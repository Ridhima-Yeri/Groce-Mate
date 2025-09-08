# GroceMate

A modern, full-stack grocery shopping application built with Ionic React and Node.js. GroceMate provides a seamless shopping experience with user authentication, product catalog management, shopping cart functionality, and comprehensive admin controls.

## Features

### User Features
- **Home Page**: Welcome screen with featured products and categories
- **Product Catalog**: Browse products by category with search functionality
- **Shopping Cart**: Add, remove, and manage cart items with quantity controls
- **User Authentication**: Secure login/registration system
- **Order Management**: Place orders and track order history
- **User Profile**: Manage personal information and upload profile pictures
- **Dark/Light Mode**: Automatic theme switching based on system preferences

### Admin Features
- **Admin Dashboard**: Comprehensive management interface
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order statuses
- **User Management**: Monitor user accounts and roles
- **Analytics**: Basic statistics and insights

### Technical Features
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Offline Support**: Cached data for offline browsing
- **Professional UI**: Modern, clean interface with smooth animations
- **Secure Authentication**: JWT-based authentication with role-based access

## Technology Stack

### Frontend
- **Framework**: Ionic React 8.5.0
- **Language**: TypeScript
- **Styling**: CSS3 with CSS Variables
- **State Management**: React Context API
- **Routing**: React Router
- **Icons**: Ionicons
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Environment**: dotenv

## Project Structure

```
GroceMate/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   │   └── SideMenu.tsx         # Navigation menu component
│   ├── contexts/                # React Context providers
│   │   └── CartContext.tsx      # Shopping cart state management
│   ├── pages/                   # Page components
│   │   ├── Home.tsx            # Landing page
│   │   ├── Products.tsx        # Product catalog
│   │   ├── Cart.tsx            # Shopping cart
│   │   ├── Checkout.tsx        # Order checkout
│   │   ├── Login.tsx           # Authentication
│   │   ├── Profile.tsx         # User profile
│   │   ├── AdminDashboard.tsx  # Admin panel
│   │   ├── Orders.tsx          # Order management
│   │   └── OrderDetails.tsx    # Individual order details
│   ├── styles/                 # CSS stylesheets
│   │   ├── variables.css       # CSS custom properties
│   │   ├── App.css            # Main app styles
│   │   ├── Home.css           # Home page styles
│   │   ├── Product.css        # Product page styles
│   │   ├── Profile.css        # Profile page styles
│   │   └── [various].css      # Component-specific styles
│   ├── api/                   # API communication
│   └── App.tsx               # Main application component
├── backend/                   # Backend source code
│   ├── src/
│   │   ├── models/           # MongoDB schemas
│   │   │   ├── User.js       # User model
│   │   │   ├── Product.js    # Product model
│   │   │   ├── Order.js      # Order model
│   │   │   └── Category.js   # Category model
│   │   ├── routes/           # API route handlers
│   │   │   ├── auth.js       # Authentication routes
│   │   │   ├── users.js      # User management routes
│   │   │   ├── products.js   # Product routes
│   │   │   └── admin.js      # Admin routes
│   │   ├── middleware/       # Custom middleware
│   │   └── server.js         # Express server setup
│   └── uploads/              # File upload directory
├── public/                   # Static assets
├── cypress/                  # E2E testing configuration
└── package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/GroceMate.git
   cd GroceMate
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/groce-mate
   JWT_SECRET=your-secret-key-here
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Seed the database (optional)**
   ```bash
   cd backend
   npm run seed
   cd ..
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   # In a new terminal, from the root directory
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Default Admin Account
- **Email**: ****
- **Password**: ****

## Design Philosophy

### User Experience
- **Mobile-First**: Designed primarily for mobile users with responsive desktop support
- **Intuitive Navigation**: Clear, accessible navigation with consistent patterns
- **Performance**: Optimized loading times and smooth interactions
- **Accessibility**: Full keyboard navigation and screen reader support

### Visual Design
- **Modern Aesthetic**: Clean, minimalist design with purposeful use of color
- **Consistent Theming**: Unified color palette and typography across all components
- **Dark Mode Support**: Automatic theme switching based on user preferences
- **Professional Polish**: Attention to micro-interactions and visual feedback

## Testing

### End-to-End Testing
```bash
npm run test.e2e
```

### Unit Testing
```bash
npm run test.unit
```

## Building for Production

### Frontend Build
```bash
npm run build
```

### Backend Production
```bash
cd backend
npm start
```

## Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/groce-mate
JWT_SECRET=your-jwt-secret
NODE_ENV=production
```

#### Frontend (Vite Configuration)
The frontend uses Vite for build configuration. Customize `vite.config.ts` for specific build requirements.

## Mobile Development

This project is built with Ionic, making it ready for mobile deployment:

### iOS/Android Build
1. Add mobile platforms:
   ```bash
   npx cap add ios
   npx cap add android
   ```

2. Build and sync:
   ```bash
   npm run build
   npx cap sync
   ```

3. Open in native IDE:
   ```bash
   npx cap open ios
   npx cap open android
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Ensure accessibility compliance
- Maintain responsive design principles

## Acknowledgments

- **Ionic Framework** - For the excellent mobile-first UI components
- **React** - For the powerful and flexible frontend framework
- **MongoDB** - For the robust document database
- **Express.js** - For the minimal and flexible web framework.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
