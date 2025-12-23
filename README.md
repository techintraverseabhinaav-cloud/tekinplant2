# Industry Training Portal

A modern, responsive training portal website built with Next.js that connects students with industry training programs and corporate partners.

## 🚀 Features

### Core Functionality
- **Industry Data Integration**: Comprehensive database of training programs and corporate partners
- **Advanced Search & Filtering**: Find courses by category, location, company, and keywords
- **Dynamic Company Pages**: Detailed company profiles with their training programs
- **Role-Based Authentication**: Student, Trainer, Admin, and Corporate user dashboards
- **Responsive Design**: Beautiful, elegant UI that works on all devices

### User Roles & Dashboards
- **Student Dashboard**: Track enrolled courses, progress, and learning statistics
- **Trainer Dashboard**: Manage courses, monitor student progress, and view analytics
- **Admin Dashboard**: System-wide statistics, user management, and course oversight
- **Corporate Dashboard**: Employee training management and ROI analytics

### Technical Features
- **Next.js 15**: Modern React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom animations
- **Authentication**: Context-based auth with localStorage persistence
- **Dynamic Routing**: SEO-friendly URLs for courses and companies
- **Glass Morphism**: Modern UI design with elegant visual effects

## 📊 Data Structure

The portal integrates data from multiple Excel files containing:
- **25 Industry Training Programs** with detailed course information
- **25 Corporate Partners** with company profiles and contact details
- **Industry Statistics** and insights for analytics
- **Dynamic Course Enrollment** system

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd trainin-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

The portal includes demo credentials for testing:

### Student Login
- Email: `student@demo.com`
- Password: `password123`

### Trainer Login
- Email: `trainer@demo.com`
- Password: `password123`

### Admin Login
- Email: `admin@demo.com`
- Password: `password123`

### Corporate Login
- Email: `corporate@demo.com`
- Password: `password123`

## 📁 Project Structure

```
trainin-portal/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── courses/           # Training programs
│   ├── partners/          # Corporate partners
│   ├── login/             # Authentication
│   ├── student-dashboard/ # Student dashboard
│   ├── trainer-dashboard/ # Trainer dashboard
│   ├── admin-dashboard/   # Admin dashboard
│   └── corporate-dashboard/ # Corporate dashboard
├── components/            # Reusable UI components
├── lib/                   # Utilities and data
│   ├── industry-data.ts   # Centralized data store
│   └── auth-context.tsx   # Authentication context
├── public/               # Static assets
└── styles/               # Global styles
```

## 🎨 Design System

The portal features a modern dark theme with:
- **Gradient Backgrounds**: Purple to blue color schemes
- **Glass Morphism**: Translucent card effects
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Mobile-first design approach
- **Custom Icons**: Lucide React icon library

## 🚀 Deployment

The project is optimized for deployment on Vercel:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and deploy
   - Your site will be live at `https://your-project.vercel.app`

## 🔧 Customization

### Adding New Data
- Update `lib/industry-data.ts` to add new courses or partners
- Follow the existing TypeScript interfaces
- Images can be added to `public/` directory

### Styling Changes
- Modify `app/globals.css` for global styles
- Update Tailwind classes in components
- Custom animations are defined in CSS

### Authentication
- Modify `lib/auth-context.tsx` for auth logic changes
- Update demo credentials in `app/login/page.tsx`

## 📱 Responsive Design

The portal is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebars
- **Tablet**: Adaptive layouts with touch-friendly interactions
- **Mobile**: Streamlined navigation with mobile-first design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Tailwind CSS** for the utility-first styling
- **Lucide React** for the beautiful icons
- **Radix UI** for accessible components

---

**Built with ❤️ for the training industry**
