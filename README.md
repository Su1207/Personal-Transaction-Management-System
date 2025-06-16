# Personal Finance Manager - Frontend

A modern, responsive personal finance management application built with React and TypeScript. This application provides users with comprehensive tools to track their expenses, manage transactions, and analyze spending patterns through interactive charts and analytics.

![image](https://github.com/user-attachments/assets/0ac889d9-8ca8-4985-86da-9811339d6b80)

![image](https://github.com/user-attachments/assets/d5fee2b2-9553-481e-a088-d273979138d1)

![image](https://github.com/user-attachments/assets/8fff3f00-1776-463f-9b0f-577b5d425d99)

![image](https://github.com/user-attachments/assets/3b4d73ff-603f-4c61-ae5a-3b64ee4340f4)

![image](https://github.com/user-attachments/assets/08bcc6e7-85cc-4ea8-8934-6c701e740f0d)


## 🚀 Features

- **User Authentication**: Session-based login and registration system
- **Transaction Management**: Complete CRUD operations for financial transactions
- **Dashboard Analytics**: Monthly and yearly spending analytics with interactive charts
- **Custom Categories**: Create and manage personalized transaction categories
- **Protected Routes**: Secure navigation with authentication guards
- **Modern UI Components**: Beautiful interface using shadcn/ui components

## 🛠️ Tech Stack

### Frontend Technologies
- **React** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - High-quality, accessible React components
- **Chart.js** - Powerful charting library for data visualization
- **React Charts** - Additional charting components for React
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication

### Backend Integration
- **Spring Boot** - Backend REST API (separate repository)
- **PostgreSQL** - Database for data persistence
- **Session-based Authentication** - Secure user authentication

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/finance-manager-frontend.git
cd finance-manager-frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
# API Configuration
VITE_BASE_API_URL=http://localhost:8080/api
```

### 4. Start the Development Server

Using npm:
```bash
npm run dev
```

Using yarn:
```bash
yarn start
```

The application will be available at `http://localhost:5173`

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── analytics/      # Charts-specific components
│   ├── dialogButton/   # Transaction and category creating components
│   └── transactionTable/  # Transaction data 
├── pages/              # Page components
│   ├── login/           # Login page
|   ├── register/       # Register page
│   ├── dashboard/      # Dashboard page
│   └── category/   # Category page
├── services/           # API service functions
├── lin/              # TypeScript type definitions, zustand store and utility functions
├── styles/             # Global styles and Tailwind config
└── App.tsx             # Main app component
```

## 🔐 Authentication Flow

The application uses session-based authentication with the following flow:

1. **Registration**: New users create accounts with username, password, fullname and phoneNumber
2. **Login**: Users authenticate with credentials
3. **Session Management**: Server maintains user sessions with cookies
4. **Protected Routes**: Authentication guards prevent unauthorized access
5. **Logout**: Sessions are invalidated on logout

## 📊 Features Overview

### Transaction Management
- Create new income and expense transactions
- Edit existing transactions with full validation
- Delete transactions with confirmation
- Categorize transactions with custom categories
- Filter and search transactions by date, category, or amount

### Dashboard Analytics
- **Monthly View**: Current month's spending breakdown
- **Yearly View**: Annual spending trends and patterns
- **Category Analysis**: Spending distribution by categories
- **Interactive Charts**: Hover effects and detailed tooltips
- **Responsive Charts**: Optimized for mobile and desktop viewing

### Category Management
- Create custom transaction categories
- Edit and delete user-created categories
- Default categories provided for new users

## 🎨 UI Components

The application uses shadcn/ui components for consistent design:

- **Forms**: Input fields, buttons, and validation
- **Navigation**: Headers, sidebars, and breadcrumbs
- **Data Display**: Tables, cards, and lists
- **Feedback**: Alerts, toasts, and loading states
- **Overlays**: Modals, dialogs, and tooltips

## 🔧 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type checking
npm run type-check
```

## 🌐 API Integration

The frontend communicates with a Spring Boot backend through RESTful APIs:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Transaction Endpoints
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Category Endpoints
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Analytics Endpoints
- `GET /api/analytics/monthly` - Monthly analytics data
- `GET /api/analytics/yearly` - Yearly analytics data

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Environment Variables for Production

```env
VITE_BASE_API_URL=https://your-api-domain.com/api
REACT_APP_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Related Repositories

- **Backend API**: [finance-manager-backend]( https://github.com/Su1207/Finance-Tracker-Backend) - Spring Boot REST API with PostgreSQL

---

**Happy Coding! 💻✨**
