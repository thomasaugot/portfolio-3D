# Blog Translation Setup

## ONE-STEP SETUP (After Deploy)

Run this ONCE after deploying to Vercel:

```bash
curl -X POST https://your-domain.com/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"password":"W5cc5v3hr6j!"}'
```

This automatically:
1. ✅ Runs database migration (adds translation columns)
2. ✅ Seeds all articles from Medium
3. ✅ Translates everything to FR & ES

## What You Need

**In Vercel Environment Variables:**
- `ADMIN_PASSWORD` = `W5cc5v3hr6j!`
- `GOOGLE_TRANSLATE_API_KEY` = Your Google Translate API key ([Get it here](https://console.cloud.google.com/apis/credentials))

## How It Works

After setup, your blog automatically serves:
- **English** at `/en/blog`
- **French** at `/fr/blog`
- **Spanish** at `/es/blog`

Content switches based on URL. All automatic.

## Adding New Articles

1. Publish on Medium (in English)
2. Go to `/admin` → Login
3. Go to `/blog` → Click "Update Articles"

New article gets translated and added to all 3 languages.

## If Translation API Not Set

No problem - blog works in English only. Add API key later when ready.
