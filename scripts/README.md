# Blog Image Download Scripts

These scripts download all blog images from Medium and store them locally, making your blog completely independent from Medium.

## Step-by-Step Guide

### 1. Download All Images

Run this script to download all article hero images from Medium:

```bash
npx tsx scripts/download-blog-images.ts
```

This will:
- Create `/public/blog-images/` directory
- Download all images from Medium
- Save them with their article slug as filename
- Generate `scripts/image-mapping.json` with URL mappings
- Skip already downloaded images (idempotent)

**Output:**
- Images saved to: `/public/blog-images/`
- Mapping file: `scripts/image-mapping.json`

### 2. Update Database Paths

After downloading, update the database to use local paths:

```bash
npx tsx lib/db/update-image-paths.ts
```

This will:
- Read the image mapping file
- Update all `image_url` fields in `blog_articles` table
- Change from `https://miro.medium.com/...` to `/blog-images/...`

### 3. Remove Medium Domain (Optional)

Once all images are local, you can remove the Medium domain from `next.config.ts`:

```typescript
// Remove this section:
remotePatterns: [
  {
    protocol: "https",
    hostname: "miro.medium.com",
    pathname: "/**",
  },
],
```

## Verification

After running both scripts:

1. Check that images exist:
   ```bash
   ls -la public/blog-images/
   ```

2. Verify database was updated:
   ```sql
   SELECT slug, image_url FROM blog_articles LIMIT 5;
   ```

   You should see paths like `/blog-images/96d71da055cb.png` instead of Medium URLs.

3. Test in browser:
   - Visit any blog article
   - Check that images load correctly
   - Verify in Network tab that images come from your domain

## Troubleshooting

### "Image mapping file not found"
Run `download-blog-images.ts` first before `update-image-paths.ts`.

### Download failures
- Check your internet connection
- Some images might have CORS issues - the script will log errors
- Re-run the script; it skips already downloaded images

### Images not showing
- Ensure `/public/blog-images/` directory exists
- Verify file permissions (should be readable)
- Check that database paths start with `/blog-images/`

## Image Naming Convention

Images are named using the article slug:
- Medium URL: `https://medium.com/@you/how-to-fix-error-96d71da055cb`
- Slug: `96d71da055cb`
- Local image: `/public/blog-images/96d71da055cb.png`

## Future Articles

For new articles added to `medium-articles.ts`:

1. Add the article with its Medium image URL
2. Run `download-blog-images.ts` to download new images
3. Run the seed script to add to database:
   ```bash
   curl -X POST http://localhost:3000/api/blog/seed
   ```
4. Run `update-image-paths.ts` to update image paths

Or manually:
1. Download the image
2. Save to `/public/blog-images/{slug}.png`
3. Add article to database with `image_url: '/blog-images/{slug}.png'`

## Cleanup

After confirming everything works:

1. **Remove Medium domain** from `next.config.ts`
2. **Delete mapping file** (optional):
   ```bash
   rm scripts/image-mapping.json
   ```
3. **Git commit**:
   ```bash
   git add public/blog-images/
   git commit -m "Add local blog images"
   ```

## Storage Considerations

- Average image size: ~200KB - 500KB
- Total for 10 articles: ~2-5 MB
- Next.js will optimize these images automatically
- Consider using Vercel Blob for larger image collections

## Alternative: Cloud Storage

If you prefer cloud storage over local files:

1. **Vercel Blob** (recommended for Vercel deployments)
2. **Cloudinary** (automatic optimization)
3. **AWS S3** (full control)

See `BLOG_ARTICLE_SETUP.md` for cloud storage setup guides.
