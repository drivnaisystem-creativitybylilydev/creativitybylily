# GitHub + Vercel Setup (Simple)

How this project is connected to GitHub and deployed on Vercel. Use this as a reference for new projects so setup stays simple.

---

## 1. Create the GitHub repo (one-time)

**Option A – You already have local code (like this project)**

1. On GitHub: **New repository** → name it (e.g. `creativitybylily`), leave it **empty** (no README, no .gitignore).
2. Locally, in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_ORG_OR_USER/REPO_NAME.git
   git push -u origin main
   ```
   Replace `YOUR_ORG_OR_USER` and `REPO_NAME` with your GitHub org/username and repo name.

**Option B – You start from a GitHub template or clone**

1. Create repo from template or clone it.
2. `cd` into the folder, then same as above: add remote if needed, push to `main`.

---

## 2. Connect to Vercel (one-time)

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub is fine).
2. **Add New** → **Project**.
3. **Import** the GitHub repo (e.g. `creativitybylily`). Authorize GitHub if asked.
4. Vercel detects Next.js; leave **Build Command** and **Output Directory** as default unless you know you need to change them.
5. Add **Environment Variables** (copy from your `.env.local` – do not commit `.env.local`). Add every variable the app needs (Supabase, Square, Shippo, Resend, etc.).
6. Click **Deploy**. First deploy runs from the default branch (usually `main`).

After this, every push to `main` (and optionally other branches) triggers a new deployment automatically.

---

## 3. Custom domain (optional)

1. In Vercel: **Project** → **Settings** → **Domains**.
2. Add your domain (e.g. `creativitybylilyco.com`).
3. Follow Vercel’s instructions to add the DNS records at your registrar (A/CNAME). Vercel will show exactly what to add.

---

## 4. Daily workflow: push changes

When you want the live site to update:

```bash
git add .
git commit -m "Short description of the change"
git push origin main
```

Vercel will pick up the push and redeploy. No need to “connect” or “sync” again unless you add a new repo or domain.

---

## What *not* to overcomplicate

- **No need for** multiple remotes, extra “connection” scripts, or Cursor agents to “set up GitHub.” One `git remote`, one `main` branch, push as above.
- **No need for** Vercel CLI for basic deploy – linking the repo in the Vercel dashboard is enough for auto-deploys.
- **Secrets:** Never commit `.env` or `.env.local`. Add the same variables in **Vercel → Project → Settings → Environment Variables** (for Production, and Preview if you use it).

---

## This project

- **Repo:** `drivnaisystem-creativitybylilydev/creativitybylily` (or current org/repo name on GitHub).
- **Live site:** Set via Vercel (e.g. creativitybylilyco.com).
- **Branch:** `main` – push here to trigger production deploys.

---

*Short version: create empty GitHub repo → `git init`, add, commit, `remote add origin`, push → in Vercel, import that repo and add env vars → deploy. After that, `git push origin main` is all you need to update the site.*
