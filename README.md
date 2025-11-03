# AI SQL Optimizer (GitHub Actions Deploy)

This repo is ready to deploy to **GitHub Pages** using **GitHub Actions** — no local Node.js required.

## Quick Deploy
1. Create a new GitHub repo named `ai-sql-optimizer`.
2. Upload all files from this zip to the repo (including the `.github/workflows/pages.yml` file).
3. Commit to the `main` branch.
4. In your repo -> **Settings -> Pages**, set **Source** to **GitHub Actions**.
5. Wait for the workflow to finish. Your site will be live at:
   `https://<YOUR-USERNAME>.github.io/ai-sql-optimizer/`

### Notes
- If your repo name differs, edit `vite.config.js` and change `base` to `/<your-repo-name>/`.
- The UI’s analyze button uses `API_URL` in `src/App.jsx`. When your backend is live, set it to your API endpoint.
- The “Pro Review” form posts to Formspree — replace the placeholder endpoint with your real one.
