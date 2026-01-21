# Data Model: Project Setup

**Feature**: Project Setup
**Status**: N/A (Infrastructure Only)

## Overview
This feature establishes the infrastructure for the database (PostgreSQL via Prisma), but does not define any domain entities yet.

## Infrastructure Schema
- **Database**: PostgreSQL (Docker container `db`)
- **ORM**: Prisma
- **Initial Schema**: Empty `schema.prisma` (or minimal `User` model if Better Auth requires it for installation - check documentation. Better Auth usually needs `User` and `Session` tables. Given "Deferred", we will setup the *capabilities* but maybe not a full schema unless mandatory for install. *Observation*: Better Auth usually has a CLI to generate schema. We will stick to "Infrastructure setup" which implies `schema.prisma` exists and is connected.)

## Core Entities
None defined in this feature.
