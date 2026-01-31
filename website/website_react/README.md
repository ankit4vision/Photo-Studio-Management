# LV_Clicks Photography - React Website

React conversion of the LV_Clicks Photography Agency website from HTML to React + Vite.

## 📋 Project Status

**Phase 1: Project Setup & Initial Configuration - ✅ COMPLETE**
**Phase 2: Common/Layout Components - ✅ COMPLETE**
**Phase 3: Home Page Components - ✅ COMPLETE**
**Phase 4: Gallery Page Components - ✅ COMPLETE**
**Phase 5: Our Works Page Components - ✅ COMPLETE**
**Phase 6: About Page Components - ✅ COMPLETE**
**Phase 7: Album Detail Page Components - ✅ COMPLETE**
**Phase 8: Functionality & JavaScript Features - ✅ COMPLETE**
**Phase 9: Styling & CSS - ✅ COMPLETE**

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📦 Installed Packages

- **react-router-dom** - Routing functionality
- **swiper** - Slider components
- **@fancyapps/ui** - Lightbox functionality
- **bootstrap-icons** - Icon library

## 📁 Project Structure

```
website_react/
├── public/
│   ├── images/          # All images from HTML template
│   ├── fonts/           # Bootstrap Icons fonts
│   ├── plugins/         # Third-party plugin CSS/JS
│   └── favicon.png      # Site favicon
├── src/
│   ├── components/
│   │   ├── common/      # Common components
│   │   │   ├── Preloader.jsx
│   │   │   ├── PointerCursor.jsx
│   │   │   ├── ToTop.jsx
│   │   │   ├── Divider.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   └── index.js
│   │   ├── layout/      # Layout components
│   │   │   ├── Layout.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   ├── AsideInfo.jsx
│   │   │   ├── SearchModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── index.js
│   │   └── sections/    # Page sections
│   │       ├── HeroSlider.jsx
│   │       ├── TextMarquee.jsx
│   │       ├── ServicesSection.jsx
│   │       ├── ProjectsSection.jsx
│   │       ├── ImageGallerySection.jsx
│   │       ├── TestimonialsSection.jsx
│   │       ├── OfficeAddressSection.jsx
│   │       ├── AboutSection.jsx
│   │       ├── ContactFormSection.jsx
│   │       ├── GalleryImagesSection.jsx
│   │       ├── GalleryVideosSection.jsx
│   │       ├── AlbumsSection.jsx
│   │       ├── AboutPageSection.jsx
│   │       ├── FAQSection.jsx
│   │       ├── VideoPlayerSection.jsx
│   │       ├── TeamSection.jsx
│   │       ├── TestimonialsColoredSection.jsx
│   │       ├── AwardsSection.jsx
│   │       ├── AlbumImagesSwiper.jsx
│   │       ├── AlbumHeaderInfo.jsx
│   │       ├── AlbumDescription.jsx
│   │       ├── AlbumImagesGrid.jsx
│   │       ├── AlbumSidebar.jsx
│   │       └── index.js
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Gallery.jsx
│   │   ├── OurWorks.jsx
│   │   ├── About.jsx
│   │   └── AlbumDetail.jsx
│   ├── styles/          # CSS files
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── data/            # Static data files
│   ├── constants/       # Constants and configurations
│   ├── index.css        # Main CSS import
│   ├── main.jsx         # React entry point
│   └── App.jsx          # Main App component with routing
└── package.json
```

## 🎨 CSS Setup

- All CSS files copied from HTML template
- Image paths updated: `assets/img/` → `/images/`
- Plugin paths updated: `../../plugins/` → `/plugins/`
- Font paths updated: `../fonts/` → `/fonts/`
- Main CSS file imports all stylesheets

## 🧩 Phase 2 Components (Complete)

### ✅ Common Components
1. **Preloader** - Loading screen with "LV_Clicks" text
2. **PointerCursor** - Custom cursor pointer element
3. **ToTop** - Scroll to top button
4. **Divider** - Section divider component

### ✅ Layout Components
1. **Layout** - Main layout wrapper component
2. **Header** - Navigation header with logo, menu, and controls
3. **MobileMenu** - Responsive mobile navigation menu
4. **AsideInfo** - Side panel with Instagram gallery and contact info
5. **SearchModal** - Search modal dialog
6. **Footer** - Footer with newsletter and social links

## 🏠 Phase 3 Components (Complete)

### ✅ Home Page Sections
1. **HeroSlider** - Hero slider with Swiper (8 slides)
   - Heading section with title and description
   - Swiper slider with autoplay and fade effect
   - Layer images (texture, round, overlay)

2. **TextMarquee** - Scrolling text marquee
   - Infinite scroll animation
   - Text items: LV_Clicks, Photography, Studio, Wedding, Portrait, Cinematography
   - Star icons with each text

3. **ServicesSection** - Services section
   - Heading with subtitle and title
   - 6 service cards with icons
   - Grid lines background
   - WOW animations ready

4. **ProjectsSection** - Projects masonry grid
   - Heading section
   - 10 project items with images
   - Project titles and photographer names
   - Masonry layout (ready for Isotope integration)

5. **ImageGallerySection** - Image gallery
   - Heading section
   - 6 images with Fancybox lightbox (ready)
   - Masonry layout
   - "View Full Gallery" button

6. **TestimonialsSection** - Testimonials slider
   - Background image
   - Swiper slider with 3 testimonials
   - 5-star ratings
   - Quote SVG icon
   - Navigation arrows

7. **OfficeAddressSection** - Office address cards
   - 3 address cards (Website, Book Us, Studio Address)
   - Icons and contact information
   - WOW animations ready

8. **AboutSection** - About LV_Clicks section
   - Heading with subtitle and title
   - Description text
   - "Learn More About Us" button

9. **ContactFormSection** - Contact form
   - Heading section with background layers
   - Form fields (Name, Email, Subject, Message)
   - Form submission handling
   - Send Mail button

## 🔧 Component Features

### Hero Slider
- Swiper integration with autoplay
- Fade effect transitions
- 8 slides with lazy loading (first slide eager, rest lazy)
- Layer images for decoration
- Exact same structure as HTML

### Text Marquee
- Infinite scroll animation
- Text outline effects
- Star icons with each text item
- Same classes and structure

### Services Section
- 6 service cards in grid layout
- Bootstrap Icons for service icons
- Active/highlight state for one card
- Grid lines background
- WOW animation classes ready

### Projects Section
- 10 project items
- Masonry grid layout
- Project images with lazy loading
- Project titles and photographer names
- Ready for Isotope integration

### Image Gallery
- 6 gallery images
- Fancybox lightbox ready (will be integrated in Phase 8)
- Fullscreen icon on hover
- "View Full Gallery" button with React Router link

### Testimonials
- Swiper slider with navigation
- 3 testimonial slides
- 5-star ratings
- Customer images, names, and locations
- Quote SVG icon

### Contact Form
- Form validation
- State management
- Form submission handling
- All required fields
- Same structure as HTML

## 🖼️ Phase 4 Components (Complete)

### ✅ Gallery Page Sections
1. **PageHeader** - Reusable page header component
   - Background image support
   - Title display
   - Circle decoration image
   - Same classes: `wptb-page-heading`

2. **GalleryImagesSection** - Images gallery section
   - Heading with subtitle and title
   - 10 images with Fancybox lightbox (ready)
   - Masonry grid layout
   - Gallery name: "gallery-images"
   - Same structure as home page gallery

3. **GalleryVideosSection** - Videos gallery section
   - Heading with subtitle and title
   - 6 video player cards:
     - Photography Session
     - Wedding Highlights
     - Portrait Session
     - Event Coverage
     - Fashion Shoot
     - Behind The Scenes
   - YouTube/Vimeo links
   - Play button with animations
   - Background images
   - WOW animation classes ready

4. **Gallery Page** - Complete gallery page
   - Page header
   - Images gallery section
   - Videos section
   - Contact form section

## 📚 Phase 5 Components (Complete)

### ✅ Our Works Page Sections
1. **AlbumsSection** - Albums masonry grid section
   - Heading with "Our Albums" subtitle
   - Title: "LV_Clicks captures All of Your beautiful memories"
   - 8 album items with different sizes:
     - 3 items: col-md-4 (small)
     - 2 items: col-md-8 (large)
     - 3 items: col-md-4 (small)
   - Album images with lazy loading
   - Album titles and photo counts
   - Links to album detail page
   - Same classes: `effect-gradient has-radius`
   - Masonry grid layout ready for Isotope

2. **Our Works Page** - Complete our works page
   - Page header
   - Albums section
   - Contact form section

## ℹ️ Phase 6 Components (Complete)

### ✅ About Page Sections
1. **AboutPageSection** - About section with images and text
   - Large image at top (bg-6.jpg)
   - Two column layout with images
   - About text content
   - Background texture (texture.png)
   - Counter section with 2 counters:
     - 100% Customer Satisfaction
     - 350+ Photography Session
   - Odometer counter animation ready
   - Same classes: `wptb-about-one`

2. **FAQSection** - FAQ/Accordion section
   - Heading: "Why Choose Us"
   - 3 FAQ accordion items:
     - LV_Clicks Missions
     - LV_Clicks Photography Features
     - Why We are Best Photographers
   - Plus/minus icons
   - Expand/collapse functionality
   - Experience badge: "15+ Years Experience"
   - FAQ image (more/3.png)
   - Same classes: `wptb-accordion`

3. **VideoPlayerSection** - Large video player
   - Background image (bg-7.jpg)
   - YouTube video link
   - Play button with animations
   - Light decoration image (light-3.png)

4. **TeamSection** - Team members Swiper slider
   - Heading: "01 // Our Team"
   - Title: "Our Core Team of Photographers"
   - 7 team member slides
   - Member images, names, and positions
   - Social media links (FB, IG, YT, DR)
   - Swiper navigation arrows
   - Same classes: `swiper-team`

5. **TestimonialsColoredSection** - Testimonials with colored variant
   - Background: bg-2.jpg
   - Colored variant class
   - Same structure as home page testimonials
   - 3 testimonial slides

6. **AwardsSection** - Awards list section
   - Heading: "02 // Our Awards"
   - Title: "Our Photography Awards"
   - 3 award items:
     - Photography Team of the Year 2023
     - Best Wedding Photographer 2022 (active highlight)
     - Photography Team of the Year 2019
   - Award images
   - "View" buttons
   - Links to album detail
   - Same classes: `wptb-award-list`

7. **About Page** - Complete about page
   - Page header
   - About section
   - FAQ section
   - Text marquee (with custom items)
   - Video player section
   - Team section
   - Testimonials section
   - Awards section
   - Contact form section

## 🎴 Phase 7 Components (Complete)

### ✅ Album Detail Page Sections
1. **AlbumImagesSwiper** - Album images Swiper slider
   - 3 slides with images
   - Fancybox lightbox links (ready for Phase 8)
   - Navigation arrows
   - Same classes: `swiper-gallery`
   - Props-based for dynamic images

2. **AlbumHeaderInfo** - Album header info
   - Title: "Wedding Album 2024"
   - Date: December 2024
   - Photo count: 25 Photos
   - Same classes: `post-header`, `post-meta`
   - Props-based for dynamic data

3. **AlbumDescription** - Album description text
   - Paragraph text
   - Same classes: `fulltext`
   - Supports children for images grid

4. **AlbumImagesGrid** - Album images grid
   - Three different grid layouts:
     - First: 2 columns (4 images)
     - Second: 3 columns (3 images)
     - Third: 2 columns (2 images)
   - Fancybox lightbox links (ready for Phase 8)
   - Images from `projects/details/` folder
   - Props-based for dynamic images

5. **AlbumSidebar** - Album sidebar widgets
   - Album Info Widget:
     - Date, Location, Photographer, Total Photos, Category
     - Same classes: `widget`, `widget-list`
   - Share Widget:
     - Social media icons (Facebook, Instagram, Twitter, Pinterest)
     - Same classes: `social-box`
   - Back Button:
     - "Back to Albums" button
     - Link to our-works page
     - Same button styling

6. **Album Detail Page** - Complete album detail page
   - Page header
   - Album images Swiper
   - Album header info
   - Album description
   - Album images grid
   - Sidebar with widgets
   - Contact form section
   - React Router dynamic route: `/album/:id`

## 🔧 Phase 8 Components (Complete)

### ✅ Functionality & JavaScript Features
1. **Fancybox Integration** - Image and video lightbox
   - Installed: `@fancyapps/ui`
   - Global initialization in Layout component
   - Works with all `data-fancybox` attributes
   - Image galleries, video players
   - Custom configuration matching original HTML

2. **Isotope Masonry Integration** - Albums grid layout
   - Installed: `isotope-layout`, `imagesloaded`
   - Integrated in AlbumsSection component
   - Masonry grid layout with responsive columns
   - Automatic layout updates on image load

3. **WOW Scroll Animations** - Scroll-triggered animations
   - Installed: `wow.js`
   - Global initialization in Layout component
   - Works with all `wow` classes (fadeInUp, skewIn, zoomIn, etc.)
   - Mobile support enabled

4. **Odometer Counter Animation** - Animated counters
   - Custom implementation using Intersection Observer
   - Triggers when counters come into view
   - Smooth animation from 0 to target value
   - Used in AboutPageSection for:
     - 100% Customer Satisfaction
     - 350+ Photography Session

5. **Accordion/FAQ Functionality** - Expand/collapse
   - State management in FAQSection component
   - Plus/minus icon toggle
   - Smooth expand/collapse animations
   - Only one item open at a time

6. **Form Handling** - Contact and Newsletter forms
   - Contact form validation (name, email required)
   - Email format validation
   - Newsletter subscription validation
   - Success/error messages
   - Form reset after submission
   - Ready for backend API integration

7. **All Features Status**
   - ✅ React Router setup
   - ✅ Swiper integration (Hero, Testimonials, Team, Album images)
   - ✅ Fancybox integration
   - ✅ Isotope masonry integration
   - ✅ Mobile menu functionality
   - ✅ Aside panel functionality
   - ✅ Search modal functionality
   - ✅ Preloader functionality
   - ✅ Scroll to top functionality
   - ✅ Text marquee animation (CSS ready)
   - ✅ WOW scroll animations
   - ✅ Odometer counter animation
   - ✅ Accordion/FAQ functionality
   - ✅ Contact form handling
   - ✅ Newsletter form handling

## 🎨 Phase 9 Components (Complete)

### ✅ Styling & CSS Verification
1. **Custom Styles Check**
   - ✅ Logo text styles (`logo-text`) - 24px, bold
   - ✅ Spinner text styles (`spinner-text`) - 20px, 600 weight, white color
   - ✅ Image optimization styles
   - ✅ Layout shift prevention styles
   - Location: `src/styles/custom.css`

2. **Responsive Design Testing**
   - ✅ Mobile breakpoint: < 768px
   - ✅ Tablet breakpoint: 768px - 1024px
   - ✅ Desktop breakpoint: > 1024px
   - ✅ All components tested for responsiveness
   - ✅ Mobile menu, responsive grids, responsive images
   - ✅ Touch-friendly buttons and links

3. **Animation Timing Check**
   - ✅ Preloader: 1000ms fade out
   - ✅ WOW scroll animations: Offset 0, mobile enabled
   - ✅ Hover effects: 0.3s - 0.5s transitions
   - ✅ Swiper transitions: 3000ms (hero), 5000ms (testimonials)
   - ✅ Text marquee: Infinite scroll animation
   - ✅ Counter animation: ~2 seconds smooth count-up

4. **Image Loading Optimization & Lazy Loading**
   - ✅ Hero Slider: First slide eager, rest lazy
   - ✅ All gallery images: Lazy loading
   - ✅ All album images: Lazy loading
   - ✅ All team/testimonial images: Lazy loading
   - ✅ All decoration images: Lazy loading
   - ✅ All images have alt text (accessibility)
   - ✅ Layout shift prevention with aspect ratios
   - ✅ Image paths verified: `/images/...`

### Documentation:
- ✅ Created `PHASE9_CHECKLIST.md` with complete verification details

## 📝 Next Steps

**Phase 10: Testing & Final Checks**

## 🎯 Key Features Implemented

- ✅ Exact HTML structure maintained
- ✅ Same CSS classes used
- ✅ React Router integration
- ✅ State management for modals and menus
- ✅ Responsive design support
- ✅ Lazy loading implemented (images have loading="lazy")
- ✅ Dynamic data preparation (props-based components)
- ✅ Swiper integration for sliders
- ✅ Form handling with state management
- ✅ No linting errors

## 📄 License

LV_Clicks Photography Agency

## 🛠️ Development Notes

- All components follow the exact HTML structure from the original template
- CSS classes are maintained exactly as in the HTML version
- Components are designed to accept props for dynamic data (future-ready)
- Layout component manages all common UI elements
- React Router handles navigation between pages
- Swiper is integrated for hero slider and testimonials
- All images use lazy loading except first slide
- Forms have proper state management and validation
