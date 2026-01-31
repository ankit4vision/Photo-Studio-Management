# LV_Clicks Website - HTML to React Conversion Guide (Step-by-Step)

## 📋 Overview

Yeh guide HTML template ko React (JSX) + Vite + CSS mein convert karne ke liye step-by-step tasks provide karti hai. Har step ek specific task hai jo aap mujhe karne ko bol sakte hain. **Important: Exact UI/UX maintain karna hai, kuch bhi change nahi chahiye.**

---

## 🎯 Conversion Strategy

1. **Exact HTML Structure** - Har HTML element ko exactly same React component mein convert karna
2. **Same CSS Classes** - Sabhi CSS classes same rahengi
3. **Same Functionality** - Sabhi JavaScript features same kaam karenge
4. **Same Images/Assets** - Sabhi assets same paths par honge
5. **No UI/UX Changes** - Design bilkul same rahega
6. **Lazy Loading** - Sabhi images aur videos lazy loading ke saath honge
7. **Dynamic Data Ready** - Components dynamic data ke liye prepare honge, par UI/UX bilkul same rahega
8. **Grid Layout Consistency** - Dynamic data aane par bhi grid layout same rahega, koi shift nahi hoga

---

## 📦 PHASE 1: Project Setup & Initial Configuration

### Step 1: Vite + React Project Create Karna
**Task:** Naya Vite React project create karo `website_react` folder mein
- Vite template use karo (React)
- Project structure setup karo
- Basic dependencies install karo

### Step 2: Required NPM Packages Install Karna
**Task:** Sabhi required packages install karo:
- react-router-dom (routing ke liye)
- swiper (sliders ke liye)
- @fancyapps/ui (lightbox ke liye)
- bootstrap-icons (icons ke liye)
- react-lazy-load-image-component (lazy loading ke liye) YA
- loading="lazy" native attribute use karo
- Aur baki jo zarurat ho

### Step 3: Folder Structure Create Karna
**Task:** Complete folder structure create karo:
- `src/components/` - Sabhi components
- `src/pages/` - Sabhi pages
- `src/styles/` - CSS files
- `public/images/` - Images
- `src/hooks/` - Custom hooks
- `src/utils/` - Utility functions
- `src/data/` - Static data files (dynamic data ke liye prepare)
- `src/constants/` - Constants aur configurations

### Step 4: Assets Copy Karna
**Task:** HTML template se sabhi assets copy karo:
- Images folder ko `public/images/` mein copy karo
- CSS files ko `src/styles/` mein copy karo
- Favicon copy karo
- Fonts copy karo (agar hain)

### Step 5: CSS Setup & Path Updates
**Task:** CSS files ko setup karo aur paths update karo:
- Main CSS file create karo jo sab import kare
- Image paths update karo (`assets/img/` → `/images/`)
- Bootstrap Icons import karo
- Swiper CSS import karo
- Fancybox CSS import karo

---

## 🧩 PHASE 2: Common/Layout Components (Sab Pages Par Same)

### Step 6: Preloader Component
**Task:** `index.html` se Preloader section ko React component mein convert karo
- Exact same HTML structure
- Same classes aur styling
- Loading state handle karo
- "LV_Clicks" text same rahe

### Step 7: Pointer Cursor Component
**Task:** Pointer cursor element ko component mein convert karo
- `bnz-pointer` class maintain karo
- Same functionality

### Step 8: Header Component - Logo Section
**Task:** Header ka logo part convert karo
- Left part with logo
- Light logo aur dark logo
- "LV_Clicks" text same
- React Router Link use karo

### Step 9: Header Component - Navigation Menu
**Task:** Main navigation menu convert karo
- Home, Gallery, Our Works, About Us links
- Active state handling
- Dropdown menus (Pages, Contact, Blog)
- Exact same structure aur classes

### Step 10: Header Component - Right Part
**Task:** Header ke right side convert karo
- Aside open button (3 lines)
- Search icon button
- Mobile menu toggle button
- Same classes aur styling

### Step 11: Mobile Menu Component
**Task:** Mobile responsive menu convert karo
- Menu close button
- Logo section
- Navigation links
- Contact information (email, address, phone)
- Social media links
- Same structure as HTML

### Step 12: Aside Info Wrapper Component
**Task:** Side panel (aside) convert karo
- Close button
- Logo
- Instagram gallery section
- Contact information
- Social media links
- Same layout aur styling

### Step 13: Search Modal Component
**Task:** Search modal convert karo
- Bootstrap modal structure
- Search input field
- Search button
- Modal open/close functionality

### Step 14: Footer Component - Top Section
**Task:** Footer ke top part convert karo
- 3 columns layout
- Left: Navigation links
- Center: Logo + Newsletter form
- Right: Navigation links
- Same structure

### Step 15: Footer Component - Bottom Section
**Task:** Footer ke bottom part convert karo
- Copyright text
- Social media icons
- Same styling

### Step 16: ToTop Button Component
**Task:** Scroll to top button convert karo
- Chevron up icon
- Scroll functionality
- Show/hide on scroll

---

## 🏠 PHASE 3: Home Page (index.html) Components

### Step 17: Hero Slider Section - Heading Part
**Task:** Hero slider ka heading section convert karo
- "Photography Agency" subtitle
- "We Capture Your Best Memories Here" title
- Description text
- Same classes aur styling

### Step 18: Hero Slider Section - Swiper Slider
**Task:** Hero slider ka Swiper convert karo
- 8 slides with images (37.jpg to 41.jpg, repeat)
- Swiper configuration
- Same classes: `wptb-swiper-slider-four`
- Autoplay aur navigation

### Step 19: Hero Slider Section - Layer Images
**Task:** Slider ke decorative layers convert karo
- Layer one: texture-1.png (both versions)
- Layer two: round.png (both versions)
- Layer three: overlay.png (both versions)
- Same positioning

### Step 20: Text Marquee Component
**Task:** Scrolling text marquee convert karo
- "LV_Clicks", "Photography", "Studio", "Wedding", "Portrait", "Cinematography"
- Star icons with each text
- Text outline effects
- Infinite scroll animation
- Same classes: `wptb-marquee`, `wptb-text-marquee1`

### Step 21: Services Section - Heading
**Task:** Services section ka heading convert karo
- "Photography" subtitle
- "Explore LV_Clicks Photography Services" title
- Description
- Background image: texture-3.png

### Step 22: Services Section - Service Cards (6 Cards)
**Task:** 6 service cards convert karo:
1. Wedding Photography (bi-camera icon, count 01)
2. Wedding Cinematography (bi-camera-video, count 02, active highlight)
3. Wedding Cinematography (bi-film, count 03)
4. Personal Portfolio Shoot (bi-person-badge, count 04)
5. Wedding Cinematography (bi-camera-reels, count 05)
6. Personal Portfolio Shoot (bi-images, count 06)
- Same classes: `wptb-icon-box7`
- Grid lines background
- WOW animations

### Step 23: Projects Section - Heading
**Task:** Projects section ka heading convert karo
- "LV_Clicks Projects" subtitle
- "Explore LV_Clicks Photography Projects" title
- Description

### Step 24: Projects Section - Masonry Grid
**Task:** Projects ka masonry grid convert karo
- 10 project items
- Images from `projects/1/` folder
- Project titles aur photographer names
- Same classes: `style-masonry effect-blur`, `grid grid-3`
- Isotope masonry layout

### Step 25: Image Gallery Section - Heading
**Task:** Gallery section ka heading convert karo
- "Our Gallery" subtitle
- "Explore Our Photography Gallery" title
- Description

### Step 26: Image Gallery Section - Images Grid
**Task:** Gallery images grid convert karo
- 6 images with Fancybox lightbox
- Same masonry layout
- Fullscreen icon on hover
- Same classes: `wptb-image-popup`, `data-fancybox`

### Step 27: Image Gallery Section - View Full Gallery Button
**Task:** "View Full Gallery" button convert karo
- Link to gallery page
- Same button styling
- Arrow icons

### Step 28: Testimonials Section - Heading & Background
**Task:** Testimonials section setup karo
- Background image: bg-3.jpg
- Container structure

### Step 29: Testimonials Section - Swiper Slider
**Task:** Testimonials Swiper convert karo
- 3 testimonial slides
- 5 star ratings
- Quote SVG icon
- Testimonial text
- Customer image, name, location
- Navigation arrows
- Same classes: `swiper-testimonial`

### Step 30: Office Address Section
**Task:** 3 address cards convert karo:
1. Our Website (bi-globe icon)
2. Book Us (bi-phone icon)
3. Studio Address (bi-geo-alt icon)
- Same classes: `wptb-icon-box1`
- WOW animations

### Step 31: About LV_Clicks Section
**Task:** About section convert karo
- "About LV_Clicks Photography" subtitle
- "We are the LV_Clicks Photography Studio" title
- Description text
- "Learn More About Us" button

### Step 32: Contact Form Section - Heading
**Task:** Contact form section ka left side (heading) convert karo
- "Contact Us" subtitle
- "Feel Free To Ask Us Anything Contact Us" title
- Background layers: texture-2.png

### Step 33: Contact Form Section - Form Fields
**Task:** Contact form convert karo
- Name input (required)
- Email input (required)
- Subject input
- Message textarea
- Send Mail button
- Same classes: `wptb-form`

---

## 🖼️ PHASE 4: Gallery Page (gallery.html) Components

### Step 34: Gallery Page - Page Header
**Task:** Gallery page ka header convert karo
- Background image: bg-3.jpg
- "Gallery" title
- Circle decoration image
- Same classes: `wptb-page-heading`

### Step 35: Gallery Page - Images Section Heading
**Task:** Images section ka heading convert karo
- "Images" subtitle
- "Our Photography Gallery" title
- Description

### Step 36: Gallery Page - Images Gallery Grid
**Task:** Images gallery grid convert karo
- 10 images with Fancybox
- Same masonry layout
- Gallery name: "gallery-images"
- Same structure as home page gallery

### Step 37: Gallery Page - Videos Section Heading
**Task:** Videos section ka heading convert karo
- "Videos" subtitle
- "Our Video Collection" title
- Description

### Step 38: Gallery Page - Video Players (6 Videos)
**Task:** 6 video player cards convert karo:
1. Photography Session
2. Wedding Highlights
3. Portrait Session
4. Event Coverage
5. Fashion Shoot
6. Behind The Scenes
- YouTube/Vimeo links
- Play button with animations
- Background images
- Same classes: `wptb-video-player1`

### Step 39: Gallery Page - Contact Form
**Task:** Gallery page par contact form add karo (same as home page)

---

## 📚 PHASE 5: Our Works Page (our-works.html) Components

### Step 40: Our Works Page - Page Header
**Task:** Our Works page ka header convert karo
- "Our Works" title
- Same structure as gallery page header

### Step 41: Our Works Page - Albums Section Heading
**Task:** Albums section ka heading convert karo
- "Our Albums" subtitle
- "LV_Clicks captures All of Your beautiful memories" title
- Description

### Step 42: Our Works Page - Albums Grid
**Task:** Albums masonry grid convert karo
- 8 album items with different sizes
- Album images
- Album titles
- Photo counts
- Links to album detail page
- Same classes: `effect-gradient has-radius`
- Different column sizes (col-md-4, col-md-8)

### Step 43: Our Works Page - Contact Form
**Task:** Our Works page par contact form add karo

---

## ℹ️ PHASE 6: About Page (about.html) Components

### Step 44: About Page - Page Header
**Task:** About page ka header convert karo
- "About Us" title

### Step 45: About Page - About Section (Images & Text)
**Task:** About section convert karo:
- Large image at top
- Two column layout with images
- About text content
- Background texture
- Same classes: `wptb-about-one`

### Step 46: About Page - Counter Section
**Task:** Two counter boxes convert karo:
1. 100% Customer Satisfaction
2. 350+ Photography Session
- Odometer counter animation
- Same classes: `wptb-counter1`

### Step 47: About Page - FAQ Section Heading
**Task:** FAQ section ka heading convert karo
- "Why Choose Us" title
- Left side layout

### Step 48: About Page - Accordion/FAQ Items
**Task:** 3 FAQ accordion items convert karo:
1. LV_Clicks Missions
2. LV_Clicks Photography Features
3. Why We are Best Photographers
- Plus/minus icons
- Expand/collapse functionality
- Same classes: `wptb-accordion`

### Step 49: About Page - Experience Badge
**Task:** "15+ Years Experience" badge convert karo
- Same styling: `wptb-agency-experience--item`

### Step 50: About Page - FAQ Image
**Task:** FAQ section ke right side ka image convert karo
- Image: more/3.png

### Step 51: About Page - Text Marquee
**Task:** About page par text marquee add karo (same as home page)

### Step 52: About Page - Video Player Section
**Task:** Large video player convert karo
- Background image: bg-7.jpg
- YouTube video link
- Play button with animations
- Light decoration image

### Step 53: About Page - Team Section Heading
**Task:** Team section ka heading convert karo
- "01 // Our Team" subtitle
- "Our Core Team of Photographers" title
- Description
- Swiper navigation arrows

### Step 54: About Page - Team Swiper Slider
**Task:** Team members Swiper convert karo
- 7 team member slides
- Member images
- Names aur positions
- Social media links (FB, IG, YT, DR)
- Same classes: `swiper-team`

### Step 55: About Page - Testimonials Section
**Task:** Testimonials section convert karo (same as home page but different background)
- Background: bg-2.jpg
- Colored variant

### Step 56: About Page - Awards Section Heading
**Task:** Awards section ka heading convert karo
- "02 // Our Awards" subtitle
- "Our Photography Awards" title
- Description

### Step 57: About Page - Awards List
**Task:** 3 award items convert karo:
1. Photography Team of the Year 2023
2. Best Wedding Photographer 2022 (active highlight)
3. Photography Team of the Year 2019
- Award images
- "View" buttons
- Links to album detail
- Same classes: `wptb-award-list`

### Step 58: About Page - Contact Form
**Task:** About page par contact form add karo

---

## 🎴 PHASE 7: Album Detail Page (album-detail.html) Components

### Step 59: Album Detail Page - Page Header
**Task:** Album detail page ka header convert karo
- "Album Detail" title

### Step 60: Album Detail Page - Album Images Swiper
**Task:** Album images ka Swiper slider convert karo
- 3 slides with images
- Fancybox lightbox on images
- Navigation arrows
- Same classes: `swiper-gallery`

### Step 61: Album Detail Page - Album Header Info
**Task:** Album ka header info convert karo
- "Wedding Album 2024" title
- Date: December 2024
- Photo count: 25 Photos
- Same classes: `post-header`, `post-meta`

### Step 62: Album Detail Page - Album Description
**Task:** Album description text convert karo
- Paragraph text
- Same classes: `fulltext`

### Step 63: Album Detail Page - Album Images Grid (Part 1)
**Task:** First set of images grid convert karo
- 2 columns layout
- 4 images with Fancybox
- Images from `projects/details/` folder

### Step 64: Album Detail Page - Album Images Grid (Part 2)
**Task:** Second set of images grid convert karo
- 3 columns layout
- 3 images with Fancybox

### Step 65: Album Detail Page - Album Images Grid (Part 3)
**Task:** Third set of images grid convert karo
- 2 columns layout
- 2 images with Fancybox

### Step 66: Album Detail Page - Sidebar - Album Info Widget
**Task:** Sidebar ka album info widget convert karo
- Date, Location, Photographer, Total Photos, Category
- Same classes: `widget`, `widget-list`

### Step 67: Album Detail Page - Sidebar - Share Widget
**Task:** Share album widget convert karo
- Social media icons (Facebook, Instagram, Twitter, Pinterest)
- Same classes: `social-box`

### Step 68: Album Detail Page - Sidebar - Back Button
**Task:** "Back to Albums" button convert karo
- Link to our-works page
- Same button styling

### Step 69: Album Detail Page - Contact Form
**Task:** Album detail page par contact form add karo

---

## 🔧 PHASE 8: Functionality & JavaScript Features

### Step 70: React Router Setup
**Task:** React Router configure karo
- Routes define karo (/, /gallery, /our-works, /about, /album/:id)
- Layout component create karo
- Navigation links connect karo

### Step 71: Swiper Integration
**Task:** Swiper.js ko React mein integrate karo
- Hero slider
- Testimonials slider
- Team slider
- Album images slider
- Same configurations as HTML

### Step 72: Fancybox Integration
**Task:** Fancybox lightbox ko React mein integrate karo
- Image galleries
- Video players
- Same options as HTML

### Step 73: Isotope Masonry Integration
**Task:** Isotope masonry layout ko React mein integrate karo
- Projects grid
- Gallery grids
- Albums grid
- Same configurations

### Step 74: Mobile Menu Functionality
**Task:** Mobile menu open/close functionality implement karo
- State management
- Click handlers
- Animation effects

### Step 75: Aside Panel Functionality
**Task:** Aside panel open/close functionality implement karo
- State management
- Click handlers
- Animation effects

### Step 76: Search Modal Functionality
**Task:** Search modal open/close functionality implement karo
- Bootstrap modal integration
- Form submission handling

### Step 77: Preloader Functionality
**Task:** Preloader hide/show functionality implement karo
- Loading state
- Fade out animation
- Body class management

### Step 78: Scroll to Top Functionality
**Task:** ToTop button functionality implement karo
- Show/hide on scroll
- Smooth scroll to top

### Step 79: Text Marquee Animation
**Task:** Text marquee infinite scroll animation implement karo
- CSS animations
- Same speed aur direction

### Step 80: WOW Scroll Animations
**Task:** WOW.js animations ko React mein implement karo
- fadeInLeft, fadeInUp, zoomIn, etc.
- Scroll trigger animations

### Step 81: Odometer Counter Animation
**Task:** Counter animations implement karo
- 100% counter
- 350+ counter
- Scroll trigger

### Step 82: Accordion/FAQ Functionality
**Task:** FAQ accordion expand/collapse implement karo
- State management
- Icon toggle (plus/minus)
- Smooth animations

### Step 83: Contact Form Handling
**Task:** Contact form submission handle karo
- Form validation
- Submit handler
- Error handling

### Step 84: Newsletter Form Handling
**Task:** Footer newsletter form handle karo
- Form validation
- Submit handler

---

## 🎨 PHASE 9: Styling & CSS

### Step 85: Custom Styles Check
**Task:** HTML mein jo inline styles hain unko check karo
- Logo text styles
- Spinner text styles
- Aur baki custom styles

### Step 86: Responsive Design Testing
**Task:** Sabhi pages ko responsive check karo
- Mobile view
- Tablet view
- Desktop view
- Breakpoints verify karo

### Step 87: Animation Timing Check
**Task:** Sabhi animations ka timing verify karo
- Preloader timing
- Scroll animations
- Hover effects
- Transitions

### Step 88: Image Loading Optimization & Lazy Loading
**Task:** Sabhi images aur videos ko lazy loading ke saath implement karo:
- **All Images:** `loading="lazy"` attribute add karo har `<img>` tag mein
- **All Videos:** Video elements ko lazy load karo (poster images use karo)
- **Gallery Images:** Intersection Observer use karo for better performance
- **Slider Images:** First slide normal load, baaki lazy load
- **Background Images:** CSS background images ko optimize karo
- Image paths verify karo
- Alt texts add karo (accessibility ke liye)
- Placeholder images add karo (optional, better UX)

**Important:** 
- Lazy loading se UI/UX change nahi hona chahiye
- Images load hote time layout shift nahi hona chahiye
- Aspect ratios maintain karo

---

## ✅ PHASE 10: Testing & Final Checks

### Step 89: All Pages Navigation Test
**Task:** Sabhi pages ki navigation test karo
- Links work karte hain
- Active states correct hain
- No broken links

### Step 90: All Sliders Test
**Task:** Sabhi Swiper sliders test karo
- Hero slider
- Testimonials slider
- Team slider
- Album images slider
- Navigation works
- Autoplay works

### Step 91: All Lightboxes Test
**Task:** Sabhi Fancybox lightboxes test karo
- Image galleries open correctly
- Videos play correctly
- Navigation between images
- Close functionality

### Step 92: All Forms Test
**Task:** Sabhi forms test karo
- Contact forms
- Newsletter form
- Validation works
- Submit works

### Step 93: Mobile Menu Test
**Task:** Mobile menu functionality test karo
- Open/close works
- Links work
- Responsive design

### Step 94: Aside Panel Test
**Task:** Aside panel functionality test karo
- Open/close works
- Instagram gallery displays
- Links work

### Step 95: Scroll Animations Test
**Task:** Sabhi scroll animations test karo
- WOW animations trigger
- Counter animations
- Fade in effects

### Step 96: Browser Compatibility Test
**Task:** Different browsers mein test karo
- Chrome
- Firefox
- Safari
- Edge

### Step 97: Performance Check
**Task:** Performance optimize karo
- Bundle size check
- Image optimization
- Code splitting
- Lazy loading

### Step 98: Final UI/UX Comparison
**Task:** HTML template se exact comparison karo
- Side by side check
- All elements match
- All styles match
- All functionality matches

### Step 99: Build & Production Check
**Task:** Production build create karo
- `npm run build` run karo
- Build errors check karo
- Preview build test karo

### Step 100: Documentation & Cleanup
**Task:** Final documentation aur cleanup
- Code comments add karo
- Unused files remove karo
- README update karo

---

## 🔄 PHASE 11: Dynamic Data Preparation (Future Ready)

### Step 101: Data Structure Planning
**Task:** Dynamic data ke liye data structures define karo:
- **Services Data:** Array of service objects (id, title, description, icon, count)
- **Projects Data:** Array of project objects (id, title, image, photographer, category)
- **Gallery Images:** Array of image objects (id, src, alt, thumbnail)
- **Videos Data:** Array of video objects (id, url, thumbnail, title, type)
- **Albums Data:** Array of album objects (id, title, thumbnail, photoCount, date, images)
- **Team Data:** Array of team objects (id, name, position, image, socialLinks)
- **Testimonials Data:** Array of testimonial objects (id, text, name, location, image, rating)
- **Awards Data:** Array of award objects (id, title, year, image, link)

**Important:** Data structure aise design karo ki UI/UX bilkul same rahe

### Step 102: Constants File Create Karna
**Task:** Constants file create karo dynamic data ke liye:
- Image paths constants
- API endpoints (future ke liye)
- Default values
- Configuration settings
- Grid column configurations (3, 4, etc.)

### Step 103: Component Props Structure Define Karna
**Task:** Har component ke liye props structure define karo:
- **Services Component:** `services` array prop
- **Projects Component:** `projects` array prop
- **Gallery Component:** `images` array prop
- **Videos Component:** `videos` array prop
- **Albums Component:** `albums` array prop
- **Team Component:** `teamMembers` array prop
- **Testimonials Component:** `testimonials` array prop

**Important:** Props structure aise ho ki dynamic data aane par UI same rahe

### Step 104: Grid Layout Consistency Ensure Karna
**Task:** Grid layouts ko dynamic data ke liye prepare karo:
- **Fixed Grid Columns:** CSS classes se grid columns fix karo (grid-3, grid-4)
- **Masonry Layout:** Isotope configuration fix karo, data change hone par layout shift nahi hoga
- **Responsive Breakpoints:** Breakpoints fix karo, data se change nahi honge
- **Item Sizing:** Grid items ka size CSS se control karo, data se nahi
- **Gap/Spacing:** Gutter spacing fix karo, consistent rahega

**Critical:** Dynamic data aane par bhi:
- Grid columns same rahenge
- Spacing same rahegi
- Layout shift nahi hoga
- Visual appearance same rahega

### Step 105: Image Dimensions & Aspect Ratios Fix Karna
**Task:** Images ke dimensions fix karo:
- **Aspect Ratio:** CSS se aspect ratios fix karo
- **Container Sizes:** Image containers ka size fix karo
- **Object Fit:** `object-fit: cover` use karo consistent display ke liye
- **Placeholder Sizes:** Placeholder images ka size same rahega

**Important:** Different size ki images aane par bhi layout same rahega

### Step 106: Conditional Rendering Rules Define Karna
**Task:** Dynamic data ke liye conditional rendering rules define karo:
- **Empty States:** Agar data nahi hai to kya show hoga (same UI maintain)
- **Single Item:** Agar 1 item hai to layout same rahega
- **Multiple Items:** Grid layout same rahega
- **Loading States:** Loading ke time skeleton UI (same dimensions)

### Step 107: Data Mapping Functions Create Karna
**Task:** Data mapping functions create karo:
- **Map Services:** Services data ko component format mein convert
- **Map Projects:** Projects data ko grid items mein convert
- **Map Images:** Images data ko gallery format mein convert
- **Map Videos:** Videos data ko video players mein convert

**Important:** Mapping se UI structure change nahi hona chahiye

### Step 108: Default/Static Data Files Create Karna
**Task:** Static data files create karo (current HTML data):
- `src/data/services.js` - Services data
- `src/data/projects.js` - Projects data
- `src/data/gallery.js` - Gallery images
- `src/data/videos.js` - Videos data
- `src/data/albums.js` - Albums data
- `src/data/team.js` - Team members
- `src/data/testimonials.js` - Testimonials
- `src/data/awards.js` - Awards

**Purpose:** Abhi static data use karenge, baad mein API se replace kar sakte hain

### Step 109: Component Data Integration
**Task:** Components mein data integration karo:
- Props se data receive karo
- Data map karo to UI elements
- Default values handle karo
- Empty states handle karo

**Important:** Data change hone par UI structure same rahega

### Step 110: Grid Layout Testing with Dynamic Data
**Task:** Grid layouts ko test karo different data scenarios mein:
- **Few Items:** 1-3 items ke saath layout same rahe
- **Many Items:** 10+ items ke saath layout same rahe
- **Different Sizes:** Different size ki images ke saath layout same rahe
- **Empty Data:** Empty data ke saath graceful handling

**Critical Test:** Data change hone par:
- Grid columns same rahenge
- Spacing same rahegi
- No layout shift
- Visual consistency maintain

---

## 📝 Important Notes

1. **Exact HTML Structure Maintain Karna:**
   - Har HTML element ko exactly same React JSX mein convert karna
   - Classes bilkul same rahengi
   - IDs same rahenge (agar hain)

2. **CSS Classes:**
   - Koi CSS class change nahi karni
   - Sabhi classes exactly same use karni
   - Custom styles bhi same rahenge

3. **Image Paths:**
   - HTML mein: `assets/img/...`
   - React mein: `/images/...`
   - Public folder mein images copy karni

4. **JavaScript Functionality:**
   - jQuery ko React hooks/state se replace karna
   - Same behavior maintain karna
   - Animations same rahengi

5. **Responsive Design:**
   - Mobile menu same kaam karega
   - Breakpoints same rahenge
   - Layout same rahega

6. **Testing:**
   - Har step ke baad test karna
   - HTML template se compare karna
   - Koi difference nahi hona chahiye

7. **Lazy Loading (CRITICAL):**
   - **Sabhi Images:** `loading="lazy"` attribute zaroor add karna
   - **Sabhi Videos:** Lazy loading implement karna
   - **Slider Images:** First slide normal, baaki lazy
   - **Gallery Images:** Intersection Observer use karna
   - **Background Images:** Optimize karna
   - **Important:** Lazy loading se UI/UX change nahi hona chahiye
   - **Layout Shift:** Images load hote time layout shift nahi hona chahiye
   - **Aspect Ratios:** Fix aspect ratios maintain karna

8. **Dynamic Data Preparation (CRITICAL):**
   - **Grid Layout Consistency:** Dynamic data aane par bhi grid layout same rahega
   - **Fixed Columns:** CSS classes se grid columns fix karna (grid-3, grid-4)
   - **Fixed Spacing:** Gutter spacing fix karna, data se change nahi hogi
   - **Fixed Sizes:** Container sizes fix karna, data se change nahi honge
   - **Aspect Ratios:** Image aspect ratios CSS se fix karna
   - **No Layout Shift:** Data change hone par layout shift nahi hona chahiye
   - **Props Structure:** Components ko props se data receive karna, par UI same rahega
   - **Data Mapping:** Data mapping se UI structure change nahi hona chahiye
   - **Empty States:** Empty data ke liye graceful handling, par UI structure same

9. **Grid Layout Rules (VERY IMPORTANT):**
   - **CSS Grid Classes:** `grid-3`, `grid-4` classes fix rahengi, data se change nahi hongi
   - **Column Count:** Column count CSS se control hogi, data length se nahi
   - **Item Sizing:** Grid items ka size CSS se fix hoga
   - **Gap Spacing:** `gutter-10`, `gutter-30` classes fix rahengi
   - **Masonry Layout:** Isotope configuration fix hogi
   - **Responsive Breakpoints:** Breakpoints fix rahenge
   - **Test Scenarios:** 1 item, 5 items, 10 items, 20 items - sab mein layout same

10. **Image Handling Rules:**
    - **Aspect Ratios:** CSS se aspect ratios fix karna
    - **Object Fit:** `object-fit: cover` use karna consistent display ke liye
    - **Container Heights:** Image containers ka height fix karna (agar needed)
    - **Placeholder:** Placeholder images ka size same rahega
    - **Different Sizes:** Different size ki images aane par bhi layout same rahega

11. **Component Design Rules:**
    - **Props Based:** Components props se data receive karenge
    - **Default Values:** Default values define karna
    - **Conditional Rendering:** Empty states handle karna
    - **Data Mapping:** Data ko UI elements mein map karna
    - **No Hardcoding:** Data hardcode nahi karna, props se aayega
    - **UI Consistency:** Data change hone par UI structure same rahega

---

## 🚀 Implementation Order

Aap mujhe step number bata sakte hain, main woh step implement kar dunga. For example:
- "Step 1 karo" - Main Vite project setup kar dunga
- "Step 6 se 16 tak karo" - Main sabhi layout components bana dunga
- "Step 17 karo" - Main hero slider heading bana dunga

---

---

## 🎯 Critical Requirements Summary

### ✅ Lazy Loading Requirements:
1. **All Images:** `loading="lazy"` attribute on every `<img>` tag
2. **All Videos:** Lazy loading with poster images
3. **Gallery Images:** Intersection Observer for better performance
4. **Slider Images:** First slide normal, rest lazy
5. **No Layout Shift:** Images load hote time layout shift nahi hona chahiye
6. **Aspect Ratios:** Fix aspect ratios maintain karna

### ✅ Dynamic Data Requirements:
1. **Grid Layout:** Dynamic data aane par bhi grid layout same rahega
2. **Fixed Columns:** CSS classes se columns fix (grid-3, grid-4)
3. **Fixed Spacing:** Gutter spacing fix, data se change nahi hogi
4. **Fixed Sizes:** Container sizes fix, data se change nahi honge
5. **No Layout Shift:** Data change hone par layout shift nahi hona chahiye
6. **Props Structure:** Components props se data receive karenge
7. **Data Mapping:** Data mapping se UI structure change nahi hona chahiye
8. **Empty States:** Empty data ke liye graceful handling

### ✅ UI/UX Consistency Requirements:
1. **Exact Same Design:** HTML template se bilkul same
2. **Same Classes:** Sabhi CSS classes same
3. **Same Animations:** Sabhi animations same
4. **Same Layout:** Grid layouts same
5. **Same Spacing:** Gaps aur padding same
6. **Same Behavior:** Functionality same
7. **No Changes:** Dynamic data aane par bhi koi visual change nahi

### ✅ Testing Requirements:
1. **Static Data:** Current HTML data ke saath test
2. **Dynamic Data:** Different data scenarios ke saath test
3. **Few Items:** 1-3 items ke saath layout same
4. **Many Items:** 10+ items ke saath layout same
5. **Different Sizes:** Different size ki images ke saath layout same
6. **Empty Data:** Empty data ke saath graceful handling
7. **Browser Test:** Different browsers mein test
8. **Responsive Test:** Different screen sizes mein test

---

**Total Steps: 110 (100 Main + 10 Dynamic Data Preparation)**
**Status: Ready for Implementation**
**Last Updated: December 2024**
**Version: 2.0 (With Lazy Loading & Dynamic Data Support)**
