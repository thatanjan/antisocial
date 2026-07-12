#!/bin/bash
# scripts/deploy-ecs.sh
# Deploy Docker image to AWS ECS Fargate
# Usage: ./scripts/deploy-ecs.sh <image-tag> [environment]
# Environment: production (default), staging

set -euo pipefail

IMAGE_TAG="${1:-latest}"
ENVIRONMENT="${2:-production}"
AWS_REGION="ap-south-1"
ECR_REPOSITORY="antisocial"
ECS_CLUSTER="antisocial-cluster"
ECS_SERVICE="antisocial-service"
TASK_FAMILY="antisocial-task"

echo "🚀 Deploying to ECS"
echo "   Image tag: $IMAGE_TAG"
echo "   Environment: $ENVIRONMENT"
echo "   Region: $AWS_REGION"
echo "   Cluster: $ECS_CLUSTER"
echo "   Service: $ECS_SERVICE"

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com"

# Get ECR repository URI
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

# Tag and push image
echo "📦 Tagging and pushing image..."
docker tag "${ECR_REPOSITORY}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"
docker push "${ECR_URI}:${IMAGE_TAG}"

# Update ECS service with new image
echo "🔄 Updating ECS service..."
aws ecs update-service \
    --cluster "$ECS_CLUSTER" \
    --service "$ECS_SERVICE" \
    --force-new-deployment \
    --region "$AWS_REGION" \
    --query 'service.deployments[0].status' \
    --output text

# Wait for deployment to complete
echo "⏳ Waiting for deployment to stabilize..."
aws ecs wait services-stable \
    --cluster "$ECS_CLUSTER" \
    --services "$ECS_SERVICE" \
    --region "$AWS_REGION"

# Verify deployment
echo "✅ Deployment complete! Verifying..."
DEPLOYMENT_STATUS=$(aws ecs describe-services \
    --cluster "$ECS_CLUSTER" \
    --services "$ECS_SERVICE" \
    --region "$AWS_REGION" \
    --query 'services[0].deployments[0].status' \
    --output text)

echo "📋 Deployment status: $DEPLOYMENT_STATUS"

if [[ "$DEPLOYMENT_STATUS" == "PRIMARY" ]]; then
    echo "🎉 Deployment successful!"
else
    echo "⚠️  Deployment may still be in progress. Check AWS Console for details."
    exit 1
fi