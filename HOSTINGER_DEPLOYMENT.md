# Hostinger Deployment Guide

This guide walks through deploying the Photo Studio Management stack (React admin + Laravel API) on Hostinger using a unified subdomain structure.

## Domain mapping

| Hostname           | Document root (Hostinger File Manager) | Contents                         |
|--------------------|----------------------------------------|----------------------------------|
| `lvclicks.in`      | `public_html/`                         | Landing/redirect (`default.php`) |
| `admin.lvclicks.in`| `public_html/admin/`                   | React build + Laravel API        |
|                    | `public_html/admin/dist/`              | React build (`dist` output)      |
|                    | `public_html/admin/api/`               | Laravel backend (full folder)    |
|                    | `public_html/admin/api/public/`        | Laravel public directory          |

**Note:** The API is accessed via `admin.lvclicks.in/api/*` (same domain, no CORS needed).

## 1. Folder Structure

The complete structure should look like this:

```
public_html/
└── admin/
    ├── dist/                    # React frontend build files
    │   ├── index.html
    │   ├── assets/
    │   └── ...
    ├── .htaccess                # Routes /api/* to Laravel, everything else to frontend
    ├── api/                     # Laravel backend (entire folder)
    │   ├── app/
    │   ├── bootstrap/
    │   ├── config/
    │   ├── database/
    │   ├── public/
    │   │   ├── index.php
    │   │   └── .htaccess
    │   ├── resources/
    │   ├── routes/
    │   ├── storage/
    │   ├── artisan
    │   ├── composer.json
    │   └── composer.lock
    └── ...
```

## 2. Backend (Laravel API)

### What to Upload

**✅ UPLOAD the entire `backend/` folder as `public_html/admin/api/`:**

Upload all these folders/files from `backend/` to `public_html/admin/api/`:
- `app/` - Application code
- `bootstrap/` - Bootstrap files
- `config/` - Configuration files
- `database/` - Migrations and seeders
- `public/` - Public assets
  - **IMPORTANT:** `public/.htaccess` must be uploaded (required for Laravel routing)
- `resources/` - Views, lang files
- `routes/` - Route definitions
- `storage/` - **Upload the folder structure** (see notes below)
- `artisan` - Artisan CLI
- `composer.json` & `composer.lock` - Dependency definitions

**❌ DO NOT UPLOAD:**
- `vendor/` - **Generate on server** with `composer install`
- `tests/` - Not needed in production
- `.env` - Create fresh on server
- `node_modules/` - Not needed (if present)
- `.git/` - Version control (if present)

### Storage Folder Notes

**Upload `storage/` folder structure, but:**
- ✅ Upload `storage/app/public/avatars/` and `storage/app/public/logos/` **if you want to keep existing user uploads**
- ✅ Upload `storage/logs/` folder (empty is fine, Laravel will create log files)
- ✅ Upload `storage/framework/` folder structure (cache, sessions, views folders)
- ⚠️ Cache files in `storage/framework/cache/` will be regenerated automatically
- ⚠️ Session files can be cleared (users will need to re-login)

### Deployment Steps

1. **Upload the entire `backend/` folder** to `public_html/admin/api/` (excluding `vendor/`, `tests/`, `.env`)
2. **On the server**, run these commands via SSH or Hostinger Terminal:
   ```bash
   cd ~/public_html/admin/api
   
   # Install dependencies (generates vendor/ folder)
   composer install --no-dev --optimize-autoloader
   
   # Generate application key
   php artisan key:generate
   
   # Create storage symlink (if not exists)
   php artisan storage:link
   
   # Run migrations (if database is empty)
   php artisan migrate --force
   
   # Clear and optimize for production
   php artisan config:clear
   php artisan cache:clear
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
3. **Set file permissions:**
   ```bash
   cd ~/public_html/admin/api
   chmod -R 755 storage bootstrap/cache
   
   # Find your username and group (usually shown in SSH prompt or run: whoami)
   # Example: chown -R u527636180:o1007611880 storage bootstrap/cache
   # Or use: chown -R $(whoami):$(whoami) storage bootstrap/cache
   chown -R $(whoami):$(whoami) storage bootstrap/cache
   ```
   
   **Note:** `[your_user]:[your_group]` is a placeholder. On Hostinger, your username is usually like `u527636180` and group like `o1007611880`. You can find it by running `whoami` and `id` commands, or use `$(whoami):$(whoami)` for automatic detection.
4. Copy `backend/env.example` to `public_html/admin/api/.env` and update values (see sample below).
5. **No CORS configuration needed** - Since API is on the same domain (`admin.lvclicks.in/api`), CORS is not required.

### Production `.env` template

```
APP_NAME="Photo Studio Management"
APP_ENV=production
APP_KEY=base64:***GENERATE_WITH_artisan***
APP_DEBUG=false
APP_URL=https://admin.lvclicks.in
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

SANCTUM_STATEFUL_DOMAINS=admin.lvclicks.in,lvclicks.in
```

> ⚠️ Never commit the real `.env` file. Keep secrets only on the server.

## 3. Frontend (React admin)

1. On your local machine, copy `admin/env.production.sample` to `.env.production` and set:
   ```
   VITE_API_BASE_URL=/
   ```
   This tells the frontend to use relative URLs (`/api`) since the API is on the same domain.

2. Build the app:
   ```bash
   cd admin
   npm install
   npm run build:prod
   ```
   
   **Note:** Use `npm run build:prod` (not `npm run build -- --mode production`) as defined in `package.json`.

3. Upload the `admin/dist/` contents into `public_html/admin/` (alongside the `api/` folder).

4. **IMPORTANT:** Copy `admin/hostinger.htaccess` to `.htaccess` inside `public_html/admin/` after upload. This file:
   - Routes `/api/*` requests to `api/public/index.php` (Laravel backend)
   - Routes everything else to `index.html` (React SPA)
   - Handles cache headers and compression

## 4. Root domain (`lvclicks.in`)

Decide what the main domain should show:

- Redirect to admin:
  ```php
  <?php
  header('Location: https://admin.lvclicks.in');
  exit;
  ?>
  ```
- Or host a marketing page in `public_html/`.

## 5. SSL & security

1. Enable SSL certificate for the domain and `admin.lvclicks.in` subdomain via Hostinger → Websites → SSL.
2. After SSL is active, update DNS (if necessary) so A/AAAA records point to Hostinger.
3. Confirm `APP_URL`/`FRONTEND_URL` use `https`.
4. **No separate SSL needed for API** - It's served from the same domain.

## 6. Post-deploy checklist

- [ ] `https://admin.lvclicks.in/api/auth/login` responds (use Postman/curl to test API).
- [ ] `https://admin.lvclicks.in` loads without console errors.
- [ ] Login from the admin UI succeeds (no CORS errors since same domain).
- [ ] API routes work correctly (test `/api/auth/login`, `/api/dashboard/summary`, etc.).
- [ ] Storage (uploads/avatars) works (permissions OK).
- [ ] Cron/queue jobs configured if needed (`php artisan schedule:run` via Hostinger cron).
- [ ] Backups enabled for database + files.

## Troubleshooting

| Issue                                   | Fix |
|-----------------------------------------|-----|
| 500 error on API                        | Check `public_html/admin/api/storage/logs/laravel.log`; verify `.env`, permissions. |
| API returns 404                         | Verify `.htaccess` in `public_html/admin/` routes `/api/*` to `api/public/index.php`. |
| React routes return 404 (refresh)      | Confirm `.htaccess` in admin root rewrites non-API routes to `index.html`. |
| CORS errors (shouldn't happen)          | If you see CORS errors, check that `VITE_API_BASE_URL=/` in frontend `.env.production`. |
| File upload errors                      | Storage/`public` symlink and permissions (`cd admin/api && php artisan storage:link`). |
| Database connection refused             | Validate credentials in `admin/api/.env`, DB host `localhost`, user privileges. |
| API not accessible                      | Verify folder structure: `public_html/admin/api/public/index.php` exists. |

## Deployment automation tips

- Keep a zipped copy of `admin/dist` and `admin/api` for quick re-upload.
- Consider using Hostinger's Git integration or FTP deploys (e.g., via GitHub Actions).
- Document any manual steps (e.g., running migrations) each release.

## Benefits of this structure

✅ **No CORS issues** - Frontend and API are on the same domain  
✅ **Simpler deployment** - Single subdomain to manage  
✅ **Easier SSL setup** - Only one SSL certificate needed  
✅ **Better performance** - No cross-origin requests  
✅ **Simpler configuration** - No CORS headers needed

