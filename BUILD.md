# Build & Deployment Guide – Core8x / UrbanCrave

This document outlines the necessary steps to build the Web App for production and resolving your current dependency conflicts.

---

## ⚠️ Important: Bypassing the Dependency Error
You recently saw an `ERESOLVE` error when running `npm install`. This happens because Tailwind CSS expects an older version of Vite (v7), but the project is successfully using Vite v8. 

To install dependencies safely without breaking the build, **always use the legacy flag**:

```bash
npm install --legacy-peer-deps
```

---

## 1. Building for Production
Once dependencies are installed, you can generate the optimized, production-ready files. Run this command in your project directory:

```bash
npm run build
```

This will run Vite's build process, bundle all assets, minify the JavaScript/CSS, and create a **`dist`** folder. 

## 2. Previewing Your Build
Before uploading to the web, you can make sure the compiled production layout works seamlessly by running:

```bash
npm run preview
```
This serves the contents of the `dist` folder locally exactly as it will appear on the internet.

## 3. Deploying to the Web
The `dist` folder is entirely static (HTML, CSS, JS, Images), which means it can be hosted almost anywhere effortlessly.

- **Standard Hosting (cPanel / Hostinger / GoDaddy):** Upload the entire *contents* of the `dist` folder into your server's `public_html` directory.
- **Vercel / Netlify:** You can connect your GitHub repository directly to Vercel/Netlify. Configure the build command as `npm run build` and output directory as `dist`.
- **Cloudflare Pages:** Drag-and-drop the `dist` folder via their dashboard for instant, ultra-fast global hosting.

## Note on Routing
Both brands (`/core8x` and `/urbancrave`) operate on a Single Page Application logic based on URL queries/paths. Because this is a static build, assure that your hosting provider routes all unknown traffic back to `index.html` (this is usually a simple checkbox in your hosting panel or a standard `.htaccess` rule).
