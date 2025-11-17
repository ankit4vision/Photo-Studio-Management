# Hostinger Deployment Guide

This guide walks through deploying the Photo Studio Management stack (React admin + Laravel API) on Hostinger using the provided domain/subdomain layout.

## Domain mapping

| Hostname           | Document root (Hostinger File Manager) | Contents                         |
|--------------------|----------------------------------------|----------------------------------|
| `lvclicks.in`      | `public_html/`                         | Landing/redirect (`default.php`) |
| `admin.lvclicks.in`| `public_html/admin/`                   | React build (`dist` output)      |
| `api.lvclicks.in`  | `public_html/api/public/`              | Laravel public directory         |

## 1. Backend (Laravel API)

1. Upload the entire backend project into `public_html/api/`.
2. Point the `api.lvclicks.in` subdomain to `public_html/api/public`.
3. Copy `backend/env.example` to `public_html/api/.env` and update values (see sample below).
4. Install dependencies and optimize:
   ```bash
   cd ~/public_html/api
   composer install --no-dev --optimize-autoloader
   php artisan key:generate
   php artisan migrate --force   # if the database is empty
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
5. Ensure `storage/` and `bootstrap/cache/` are writable:
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```
6. Update `config/cors.php` so the production origins are allowed (already configured in repo).

### Production `.env` template

```
APP_NAME="Photo Studio Management"
APP_ENV=production
APP_KEY=base64:***GENERATE_WITH_artisan***
APP_DEBUG=false
APP_URL=https://api.lvclicks.in
FRONTEND_URL=https://admin.lvclicks.in

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u527636180_p_s_live_1
DB_USERNAME=u527636180_codexaag
DB_PASSWORD=Codexaa@101

MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=noreply@lvclicks.in
MAIL_PASSWORD=***SET***
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@lvclicks.in
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=admin.lvclicks.in,api.lvclicks.in,lvclicks.in
```

> ⚠️ Never commit the real `.env` file. Keep secrets only on the server.

## 2. Frontend (React admin)

1. On your local machine, copy `admin/env.production.sample` to `.env.production` and adjust any overrides (only the API URL is mandatory).
2. Build the app:
   ```bash
   cd admin
   npm install
   npm run build -- --mode production
   ```
3. Upload the `admin/dist/` contents into `public_html/admin/`.
4. Rename `admin/hostinger.htaccess` to `.htaccess` inside `public_html/admin/` after upload for SPA routing/cache headers.

## 3. Root domain (`lvclicks.in`)

Decide what the main domain should show:

- Redirect to admin:
  ```php
  <?php
  header('Location: https://admin.lvclicks.in');
  exit;
  ?>
  ```
- Or host a marketing page in `public_html/`.

## 4. SSL & security

1. Enable SSL certificates for the domain and both subdomains via Hostinger → Websites → SSL.
2. After SSL is active, update DNS (if necessary) so A/AAAA records point to Hostinger.
3. Confirm `APP_URL`/`FRONTEND_URL` use `https`.

## 5. Post-deploy checklist

- [ ] `https://api.lvclicks.in/api/health` or `/api/auth/login` responds (use Postman/curl).
- [ ] `https://admin.lvclicks.in` loads without console errors.
- [ ] Login from the admin UI succeeds (confirms CORS + SANCTUM settings).
- [ ] Storage (uploads/avatars) works (permissions OK).
- [ ] Cron/queue jobs configured if needed (`php artisan schedule:run` via Hostinger cron).
- [ ] Backups enabled for database + files.

## Troubleshooting

| Issue                                   | Fix |
|-----------------------------------------|-----|
| 500 error on API                        | Check `storage/logs/laravel.log`; verify `.env`, permissions. |
| CORS blocked in browser                 | Ensure production origins exist in `config/cors.php`, clear caches. |
| React routes return 404 (refresh)      | Confirm `.htaccess` in admin root rewrites to `index.html`. |
| File upload errors                      | Storage/`public` symlink and permissions (`php artisan storage:link`). |
| Database connection refused             | Validate credentials, DB host `localhost`, user privileges. |

## Deployment automation tips

- Keep a zipped copy of `admin/dist` and `api` for quick re-upload.
- Consider using Hostinger’s Git integration or FTP deploys (e.g., via GitHub Actions).
- Document any manual steps (e.g., running migrations) each release.

