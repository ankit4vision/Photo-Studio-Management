# LV_Clicks Photography - React Website

This is the React + Vite version of the LV_Clicks photography website, converted from the original HTML version. The website features a modern, responsive design with optimized performance and smooth user experience.

## 📁 Project Structure

```
website_react/
├── public/
│   ├── assets/
│   │   ├── css/          # All CSS files from HTML version
│   │   ├── img/          # All images (with lazy loading)
│   │   ├── js/           # JavaScript files (jQuery, Bootstrap, theme.js, map.js)
│   │   └── fonts/        # Font files
│   └── plugins/          # Third-party plugins (Swiper, Fancybox, Isotope, etc.)
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.jsx    # Navigation header with active route highlighting
│   │   ├── Footer.jsx    # Footer with newsletter and links
│   │   └── Preloader.jsx # Page loading animation
│   ├── pages/           # Page components
│   │   ├── Home.jsx      # Landing page with slider, services, projects, gallery
│   │   ├── About.jsx    # About page with FAQ, team, testimonials, awards
│   │   ├── Gallery.jsx  # Image and video gallery with masonry layout
│   │   ├── OurWorks.jsx # Albums listing page with grid layout
│   │   ├── AlbumDetail.jsx # Individual album detail page
│   │   └── Contact.jsx  # Contact page with form and Google Maps
│   ├── hooks/           # Custom React hooks
│   │   └── useIsotope.js # Hook for Isotope masonry grid initialization
│   ├── utils/           # Utility functions (currently empty)
│   ├── App.jsx          # Main app component with routing and script loading
│   ├── main.jsx         # Entry point with BrowserRouter
│   ├── App.css          # App-specific styles
│   └── index.css        # Global styles and Isotope grid fixes
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd website/website_react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The website will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📄 Pages

- **Home** (`/`) - Main landing page featuring:
  - Hero slider with Swiper
  - Services section with icons
  - Projects gallery with masonry layout
  - Image gallery section
  - Testimonials slider
  - Office address section
  - Contact form

- **About** (`/about`) - About page featuring:
  - Company information and images
  - FAQ accordion section
  - Team members slider
  - Testimonials section
  - Awards showcase
  - Video player section

- **Gallery** (`/gallery`) - Gallery page featuring:
  - Image gallery with masonry layout and lightbox
  - Video collection with Fancybox integration
  - Contact form section

- **Our Works** (`/our-works`) - Albums listing page featuring:
  - Album grid with masonry layout
  - Album cards with image previews
  - Contact form section

- **Album Detail** (`/album-detail`) - Individual album detail page featuring:
  - Image slider with Swiper
  - Album information sidebar
  - Image grid with lightbox
  - Contact form section

- **Contact** (`/contact`) - Contact page featuring:
  - Google Maps integration (iframe embed)
  - Contact form
  - Office address information (Website, Phone, Address)

## 🎨 Styling

All CSS files from the original HTML version are preserved in `public/assets/css/`. The main CSS file (`main.css`) imports all other stylesheets.

### Custom Styles

- **`src/index.css`** - Global styles including:
  - Isotope grid layout fixes
  - Image lazy loading styles
  - React Router link styles
  - Body and theme class styles

- **`src/App.css`** - App-specific styles for theme classes

## 🔌 Plugins & Dependencies

### React Dependencies
- `react` (^19.2.0) - React library
- `react-dom` (^19.2.0) - React DOM rendering
- `react-router-dom` (^7.12.0) - Client-side routing

### External Plugins (Loaded from public/plugins/)
- **Swiper** - Slider/carousel functionality for hero slider, testimonials, and team sections
- **Fancybox** - Lightbox for images and videos in galleries
- **Isotope** - Masonry grid layouts for image galleries (initialized via custom hook)
- **WOW.js** - Scroll animations for elements
- **Odometer** - Counter animations for statistics
- **jQuery** (3.6.0) - Required by some plugins
- **Bootstrap** - CSS framework for responsive layout
- **Cursor Effect** - Custom cursor effects
- **Nice Select** - Enhanced select dropdowns
- **Flatpickr** - Date picker functionality

These plugins are loaded dynamically in `App.jsx` after the component mounts, ensuring proper initialization order.

## 🛠️ Development

### Adding a New Page

1. Create a new component in `src/pages/`:
```jsx
import { useEffect } from 'react'

const NewPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      {/* Page content */}
    </>
  )
}

export default NewPage
```

2. Add the route in `src/App.jsx`:
```jsx
import NewPage from './pages/NewPage'

// In Routes:
<Route path="/new-page" element={<NewPage />} />
```

3. Add navigation link in `src/components/Header.jsx`:
```jsx
<li className={`menu-item ${isActive('/new-page') ? 'active' : ''}`}>
  <Link to="/new-page" style={{ textDecoration: 'none' }}>New Page</Link>
</li>
```

### Using Isotope for Masonry Grids

If your page has a masonry grid layout, use the `useIsotope` hook:

```jsx
import useIsotope from '../hooks/useIsotope'

const MyPage = () => {
  // Initialize Isotope for the grid
  useIsotope('.style-masonry .grid')
  
  return (
    <div className="style-masonry">
      <div className="grid grid-3 gutter-10 clearfix">
        <div className="grid-sizer"></div>
        {/* Grid items */}
      </div>
    </div>
  )
}
```

### Modifying Styles

- Global styles: Edit `src/index.css`
- Component-specific styles: Add inline styles or CSS classes
- Template styles: Edit files in `public/assets/css/`

### Image Paths

All images are in `public/assets/img/`. Use absolute paths starting with `/assets/img/`. **Always include `loading="lazy"` for performance:**

```jsx
<img src="/assets/img/slider/37.jpg" alt="description" loading="lazy" />
```

### Custom Hooks

#### useIsotope Hook

The `useIsotope` hook handles Isotope masonry grid initialization in React components:

```jsx
import useIsotope from '../hooks/useIsotope'

// Basic usage
useIsotope('.grid')

// With custom selector
useIsotope('.style-masonry .grid')

// With options
useIsotope('.grid', { transitionDuration: '500ms' })
```

**Features:**
- Waits for React to render before initializing
- Handles image loading with imagesLoaded
- Automatically cleans up on component unmount
- Prevents initialization conflicts

## 📝 Key Features

### Core Features
- ✅ **React Router Navigation** - Client-side routing with active route highlighting
- ✅ **Responsive Design** - Mobile-first design that works on all devices
- ✅ **Performance Optimized** - All images use native lazy loading
- ✅ **Smooth Animations** - WOW.js scroll animations and CSS transitions

### Image & Media Features
- ✅ **Image Lazy Loading** - All images load lazily for better performance
- ✅ **Masonry Grid Layouts** - Isotope-powered image grids with custom React hook
- ✅ **Image Lightbox** - Fancybox integration for full-screen image viewing
- ✅ **Video Integration** - YouTube/Vimeo video support with Fancybox
- ✅ **Swiper Sliders** - Multiple slider implementations (hero, testimonials, team)

### Interactive Features
- ✅ **Contact Form** - Contact page with form validation
- ✅ **Google Maps** - Embedded Google Maps for studio location (Voharwad, Lunawada, Gujarat)
- ✅ **Newsletter Subscription** - Footer newsletter signup form
- ✅ **Social Media Integration** - Social links in header and footer

### Technical Features
- ✅ **Custom React Hooks** - `useIsotope` hook for reliable Isotope initialization
- ✅ **Dynamic Script Loading** - Scripts loaded in proper order after component mount
- ✅ **Route-based Scroll Reset** - Automatic scroll to top on route changes
- ✅ **Preloader** - Page loading animation

## 🔧 Configuration

### Vite Configuration

The project uses Vite as the build tool. Configuration is in `vite.config.js`.

### Routing

React Router is configured in `src/App.jsx` with BrowserRouter in `src/main.jsx`.

## 📦 Build Output

When you run `npm run build`, Vite will:
1. Bundle all React components
2. Optimize assets
3. Generate production-ready files in `dist/` folder

## 🚨 Important Notes

1. **Script Loading**: External scripts (jQuery, plugins) are loaded dynamically in `App.jsx`. Make sure all plugin files exist in `public/plugins/`. Scripts load sequentially to ensure proper dependencies.

2. **Image Paths**: Always use absolute paths starting with `/` for images in the public folder. **Include `loading="lazy"` on all images for performance.**

3. **CSS Imports**: The main CSS file is imported in `main.jsx`. All other CSS files are imported by `main.css`.

4. **Plugin Initialization**: 
   - Plugins are initialized by `theme.js` which is loaded after all scripts
   - Isotope grids use the custom `useIsotope` hook for reliable initialization
   - Swiper sliders may need manual initialization in component `useEffect` hooks

5. **Isotope Grids**: Always use the `useIsotope` hook for masonry grids. It handles timing issues and ensures proper initialization after React renders.

6. **Google Maps**: The Contact page uses an iframe embed for Google Maps (no API key required). The location is set to Voharwad, Lunawada, Gujarat.

7. **Navigation**: The header navigation includes active route highlighting. Blog and Pages menu items have been removed as per requirements.

## 🐛 Troubleshooting

### Images Not Showing
- Check that image paths start with `/assets/img/`
- Verify images exist in `public/assets/img/`
- Ensure images have proper file extensions

### Images Appearing in Single Line
- This was a common issue with Isotope initialization timing
- **Solution**: Use the `useIsotope` hook in components with masonry grids
- The hook ensures Isotope initializes after React renders and images load

### Styles Not Applying
- Ensure `main.css` is imported in `main.jsx`
- Check browser console for CSS loading errors
- Verify CSS files exist in `public/assets/css/`

### Plugins Not Working
- Verify all plugin files exist in `public/plugins/`
- Check browser console for JavaScript errors
- Ensure jQuery loads before other plugins (it loads first in `App.jsx`)
- For Isotope grids, use the `useIsotope` hook instead of relying on `isotope-init.js`

### Routing Issues
- Make sure BrowserRouter wraps the App component in `main.jsx`
- Check that routes are defined correctly in `App.jsx`
- Verify Link components use `to` prop, not `href`

### Google Maps Not Loading
- The Contact page uses iframe embed (no API key needed)
- If map doesn't show, check browser console for iframe errors
- Verify internet connection (map loads from Google servers)

### Performance Issues
- All images should have `loading="lazy"` attribute
- Check Network tab in browser DevTools to verify lazy loading
- Ensure images are optimized before adding to `public/assets/img/`

## 🎯 Performance Optimizations

### Implemented Optimizations
- ✅ **Image Lazy Loading** - All 71+ images use native `loading="lazy"` attribute
- ✅ **Custom Isotope Hook** - Prevents layout issues and ensures proper initialization
- ✅ **Dynamic Script Loading** - Scripts load asynchronously after component mount
- ✅ **Route-based Code Splitting** - Each page is a separate component
- ✅ **Optimized Asset Loading** - CSS and JS files load in proper order

### Best Practices
- Images load only when entering viewport
- Isotope grids initialize after DOM is ready
- Scripts don't block initial render
- Smooth scroll to top on route changes

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Swiper Documentation](https://swiperjs.com/)
- [Fancybox Documentation](https://fancyapps.com/fancybox/)
- [Isotope Documentation](https://isotope.metafizzy.co/)
- [Native Image Lazy Loading](https://web.dev/native-lazy-loading/)

## 🗺️ Navigation Structure

The website navigation includes:
- **Home** - Main landing page
- **Gallery** - Image and video gallery
- **Our Works** - Photography albums
- **About Us** - Company information
- **Contact** - Contact form and location

Note: Blog and Pages menu items have been removed.

## 📄 License

LV_Clicks Photography - All Rights Reserved © 2025

## 👥 Development Team

Converted from HTML to React + Vite for LV_Clicks Photography Agency.

### Recent Updates
- ✅ Added Contact page with Google Maps
- ✅ Implemented lazy loading for all images
- ✅ Created custom useIsotope hook for reliable grid layouts
- ✅ Fixed image layout issues (images appearing in single line)
- ✅ Removed Blog and Pages from navigation
- ✅ Updated Google Maps location to Voharwad, Lunawada, Gujarat

---

**Last Updated:** January 2025
