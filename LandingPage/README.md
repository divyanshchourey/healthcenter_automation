# Health Center Automation Landing Page

A professional, modern, and fully responsive landing page for the Health Center Automation project built with React JSX and Tailwind CSS.

## Features

- **Professional Navigation**: Fixed navbar with smooth scrolling and responsive mobile menu
- **Full-width Hero Section**: Spans entire viewport height with centered content
- **Video Integration**: Playable video with custom controls and overlay text
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Dynamic Content**: Content managed through `data.json` for easy updates
- **Professional Styling**: Clean, minimalist design with neutral color palette
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Modular Components**: Reusable component structure for easy maintenance

## Project Structure

```
health_AutomationApp/
├── public/
│   └── data.json              # Content management file
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Professional navigation bar
│   │   ├── Hero.jsx           # Hero section with video player
│   │   ├── Features.jsx       # Features section
│   │   ├── Testimonials.jsx   # Testimonials section
│   │   └── Contact.jsx        # Contact form section
│   ├── App.jsx                # Main application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles and Tailwind imports
├── index.html                 # HTML template with SEO meta tags
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.js             # Vite build configuration
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000` to view the landing page.

### Building for Production

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

## Content Management

All content is managed through the `data.json` file located in the `public` directory. This allows for easy content updates without modifying the React code.

### Updating Content

1. Open `public/data.json`
2. Modify the content as needed:

   - `hero`: Main hero section content
   - `features`: Features section content
   - `testimonials`: Customer testimonials
   - `contact`: Contact section content

3. Save the file - changes will be reflected immediately in development mode

### Adding New Sections

1. Add new content to `data.json`
2. Create a new component in `src/components/`
3. Import and use the component in `App.jsx`
4. The component will automatically receive the data from the JSON file

## Customization

### Styling

The project uses Tailwind CSS for all styling. Key customization points:

- **Colors**: Modify the color palette in `tailwind.config.js`
- **Fonts**: Update font families in `tailwind.config.js`
- **Animations**: Add custom animations in `src/index.css`

### Video

To change the hero video:

1. Update the `videoUrl` in `data.json`
2. Ensure the video is hosted and accessible
3. Consider adding a poster image for better loading experience

### Responsive Breakpoints

The design uses Tailwind's default breakpoints:

- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized for fast loading
- Minimal bundle size
- Lazy loading for images and videos
- SEO-friendly structure

## License

This project is proprietary software for Health Center Automation.

## Support

For technical support or questions about this landing page, please contact the development team.
