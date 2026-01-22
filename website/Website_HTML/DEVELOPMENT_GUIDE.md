# Development Guide - LV_Clicks Website

## Quick Start Guide

This guide provides step-by-step instructions for creating new pages and implementing designs using the template.

---

## 📋 Table of Contents

1. [Creating a New Page](#creating-a-new-page)
2. [Using Template Components](#using-template-components)
3. [Working with Images](#working-with-images)
4. [Implementing Galleries](#implementing-galleries)
5. [Adding Videos](#adding-videos)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## 🆕 Creating a New Page

### Step-by-Step Process

#### Step 1: Choose a Base Template
```bash
# Option 1: Copy an existing page
cp index.html new-page.html

# Option 2: Copy from template (if starting fresh)
cp ../Template-kimono/dark/index-4.html new-page.html
```

#### Step 2: Update Page Metadata

Edit the `<head>` section:

```html
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
    <meta name="description" content="LV_Clicks - Your Page Description">
    <meta name="author" content="">

    <link href="assets/img/favicon.png" rel="shortcut icon" type="image/png">
    <title>Page Name - LV_Clicks Photography</title>
    
    <link rel="stylesheet" href="assets/css/main.css">
</head>
```

#### Step 3: Update Navigation

Find the navigation menu (around line 70-180) and add your page:

```html
<ul class="main-menu">
    <li class="menu-item"><a href="index.html">Home</a></li>
    <li class="menu-item"><a href="gallery.html">Gallery</a></li>
    <li class="menu-item"><a href="our-works.html">Our Works</a></li>
    <li class="menu-item"><a href="new-page.html" class="active">New Page</a></li>
</ul>
```

**Important**: Add `class="active"` to the current page link.

#### Step 4: Replace Main Content

Find `<main class="wrapper">` and replace the content inside with your new content.

#### Step 5: Update Footer Links (if needed)

Footer is usually consistent, but update if your page needs different links.

---

## 🧩 Using Template Components

### Finding Components in Template

1. **Browse Template Files**: Open `Template-kimono/dark/` directory
2. **Identify Component**: Find a page with similar functionality
3. **Copy HTML**: Copy the relevant section
4. **Adapt**: Replace "Kimono" with "LV_Clicks" and update paths

### Component Library

#### Page Header
```html
<div class="wptb-page-heading">
    <div class="wptb-item--inner" style="background-image: url('assets/img/background/bg-3.jpg');">
        <div class="wptb-item-layer wptb-item-layer-one">
            <img src="assets/img/more/circle.png" alt="img">
        </div>
        <h2 class="wptb-item--title">Your Page Title</h2>
    </div>
</div>
```

#### Section with Heading
```html
<section class="wptb-project pd-top-100 pd-bottom-80">
    <div class="container">
        <div class="wptb-heading-two">
            <div class="wptb-item--inner text-center">
                <h6 class="wptb-item--subtitle">Subtitle</h6>
                <h1 class="wptb-item--title">Main Title <span>Highlighted</span></h1>
                <div class="wptb-item--description">
                    Description text here.
                </div>
            </div>
        </div>
        
        <!-- Your content here -->
    </div>
</section>
```

**Spacing Classes:**
- `pd-top-100` - Padding top 100px
- `pd-bottom-80` - Padding bottom 80px
- `mr-top-50` - Margin top 50px
- `mr-bottom-40` - Margin bottom 40px

#### Divider Line
```html
<div class="divider-line-hr"></div>
<!-- or with margin -->
<div class="divider-line-hr mr-bottom-40"></div>
```

---

## 🖼️ Working with Images

### Image Gallery with Lightbox

**Basic Structure:**
```html
<div class="style-masonry effect-blur">
    <div class="grid grid-3 gutter-10 clearfix">
        <div class="grid-sizer"></div>
        
        <div class="grid-item">
            <div class="wptb-item--inner">
                <div class="wptb-item--image">
                    <img src="assets/img/projects/1/1.jpg" alt="Description">
                    <a class="wptb-image-popup" href="assets/img/projects/1/1.jpg" data-fancybox="gallery-name">
                        <i class="bi bi-arrows-fullscreen"></i>
                    </a>
                </div>
            </div>
        </div>
        
        <!-- More items -->
    </div>
</div>
```

**Key Points:**
- Use same `data-fancybox="gallery-name"` for all images in one gallery
- `href` should point to full-size image
- `src` can be thumbnail or same image
- Always include `alt` text

### Grid Layouts

**3 Column Grid:**
```html
<div class="grid grid-3 gutter-10 clearfix">
```

**2 Column Grid:**
```html
<div class="grid grid-2 gutter-30 clearfix">
```

**4 Column Grid:**
```html
<div class="grid grid-4 gutter-10 clearfix">
```

### Hover Effects

Available effect classes:
- `effect-blur` - Blur on hover
- `effect-fly` - Fly animation
- `effect-tilt` - 3D tilt
- `effect-gradient` - Gradient overlay

### Standard Bootstrap Grid

```html
<div class="row">
    <div class="col-lg-4 col-md-6 mb-4">
        <img src="assets/img/projects/1/1.jpg" alt="Description">
    </div>
    <div class="col-lg-4 col-md-6 mb-4">
        <img src="assets/img/projects/1/2.jpg" alt="Description">
    </div>
    <div class="col-lg-4 col-md-6 mb-4">
        <img src="assets/img/projects/1/3.jpg" alt="Description">
    </div>
</div>
```

---

## 🎬 Implementing Galleries

### Image Gallery (Click to View Full Size)

**Example from gallery.html:**
```html
<section class="wptb-project pd-top-100 pd-bottom-80">
    <div class="container">
        <div class="wptb-heading-two">
            <div class="wptb-item--inner text-center">
                <h6 class="wptb-item--subtitle">Images</h6>
                <h1 class="wptb-item--title">Our Photography <br> <span>Gallery</span></h1>
            </div>
        </div>

        <div class="style-masonry effect-blur">
            <div class="grid grid-3 gutter-10 clearfix">
                <div class="grid-sizer"></div>
                
                <div class="grid-item">
                    <div class="wptb-item--inner">
                        <div class="wptb-item--image">
                            <img src="assets/img/projects/1/1.jpg" alt="img">
                            <a class="wptb-image-popup" href="assets/img/projects/1/1.jpg" data-fancybox="gallery-images">
                                <i class="bi bi-arrows-fullscreen"></i>
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Repeat for more images -->
            </div>
        </div>
    </div>
</section>
```

### Album Listing (Links to Detail Page)

**Example from our-works.html:**
```html
<div class="grid gutter-10 clearfix">
    <div class="grid-sizer"></div>
    <div class="row">
        <div class="grid-item col-md-4">
            <div class="wptb-item--inner">
                <div class="wptb-item--image">
                    <img src="assets/img/projects/1/1.jpg" alt="img">
                    <a class="wptb-item--link" href="album-detail.html">
                        <i class="bi bi-chevron-right"></i>
                    </a>
                </div>
                <div class="wptb-item--holder">
                    <div class="wptb-item--meta">
                        <h4><a href="album-detail.html">Album Title</a></h4>
                        <p>25 Photos</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

## 🎥 Adding Videos

### Video Player with Fancybox

**YouTube Video:**
```html
<div class="wptb-video-player1" style="background-image: url('assets/img/background/bg-3.jpg');">
    <div class="wptb-item--inner">
        <div class="wptb-item--holder">
            <div class="wptb-item--video-button">
                <a class="btn" data-fancybox href="https://www.youtube.com/watch?v=VIDEO_ID">
                    <span class="text-second"> <i class="bi bi-play-fill"></i> </span>
                    <span class="line-video-animation line-video-1"></span>
                    <span class="line-video-animation line-video-2"></span>
                    <span class="line-video-animation line-video-3"></span>
                </a>
            </div>
            <h4 class="wptb-item--title">Video Title</h4>
        </div>
    </div>
</div>
```

**Vimeo Video:**
```html
<a class="btn" data-fancybox href="https://vimeo.com/VIDEO_ID">
```

**Video Grid Layout:**
```html
<div class="row">
    <div class="col-lg-4 col-md-6 mb-4">
        <!-- Video player -->
    </div>
    <div class="col-lg-4 col-md-6 mb-4">
        <!-- Video player -->
    </div>
    <div class="col-lg-4 col-md-6 mb-4">
        <!-- Video player -->
    </div>
</div>
```

---

## 🔄 Common Patterns

### Swiper Slider

**Basic Slider:**
```html
<div class="swiper-container swiper-gallery">
    <div class="swiper-wrapper">
        <div class="swiper-slide">
            <figure class="block-gallery">
                <img src="assets/img/projects/gallery/1.jpg" alt="img">
            </figure>
        </div>
        <div class="swiper-slide">
            <figure class="block-gallery">
                <img src="assets/img/projects/gallery/2.jpg" alt="img">
            </figure>
        </div>
    </div>
    
    <!-- Navigation -->
    <div class="wptb-swiper-navigation style2">
        <div class="wptb-swiper-arrow swiper-button-prev"></div>
        <div class="wptb-swiper-arrow swiper-button-next"></div>
    </div>
</div>
```

### Contact Form

**Full Contact Form Section:**
```html
<section class="wptb-contact-form style2">
    <div class="wptb-item-layer both-version">
        <img src="assets/img/more/texture-2.png" alt="">
        <img src="assets/img/more/texture-2-light.png" alt="">
    </div>
    <div class="container">
        <div class="wptb-form--wrapper no-bg">
            <div class="row">
                <div class="col-lg-5">
                    <div class="wptb-heading-two pe-lg-5">
                        <div class="wptb-item--inner">
                            <h6 class="wptb-item--subtitle">Contact Us</h6>
                            <h1 class="wptb-item--title">Feel Free To Ask Us Anything <span>Contact Us</span></h1>
                        </div>
                    </div>
                </div>
                <div class="col-lg-7">
                    <form class="wptb-form" action="#" method="post">
                        <div class="wptb-form--inner">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 mb-4">
                                    <div class="form-group">
                                        <input type="text" name="name" class="form-control" placeholder="Name*" required>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 mb-4">
                                    <div class="form-group">
                                        <input type="email" name="email" class="form-control" placeholder="E-mail*" required>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 mb-4">
                                    <div class="form-group">
                                        <input type="text" name="subject" class="form-control" placeholder="Subject">
                                    </div>
                                </div>
                                <div class="col-md-12 col-lg-12 mb-4">
                                    <div class="form-group">
                                        <textarea name="message" class="form-control" placeholder="Text"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-12 col-lg-12">
                                    <div class="wptb-item--button">
                                        <button class="btn" type="submit">
                                            <span class="btn-wrap">
                                                <span class="text-first">Send Mail</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
```

### Icon Boxes

```html
<div class="wptb-icon-box1">
    <div class="wptb-item--inner flex-start">
        <div class="wptb-item--icon"><i class="bi bi-camera"></i></div>
        <div class="wptb-item--holder">
            <h3 class="wptb-item--title">Service Title</h3>
            <p class="wptb-item--description">Service description</p>
            <a href="#" class="wptb-item--link">Learn More</a>
        </div>
    </div>
</div>
```

### Buttons

**Primary Button:**
```html
<a class="btn" href="#">
    <span class="btn-wrap">
        <span class="text-first">Button Text</span>
        <span class="text-second"><i class="bi bi-arrow-up-right"></i> <i class="bi bi-arrow-up-right"></i></span>
    </span>
</a>
```

**Secondary Button:**
```html
<a class="btn btn-two" href="#">
    <span class="btn-wrap">
        <span class="text-first">Button Text</span>
    </span>
</a>
```

---

## 🔍 Finding Components in Template

### Step-by-Step Process

1. **Identify What You Need**
   - Gallery? → Look at `project-general.html`, `project-masonry-1.html`
   - Video? → Look at `index.html`, `about.html`
   - Contact Form? → Look at `contact-1.html`, `contact-2.html`
   - Services? → Look at `services-1.html`, `service-details.html`

2. **Open Template File**
   - Navigate to `Template-kimono/dark/`
   - Open the relevant HTML file

3. **Find the Component**
   - Use browser "Find" (Ctrl+F) to search for keywords
   - Look for section comments like `<!-- Gallery -->`

4. **Copy the HTML**
   - Copy the entire component section
   - Include opening and closing tags

5. **Adapt for LV_Clicks**
   - Replace "Kimono" with "LV_Clicks"
   - Update image paths (remove `../` if copying to root)
   - Update links to point to your pages
   - Remove copyright notices

6. **Test**
   - Open page in browser
   - Check console for errors
   - Test functionality

---

## 🐛 Troubleshooting

### Images Not Showing

**Problem**: Images appear broken
**Solutions**:
1. Check image path (relative to HTML file)
2. Verify image exists in directory
3. Check file extension (case-sensitive)
4. Clear browser cache

### Lightbox Not Working

**Problem**: Clicking images doesn't open lightbox
**Solutions**:
1. Verify Fancybox script is loaded
2. Check `data-fancybox` attribute is present
3. Ensure all images in gallery have same `data-fancybox` value
4. Check browser console for JavaScript errors

### Layout Broken

**Problem**: Grid/masonry layout not working
**Solutions**:
1. Verify Isotope scripts are loaded
2. Check for `grid-sizer` element
3. Ensure proper grid classes (`grid-2`, `grid-3`, etc.)
4. Check for JavaScript errors in console

### Navigation Not Working

**Problem**: Menu links don't work
**Solutions**:
1. Check file paths are correct
2. Verify files exist
3. Check for typos in filenames
4. Ensure proper HTML structure

### Styles Not Applying

**Problem**: Custom styles not showing
**Solutions**:
1. Check CSS file is linked
2. Verify class names are correct
3. Check for typos in CSS
4. Use browser DevTools to inspect
5. Clear browser cache

---

## 📝 Checklist for New Pages

Before finishing a new page, verify:

- [ ] Page title updated in `<title>` tag
- [ ] Meta description updated
- [ ] Navigation menu includes new page
- [ ] Active menu item has `class="active"`
- [ ] All image paths are correct
- [ ] All links work
- [ ] Branding updated (LV_Clicks, not Kimono)
- [ ] Copyright notices removed/updated
- [ ] Page is responsive (test on mobile)
- [ ] No console errors
- [ ] Footer links updated (if needed)

---

## 💡 Tips & Best Practices

1. **Always Test Locally First**
   - Open HTML file directly in browser
   - Test all functionality before deploying

2. **Keep Structure Consistent**
   - Use same header/footer on all pages
   - Maintain navigation consistency

3. **Optimize Images**
   - Compress images before adding
   - Use appropriate sizes (don't use 4K images for thumbnails)

4. **Use Semantic HTML**
   - Use proper heading hierarchy
   - Include alt text for images
   - Use semantic elements (section, article, etc.)

5. **Comment Your Code**
   - Add comments for major sections
   - Explain complex structures

6. **Version Control**
   - Commit changes frequently
   - Use descriptive commit messages

---

## 🚀 Quick Reference

### Common Classes

**Layout:**
- `container` - Bootstrap container
- `row` - Bootstrap row
- `col-lg-4 col-md-6` - Responsive columns

**Spacing:**
- `pd-top-100` - Padding top
- `pd-bottom-80` - Padding bottom
- `mr-top-50` - Margin top
- `mb-4` - Margin bottom

**Effects:**
- `effect-blur` - Blur hover effect
- `effect-fly` - Fly animation
- `wow fadeInLeft` - Scroll animation

**Icons:**
- Bootstrap Icons: `<i class="bi bi-icon-name"></i>`
- See: https://icons.getbootstrap.com/

---

**Last Updated**: December 2024

