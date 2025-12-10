# Assets Folder

This folder is for storing images, icons, logos, and other media files.

## Recommended Structure

```
assets/
├── icons/          # UI icons and small graphics
├── images/         # Photos and larger images
├── logos/          # Brand logos
└── README.md       # This file
```

## Usage

### Adding Images

Place your image files in this folder and reference them in HTML:

```html
<img src="assets/images/destination.jpg" alt="Destination" />
```

### Icons

You can use:

- Font Awesome (add CDN link in HTML)
- Emojis (already used in the project)
- Custom SVG icons (place in `icons/` subfolder)

### Image Sources

For prototype/development, you can use:

- Unsplash (https://unsplash.com) - Free stock photos
- Pexels (https://pexels.com) - Free stock photos
- Placeholder services (https://placeholder.com)

## Notes

- Keep image file sizes reasonable (< 500KB each)
- Use descriptive filenames (e.g., `tokyo-skyline.jpg` not `img1.jpg`)
- Consider using WebP format for better performance
- For production, optimize all images before deployment
