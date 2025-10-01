# Manu Kakkar - Portfolio Website

A professional, responsive portfolio website showcasing the skills, experience, and achievements of Manu Kakkar, Quality Assurance Engineer at Amazon. Built with modern web technologies and optimized for both desktop and mobile experiences.

## 🚀 Features

### Core Features
- **Responsive Design**: Mobile-first approach with breakpoints for all device sizes
- **Hero Section**: Professional introduction with Amazon branding and animated background
- **Interactive Navigation**: Smooth scrolling with active section highlighting and animated chat button
- **Project Portfolio**: Comprehensive showcase of QA testing projects with advanced filtering
- **Blog System**: Technical articles and insights with search, categorization, and modal views
- **Certificates Gallery**: Professional certifications with detailed information and filtering
- **Career Chat**: Full-screen mobile-optimized interactive chat interface with AI-powered responses
- **Direct Contact**: Professional contact tiles with direct email/phone integration

### Technical Features
- **Vanilla JavaScript**: No external dependencies for optimal performance
- **Tailwind CSS Integration**: Modern utility-first CSS framework for enhanced styling
- **CSS Grid & Flexbox**: Advanced layout techniques for responsive design
- **Local Storage**: Chat history and user preferences persistence
- **JSON Data Management**: Easy content updates through structured JSON files
- **Performance Optimized**: Lazy loading, optimized animations, and efficient DOM manipulation
- **Mobile-First Design**: Full-screen mobile experience with touch-optimized interfaces
- **Dark Theme**: Consistent dark theme with Amazon brand colors throughout

## 📁 Project Structure

```
MANU-Portfolio/
├── index.html                 # Main landing page
├── pages/                     # Individual pages
│   ├── projects.html         # Projects showcase
│   ├── blog.html            # Blog posts
│   └── certificates.html    # Certifications
├── assets/
│   ├── css/
│   │   ├── main.css         # Main styles
│   │   ├── responsive.css   # Responsive design
│   │   └── components.css   # Component styles
│   ├── js/
│   │   ├── main.js          # Core functionality
│   │   ├── projects.js      # Projects page logic
│   │   ├── blog.js          # Blog page logic
│   │   └── certificates.js  # Certificates page logic
│   ├── images/              # Image assets
│   │   ├── profile/         # Profile images
│   │   ├── projects/        # Project screenshots
│   │   ├── certificates/    # Certificate images
│   │   └── icons/           # Icon assets
│   └── data/                # JSON data files
│       ├── projects.json    # Project data
│       ├── blog-posts.json  # Blog content
│       ├── certificates.json # Certificate data
│       └── chat-responses.json # Chat responses
└── README.md
```

## 🛠 Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with custom properties, Grid, and Flexbox
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **JavaScript (ES6+)**: Modern JavaScript features and APIs
- **JSON**: Data storage and management
- **No External Dependencies**: Pure vanilla implementation for core functionality

## 📱 Mobile Optimization

### Full-Screen Mobile Experience
- **Career Chat**: Full viewport coverage on mobile devices (100vw x 100vh)
- **Touch-Optimized**: Large touch targets and gesture-friendly interfaces
- **Responsive Navigation**: Collapsible mobile menu with smooth animations
- **Optimized Typography**: Scalable text and proper contrast ratios
- **Performance**: Optimized for mobile networks and devices

### Mobile-Specific Features
- **Full-screen modals**: Blog posts and chat interface use entire screen real estate
- **Touch-friendly buttons**: Minimum 44px touch targets for accessibility
- **Swipe gestures**: Enhanced mobile navigation experience
- **Viewport optimization**: No horizontal scrolling, proper scaling

## 🎨 Design System

### Color Palette
- **Primary**: Amazon Orange (#FF9900) - Used for CTAs, highlights, and interactive elements
- **Secondary**: Amazon Blue (#232F3E) - Navigation, footer, and structural elements
- **Accent**: Professional Blue (#146EB4) - Links, secondary actions, and user messages
- **Text**: White (#ffffff) primary, light gray (#e0e0e0) secondary for dark theme
- **Background**: Dark gradient (#000000 to #16213e) with animated elements
- **Cards**: Dark gray (#1a1a1a) with subtle borders (#333333)

### Recent Design Improvements
- **Enhanced Contrast**: Fixed blog post headers and modal content for better readability
- **Animated Elements**: Pulsing chat button with emoji for better engagement
- **Colorful Tags**: Amazon orange background for project and blog tags
- **Consistent Theming**: Unified dark theme across all pages and components
- **Mobile-First**: Optimized color contrast and sizing for mobile devices

### Typography
- **Primary Font**: System font stack for performance
- **Fallbacks**: Cross-platform compatibility
- **Hierarchy**: Clear heading structure with proper contrast

### Components
- **Cards**: Consistent card design across all sections
- **Buttons**: Primary and secondary button styles
- **Forms**: Accessible form design with validation
- **Modals**: Responsive modal dialogs
- **Navigation**: Sticky navigation with mobile menu

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1200px
- **Large Desktop**: 1200px+

## 🚀 Getting Started

1. **Clone or Download** the repository
2. **Replace Images**: Add actual images to the `assets/images/` directories
3. **Update Content**: Modify JSON files in `assets/data/` to reflect actual content
4. **Customize**: Update colors, fonts, and styling in CSS files
5. **Deploy**: Upload to any web server or hosting platform

## 📝 Content Management

### Adding Projects
Edit `assets/data/projects.json` to add new projects:

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "description": "Brief description",
  "longDescription": "Detailed description",
  "technologies": ["Tech1", "Tech2"],
  "category": "Project Category",
  "status": "Active|Completed",
  "featured": true|false
}
```

### Adding Blog Posts
Edit `assets/data/blog-posts.json` to add new blog posts:

```json
{
  "id": "unique-post-id",
  "title": "Post Title",
  "excerpt": "Brief excerpt",
  "content": "Full content in markdown",
  "category": "Post Category",
  "tags": ["tag1", "tag2"],
  "featured": true|false,
  "published": true|false
}
```

### Adding Certificates
Edit `assets/data/certificates.json` to add new certificates:

```json
{
  "id": "unique-cert-id",
  "title": "Certificate Title",
  "issuer": "Issuing Organization",
  "category": "Certificate Category",
  "skills": ["skill1", "skill2"],
  "featured": true|false
}
```

## 🔧 Customization

### Colors
Update CSS custom properties in `assets/css/main.css`:

```css
:root {
  --primary-color: #FF9900;
  --secondary-color: #232F3E;
  --accent-color: #146EB4;
}
```

### Content
- Update personal information in `index.html`
- Modify navigation links as needed
- Replace placeholder images with actual photos
- Update contact information and social links

## 🌟 Key Features Explained

### Career Chat
Interactive chat system that provides automated responses to common career questions about QA, testing, and working at Amazon.

### Project Filtering
Advanced filtering system allowing users to search and filter projects by:
- Technology stack
- Project category
- Status (Active/Completed)
- Keywords

### Blog System
Full-featured blog with:
- Category-based organization
- Tag system
- Search functionality
- Reading time estimation
- Social sharing

### Certificate Gallery
Professional certificate showcase with:
- Category filtering
- Issuer filtering
- Detailed certificate information
- Verification links

## 📊 Performance Features

- **Lazy Loading**: Images load as needed
- **Minified Code**: Optimized CSS and JavaScript
- **Efficient DOM Manipulation**: Minimal reflows and repaints
- **Local Storage**: Reduced server requests
- **Responsive Images**: Optimized for different screen sizes

## 🔒 Security Considerations

- **Input Validation**: All form inputs are validated
- **XSS Prevention**: Content is properly sanitized
- **No Sensitive Data**: No credentials or sensitive information in client-side code
- **Contact Form**: Simulated email functionality (no real email sending)

## 🚀 Deployment

The website is a static site and can be deployed to:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **AWS S3 + CloudFront**
- **Any web server**

Simply upload all files to your hosting platform of choice.

## 📝 Recent Updates & Changelog

### v2.0.0 - Mobile Optimization & Design Enhancements
- **📱 Full Mobile Optimization**: Career chat now uses full screen on mobile devices
- **🎨 Enhanced UI/UX**: Fixed color contrast issues in blog posts and modals
- **✨ Interactive Elements**: Added animated chat button with emoji and pulse effect
- **🏷️ Colorful Tags**: Project and blog tags now have Amazon orange backgrounds
- **🔧 Tailwind Integration**: Added Tailwind CSS for enhanced styling capabilities
- **💬 Improved Chat**: Better mobile responsiveness and touch-friendly interface
- **🌌 Dark Theme**: Consistent dark theme across all pages and components
- **🔍 Better Filters**: Fixed z-index issues with dropdown filters
- **📝 Content Updates**: Enhanced blog modal content with proper color schemes

## 📈 Future Enhancements

- **Backend Integration**: Add real email functionality
- **Analytics**: Implement visitor tracking
- **SEO Optimization**: Add meta tags and structured data
- **PWA Features**: Service worker for offline functionality
- **CMS Integration**: Content management system
- **Multi-language Support**: Internationalization

## 🤝 Contributing

This is a personal portfolio website. However, suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Manu Kakkar**
- Email: manu2551988@gmail.com
- LinkedIn: [linkedin.com/in/manu2551988](https://linkedin.com/in/manu2551988)
- GitHub: [github.com/manu2551988](https://github.com/manu2551988)

---

Built with ❤️ by Manu Kakkar - Quality Assurance Engineer @ Amazon