# Backend Project Structure & Development Guidelines

## 📁 Complete Project Structure

```
backend/
├── app/                          # Application core code
│   ├── Console/                  # Artisan commands
│   │   └── Kernel.php           # Console kernel (scheduled tasks)
│   ├── Exceptions/              # Exception handling
│   │   └── Handler.php          # Global exception handler
│   ├── Http/                    # HTTP layer
│   │   ├── Controllers/         # Request handlers
│   │   │   ├── API/            # API controllers
│   │   │   │   ├── PermissionController.php
│   │   │   │   ├── RoleController.php
│   │   │   │   ├── SettingController.php
│   │   │   │   └── UserController.php
│   │   │   ├── Concerns/        # Shared controller traits
│   │   │   │   └── PaginatesResults.php
│   │   │   ├── AuthController.php
│   │   │   └── Controller.php   # Base controller
│   │   ├── Kernel.php           # HTTP kernel (middleware)
│   │   └── Middleware/          # Request middleware
│   │       ├── Authenticate.php
│   │       ├── CheckPermission.php  # Custom: Permission check
│   │       ├── CheckRole.php         # Custom: Role check
│   │       ├── EncryptCookies.php
│   │       ├── PreventRequestsDuringMaintenance.php
│   │       ├── RedirectIfAuthenticated.php
│   │       ├── TrimStrings.php
│   │       ├── TrustProxies.php
│   │       ├── ValidateSignature.php
│   │       └── VerifyCsrfToken.php
│   ├── Mail/                    # Email classes
│   │   └── GenericEmail.php     # Generic mailable class
│   ├── Models/                  # Eloquent models
│   │   ├── Permission.php       # Permission model
│   │   ├── Role.php             # Role model
│   │   ├── Setting.php          # Setting model
│   │   └── User.php             # User model
│   ├── Providers/               # Service providers
│   │   ├── AppServiceProvider.php
│   │   ├── AuthServiceProvider.php
│   │   ├── EventServiceProvider.php
│   │   └── RouteServiceProvider.php
│   └── Services/                # Business logic services
│       ├── EmailService.php     # Email sending service
│       ├── PdfExportService.php # PDF generation service
│       └── S3Service.php        # AWS S3 file storage service
├── bootstrap/                   # Bootstrap files
│   ├── app.php                  # Application bootstrap
│   └── cache/                   # Bootstrap cache
│       ├── packages.php
│       └── services.php
├── config/                      # Configuration files
│   ├── app.php                  # Application config
│   ├── auth.php                 # Authentication config
│   ├── cache.php                # Cache config
│   ├── cors.php                 # CORS config
│   ├── database.php             # Database config
│   ├── filesystems.php         # File storage config
│   ├── logging.php             # Logging config
│   ├── mail.php                # Mail config
│   ├── queue.php               # Queue config
│   ├── sanctum.php             # Sanctum config
│   ├── session.php             # Session config
│   └── view.php                # View config
├── database/                    # Database files
│   ├── migrations/              # Database migrations
│   │   ├── 2014_10_12_000000_create_users_table.php
│   │   ├── 2014_10_12_100000_create_password_resets_table.php
│   │   ├── 2019_08_19_000000_create_failed_jobs_table.php
│   │   ├── 2019_12_14_000001_create_personal_access_tokens_table.php
│   │   ├── 2024_01_01_000001_create_roles_table.php
│   │   ├── 2024_01_01_000002_create_permissions_table.php
│   │   ├── 2024_01_01_000003_create_user_role_table.php
│   │   ├── 2024_01_01_000004_create_role_permission_table.php
│   │   ├── 2024_01_01_000005_create_settings_table.php
│   │   └── 2024_01_01_000006_create_emails_table.php
│   └── seeders/                 # Database seeders
│       ├── DatabaseSeeder.php
│       ├── PermissionsTableSeeder.php
│       ├── RolesTableSeeder.php
│       └── UserSeeder.php
├── public/                      # Public web root
│   └── index.php                # Application entry point
├── resources/                   # Views, assets, lang files
│   └── views/                   # Blade templates
│       └── emails/              # Email templates
│           ├── generic.blade.php
│           ├── password_reset.blade.php
│           └── welcome.blade.php
├── routes/                      # Route definitions
│   ├── api.php                  # API routes
│   ├── console.php              # Console routes
│   └── web.php                  # Web routes
├── storage/                     # Storage directory
│   ├── app/                     # Application storage
│   │   └── cache/               # Application cache
│   ├── framework/               # Framework files
│   │   ├── cache/               # Framework cache
│   │   ├── sessions/            # Session files
│   │   └── views/               # Compiled views
│   └── logs/                    # Log files
│       └── laravel.log
├── tests/                       # Test files
│   ├── CreatesApplication.php   # Test trait
│   └── TestCase.php             # Base test case
├── vendor/                      # Composer dependencies (auto-generated)
├── .env                         # Environment variables (not in git)
├── .env.development             # Development environment
├── .env.production              # Production environment
├── .gitignore                   # Git ignore rules
├── artisan                      # Artisan CLI tool
├── composer.json                # Composer dependencies
├── composer.lock                # Composer lock file
├── package.json                 # NPM dependencies
├── phpunit.xml                  # PHPUnit config
├── vite.config.js               # Vite config
├── AI_PROJECT_GENERATION_PROMPT.md
├── API_DOCUMENTATION.md
├── API_REVIEW.md
├── ENV_FILES_GUIDE.md
├── PROJECT_SUMMARY.md
├── README.md
├── SETUP.md
├── create-env-files.ps1         # Windows env setup script
├── create-env-files.sh          # Linux/Mac env setup script
├── env.example                  # Environment template
├── env.development.example      # Development env template
└── env.production.example       # Production env template
```

---

## 📂 Directory Purposes

### `/app` - Application Core
The heart of your Laravel application containing all business logic.

#### `/app/Console`
- **Purpose:** Artisan commands and scheduled tasks
- **Files:**
  - `Kernel.php` - Define scheduled tasks, register commands

#### `/app/Exceptions`
- **Purpose:** Exception handling
- **Files:**
  - `Handler.php` - Global exception handler, customize error responses

#### `/app/Http/Controllers`
- **Purpose:** Handle HTTP requests and return responses
- **Structure:**
  - `API/` - All API controllers (RESTful)
  - `Concerns/` - Reusable controller traits (e.g., `PaginatesResults`)
  - `AuthController.php` - Authentication endpoints
  - `Controller.php` - Base controller class
- **Guidelines:**
  - Keep controllers thin (delegate to services)
  - Use dependency injection for services
  - Return JSON responses for API
  - Validate all inputs

#### `/app/Http/Middleware`
- **Purpose:** Filter HTTP requests
- **Custom Middleware:**
  - `CheckRole.php` - Verify user has specific role
  - `CheckPermission.php` - Verify user has specific permission
- **Usage:**
  ```php
  Route::middleware(['auth:sanctum', 'role:admin'])->group(...);
  Route::middleware(['auth:sanctum', 'permission:view_user'])->group(...);
  ```

#### `/app/Mail`
- **Purpose:** Email mailable classes
- **Files:**
  - `GenericEmail.php` - Reusable email class for various types

#### `/app/Models`
- **Purpose:** Eloquent ORM models
- **Models:**
  - `User.php` - User model with role/permission methods
  - `Role.php` - Role model with soft delete
  - `Permission.php` - Permission model organized by module
  - `Setting.php` - Settings model for database-driven config
- **Guidelines:**
  - Define relationships in models
  - Use scopes for common queries
  - Keep business logic in models or services

#### `/app/Providers`
- **Purpose:** Service providers for dependency injection
- **Files:**
  - `AppServiceProvider.php` - Application-wide services
  - `AuthServiceProvider.php` - Authorization policies
  - `EventServiceProvider.php` - Event listeners
  - `RouteServiceProvider.php` - Route configuration

#### `/app/Services`
- **Purpose:** Business logic layer (Service Pattern)
- **Services:**
  - `EmailService.php` - Email sending with database config
  - `PdfExportService.php` - PDF generation using DomPDF
  - `S3Service.php` - AWS S3 file operations
- **Guidelines:**
  - Inject services into controllers
  - Services handle external integrations
  - Services load settings from database
  - Keep services focused and single-purpose

### `/bootstrap`
- **Purpose:** Application bootstrap files
- **Files:**
  - `app.php` - Creates application instance
  - `cache/` - Cached bootstrap files

### `/config`
- **Purpose:** Configuration files
- **Key Files:**
  - `app.php` - Application settings
  - `auth.php` - Authentication configuration
  - `cors.php` - CORS settings for API
  - `database.php` - Database connections
  - `sanctum.php` - Sanctum token auth config
  - **2025-11 Update:** the default connection is MySQL-only. SQLite scaffolding was removed, `composer.json` now requires `ext-pdo_mysql`, and `phpunit.xml` targets a MySQL testing database (`photo_studio_test`).
  - **2025-11 Update:** user/role/permission endpoints are protected per action (e.g. `permission:view_user`, `permission:create_role`, `permission:view_permission`), matching the frontend alias map for fine-grained access control.
- **Note:** Settings can be overridden by database (via Setting model)

### `/database`
- **Purpose:** Database schema and seed data

#### `/database/migrations`
- **Purpose:** Database schema definitions
- **Naming:** `YYYY_MM_DD_HHMMSS_description.php`
- **Guidelines:**
  - Always create migrations for schema changes
  - Never modify existing migrations (create new ones)
  - Use foreign keys for relationships

#### `/database/seeders`
- **Purpose:** Populate database with initial data
- **Seeders:**
  - `DatabaseSeeder.php` - Main seeder (calls others)
  - `RolesTableSeeder.php` - Default roles
  - `PermissionsTableSeeder.php` - System permissions
  - `UserSeeder.php` - Admin user
  - `RolePermissionSeeder.php` - Maps manager/staff roles to the new permission set (including branch CRUD) while keeping admin unrestricted.

### `/public`
- **Purpose:** Web server document root
- **Files:**
  - `index.php` - Application entry point
- **Note:** All requests go through this file

### `/resources`
- **Purpose:** Uncompiled assets and views

#### `/resources/views`
- **Purpose:** Blade templates
- **Email Templates:**
  - `emails/generic.blade.php` - Generic email template
  - `emails/password_reset.blade.php` - Password reset email
  - `emails/welcome.blade.php` - Welcome email

### `/routes`
- **Purpose:** Route definitions
- **Files:**
  - `api.php` - API routes (prefixed with `/api`)
  - `web.php` - Web routes
  - `console.php` - Artisan command routes

### `/storage`
- **Purpose:** Application storage
- **Directories:**
  - `app/` - Application files
  - `framework/` - Framework cache, sessions, views
  - `logs/` - Application logs
  - **CORS Configuration:** `config/cors.php` includes dev origins `http://localhost:5173`, `http://localhost:5174`, and their `127.0.0.1` equivalents so Vite-based frontends can call the API without manual tweaks.
- **Note:** Must be writable by web server

### `/tests`
- **Purpose:** Automated tests
- **Structure:**
  - `Feature/` - Feature/integration tests
  - `Unit/` - Unit tests
- **Files:**
  - `TestCase.php` - Base test class
  - `CreatesApplication.php` - Test trait

---

## 🏗️ Architecture Patterns

### 1. **Service Layer Pattern**
Business logic is separated into service classes:
```
Controller → Service → Model → Database
```

**Example:**
```php
// Controller
public function __construct(EmailService $emailService)
{
    $this->emailService = $emailService;
}

// Service handles business logic
$this->emailService->sendEmailImmediately(...);
```

### 2. **Repository Pattern (Implicit)**
Eloquent models act as repositories:
```php
User::where('email', $email)->first();
Role::with('permissions')->get();
```

### 3. **Middleware Pattern**
Authentication and authorization via middleware:
```php
Route::middleware(['auth:sanctum', 'permission:view_user'])
```

### 4. **Dependency Injection**
Services injected via constructor:
```php
public function __construct(EmailService $emailService, S3Service $s3Service)
{
    $this->emailService = $emailService;
    $this->s3Service = $s3Service;
}
```

### 5. **Controller Traits (2025-11 update)**
- Use `App\Http\Controllers\Concerns\PaginatesResults` to standardize pagination, sorting, and meta responses across list endpoints.
- Compose the trait in controllers (`use PaginatesResults;`) and call `$this->buildPaginator($request, $query, $sortableColumns, $defaultSort);`.
- Return JSON payloads that include the paginator meta via `$this->paginationMeta($paginator, $sortBy, $sortDirection);`.

---

## 📋 Development Guidelines

### Code Organization

#### 1. **Controllers**
- Keep controllers thin (max 100-150 lines)
- Delegate business logic to services
- Handle HTTP concerns only (request/response)
- Use dependency injection
- Reuse the `PaginatesResults` trait for consistent pagination, sorting, and meta payloads.

**Good:**
```php
public function store(Request $request, EmailService $emailService)
{
    $validated = $request->validate([...]);
    $user = User::create($validated);
    $emailService->sendWelcomeEmail($user);
    return response()->json($user, 201);
}
```

**Bad:**
```php
public function store(Request $request)
{
    // Too much business logic in controller
    $user = User::create($request->all());
    Mail::to($user->email)->send(new WelcomeMail($user));
    // ... more logic
}
```

#### 2. **Models**
- Define relationships
- Use scopes for reusable queries
- Add accessors/mutators when needed
- Keep business logic minimal (use services)

**Example:**
```php
// Model
public function scopeActive($query)
{
    return $query->where('is_active', true);
}

// Usage
User::active()->get();
```

#### 3. **Services**
- Single responsibility principle
- Load settings from database
- Handle external API calls
- Return simple values or throw exceptions

**Example:**
```php
class EmailService
{
    public function sendEmailImmediately($to, $type, $data)
    {
        $settings = $this->getEmailSettings();
        $this->configureMailSettings($settings);
        // ... send email
    }
}
```

#### 4. **Middleware**
- Keep middleware focused
- Return early on failure
- Use for cross-cutting concerns

**Example:**
```php
public function handle(Request $request, Closure $next, $permission)
{
    if (!$request->user()->hasPermission($permission)) {
        return response()->json(['message' => 'Forbidden'], 403);
    }
    return $next($request);
}
```

### Naming Conventions

#### Files & Classes
- **Controllers:** `UserController`, `RoleController`
- **Models:** `User`, `Role`, `Permission` (singular, PascalCase)
- **Services:** `EmailService`, `PdfExportService` (PascalCase + Service)
- **Middleware:** `CheckRole`, `CheckPermission` (PascalCase)
- **Migrations:** `create_users_table`, `add_status_to_users_table` (snake_case)

#### Methods
- **Controllers:** `index`, `store`, `show`, `update`, `destroy` (RESTful)
- **Models:** `hasRole()`, `hasPermission()`, `getAllPermissions()`
- **Services:** `sendEmailImmediately()`, `uploadFile()`

#### Variables
- **camelCase:** `$userName`, `$emailService`
- **Database:** `snake_case` (Laravel convention)

### Database Guidelines

#### Migrations
1. **Always create migrations** for schema changes
2. **Never modify existing migrations** - create new ones
3. **Use foreign keys** for relationships
4. **Add indexes** for frequently queried columns
5. **Use timestamps** on all tables

**Example:**
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('email')->unique();
    $table->timestamps();
    $table->index('email');
});
```

#### Seeders
1. **Idempotent** - Can run multiple times safely
2. **Use factories** for test data
3. **Call from DatabaseSeeder**

### API Development

#### Request Validation
Always validate inputs:
```php
$validated = $request->validate([
    'email' => 'required|email|unique:users',
    'password' => 'required|min:8',
]);
```

#### Response Format
Consistent JSON responses:
```php
// Success
return response()->json($data, 201);

// Error
return response()->json(['message' => 'Error'], 400);
```

#### Pagination Format (2025-11 update)
- List endpoints return `{ success, data, meta }`.
- `meta` must contain `total`, `page`, `limit`, `totalPages`, `hasNext`, `hasPrev`, `sortBy`, and `sortDirection`.
- Use the `PaginatesResults` trait to clamp pagination limits (1-100), append whitelisted sorts, and include `appends()` links.
- Controllers should pass normalized data arrays (resources or transformed models) into the `data` key.

#### HTTP Status Codes
- `200` - Success (GET, PUT, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

### Security Guidelines

#### 1. **Authentication**
- Use Laravel Sanctum for API tokens
- Tokens stored in `personal_access_tokens` table
- Include token in `Authorization: Bearer {token}` header

#### 2. **Authorization**
- Check permissions in middleware
- Admin role has all permissions (checked in User model)
- Use `hasPermission()` method for checks

#### 3. **Input Validation**
- Always validate user input
- Use Laravel's validation rules
- Sanitize data before storing

#### 4. **Password Security**
- Always hash passwords: `Hash::make($password)`
- Never store plain text passwords
- Use `Hash::check()` for verification

#### 5. **SQL Injection**
- Use Eloquent ORM (prevents SQL injection)
- Use parameter binding for raw queries
- Never concatenate user input into queries

#### 6. **CORS**
- Configured in `config/cors.php`
- Only allow trusted origins
- Support credentials for authenticated requests

### Error Handling

#### Exception Handling
```php
try {
    // Code that might fail
} catch (\Exception $e) {
    Log::error('Error: ' . $e->getMessage());
    return response()->json(['message' => 'Error occurred'], 500);
}
```

#### Validation Errors
Laravel automatically returns 422 with validation errors:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

### Testing Guidelines

#### Test Structure
```
tests/
├── Feature/        # Integration tests
│   └── UserTest.php
└── Unit/           # Unit tests
    └── UserModelTest.php
```

#### Writing Tests
```php
public function test_user_can_login()
{
    $user = User::factory()->create();
    
    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);
    
    $response->assertStatus(200)
             ->assertJsonStructure(['token', 'user']);
}
```

### Environment Configuration

#### Environment Files
- `.env` - Local development (not in git)
- `.env.development` - Development server
- `.env.production` - Production server

#### Configuration Priority
1. Database settings (via Setting model)
2. Environment variables (.env)
3. Config files (config/)

### Logging

#### Log Levels
- `debug` - Detailed debugging information
- `info` - Informational messages
- `warning` - Warning messages
- `error` - Error messages
- `critical` - Critical errors

#### Usage
```php
Log::info('User logged in', ['user_id' => $user->id]);
Log::error('Payment failed', ['order_id' => $order->id]);
```

### Performance Optimization

#### 1. **Eager Loading**
Avoid N+1 queries:
```php
// Bad
$users = User::all();
foreach ($users as $user) {
    $user->roles; // N+1 query
}

// Good
$users = User::with('roles')->get();
```

#### 2. **Caching**
Cache expensive operations:
```php
Cache::remember('users', 3600, function () {
    return User::all();
});
```

#### 3. **Database Indexes**
Add indexes for frequently queried columns:
```php
$table->index('email');
$table->index(['status', 'created_at']);
```

#### 4. **Query Optimization**
Use select() to limit columns:
```php
User::select('id', 'name', 'email')->get();
```

### Git Workflow

#### Branching Strategy
- `main` - Production code
- `develop` - Development branch
- `feature/feature-name` - Feature branches
- `bugfix/bug-name` - Bug fixes

#### Commit Messages
Use clear, descriptive messages:
```
feat: Add user role assignment endpoint
fix: Resolve permission check issue
docs: Update API documentation
refactor: Simplify email service
```

#### .gitignore
Never commit:
- `.env` files
- `vendor/` directory
- `node_modules/`
- `storage/logs/*`
- `storage/framework/cache/*`

---

## 🔧 Common Tasks

### Adding a New API Endpoint

1. **Create Migration** (if needed)
   ```bash
   php artisan make:migration create_products_table
   ```

2. **Create Model**
   ```bash
   php artisan make:model Product
   ```

3. **Create Controller**
   ```bash
   php artisan make:controller API/ProductController
   ```

4. **Add Routes** (`routes/api.php`)
   ```php
   Route::apiResource('products', ProductController::class);
   ```

5. **Implement Methods** in controller

6. **Test** the endpoint

### Adding a New Service

1. **Create Service File**
   ```
   app/Services/NewService.php
   ```

2. **Implement Service Class**
   ```php
   class NewService
   {
       public function doSomething()
       {
           // Implementation
       }
   }
   ```

3. **Inject in Controller**
   ```php
   public function __construct(NewService $newService)
   {
       $this->newService = $newService;
   }
   ```

### Adding a New Middleware

1. **Create Middleware**
   ```bash
   php artisan make:middleware CheckFeature
   ```

2. **Register in Kernel** (`app/Http/Kernel.php`)
   ```php
   'feature' => \App\Http\Middleware\CheckFeature::class,
   ```

3. **Use in Routes**
   ```php
   Route::middleware(['auth:sanctum', 'feature'])->group(...);
   ```

### Adding a New Permission

1. **Create Migration** (or add to seeder)
   ```php
   Permission::create([
       'name' => 'view_product',
       'description' => 'View products',
       'module' => 'products',
       'submodule' => 'management',
       'type' => 'read',
   ]);
   ```

2. **Assign to Roles** via API or seeder

---

## 📚 Best Practices Summary

### ✅ Do's

- ✅ Keep controllers thin
- ✅ Use services for business logic
- ✅ Validate all inputs
- ✅ Use Eloquent relationships
- ✅ Eager load relationships
- ✅ Use migrations for schema changes
- ✅ Write descriptive commit messages
- ✅ Follow PSR-12 coding standards
- ✅ Use dependency injection
- ✅ Handle errors gracefully
- ✅ Log important events
- ✅ Write tests for critical features

### ❌ Don'ts

- ❌ Don't put business logic in controllers
- ❌ Don't modify existing migrations
- ❌ Don't commit `.env` files
- ❌ Don't use raw SQL (use Eloquent)
- ❌ Don't ignore validation errors
- ❌ Don't hardcode configuration
- ❌ Don't skip error handling
- ❌ Don't create N+1 queries
- ❌ Don't store sensitive data in logs
- ❌ Don't bypass authentication/authorization

---

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   composer install
   ```

2. **Setup Environment**
   ```bash
   cp env.example .env
   php artisan key:generate
   ```

3. **Configure Database**
   Edit `.env` with your database credentials

4. **Run Migrations**
   ```bash
   php artisan migrate
   ```

5. **Seed Database**
   ```bash
   php artisan db:seed
   ```

6. **Start Server**
   ```bash
   php artisan serve
   ```

---

## 📖 Additional Resources

- **Laravel Documentation:** https://laravel.com/docs/9.x
---

## 🔄 Maintenance

### Regular Tasks

1. **Update Dependencies**
   ```bash
   composer update
   ```

2. **Clear Cache**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

3. **Optimize for Production**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

4. **Check Logs**
   ```bash
   tail -f storage/logs/laravel.log
   ```

---

**Last Updated:** 2024
**Version:** 1.0.0

