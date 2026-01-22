# LV_Clicks Photography - React Website

This is the React + Vite version of the LV_Clicks photography website, converted from the original HTML version.

## 📁 Project Structure

```
website_react/
├── public/
│   ├── assets/
│   │   ├── css/          # All CSS files from HTML version
│   │   ├── img/          # All images
│   │   └── fonts/        # Font files
│   └── plugins/          # Third-party plugins (Swiper, Fancybox, etc.)
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Preloader.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Gallery.jsx
│   │   ├── OurWorks.jsx
│   │   └── AlbumDetail.jsx
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
└── vite.config.js
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

- **Home** (`/`) - Main landing page with slider, services, projects, gallery, and testimonials
- **About** (`/about`) - About page with company information, FAQ, team, and testimonials
- **Gallery** (`/gallery`) - Image and video gallery with lightbox functionality
- **Our Works** (`/our-works`) - Albums listing page
- **Album Detail** (`/album-detail`) - Individual album detail page with image grid

## 🎨 Styling

All CSS files from the original HTML version are preserved in `public/assets/css/`. The main CSS file (`main.css`) imports all other stylesheets.

### Custom Styles

Custom React-specific styles are in `src/index.css`.

## 🔌 Plugins & Dependencies

### React Dependencies
- `react` - React library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing

### External Plugins (Loaded from public/plugins/)
- **Swiper** - Slider/carousel functionality
- **Fancybox** - Lightbox for images and videos
- **Isotope** - Masonry grid layouts
- **WOW.js** - Scroll animations
- **Odometer** - Counter animations
- **jQuery** - Required by some plugins
- **Bootstrap** - CSS framework

These plugins are loaded dynamically in `App.jsx` after the component mounts.

## 🛠️ Development

### Adding a New Page

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`:
```jsx
<Route path="/new-page" element={<NewPage />} />
```
3. Add navigation link in `src/components/Header.jsx`

### Modifying Styles

- Global styles: Edit `src/index.css`
- Component-specific styles: Add inline styles or CSS classes
- Template styles: Edit files in `public/assets/css/`

### Image Paths

All images are in `public/assets/img/`. Use absolute paths starting with `/assets/img/`:

```jsx
<img src="/assets/img/slider/37.jpg" alt="description" />
```

## 📝 Key Features

- ✅ Exact replica of HTML website
- ✅ React Router for navigation
- ✅ All original CSS preserved
- ✅ All plugins integrated
- ✅ Responsive design
- ✅ Image lightbox functionality
- ✅ Swiper sliders
- ✅ Smooth animations

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

1. **Script Loading**: External scripts (jQuery, plugins) are loaded dynamically in `App.jsx`. Make sure all plugin files exist in `public/plugins/`.

2. **Image Paths**: Always use absolute paths starting with `/` for images in the public folder.

3. **CSS Imports**: The main CSS file is imported in `main.jsx`. All other CSS files are imported by `main.css`.

4. **Plugin Initialization**: Plugins are initialized by `theme.js` which is loaded after all scripts. Some manual initialization may be needed in component `useEffect` hooks.

## 🐛 Troubleshooting

### Images Not Showing
- Check that image paths start with `/assets/img/`
- Verify images exist in `public/assets/img/`

### Styles Not Applying
- Ensure `main.css` is imported in `main.jsx`
- Check browser console for CSS loading errors

### Plugins Not Working
- Verify all plugin files exist in `public/plugins/`
- Check browser console for JavaScript errors
- Ensure jQuery loads before other plugins

### Routing Issues
- Make sure BrowserRouter wraps the App component
- Check that routes are defined correctly in `App.jsx`

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Swiper Documentation](https://swiperjs.com/)
- [Fancybox Documentation](https://fancyapps.com/fancybox/)

## 📄 License

LV_Clicks Photography - All Rights Reserved © 2025

## 👥 Development Team

Converted from HTML to React + Vite for LV_Clicks Photography Agency.

---

**Last Updated:** January 2025
