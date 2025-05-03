super-user-email: demon@superuser.com
password: 0000

# ShopMVP: E-Commerce Application Architecture

ShopMVP is a modern e-commerce application built with React for the frontend and a REST API backend. This document outlines the architecture, design patterns, and key components of the application.

## Table of Contents

- [Frontend Architecture](#frontend-architecture)
  - [Technology Stack](#frontend-technology-stack)
  - [Directory Structure](#frontend-directory-structure)
  - [Component Design](#component-design)
  - [State Management](#state-management)
  - [Context System](#context-system)
  - [Routing](#routing)
  - [UI Component Library](#ui-component-library)
- [Backend Architecture](#backend-architecture)
  - [Technology Stack](#backend-technology-stack)
  - [API Design](#api-design)
  - [Authentication](#authentication)
  - [Database Models](#database-models)
- [Authentication Flow](#authentication-flow)

## Frontend Architecture

### Frontend Technology Stack

- **React**: Core UI library
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: High-quality UI components based on Radix UI
- **Lucide Icons**: Modern icon library
- **Sonner**: Toast notifications

### Frontend Directory Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Base UI components (shadcn)
│   └── ...           # Feature-specific components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
│   ├── api/          # API-related hooks
│   └── ui/           # UI-related hooks
├── lib/              # Utility functions and services
│   ├── api/          # API client and utilities
│   └── utils/        # Helper functions
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── App.tsx           # Main application entry
```

### Component Design

The application follows a component-based architecture with:

- **UI Components**: Generic, reusable UI elements (buttons, inputs, etc.)
- **Feature Components**: Domain-specific components (product cards, checkout form, etc.)
- **Page Components**: Top-level components that represent entire pages

### State Management

ShopMVP uses a combination of state management approaches:

1. **Local Component State**: Using React's `useState` hook for component-specific state
2. **Context API**: For shared state across multiple components
3. **TanStack Query**: For server state management (data fetching, caching, synchronization)

### Context System

The application uses several context providers to manage global state:

1. **AuthContext**: Handles user authentication state
   - Manages user login/logout
   - Stores user information
   - Handles authentication status
   - Provides authentication-related functions (login, signup, logout, etc.)

2. **CartContext**: Manages shopping cart state
   - Tracks items in the cart
   - Handles adding/removing items
   - Calculates cart totals

3. **ProductContext**: Manages product-related state
   - Stores product catalog
   - Handles product filtering and search

4. **OrderContext**: Manages order-related state
   - Tracks order history
   - Handles order creation and processing

### Authentication Implementation

The authentication system is structured in two layers:

1. **API Hook Layer** (`hooks/api/useAuth.ts`):
   - Handles direct API communication
   - Manages tokens in localStorage
   - Performs login, signup, and user retrieval operations

2. **Context Layer** (`contexts/AuthContext.tsx`):
   - Provides authentication state to the entire application
   - Uses the API hook for data operations
   - Adds additional functionality like toast notifications
   - Transforms API responses into application-specific formats

The header component and other authenticated UI elements consume the AuthContext to determine what to display based on the user's authentication status.

### Routing

Routing is implemented using React Router with the following structure:

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/products",
    element: <ProductsPage />
  },
  {
    path: "/products/:id",
    element: <ProductDetailPage />
  },
  // Additional routes...
])
```

### UI Component Library

The application uses Shadcn UI components which are built on top of Tailwind CSS. These components include:

- Button
- Dropdown
- Sheet (for mobile navigation)
- Toast
- Form elements
- And more

## Backend Architecture

### Backend Technology Stack

- **Django**: Web framework
- **Django REST Framework**: API tooling
- **PostgreSQL**: Relational database
- **JWT**: JSON Web Tokens for authentication

### API Design

The backend follows a RESTful API design pattern with the following key endpoints:

```
/api/
├── auth/                # Authentication endpoints
│   ├── login/           # User login
│   ├── register/        # User registration
│   ├── me/              # Get current user
│   └── reset-password/  # Password reset
├── products/            # Product management
├── orders/              # Order management
└── cart/                # Cart management
```

### Authentication

The authentication system uses JWT (JSON Web Tokens) with:

- **Access Tokens**: Short-lived tokens for API access
- **Token Storage**: Stored in localStorage on the client
- **Protected Routes**: Endpoints that require authentication
- **Role-based Access**: Different permissions for users vs. admins

### Database Models

Key database models include:

- **User**: Extended from Django's built-in User model
- **Product**: Stores product information
- **Order**: Represents a customer order
- **OrderItem**: Individual items within an order
- **Cart**: User's shopping cart

## Authentication Flow

1. **User Registration**:
   - User submits registration form with username, email, and password
   - Backend validates input and creates a new user
   - JWT token is generated and returned to the client
   - Client stores token in localStorage
   - AuthContext updates the user state

2. **User Login**:
   - User submits login form with email and password
   - Backend validates credentials and returns JWT token
   - Client stores token in localStorage
   - AuthContext updates the user state

3. **Authentication Check**:
   - On application load, AuthContext checks for token in localStorage
   - If token exists, it calls the `/auth/me/` endpoint to get user data
   - If successful, user is authenticated
   - If unsuccessful, token is removed and user is logged out

4. **Logout**:
   - Token is removed from localStorage
   - AuthContext updates the user state to null
   - User is redirected to login page or home page