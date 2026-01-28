# CMS Features List - Website Dynamic Content Management

**Date:** January 2025  
**Purpose:** List of all content that should be made dynamic through CMS integration with Admin Panel and Backend

---

## 📋 Overview

This document lists all static content in the website that should be converted to dynamic content managed through the Admin Panel. 

### 🔗 Integration Architecture

**CMS features will be integrated into EXISTING projects:**

1. **Backend (Laravel)** - `backend/` folder
   - New Models, Controllers, Migrations will be added
   - New API routes in `backend/routes/api.php`
   - Follows existing backend architecture patterns
   - Uses existing authentication (Sanctum) and permission system

2. **Admin Panel (React)** - `admin/` folder
   - New CMS pages will be added in `admin/src/views/website/`
   - New components in `admin/src/components/pages/website/`
   - Routes added to `admin/src/components/layout/AppContent.jsx`
   - Navigation added to `admin/src/_nav.jsx`
   - Routes config added to `admin/src/routesConfig.jsx`
   - Uses existing admin panel structure and components

3. **Website (React)** - `website/website_react/` folder
   - API integration to fetch dynamic content
   - Components updated to use API data instead of static arrays
   - New services in `website/website_react/src/services/` for API calls

### 📁 File Structure

**Backend Structure:**
```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── API/
│   │           └── Website/          # New CMS Controllers
│   │               ├── SliderController.php
│   │               ├── ServiceController.php
│   │               ├── AlbumController.php
│   │               └── ...
│   └── Models/
│       └── Website/                  # New CMS Models
│           ├── Slider.php
│           ├── Service.php
│           ├── Album.php
│           └── ...
├── database/
│   └── migrations/
│       └── create_website_*.php      # New CMS Migrations
└── routes/
    └── api.php                       # Add CMS routes here
```

**Admin Panel Structure:**
```
admin/
├── src/
│   ├── views/
│   │   └── website/                  # New CMS Views
│   │       ├── SliderList.jsx
│   │       ├── ServicesList.jsx
│   │       ├── AlbumsList.jsx
│   │       └── ...
│   ├── components/
│   │   └── pages/
│   │       └── website/              # New CMS Components
│   │           ├── SliderForm.jsx
│   │           ├── ServiceForm.jsx
│   │           └── ...
│   ├── services/
│   │   └── websiteService.js        # New CMS API Service
│   ├── _nav.jsx                      # Add CMS navigation
│   └── routesConfig.jsx              # Add CMS routes
```

**Website Structure:**
```
website/website_react/
├── src/
│   ├── services/
│   │   └── websiteApi.js            # New API service for website
│   └── pages/
│       ├── Home.jsx                 # Updated to use API
│       ├── About.jsx                # Updated to use API
│       └── ...
```

### 🎯 Implementation Approach

Each feature will require:
- **Backend:** Database tables, Models, Controllers, API endpoints (following existing patterns)
- **Admin Panel:** New pages/modules added to existing admin structure
- **Website:** API integration to fetch and display dynamic content

---

## 🏠 1. HOME PAGE CONTENT

### 1.1 Hero Slider
**Current:** Static array of 8 slider images  
**Dynamic Features:**
- ✅ Add/Edit/Delete slider images
- ✅ Upload images (with preview)
- ✅ Set image order/sequence
- ✅ Add/Edit image titles, descriptions, alt text
- ✅ Enable/Disable individual slides
- ✅ Set slider autoplay delay
- ✅ Link slides to pages/albums (optional)

**Database Fields:**
- id, image_path, title, description, alt_text, order, is_active, link_url, created_at, updated_at

**Admin Panel Route:** `/website/slider`  
**Admin Panel Files:**
- View: `admin/src/views/website/SliderList.jsx`
- Component: `admin/src/components/pages/website/SliderForm.jsx`
- Service: `admin/src/services/websiteService.js` (add slider methods)

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/SliderController.php`
- Model: `backend/app/Models/Website/Slider.php`
- Migration: `backend/database/migrations/xxxx_create_website_sliders_table.php`

**API Endpoints:** 
- `GET /api/website/slider` (public)
- `GET /api/admin/website/slider` (admin)
- `POST /api/admin/website/slider`
- `PUT /api/admin/website/slider/{id}`
- `DELETE /api/admin/website/slider/{id}`
- `PUT /api/admin/website/slider/{id}/reorder`

---

### 1.2 Services Section
**Current:** Static array of 6 services  
**Dynamic Features:**
- ✅ Add/Edit/Delete services
- ✅ Upload service icons or use icon classes
- ✅ Service title, description
- ✅ Service number/order
- ✅ Link to service detail page (optional)
- ✅ Enable/Disable services

**Database Fields:**
- id, icon_class, title, description, order, is_active, link_url, created_at, updated_at

**Admin Panel Route:** `/website/services`  
**Admin Panel Files:**
- View: `admin/src/views/website/ServicesList.jsx`
- Component: `admin/src/components/pages/website/ServiceForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/ServiceController.php`
- Model: `backend/app/Models/Website/Service.php`
- Migration: `backend/database/migrations/xxxx_create_website_services_table.php`

**API Endpoints:**
- `GET /api/website/services` (public)
- `GET /api/admin/website/services` (admin)
- `POST /api/admin/website/services`
- `PUT /api/admin/website/services/{id}`
- `DELETE /api/admin/website/services/{id}`

---

### 1.3 Projects Gallery
**Current:** Static array of 10 projects  
**Dynamic Features:**
- ✅ Add/Edit/Delete projects
- ✅ Upload project thumbnail image
- ✅ Project title, author/photographer name
- ✅ Link to album detail page
- ✅ Project category/tags
- ✅ Enable/Disable projects
- ✅ Featured projects (show on homepage)

**Database Fields:**
- id, title, author, thumbnail_image, album_id (link), category, tags, is_featured, is_active, order, created_at, updated_at

**Admin Panel Route:** `/website/projects`  
**Admin Panel Files:**
- View: `admin/src/views/website/ProjectsList.jsx`
- Component: `admin/src/components/pages/website/ProjectForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/ProjectController.php`
- Model: `backend/app/Models/Website/Project.php`
- Migration: `backend/database/migrations/xxxx_create_website_projects_table.php`

**API Endpoints:**
- `GET /api/website/projects` (public, with featured filter)
- `GET /api/admin/website/projects` (admin)
- `POST /api/admin/website/projects`
- `PUT /api/admin/website/projects/{id}`
- `DELETE /api/admin/website/projects/{id}`

---

### 1.4 Image Gallery Section
**Current:** Static array of 6 gallery images  
**Dynamic Features:**
- ✅ Add/Edit/Delete gallery images
- ✅ Upload images
- ✅ Image title, alt text
- ✅ Link to full gallery page
- ✅ Enable/Disable images

**Database Fields:**
- id, image_path, title, alt_text, order, is_active, created_at, updated_at

**Admin Panel Route:** `/website/home-gallery`  
**Admin Panel Files:**
- View: `admin/src/views/website/HomeGalleryList.jsx`
- Component: `admin/src/components/pages/website/HomeGalleryForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/HomeGalleryController.php`
- Model: `backend/app/Models/Website/HomeGallery.php`
- Migration: `backend/database/migrations/xxxx_create_website_home_gallery_table.php`

**API Endpoints:**
- `GET /api/website/home-gallery` (public)
- `GET /api/admin/website/home-gallery` (admin)
- `POST /api/admin/website/home-gallery`
- `PUT /api/admin/website/home-gallery/{id}`
- `DELETE /api/admin/website/home-gallery/{id}`

---

### 1.5 Testimonials ✅ COMPLETED
**Current:** Static array of 3 testimonials  
**Dynamic Features:**
- ✅ Add/Edit/Delete testimonials
- ✅ Upload customer photo
- ✅ Customer name, location, testimonial text
- ✅ Rating (1-5 stars)
- ✅ Enable/Disable testimonials
- ✅ Featured testimonials

**Status:** ✅ Backend ✅ Admin Panel ✅ Website Integration

**Database Fields:**
- id, customer_name, location, testimonial_text, rating, photo_path, is_featured, is_active, order, created_at, updated_at

**Admin Panel Route:** `/website/testimonials`  
**Admin Panel Files:**
- View: `admin/src/views/website/TestimonialsList.jsx`
- Component: `admin/src/components/pages/website/TestimonialForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/TestimonialController.php`
- Model: `backend/app/Models/Website/Testimonial.php`
- Migration: `backend/database/migrations/xxxx_create_website_testimonials_table.php`

**API Endpoints:**
- `GET /api/website/testimonials` (public)
- `GET /api/admin/website/testimonials` (admin)
- `POST /api/admin/website/testimonials`
- `PUT /api/admin/website/testimonials/{id}`
- `DELETE /api/admin/website/testimonials/{id}`

---

### 1.6 Office Address Section
**Current:** Static contact boxes  
**Dynamic Features:**
- ✅ Edit office address, phone, email
- ✅ Multiple office locations (if needed)
- ✅ Office hours
- ✅ Social media links

**Database Fields:**
- id, office_name, address, phone, email, office_hours, map_coordinates, is_active, created_at, updated_at

**Admin Panel Route:** `/website/office-address`  
**Admin Panel Files:**
- View: `admin/src/views/website/OfficeAddress.jsx`
- Component: `admin/src/components/pages/website/OfficeAddressForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/OfficeAddressController.php`
- Model: `backend/app/Models/Website/OfficeAddress.php`
- Migration: `backend/database/migrations/xxxx_create_website_office_addresses_table.php`

**API Endpoints:**
- `GET /api/website/office-address` (public)
- `GET /api/admin/website/office-address` (admin)
- `PUT /api/admin/website/office-address/{id}`

---

## 📖 2. ABOUT PAGE CONTENT

### 2.1 About Section Content
**Current:** Static text and images  
**Dynamic Features:**
- ✅ Edit about page main content (rich text editor)
- ✅ Upload about page images
- ✅ Edit company description paragraphs
- ✅ Multiple content sections

**Database Fields:**
- id, section_type, title, content (HTML), image_path, order, is_active, created_at, updated_at

**Admin Panel Route:** `/website/about-content`  
**Admin Panel Files:**
- View: `admin/src/views/website/AboutContent.jsx`
- Component: `admin/src/components/pages/website/AboutContentForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/AboutContentController.php`
- Model: `backend/app/Models/Website/AboutContent.php`
- Migration: `backend/database/migrations/xxxx_create_website_about_content_table.php`

**API Endpoints:**
- `GET /api/website/about-content` (public)
- `GET /api/admin/website/about-content` (admin)
- `POST /api/admin/website/about-content`
- `PUT /api/admin/website/about-content/{id}`
- `DELETE /api/admin/website/about-content/{id}`

---

### 2.2 Statistics/Counters
**Current:** Static counters (100% satisfaction, 350+ sessions)  
**Dynamic Features:**
- ✅ Add/Edit/Delete statistics
- ✅ Counter value, suffix (%, +, etc.)
- ✅ Counter label/description
- ✅ Enable/Disable counters

**Database Fields:**
- id, value, suffix, label, is_active, order, created_at, updated_at

**Admin Panel Route:** `/website/statistics`  
**Admin Panel Files:**
- View: `admin/src/views/website/StatisticsList.jsx`
- Component: `admin/src/components/pages/website/StatisticsForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/StatisticsController.php`
- Model: `backend/app/Models/Website/Statistics.php`
- Migration: `backend/database/migrations/xxxx_create_website_statistics_table.php`

**API Endpoints:**
- `GET /api/website/statistics` (public)
- `GET /api/admin/website/statistics` (admin)
- `POST /api/admin/website/statistics`
- `PUT /api/admin/website/statistics/{id}`
- `DELETE /api/admin/website/statistics/{id}`

---

### 2.3 FAQ Section
**Current:** Static array of 3 FAQ items  
**Dynamic Features:**
- ✅ Add/Edit/Delete FAQ items
- ✅ Question, Answer (rich text)
- ✅ Expand/collapse state (default)
- ✅ Category/tags
- ✅ Enable/Disable FAQs

**Database Fields:**
- id, question, answer, is_expanded, category, order, is_active, created_at, updated_at

**Admin Panel Route:** `/website/faq`  
**Admin Panel Files:**
- View: `admin/src/views/website/FAQList.jsx`
- Component: `admin/src/components/pages/website/FAQForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/FAQController.php`
- Model: `backend/app/Models/Website/FAQ.php`
- Migration: `backend/database/migrations/xxxx_create_website_faq_table.php`

**API Endpoints:**
- `GET /api/website/faq` (public)
- `GET /api/admin/website/faq` (admin)
- `POST /api/admin/website/faq`
- `PUT /api/admin/website/faq/{id}`
- `DELETE /api/admin/website/faq/{id}`

---

### 2.4 Team Members
**Current:** Static array of 6-7 team members  
**Dynamic Features:**
- ✅ Add/Edit/Delete team members
- ✅ Upload team member photo
- ✅ Name, position/role, bio
- ✅ Social media links (Facebook, Instagram, LinkedIn, etc.)
- ✅ Display order
- ✅ Enable/Disable team members

**Database Fields:**
- id, name, position, bio, photo_path, social_links (JSON), order, is_active, created_at, updated_at

**Admin Panel Route:** `/website/team`  
**Admin Panel Files:**
- View: `admin/src/views/website/TeamList.jsx`
- Component: `admin/src/components/pages/website/TeamForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/TeamController.php`
- Model: `backend/app/Models/Website/Team.php`
- Migration: `backend/database/migrations/xxxx_create_website_team_table.php`

**API Endpoints:**
- `GET /api/website/team` (public)
- `GET /api/admin/website/team` (admin)
- `POST /api/admin/website/team`
- `PUT /api/admin/website/team/{id}`
- `DELETE /api/admin/website/team/{id}`

---

### 2.5 Awards Section
**Current:** Static array of 3 awards  
**Dynamic Features:**
- ✅ Add/Edit/Delete awards
- ✅ Upload award image
- ✅ Award title, year, description
- ✅ Link to detail page
- ✅ Featured/highlighted awards
- ✅ Enable/Disable awards

**Database Fields:**
- id, title, year, description, image_path, link_url, is_featured, is_active, order, created_at, updated_at

**Admin Panel Route:** `/website/awards`  
**Admin Panel Files:**
- View: `admin/src/views/website/AwardsList.jsx`
- Component: `admin/src/components/pages/website/AwardForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/AwardController.php`
- Model: `backend/app/Models/Website/Award.php`
- Migration: `backend/database/migrations/xxxx_create_website_awards_table.php`

**API Endpoints:**
- `GET /api/website/awards` (public)
- `GET /api/admin/website/awards` (admin)
- `POST /api/admin/website/awards`
- `PUT /api/admin/website/awards/{id}`
- `DELETE /api/admin/website/awards/{id}`

---

## 🖼️ 3. GALLERY PAGE CONTENT

### 3.1 Gallery Images ✅ COMPLETED
**Current:** Static array of 10 images  
**Dynamic Features:**
- ✅ Add/Edit/Delete gallery images
- ✅ Upload images (bulk upload support)
- ✅ Image title, description, alt text
- ✅ Image categories/tags
- ✅ Enable/Disable images
- ✅ Image ordering

**Status:** ✅ Backend ✅ Admin Panel ✅ Website Integration

**Database Fields:**
- id, image_path, title, description, alt_text, category, tags, order, is_active, created_at, updated_at

**Admin Panel Route:** `/website/gallery`  
**Admin Panel Files:**
- View: `admin/src/views/website/GalleryList.jsx`
- Component: `admin/src/components/pages/website/GalleryForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/GalleryController.php`
- Model: `backend/app/Models/Website/Gallery.php`
- Migration: `backend/database/migrations/xxxx_create_website_gallery_table.php`

**API Endpoints:**
- `GET /api/website/gallery` (public, with pagination, filters)
- `GET /api/admin/website/gallery` (admin)
- `POST /api/admin/website/gallery`
- `POST /api/admin/website/gallery/bulk-upload`
- `PUT /api/admin/website/gallery/{id}`
- `DELETE /api/admin/website/gallery/{id}`

---

### 3.2 Gallery Videos ✅ COMPLETED
**Current:** Static array of 6 videos  
**Dynamic Features:**
- ✅ Add/Edit/Delete videos
- ✅ Video URL (YouTube, Vimeo)
- ✅ Video thumbnail image (upload or auto-generate)
- ✅ Video title, description
- ✅ Video platform (YouTube/Vimeo)
- ✅ Enable/Disable videos

**Status:** ✅ Backend ✅ Admin Panel ✅ Website Integration

**Database Fields:**
- id, video_url, platform, title, description, thumbnail_path, order, is_active, created_at, updated_at

**Admin Panel Route:** `/website/gallery-videos`  
**Admin Panel Files:**
- View: `admin/src/views/website/GalleryVideosList.jsx`
- Component: `admin/src/components/pages/website/GalleryVideoForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/GalleryVideoController.php`
- Model: `backend/app/Models/Website/GalleryVideo.php`
- Migration: `backend/database/migrations/xxxx_create_website_gallery_videos_table.php`

**API Endpoints:**
- `GET /api/website/gallery-videos` (public)
- `GET /api/admin/website/gallery-videos` (admin)
- `POST /api/admin/website/gallery-videos`
- `PUT /api/admin/website/gallery-videos/{id}`
- `DELETE /api/admin/website/gallery-videos/{id}`

---

## 📚 4. OUR WORKS / ALBUMS PAGE

### 4.1 Albums Management ✅ COMPLETED
**Current:** Static array of 8 albums  
**Dynamic Features:**
- ✅ Add/Edit/Delete albums
- ✅ Upload album cover image
- ✅ Album title, description
- ✅ Photo count (auto-calculated or manual)
- ✅ Album category/type
- ✅ Grid column size (4, 8, etc.)
- ✅ Link to album detail page
- ✅ Featured albums
- ✅ Enable/Disable albums
- ✅ Album date/event date

**Status:** ✅ Backend ✅ Admin Panel ✅ Website Integration

**Database Fields:**
- id, title, description, cover_image, photo_count, category, grid_column_size, is_featured, is_active, event_date, order, created_at, updated_at

**Admin Panel Route:** `/website/albums`  
**Admin Panel Files:**
- View: `admin/src/views/website/AlbumsList.jsx`
- Component: `admin/src/components/pages/website/AlbumForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/AlbumController.php`
- Model: `backend/app/Models/Website/Album.php`
- Migration: `backend/database/migrations/xxxx_create_website_albums_table.php`

**API Endpoints:**
- `GET /api/website/albums` (public)
- `GET /api/admin/website/albums` (admin)
- `POST /api/admin/website/albums`
- `PUT /api/admin/website/albums/{id}`
- `DELETE /api/admin/website/albums/{id}`

---

### 4.2 Album Detail Page
**Current:** Static album detail with images  
**Dynamic Features:**
- ✅ Album information (title, date, description)
- ✅ Album slider images (featured images)
- ✅ Album detail images grid
- ✅ Add/Remove images from album
- ✅ Image ordering within album
- ✅ Album meta information
- ✅ Share buttons configuration

**Database Fields:**
- Album: id, title, description, event_date, meta_info (JSON)
- Album Images: id, album_id, image_path, is_featured, order, created_at, updated_at

**Admin Panel Route:** `/website/albums/:id/edit`  
**Admin Panel Files:**
- View: `admin/src/views/website/AlbumDetail.jsx`
- Component: `admin/src/components/pages/website/AlbumImageForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/AlbumImageController.php`
- Model: `backend/app/Models/Website/AlbumImage.php`
- Migration: `backend/database/migrations/xxxx_create_website_album_images_table.php`

**API Endpoints:**
- `GET /api/website/albums/{id}` (public)
- `GET /api/admin/website/albums/{id}` (admin)
- `PUT /api/admin/website/albums/{id}`
- `POST /api/admin/website/albums/{id}/images`
- `PUT /api/admin/website/albums/{id}/images/{imageId}`
- `DELETE /api/admin/website/albums/{id}/images/{imageId}`
- `PUT /api/admin/website/albums/{id}/images/reorder`

---

## 📞 5. CONTACT PAGE CONTENT

### 5.1 Contact Information
**Current:** Static contact details  
**Dynamic Features:**
- ✅ Edit contact form heading, description
- ✅ Edit office address, phone, email
- ✅ Edit Google Maps coordinates
- ✅ Edit office hours
- ✅ Multiple contact methods

**Database Fields:**
- id, form_heading, form_description, office_address, phone, email, map_coordinates, office_hours, is_active, created_at, updated_at

**Admin Panel Route:** `/website/contact-info`  
**Admin Panel Files:**
- View: `admin/src/views/website/ContactInfo.jsx`
- Component: `admin/src/components/pages/website/ContactInfoForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/ContactInfoController.php`
- Model: `backend/app/Models/Website/ContactInfo.php`
- Migration: `backend/database/migrations/xxxx_create_website_contact_info_table.php`

**API Endpoints:**
- `GET /api/website/contact-info` (public)
- `GET /api/admin/website/contact-info` (admin)
- `PUT /api/admin/website/contact-info/{id}`

---

### 5.2 Contact Form Submissions
**Current:** No form handling  
**Dynamic Features:**
- ✅ Store contact form submissions
- ✅ View submissions in admin panel
- ✅ Mark as read/unread
- ✅ Reply to submissions (email integration)
- ✅ Export submissions
- ✅ Delete submissions

**Database Fields:**
- id, name, email, subject, message, status (new/read/replied), replied_at, created_at, updated_at

**Admin Panel Route:** `/website/contact-submissions`  
**Admin Panel Files:**
- View: `admin/src/views/website/ContactSubmissionsList.jsx`
- Component: `admin/src/components/pages/website/ContactSubmissionDetails.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/ContactSubmissionController.php`
- Model: `backend/app/Models/Website/ContactSubmission.php`
- Migration: `backend/database/migrations/xxxx_create_website_contact_submissions_table.php`

**API Endpoints:**
- `POST /api/website/contact` (public - submit form)
- `GET /api/admin/website/contact-submissions` (admin)
- `GET /api/admin/website/contact-submissions/{id}` (admin)
- `PUT /api/admin/website/contact-submissions/{id}/status`
- `DELETE /api/admin/website/contact-submissions/{id}`

---

## 🎨 6. GENERAL WEBSITE SETTINGS

### 6.1 Site Settings
**Current:** Hardcoded values  
**Dynamic Features:**
- ✅ Site name, logo (light/dark versions)
- ✅ Site description, meta tags
- ✅ Social media links (Facebook, Instagram, LinkedIn, YouTube, Behance)
- ✅ Copyright text
- ✅ Google Maps API key (if needed)
- ✅ Email settings for contact form
- ✅ SEO settings (meta title, description, keywords)

**Database Fields:**
- id, site_name, logo_light, logo_dark, description, meta_title, meta_description, meta_keywords, social_links (JSON), copyright_text, google_maps_key, contact_email, created_at, updated_at

**Admin Panel Route:** `/website/settings`  
**Admin Panel Files:**
- View: `admin/src/views/website/WebsiteSettings.jsx`
- Component: `admin/src/components/pages/website/WebsiteSettingsForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/WebsiteSettingsController.php`
- Model: `backend/app/Models/Website/WebsiteSettings.php`
- Migration: `backend/database/migrations/xxxx_create_website_settings_table.php`

**API Endpoints:**
- `GET /api/website/settings` (public - limited fields)
- `GET /api/admin/website/settings` (admin)
- `PUT /api/admin/website/settings/{id}`

---

### 6.2 Navigation Menu
**Current:** Static menu in Header  
**Dynamic Features:**
- ✅ Add/Edit/Delete menu items
- ✅ Menu item order
- ✅ Menu item links (internal/external)
- ✅ Enable/Disable menu items
- ✅ Dropdown menus (if needed)

**Database Fields:**
- id, label, link, type (internal/external), parent_id, order, is_active, created_at, updated_at

**Admin Panel Route:** `/website/menu`  
**Admin Panel Files:**
- View: `admin/src/views/website/MenuList.jsx`
- Component: `admin/src/components/pages/website/MenuForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/MenuController.php`
- Model: `backend/app/Models/Website/Menu.php`
- Migration: `backend/database/migrations/xxxx_create_website_menu_table.php`

**API Endpoints:**
- `GET /api/website/menu` (public)
- `GET /api/admin/website/menu` (admin)
- `POST /api/admin/website/menu`
- `PUT /api/admin/website/menu/{id}`
- `DELETE /api/admin/website/menu/{id}`
- `PUT /api/admin/website/menu/reorder`

---

### 6.3 Footer Content
**Current:** Static footer links and content  
**Dynamic Features:**
- ✅ Edit footer links (3 columns)
- ✅ Edit newsletter subscription text
- ✅ Edit copyright text
- ✅ Social media links
- ✅ Footer widgets configuration

**Database Fields:**
- id, column, links (JSON), newsletter_text, copyright_text, social_links (JSON), created_at, updated_at

**Admin Panel Route:** `/website/footer`  
**Admin Panel Files:**
- View: `admin/src/views/website/FooterSettings.jsx`
- Component: `admin/src/components/pages/website/FooterForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/FooterController.php`
- Model: `backend/app/Models/Website/Footer.php`
- Migration: `backend/database/migrations/xxxx_create_website_footer_table.php`

**API Endpoints:**
- `GET /api/website/footer` (public)
- `GET /api/admin/website/footer` (admin)
- `PUT /api/admin/website/footer/{id}`

---

### 6.4 Newsletter Subscriptions
**Current:** No subscription handling  
**Dynamic Features:**
- ✅ Store newsletter email subscriptions
- ✅ View subscriptions in admin panel
- ✅ Export subscriptions
- ✅ Unsubscribe functionality
- ✅ Email integration for newsletters

**Database Fields:**
- id, email, status (active/unsubscribed), subscribed_at, unsubscribed_at, created_at, updated_at

**Admin Panel Route:** `/website/newsletter`  
**Admin Panel Files:**
- View: `admin/src/views/website/NewsletterList.jsx`
- Component: `admin/src/components/pages/website/NewsletterForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/NewsletterController.php`
- Model: `backend/app/Models/Website/Newsletter.php`
- Migration: `backend/database/migrations/xxxx_create_website_newsletter_table.php`

**API Endpoints:**
- `POST /api/website/newsletter/subscribe` (public)
- `POST /api/website/newsletter/unsubscribe` (public)
- `GET /api/admin/website/newsletter` (admin)
- `DELETE /api/admin/website/newsletter/{id}`

---

## 📝 7. PAGE CONTENT MANAGEMENT

### 7.1 Page Headers/Banners
**Current:** Removed from some pages  
**Dynamic Features:**
- ✅ Enable/Disable page banners per page
- ✅ Custom banner image per page
- ✅ Banner title, subtitle
- ✅ Banner overlay settings

**Database Fields:**
- id, page_route, banner_image, title, subtitle, is_enabled, created_at, updated_at

**Admin Panel Route:** `/website/page-headers`  
**Admin Panel Files:**
- View: `admin/src/views/website/PageHeadersList.jsx`
- Component: `admin/src/components/pages/website/PageHeaderForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/PageHeaderController.php`
- Model: `backend/app/Models/Website/PageHeader.php`
- Migration: `backend/database/migrations/xxxx_create_website_page_headers_table.php`

**API Endpoints:**
- `GET /api/website/page-headers/{pageRoute}` (public)
- `GET /api/admin/website/page-headers` (admin)
- `PUT /api/admin/website/page-headers/{id}`

---

### 7.2 Section Headings
**Current:** Static headings on pages  
**Dynamic Features:**
- ✅ Edit section headings, subtitles, descriptions
- ✅ Per-page section content management

**Database Fields:**
- id, page_route, section_key, title, subtitle, description, order, created_at, updated_at

**Admin Panel Route:** `/website/sections`  
**Admin Panel Files:**
- View: `admin/src/views/website/SectionsList.jsx`
- Component: `admin/src/components/pages/website/SectionForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/SectionController.php`
- Model: `backend/app/Models/Website/Section.php`
- Migration: `backend/database/migrations/xxxx_create_website_sections_table.php`

**API Endpoints:**
- `GET /api/website/sections/{pageRoute}` (public)
- `GET /api/admin/website/sections` (admin)
- `PUT /api/admin/website/sections/{id}`

---

## 🎯 8. ADDITIONAL FEATURES

### 8.1 Image Management
**Dynamic Features:**
- ✅ Centralized image upload/management
- ✅ Image optimization
- ✅ Image categories/folders
- ✅ Bulk image operations
- ✅ Image metadata (alt text, captions)

**Admin Panel Route:** `/website/media`  
**Admin Panel Files:**
- View: `admin/src/views/website/MediaLibrary.jsx`
- Component: `admin/src/components/pages/website/MediaUpload.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/MediaController.php`
- Model: `backend/app/Models/Website/Media.php`
- Migration: `backend/database/migrations/xxxx_create_website_media_table.php`

**API Endpoints:**
- `POST /api/admin/website/media/upload`
- `GET /api/admin/website/media`
- `DELETE /api/admin/website/media/{id}`

---

### 8.2 Content Versioning
**Dynamic Features:**
- ✅ Save content revisions
- ✅ Restore previous versions
- ✅ Preview before publish

---

### 8.3 SEO Management
**Dynamic Features:**
- ✅ Per-page SEO settings
- ✅ Meta titles, descriptions
- ✅ Open Graph tags
- ✅ Schema markup

**Database Fields:**
- id, page_route, meta_title, meta_description, meta_keywords, og_image, schema_markup, created_at, updated_at

**Admin Panel Route:** `/website/seo`  
**Admin Panel Files:**
- View: `admin/src/views/website/SEOList.jsx`
- Component: `admin/src/components/pages/website/SEOForm.jsx`

**Backend Files:**
- Controller: `backend/app/Http/Controllers/API/Website/SEOController.php`
- Model: `backend/app/Models/Website/SEO.php`
- Migration: `backend/database/migrations/xxxx_create_website_seo_table.php`

**API Endpoints:**
- `GET /api/website/seo/{pageRoute}` (public)
- `GET /api/admin/website/seo` (admin)
- `PUT /api/admin/website/seo/{id}`

---

## 📊 SUMMARY

### Total CMS Features: **35+ Features**

**Priority Levels:**
- **High Priority:** Hero Slider, Services, Albums, Gallery Images, Team, Testimonials, Contact Info
- **Medium Priority:** FAQ, Awards, Statistics, Projects, Videos, Site Settings
- **Low Priority:** Newsletter, Content Versioning, Advanced SEO

### Database Tables Needed:
1. `website_sliders`
2. `website_services`
3. `website_projects`
4. `website_gallery_images`
5. `website_gallery_videos`
6. `website_testimonials`
7. `website_albums`
8. `website_album_images`
9. `website_about_content`
10. `website_statistics`
11. `website_faq`
12. `website_team`
13. `website_awards`
14. `website_contact_info`
15. `website_contact_submissions`
16. `website_settings`
17. `website_menu`
18. `website_footer`
19. `website_newsletter`
20. `website_page_headers`
21. `website_sections`
22. `website_media`
23. `website_seo`

### Admin Panel Navigation Structure

CMS modules will be added as a new section in the admin panel navigation (`admin/src/_nav.jsx`):

```javascript
{
  component: CNavTitle,
  name: 'Website CMS',
},
{
  component: CNavItem,
  name: 'Home Page',
  to: '/website/home',
  icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  items: [
    { name: 'Hero Slider', to: '/website/slider' },
    { name: 'Services', to: '/website/services' },
    { name: 'Projects', to: '/website/projects' },
    { name: 'Home Gallery', to: '/website/home-gallery' },
    { name: 'Testimonials', to: '/website/testimonials' },
  ]
},
{
  component: CNavItem,
  name: 'Content Pages',
  to: '/website/content',
  icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  items: [
    { name: 'About Content', to: '/website/about-content' },
    { name: 'Team Members', to: '/website/team' },
    { name: 'FAQ', to: '/website/faq' },
    { name: 'Statistics', to: '/website/statistics' },
    { name: 'Awards', to: '/website/awards' },
  ]
},
{
  component: CNavItem,
  name: 'Gallery & Albums',
  to: '/website/gallery',
  icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
  items: [
    { name: 'Gallery Images', to: '/website/gallery' },
    { name: 'Gallery Videos', to: '/website/gallery-videos' },
    { name: 'Albums', to: '/website/albums' },
  ]
},
{
  component: CNavItem,
  name: 'Contact',
  to: '/website/contact',
  icon: <CIcon icon={cilEnvelope} customClassName="nav-icon" />,
  items: [
    { name: 'Contact Info', to: '/website/contact-info' },
    { name: 'Submissions', to: '/website/contact-submissions' },
  ]
},
{
  component: CNavItem,
  name: 'Website Settings',
  to: '/website/settings',
  icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  items: [
    { name: 'General Settings', to: '/website/settings' },
    { name: 'Navigation Menu', to: '/website/menu' },
    { name: 'Footer', to: '/website/footer' },
    { name: 'Page Headers', to: '/website/page-headers' },
    { name: 'Sections', to: '/website/sections' },
    { name: 'SEO', to: '/website/seo' },
  ]
},
{
  component: CNavItem,
  name: 'Media Library',
  to: '/website/media',
  icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
},
{
  component: CNavItem,
  name: 'Newsletter',
  to: '/website/newsletter',
  icon: <CIcon icon={cilEnvelopeOpen} customClassName="nav-icon" />,
},
```

### Admin Panel Routes to Add

Routes will be added to `admin/src/components/layout/AppContent.jsx`:

```javascript
// Website CMS Routes
<Route path="/website/slider" element={<SliderList />} />
<Route path="/website/services" element={<ServicesList />} />
<Route path="/website/projects" element={<ProjectsList />} />
<Route path="/website/home-gallery" element={<HomeGalleryList />} />
<Route path="/website/testimonials" element={<TestimonialsList />} />
<Route path="/website/about-content" element={<AboutContent />} />
<Route path="/website/team" element={<TeamList />} />
<Route path="/website/faq" element={<FAQList />} />
<Route path="/website/statistics" element={<StatisticsList />} />
<Route path="/website/awards" element={<AwardsList />} />
<Route path="/website/gallery" element={<GalleryList />} />
<Route path="/website/gallery-videos" element={<GalleryVideosList />} />
<Route path="/website/albums" element={<AlbumsList />} />
<Route path="/website/albums/:id/edit" element={<AlbumDetail />} />
<Route path="/website/contact-info" element={<ContactInfo />} />
<Route path="/website/contact-submissions" element={<ContactSubmissionsList />} />
<Route path="/website/settings" element={<WebsiteSettings />} />
<Route path="/website/menu" element={<MenuList />} />
<Route path="/website/footer" element={<FooterSettings />} />
<Route path="/website/newsletter" element={<NewsletterList />} />
<Route path="/website/page-headers" element={<PageHeadersList />} />
<Route path="/website/sections" element={<SectionsList />} />
<Route path="/website/media" element={<MediaLibrary />} />
<Route path="/website/seo" element={<SEOList />} />
```

### Backend Routes to Add

Routes will be added to `backend/routes/api.php`:

```php
// Website CMS Routes (Public - for website)
Route::prefix('website')->group(function () {
    Route::get('/slider', [Website\SliderController::class, 'index']);
    Route::get('/services', [Website\ServiceController::class, 'index']);
    Route::get('/projects', [Website\ProjectController::class, 'index']);
    // ... more public routes
});

// Website CMS Routes (Admin - protected)
Route::middleware('auth:sanctum')->prefix('admin/website')->group(function () {
    Route::apiResource('slider', Website\SliderController::class);
    Route::apiResource('services', Website\ServiceController::class);
    Route::apiResource('projects', Website\ProjectController::class);
    // ... more admin routes
});
```

---

## 🚀 Implementation Order Recommendation

### ⚠️ STEP 0: Database Seeders (MUST DO FIRST)
**Before starting any development:**
1. ✅ Extract all current static data from website components
2. ✅ Create all seeder files with current data
3. ✅ Update DatabaseSeeder.php
4. ✅ Test seeders run successfully
5. ✅ Verify data appears in database

**This ensures database is not blank and existing content is preserved.**

---

### Phase 1 (Core Content):
1. Site Settings
2. Hero Slider
3. Services
4. Albums & Album Images
5. Gallery Images

### Phase 2 (Content Pages):
6. About Content
7. Team Members
8. Testimonials
9. FAQ
10. Statistics

### Phase 3 (Interactive Features):
11. Contact Form Submissions
12. Newsletter Subscriptions
13. Gallery Videos
14. Projects

### Phase 4 (Advanced Features):
15. Awards
16. Menu Management
17. Footer Management
18. SEO Management
19. Media Library

---

### 📋 Development Workflow

**For Each Feature:**
1. **Backend:**
   - Create migration
   - Create model
   - Create controller
   - Add API routes
   - Create seeder with current data (if applicable)
   - Test API endpoints

2. **Admin Panel:**
   - Create view component
   - Create form component
   - Add service methods
   - Add routes
   - Add navigation
   - Test CRUD operations

3. **Website:**
   - Create/update API service
   - Update component to fetch from API
   - Test data display
   - Handle loading/error states

---

## 🔐 Permissions Required

New permissions will be added to the existing permission system:

**Permission Names:**
- `view_website_content`
- `create_website_content`
- `edit_website_content`
- `delete_website_content`
- `view_website_slider`
- `create_website_slider`
- `edit_website_slider`
- `delete_website_slider`
- `view_website_services`
- `create_website_services`
- `edit_website_services`
- `delete_website_services`
- ... (similar for all CMS modules)

**Permission Structure:**
- Module: `website`
- Submodules: `slider`, `services`, `albums`, `gallery`, `team`, etc.
- Types: `view`, `create`, `edit`, `delete`

---

## 🌱 Database Seeders - IMPORTANT

### ⚠️ Critical Requirement: Seed Current Static Data

**Before starting development, ALL current static data from the website MUST be added to database seeders.** This ensures:
- ✅ Database is not blank when migrations run
- ✅ Existing content is preserved and available immediately
- ✅ Website shows data from database from day one
- ✅ No data loss during migration

### 📋 Seeder Files to Create

All seeders will be created in `backend/database/seeders/`:

1. **WebsiteSliderSeeder.php** - Seed hero slider images (8 images)
2. **WebsiteServiceSeeder.php** - Seed services (6 services)
3. **WebsiteProjectSeeder.php** - Seed projects (10 projects)
4. **WebsiteHomeGallerySeeder.php** - Seed home gallery images (6 images)
5. **WebsiteTestimonialSeeder.php** - Seed testimonials (3 testimonials)
6. **WebsiteAboutContentSeeder.php** - Seed about page content
7. **WebsiteStatisticsSeeder.php** - Seed statistics (100% satisfaction, 350+ sessions)
8. **WebsiteFAQSeeder.php** - Seed FAQ items (3 FAQs)
9. **WebsiteTeamSeeder.php** - Seed team members (6-7 members)
10. **WebsiteAwardSeeder.php** - Seed awards (3 awards)
11. **WebsiteGallerySeeder.php** - Seed gallery images (10 images)
12. **WebsiteGalleryVideoSeeder.php** - Seed gallery videos (6 videos)
13. **WebsiteAlbumSeeder.php** - Seed albums (8 albums)
14. **WebsiteAlbumImageSeeder.php** - Seed album images
15. **WebsiteContactInfoSeeder.php** - Seed contact information
16. **WebsiteSettingsSeeder.php** - Seed website settings
17. **WebsiteMenuSeeder.php** - Seed navigation menu items
18. **WebsiteFooterSeeder.php** - Seed footer content

### 📝 Current Static Data to Seed

#### 1. Hero Slider (8 images)
```php
// From: website/website_react/src/pages/Home.jsx
$sliderImages = [37, 38, 39, 40, 41, 38, 39, 40];
// Image paths: /assets/img/slider/{num}.jpg
```

#### 2. Services (6 services)
```php
// From: website/website_react/src/pages/Home.jsx
[
  { icon: 'bi-camera', title: 'Wedding Photography', desc: '...', num: '01' },
  { icon: 'bi-camera-video', title: 'Wedding Cinematography', desc: '...', num: '02' },
  { icon: 'bi-images', title: 'Portrait Photography', desc: '...', num: '03' },
  { icon: 'bi-camera-reels', title: 'Event Photography', desc: '...', num: '04' },
  { icon: 'bi-palette', title: 'Photo Editing', desc: '...', num: '05' },
  { icon: 'bi-book', title: 'Album Design', desc: '...', num: '06' },
]
```

#### 3. Projects (10 projects)
```php
// From: website/website_react/src/pages/Home.jsx
[
  { title: 'Bright Boho Sunshine', author: 'Jonathon Willson' },
  { title: 'California Fall Collection 2023', author: 'Jonathon Willson' },
  { title: 'Brown girl next door', author: 'Jonathon Willson' },
  // ... 10 total projects
]
```

#### 4. Home Gallery Images (6 images)
```php
// From: website/website_react/src/pages/Home.jsx
$galleryImages = [1, 2, 3, 4, 5, 6];
// Image paths: /assets/img/projects/gallery/{num}.jpg
```

#### 5. Testimonials (3 testimonials)
```php
// From: website/website_react/src/pages/About.jsx
[
  { name: 'Rachel Jackson', location: 'New York', image: 1 },
  { name: 'Helen Jordan', location: 'Chicago', image: 2 },
  { name: 'Helen Jordan', location: 'New York', image: 3 }
]
```

#### 6. FAQ Items (3 FAQs)
```php
// From: website/website_react/src/pages/About.jsx
[
  { title: 'LV_Clicks Missions', content: '...', active: true },
  { title: 'LV_Clicks Photography Features', content: '...' },
  { title: 'Why We are Best Photographers', content: '...' }
]
```

#### 7. Team Members (6-7 members)
```php
// From: website/website_react/src/pages/About.jsx
[
  { name: 'Maxim Alexhander', position: 'CEO, LV_Clicks Agency', image: 1 },
  { name: 'Nelson Jameson', position: 'Photographer', image: 2 },
  // ... 6-7 total members
]
```

#### 8. Statistics (2 counters)
```php
// From: website/website_react/src/pages/About.jsx
[
  { value: 100, suffix: '%', label: 'Customer Satisfaction' },
  { value: 350, suffix: '+', label: 'Photography Session' }
]
```

#### 9. Awards (3 awards)
```php
// From: website/website_react/src/pages/About.jsx
[
  { title: 'Photography Team of the Year 2023', year: 2023, image: 4 },
  { title: 'Best Wedding Photographer 2022', year: 2022, image: 5 },
  { title: 'Photography Team of the Year 2019', year: 2019, image: 6 }
]
```

#### 10. Gallery Images (10 images)
```php
// From: website/website_react/src/pages/Gallery.jsx
$galleryImages = Array.from({ length: 10 }, (_, i) => i + 1);
// Image paths: /assets/img/projects/1/{num}.jpg
```

#### 11. Gallery Videos (6 videos)
```php
// From: website/website_react/src/pages/Gallery.jsx
[
  { title: 'Photography Session', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { title: 'Wedding Highlights', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  // ... 6 total videos
]
```

#### 12. Albums (8 albums)
```php
// From: website/website_react/src/pages/OurWorks.jsx
[
  { title: 'Wedding Album 2024', count: '25 Photos', image: 1, col: 4 },
  { title: 'Portrait Session', count: '18 Photos', image: 2, col: 4 },
  // ... 8 total albums
]
```

#### 13. Contact Information
```php
// From: website/website_react/src/pages/Contact.jsx
- Office Address: Voharwad, Lunawada, Gujarat 389230
- Phone: +123 455 987 994
- Email: info@lvclicks.com
- Website: www.lvclicks.com
- Map Coordinates: 23.130011, 73.61087
```

#### 14. Website Settings
```php
- Site Name: LV_Clicks
- Logo: (light and dark versions)
- Social Media Links: Facebook, Instagram, LinkedIn, YouTube, Behance
- Copyright: LV_Clicks Photography, All Rights Reserved © 2025
```

#### 15. Navigation Menu
```php
// From: website/website_react/src/components/Header.jsx
[
  { label: 'Home', link: '/', order: 1 },
  { label: 'Gallery', link: '/gallery', order: 2 },
  { label: 'Our Works', link: '/our-works', order: 3 },
  { label: 'About Us', link: '/about', order: 4 },
  { label: 'Contact', link: '/contact', order: 5 }
]
```

#### 16. Footer Content
```php
// From: website/website_react/src/components/Footer.jsx
- Footer Links (3 columns)
- Newsletter Text: "Sign up for all the latest news and offers"
- Copyright Text: "LV_Clicks Photography, All Rights Reserved © 2025"
- Social Media Links
```

### 🔧 Seeder Implementation Pattern

**Example Seeder Structure:**

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Website\Slider;

class WebsiteSliderSeeder extends Seeder
{
    public function run()
    {
        $sliders = [
            [
                'image_path' => '/assets/img/slider/37.jpg',
                'title' => 'Slider Image 1',
                'description' => 'Description for slider image 1',
                'alt_text' => 'LV_Clicks Photography',
                'order' => 1,
                'is_active' => true,
            ],
            // ... more slider data
        ];

        foreach ($sliders as $slider) {
            Slider::updateOrCreate(
                ['image_path' => $slider['image_path']],
                $slider
            );
        }
    }
}
```

### 📦 DatabaseSeeder Update

Update `backend/database/seeders/DatabaseSeeder.php`:

```php
public function run()
{
    $this->call([
        // Existing seeders
        RolesTableSeeder::class,
        PermissionsTableSeeder::class,
        RolePermissionSeeder::class,
        BranchSeeder::class,
        PackageTypeSeeder::class,
        FinancialCategorySeeder::class,
        UserSeeder::class,
        
        // NEW: Website CMS Seeders
        WebsiteSliderSeeder::class,
        WebsiteServiceSeeder::class,
        WebsiteProjectSeeder::class,
        WebsiteHomeGallerySeeder::class,
        WebsiteTestimonialSeeder::class,
        WebsiteAboutContentSeeder::class,
        WebsiteStatisticsSeeder::class,
        WebsiteFAQSeeder::class,
        WebsiteTeamSeeder::class,
        WebsiteAwardSeeder::class,
        WebsiteGallerySeeder::class,
        WebsiteGalleryVideoSeeder::class,
        WebsiteAlbumSeeder::class,
        WebsiteAlbumImageSeeder::class,
        WebsiteContactInfoSeeder::class,
        WebsiteSettingsSeeder::class,
        WebsiteMenuSeeder::class,
        WebsiteFooterSeeder::class,
    ]);
}
```

### ✅ Seeder Checklist

Before starting development, ensure:
- [ ] All current static data is extracted from website components
- [ ] All seeder files are created with current data
- [ ] Image paths are correctly mapped
- [ ] All relationships are properly seeded
- [ ] DatabaseSeeder.php is updated
- [ ] Seeders can run without errors
- [ ] After seeding, website shows all existing content from database

### 🚀 Running Seeders

```bash
# Run all seeders (including website CMS seeders)
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=WebsiteSliderSeeder

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

---

## 📝 Notes

1. **⚠️ CRITICAL: Seeders First** - ALL current static data MUST be seeded before development starts
2. **Existing Architecture:** All CMS features will follow the existing patterns used in the admin panel and backend
3. **Reusable Components:** Use existing admin panel components (FormModal, Table, etc.)
4. **API Structure:** Follow existing API response format and error handling
5. **Authentication:** Use existing Sanctum authentication
6. **Permissions:** Integrate with existing permission system
7. **File Uploads:** Use existing file upload patterns from backend
8. **Image Storage:** Store images in `backend/storage/app/public/website/` or similar
9. **Data Migration:** Current static data will be preserved through seeders

---

**Last Updated:** January 2025  
**Status:** Ready for Development Planning  
**Integration:** CMS will be integrated into existing Admin Panel and Backend projects

