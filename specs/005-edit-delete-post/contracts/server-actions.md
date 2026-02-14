# Server Action Contracts: Edit and Delete Post

## updatePostAction
**Path**: `src/features/create-post/actions/index.ts`

### Input
- `postId`: `string`
- `content`: `string`

### Output
```typescript
{
  success: boolean;
  error?: string;
}
```

## deletePostAction
**Path**: `src/features/create-post/actions/index.ts`

### Input
- `postId`: `string`

### Output
```typescript
{
  success: boolean;
  error?: string;
}
```
