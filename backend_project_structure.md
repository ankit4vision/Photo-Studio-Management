# Photo Studio Management - Backend API Project Structure & Development Guidelines

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Complete Project Structure](#complete-project-structure)
3. [Technology Stack](#technology-stack)
4. [Module Overview](#module-overview)
5. [Architecture Patterns](#architecture-patterns)
6. [Development Guidelines](#development-guidelines)
7. [API Development](#api-development)
8. [Database Guidelines](#database-guidelines)
9. [Security Guidelines](#security-guidelines)
10. [Testing Guidelines](#testing-guidelines)
11. [Best Practices](#best-practices)

---

## 🚀 Project Overview

**Photo Studio Management Backend** is a Laravel 9 RESTful API that powers the Photo Studio Management admin dashboard. It provides comprehensive backend services for managing users, roles, permissions, branches, settings, and more.

### Key Features
- 🔐 JWT Authentication with Laravel Sanctum
- 👥 Role-Based Access Control (RBAC)
- 📊 RESTful API endpoints
- 🗄️ MySQL database with migrations
- 📧 Email service integration
- 📄 PDF export service
- ☁️ AWS S3 file storage integration
- 🔒 Permission-based route protection
- 📦 Standardized pagination and sorting

---

## 📁 Complete Project Structure

```
backend/
├── 📁 app/                          # Application core code
│   ├── 📁 Console/                  # Artisan commands
│   │   └── Kernel.php              # Console kernel (scheduled tasks)
│   │
│   ├── 📁 Exceptions/              # Exception handling
│   │   └── Handler.php              # Global exception handler
│   │
│   ├── 📁 Http/                     # HTTP layer
│   │   ├── 📁 Controllers/         # Request handlers
│   │   │   ├── 📁 API/             # API controllers
│   │   │   │   ├── BranchController.php
│   │   │   │   ├── CustomerController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   ├── PackageController.php
│   │   │   │   ├── PaymentController.php
│   │   │   │   ├── PermissionController.php
│   │   │   │   ├── RoleController.php
│   │   │   │   ├── SettingController.php
│   │   │   │   └── UserController.php
│   │   │   ├── 📁 Concerns/        # Shared controller traits
│   │   │   │   └── PaginatesResults.php
│   │   │   ├── AuthController.php
│   │   │   └── Controller.php      # Base controller
│   │   ├── 📁 Kernel.php           # HTTP kernel (middleware)
│   │   ├── 📁 Middleware/          # Request middleware
│   │   │   ├── Authenticate.php
│   │   │   ├── CheckPermission.php # Custom: Permission check
│   │   │   ├── CheckRole.php       # Custom: Role check
│   │   │   ├── EncryptCookies.php
│   │   │   ├── PreventRequestsDuringMaintenance.php
│   │   │   ├── RedirectIfAuthenticated.php
│   │   │   ├── TrimStrings.php
│   │   │   ├── TrustProxies.php
│   │   │   ├── ValidateSignature.php
│   │   │   └── VerifyCsrfToken.php
│   │   ├── 📁 Requests/            # Form request validation
│   │   │   └── [Request classes]
│   │   └── 📁 Resources/            # API resources
│   │       ├── CustomerResource.php
│   │       ├── OrderResource.php
│   │       ├── OrderItemResource.php
│   │       ├── PaymentResource.php
│   │       └── [Other Resource classes]
│   │
│   ├── 📁 Mail/                     # Email classes
│   │   └── GenericEmail.php        # Generic mailable class
│   │
│   ├── 📁 Models/                   # Eloquent models
│   │   ├── Branch.php               # Branch model
│   │   ├── Customer.php             # Customer model (with stats auto-calculation)
│   │   ├── Order.php                # Order model (with payment recalculation)
│   │   ├── OrderItem.php            # OrderItem model
│   │   ├── Package.php              # Package model
│   │   ├── Payment.php              # Payment model (with auto order status update)
│   │   ├── Permission.php           # Permission model
│   │   ├── Role.php                  # Role model (with soft delete)
│   │   ├── Setting.php               # Setting model
│   │   └── User.php                  # User model (with roles/permissions)
│   │
│   ├── 📁 Providers/                # Service providers
│   │   ├── AppServiceProvider.php
│   │   ├── AuthServiceProvider.php
│   │   ├── EventServiceProvider.php
│   │   └── RouteServiceProvider.php
│   │
│   └── 📁 Services/                 # Business logic services
│       ├── EmailService.php         # Email sending service
│       ├── PdfExportService.php     # PDF generation service
│       └── S3Service.php             # AWS S3 file storage service
│
├── 📁 bootstrap/                    # Bootstrap files
│   ├── app.php                      # Application bootstrap
│   └── 📁 cache/                    # Bootstrap cache
│       ├── packages.php
│       └── services.php
│
├── 📁 config/                       # Configuration files
│   ├── app.php                      # Application config
│   ├── auth.php                     # Authentication config
│   ├── cache.php                    # Cache config
│   ├── cors.php                     # CORS config
│   ├── database.php                 # Database config (MySQL only)
│   ├── filesystems.php              # File storage config
│   ├── logging.php                  # Logging config
│   ├── mail.php                     # Mail config
│   ├── queue.php                    # Queue config
│   ├── sanctum.php                  # Sanctum config
│   ├── session.php                  # Session config
│   └── view.php                     # View config
│
├── 📁 database/                     # Database files
│   ├── 📁 factories/                # Model factories
│   │   └── BranchFactory.php
│   ├── 📁 migrations/               # Database migrations
│   │   ├── 2014_10_12_000000_create_users_table.php
│   │   ├── 2014_10_12_100000_create_password_resets_table.php
│   │   ├── 2019_08_19_000000_create_failed_jobs_table.php
│   │   ├── 2019_12_14_000001_create_personal_access_tokens_table.php
│   │   ├── 2024_01_01_000001_create_roles_table.php
│   │   ├── 2024_01_01_000002_create_permissions_table.php
│   │   ├── 2024_01_01_000003_create_user_role_table.php
│   │   ├── 2024_01_01_000004_create_role_permission_table.php
│   │   ├── 2024_01_01_000005_create_settings_table.php
│   │   ├── 2024_01_01_000006_create_emails_table.php
│   │   ├── 2025_11_11_000000_create_branches_table.php
│   │   ├── 2025_11_13_063625_create_packages_table.php
│   │   ├── 2025_11_13_071304_create_customers_table.php
│   │   ├── 2025_11_13_071741_create_orders_table.php
│   │   ├── 2025_11_13_071758_create_order_items_table.php
│   │   └── 2025_11_13_090017_create_payments_table.php
│   └── 📁 seeders/                  # Database seeders
│       ├── BranchSeeder.php
│       ├── DatabaseSeeder.php
│       ├── PermissionsTableSeeder.php
│       ├── RolePermissionSeeder.php
│       ├── RolesTableSeeder.php
│       └── UserSeeder.php
│
├── 📁 public/                       # Public web root
│   └── index.php                    # Application entry point
│
├── 📁 resources/                    # Views, assets, lang files
│   └── 📁 views/                    # Blade templates
│       └── 📁 emails/               # Email templates
│           ├── generic.blade.php
│           ├── password_reset.blade.php
│           ├── test.blade.php        # Test email template
│           └── welcome.blade.php
│
├── 📁 routes/                       # Route definitions
│   ├── api.php                      # API routes
│   ├── console.php                  # Console routes
│   └── web.php                      # Web routes
│
├── 📁 storage/                      # Storage directory
│   ├── 📁 app/                      # Application storage
│   │   └── 📁 cache/                # Application cache
│   ├── 📁 framework/                # Framework files
│   │   ├── 📁 cache/                # Framework cache
│   │   ├── 📁 sessions/             # Session files
│   │   └── 📁 views/                # Compiled views
│   └── 📁 logs/                     # Log files
│       └── laravel.log
│
├── 📁 tests/                        # Test files
│   ├── CreatesApplication.php       # Test trait
│   └── TestCase.php                 # Base test case
│
├── 📁 vendor/                       # Composer dependencies (auto-generated)
│
├── .env                             # Environment variables (not in git)
├── .env.development                 # Development environment
├── .env.production                  # Production environment
├── .env.example                     # Environment template
├── .env.development.example         # Development env template
├── .env.production.example          # Production env template
├── artisan                          # Artisan CLI tool
├── composer.json                    # Composer dependencies
├── composer.lock                    # Composer lock file
├── package.json                     # NPM dependencies
├── phpunit.xml                      # PHPUnit config
├── vite.config.js                   # Vite config
├── API-Info.md                      # API documentation
├── README.md                        # Project documentation
└── SETUP.md                         # Setup instructions
```

---

## 🛠️ Technology Stack

### Core Framework
- **Laravel 9.x** - PHP framework
- **PHP 8.0.2+** - PHP version requirement
- **MySQL** - Database (ext-pdo_mysql required)

### Authentication & Security
- **Laravel Sanctum 3.0** - API token authentication
- **JWT Tokens** - Token-based authentication

### Third-Party Packages
- **barryvdh/laravel-dompdf 3.1** - PDF generation
- **guzzlehttp/guzzle 7.2** - HTTP client
- **league/flysystem-aws-s3-v3 3.29** - AWS S3 integration

### Development Tools
- **Laravel Pint 1.0** - Code formatter
- **Laravel Sail 1.0.1** - Docker development environment
- **PHPUnit 9.5.10** - Testing framework
- **Mockery 1.4.4** - Mocking library
- **FakerPHP 1.9.1** - Fake data generation

---

## 📦 Module Overview

### 1. **Authentication Module**
- **Location**: `app/Http/Controllers/AuthController.php`
- **Routes**: `/api/auth/*`
- **Features**:
  - User login with JWT token
  - User logout
  - Get authenticated user
  - Forgot password (with email service integration, uses web_url from App Settings)
  - Reset password (with token validation)
  - Change password (for authenticated users)
- **Status**: ✅ Fully implemented

### 2. **User Management Module**
- **Location**: `app/Http/Controllers/API/UserController.php`
- **Routes**: `/api/users/*`, `/api/users/profile`
- **Features**:
  - List users (paginated, sortable)
  - Get user by ID
  - Create user
  - Update user
  - Delete user
  - Get current user profile
  - Update current user profile (with avatar upload, address, personal info)
- **Permissions**: `view_user`, `create_user`, `edit_user`, `delete_user`
- **Status**: ✅ Fully implemented

### 3. **Role Management Module**
- **Location**: `app/Http/Controllers/API/RoleController.php`
- **Routes**: `/api/roles/*`
- **Features**:
  - List roles (paginated, sortable)
  - Get role by ID
  - Create role
  - Update role
  - Delete role (soft delete)
  - Update role permissions
- **Permissions**: `view_role`, `create_role`, `edit_role`, `delete_role`
- **Status**: ✅ Fully implemented

### 4. **Permission Management Module**
- **Location**: `app/Http/Controllers/API/PermissionController.php`
- **Routes**: `/api/permissions/*`
- **Features**:
  - List permissions
  - Get permission by ID
- **Permissions**: `view_permission`
- **Status**: ✅ Fully implemented

### 5. **Branch Management Module**
- **Location**: `app/Http/Controllers/API/BranchController.php`
- **Routes**: `/api/branches/*`
- **Features**:
  - List branches (paginated, sortable)
  - Get branch by ID
  - Create branch
  - Update branch
  - Delete branch
- **Permissions**: `view_branch`, `create_branch`, `edit_branch`, `delete_branch`
- **Status**: ✅ Fully implemented

### 6. **Package Management Module**
- **Location**: `app/Http/Controllers/API/PackageController.php`
- **Routes**: `/api/packages/*`
- **Features**:
  - List packages (paginated, sortable with server-side filtering)
  - Get package by ID
  - Create package
  - Update package
  - Delete package (soft delete)
- **Permissions**: `view_package`, `create_package`, `edit_package`, `delete_package`
- **Status**: ✅ Fully implemented

### 7. **Customer Management Module**
- **Location**: `app/Http/Controllers/API/CustomerController.php`
- **Routes**: `/api/customers/*`
- **Features**:
  - List customers (paginated, sortable, searchable with server-side filtering)
  - Get customer by ID
  - Create customer
  - Update customer
  - Delete customer (soft delete)
  - Update customer status
  - Recalculate customer statistics from orders
- **Permissions**: `view_customer`, `create_customer`, `edit_customer`, `delete_customer`
- **Status**: ✅ Fully implemented
- **Note**: Customer statistics (totalOrders, total_amount, paid_amount, etc.) automatically calculated from orders via model events

### 8. **Order Management Module**
- **Location**: `app/Http/Controllers/API/OrderController.php`
- **Routes**: `/api/orders/*`
- **Features**:
  - List orders (paginated, sortable, searchable with server-side filtering)
  - Get order by ID
  - Create order (with multiple packages/items)
  - Update order (with items update)
  - Delete order (soft delete)
  - Update order status
  - Update payment status
  - Get orders by customer
- **Permissions**: `view_order`, `create_order`, `edit_order`, `delete_order`
- **Status**: ✅ Fully implemented
- **Note**: Order create/update/delete होने पर customer stats automatically update होते हैं

### 9. **Payment Management Module**
- **Location**: `app/Http/Controllers/API/PaymentController.php`
- **Routes**: `/api/payments/*`
- **Features**:
  - List payments (paginated, sortable, searchable)
  - Get payment by ID
  - Create payment (from orders)
  - Update payment
  - Delete payment (soft delete)
  - Get payments by order
  - Auto-generates payment_number (#PAY001)
  - Auto-updates order payment status on create/update/delete
  - Auto-updates customer stats
- **Permissions**: `view_payment`, `create_payment`, `edit_payment`, `delete_payment`
- **Status**: ✅ Fully implemented
- **Note**: Payment record होने पर order payment status और customer stats automatically update होते हैं

### 10. **Settings Management Module**
- **Location**: `app/Http/Controllers/API/SettingController.php`
- **Routes**: `/api/settings/*`, `/api/global-settings/*`
- **Features**:
  - List all settings
  - Get settings by section
  - Get setting by key
  - Create setting
  - Update setting
  - Delete setting
  - Update settings group
  - Test S3 connection
  - Test email configuration (uses database email settings)
  - App Settings section (Web URL for reset password links)
- **Permissions**: `view_setting`, `edit_setting`
- **Status**: ✅ Fully implemented

### 8. **Email Service**
- **Location**: `app/Services/EmailService.php`
- **Features**:
  - Send generic emails
  - Send welcome emails
  - Send password reset emails
  - Send test emails
  - Database-driven email configuration (with fallback to .env)
  - Dynamic SMTP configuration (host, port, username, password, encryption, from address/name)
  - Email template rendering (Blade templates)
- **Status**: ✅ Fully implemented

### 11. **PDF Export Service**
- **Location**: `app/Services/PdfExportService.php`
- **Features**:
  - Generate PDF documents
  - Export reports to PDF
- **Status**: ✅ Fully implemented

### 12. **S3 Storage Service**
- **Location**: `app/Services/S3Service.php`
- **Features**:
  - Upload files to S3
  - Delete files from S3
  - Get file URLs
- **Status**: ✅ Fully implemented

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

### 5. **Controller Traits**
- **PaginatesResults Trait**: Standardizes pagination, sorting, and meta responses
- **Usage**: Compose in controllers and call `buildPaginator()` method
- **Returns**: Standardized `{ success, data, meta }` response format

---

## 📋 Development Guidelines

### Code Organization

#### 1. **Controllers**
- Keep controllers thin (max 100-150 lines)
- Delegate business logic to services
- Handle HTTP concerns only (request/response)
- Use dependency injection
- Reuse `PaginatesResults` trait for consistent pagination

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
- **Controllers**: `UserController`, `RoleController`
- **Models**: `User`, `Role`, `Permission` (singular, PascalCase)
- **Services**: `EmailService`, `PdfExportService` (PascalCase + Service)
- **Middleware**: `CheckRole`, `CheckPermission` (PascalCase)
- **Migrations**: `create_users_table`, `add_status_to_users_table` (snake_case)

#### Methods
- **Controllers**: `index`, `store`, `show`, `update`, `destroy` (RESTful)
- **Models**: `hasRole()`, `hasPermission()`, `getAllPermissions()`
- **Services**: `sendEmailImmediately()`, `uploadFile()`

#### Variables
- **camelCase**: `$userName`, `$emailService`
- **Database**: `snake_case` (Laravel convention)

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

---

## 🌐 API Development

### Request Validation
Always validate inputs:
```php
$validated = $request->validate([
    'email' => 'required|email|unique:users',
    'password' => 'required|min:8',
]);
```

### Response Format

#### Success Response
```php
// Single item
return response()->json([
    'success' => true,
    'data' => $user
], 200);

// List with pagination
return response()->json([
    'success' => true,
    'data' => $users,
    'meta' => $this->paginationMeta($paginator, $sortBy, $sortDirection)
], 200);
```

#### Error Response
```php
// Validation error (422)
return response()->json([
    'message' => 'The given data was invalid.',
    'errors' => $validator->errors()
], 422);

// Not found (404)
return response()->json([
    'message' => 'Resource not found'
], 404);

// Forbidden (403)
return response()->json([
    'message' => 'Forbidden'
], 403);
```

### Pagination Format
List endpoints return standardized format:
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false,
    "sortBy": "name",
    "sortDirection": "asc"
  }
}
```

### HTTP Status Codes
- `200` - Success (GET, PUT, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

### Using PaginatesResults Trait

```php
use App\Http\Controllers\Concerns\PaginatesResults;

class UserController extends Controller
{
    use PaginatesResults;

    public function index(Request $request)
    {
        $query = User::query();
        $sortableColumns = ['name', 'email', 'created_at'];
        $defaultSort = ['column' => 'created_at', 'direction' => 'desc'];

        [$paginator, $sortBy, $sortDirection] = $this->buildPaginator(
            $request,
            $query,
            $sortableColumns,
            $defaultSort
        );

        return response()->json([
            'success' => true,
            'data' => $paginator->items(),
            'meta' => $this->paginationMeta($paginator, $sortBy, $sortDirection)
        ]);
    }
}
```

---

## 🔒 Security Guidelines

### 1. **Authentication**
- Use Laravel Sanctum for API tokens
- Tokens stored in `personal_access_tokens` table
- Include token in `Authorization: Bearer {token}` header

### 2. **Authorization**
- Check permissions in middleware
- Admin role has all permissions (checked in User model)
- Use `hasPermission()` method for checks

### 3. **Input Validation**
- Always validate user input
- Use Laravel's validation rules
- Sanitize data before storing

### 4. **Password Security**
- Always hash passwords: `Hash::make($password)`
- Never store plain text passwords
- Use `Hash::check()` for verification

### 5. **SQL Injection**
- Use Eloquent ORM (prevents SQL injection)
- Use parameter binding for raw queries
- Never concatenate user input into queries

### 6. **CORS**
- Configured in `config/cors.php`
- Only allow trusted origins
- Support credentials for authenticated requests
- Includes dev origins: `http://localhost:5173`, `http://localhost:5174`

---

## 🧪 Testing Guidelines

### Test Structure
```
tests/
├── Feature/        # Integration tests
│   └── UserTest.php
└── Unit/           # Unit tests
    └── UserModelTest.php
```

### Writing Tests
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
   Route::get('/products', [ProductController::class, 'index'])
        ->middleware(['auth:sanctum', 'permission:view_product']);
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

1. **Add to PermissionsTableSeeder**
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

## 📊 Database Schema

### Core Tables
- **users** - User accounts (with avatar, date_of_birth, gender, state, zip_code fields)
- **roles** - User roles (with soft delete)
- **permissions** - System permissions
- **user_role** - User-role pivot table
- **role_permission** - Role-permission pivot table
- **branches** - Branch locations
- **packages** - Package definitions (package_name, package_type, default_price, description, status)
- **customers** - Customer accounts (with stats: total_orders, total_amount, paid_amount, remaining_amount, customer_code)
- **orders** - Order records (with customer_id, branch_id, status, payment_status, amounts)
- **order_items** - Order items (many packages per order: order_id, package_id, quantity, unit_price, total_price)
- **payments** - Payment records (payment_number, order_id, customer_id, payment_type, amount, payment_method)
- **settings** - System settings (including email settings: host, port, username, password, from_address, from_name; App Settings: web_url)
- **emails** - Email logs
- **personal_access_tokens** - Sanctum tokens
- **password_resets** - Password reset tokens
- **failed_jobs** - Failed queue jobs

### Relationships
- **User** has many **Roles** (many-to-many)
- **Role** has many **Permissions** (many-to-many)
- **User** has many **Permissions** (through roles)
- **Branch** belongs to many **Users** (future)
- **Customer** belongs to **Branch**
- **Customer** has many **Orders**
- **Customer** has many **Payments**
- **Order** belongs to **Customer**
- **Order** belongs to **Branch**
- **Order** has many **OrderItems**
- **Order** has many **Payments**
- **OrderItem** belongs to **Order**
- **OrderItem** belongs to **Package**
- **Payment** belongs to **Order**
- **Payment** belongs to **Customer**
- **Payment** belongs to **Branch**

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
composer install
```

### 2. Setup Environment
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Configure Database
Edit `.env` with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=photo_studio
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Run Migrations
```bash
php artisan migrate
```

### 5. Seed Database
```bash
php artisan db:seed
```

### 6. Start Server
```bash
php artisan serve
```

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
- ✅ Use PaginatesResults trait for list endpoints
- ✅ Convert empty strings to null for nullable fields
- ✅ Use database settings with fallback to .env
- ✅ Provide user-friendly error messages

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

## 📖 Additional Resources

- **Laravel Documentation**: https://laravel.com/docs/9.x
- **Laravel Sanctum**: https://laravel.com/docs/9.x/sanctum
- **Laravel Migrations**: https://laravel.com/docs/9.x/migrations

---

**Last Updated**: January 2025
**Version**: 1.1.0

## 🔄 Recent Updates
- ✅ Payment Management module fully implemented
- ✅ Payments table migration created and run
- ✅ Payment permissions added and seeded
- ✅ Server-side pagination, filtering, and searching for Packages, Customers, and Orders
- ✅ Payment model with auto order status update
- ✅ PaymentController with full CRUD operations
