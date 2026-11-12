# Publish the museum on GitHub Pages

The site opens in English by default. Visitors can select **AZ** in the header to switch to Azerbaijani; **EN** switches back. The choice is saved in their browser. Exhibit URLs use hash routes, so direct exhibit links work on GitHub Pages.

This folder has no Git repository or GitHub remote yet. Create a **public** GitHub repository for it, then run these commands from this folder (replace the example URL with your repository URL):

```bash
git init
git add .
git commit -m "Build interactive history museum"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

On GitHub, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. The included `.github/workflows/deploy-pages.yml` installs dependencies, builds the site, and publishes `dist` on every push to `main`. Check the **Actions** tab for the result. The expected address is `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/` (or your configured custom domain).

The Vite `base: './'` setting makes scripts, styles and model URLs work under a repository subpath. The build copies the model credits and 3D assets to `dist/models/`. Avoid changing these paths to root-relative `/models/...`; those would fail on a repository Pages URL. QR links created on the published site point to the published exhibit URL.

To preview the production build locally:

```bash
npm ci
npm run build
npm run preview
```

The deployed repository is public if you choose a public GitHub repository, including research files and 3D assets committed here. Review the repository contents before your first push. Model credits and licenses remain in `assets/3d/ATTRIBUTION.md` and in the exhibition panels.

References: [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Vite static deployment](https://vite.dev/guide/static-deploy).
