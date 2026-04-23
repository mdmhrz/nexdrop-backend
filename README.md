# NexDrop Backend

A modern, scalable backend API for a parcel delivery management system. Built with TypeScript, Express.js, and Prisma ORM, NexDrop provides a comprehensive solution for managing parcels, riders, payments, and user authentication.

## Live Demo

- Production URL: https://nexdrop.up.railway.app/
- GitHub Repository: https://github.com/mdmhrz/nexdrop-backend

## Features

### Core Functionality
- User Management: Customer, Admin, and Rider account management with role-based access control
- Authentication & Authorization: Secure authentication using better-auth with session-based and token-based auth
- Parcel Management: Create, track, and manage parcels with real-time status updates
- Rider Operations: Rider application, approval, assignment, and delivery management
- Payment Integration: Multiple payment gateway support (Stripe, SSLCommerz)
- Rating System: Customer ratings for riders with average rating calculations
- Address Management: Multiple address management for customers
- Analytics Dashboard: Revenue analytics, parcel statistics, and performance metrics
- Cashout System: Rider earnings management and cashout request processing

### User Roles
- Customer: Create parcels, track deliveries, manage addresses, rate riders
- Rider: Apply for rider account, accept deliveries, manage earnings, request cashouts
- Admin: Manage users, approve riders, view analytics, manage system operations
- Super Admin: Full system control and configuration

## Tech Stack

### Backend Framework
- Node.js - JavaScript runtime
- Express.js - Web application framework
- TypeScript - Type-safe JavaScript

### Database & ORM
- PostgreSQL - Relational database
- Prisma ORM - Database toolkit and ORM
- Prisma Adapter (pg) - PostgreSQL adapter for Prisma

### Authentication
- better-auth - Modern authentication library
- JWT - Token-based authentication
- Cookie Parser - Cookie management

### Payment Gateways
- Stripe - Payment processing
- SSLCommerz - Alternative payment gateway

### Validation & Security
- Zod - Schema validation
- http-status - HTTP status codes
- dotenv - Environment variable management

### Development Tools
- ESLint - Code linting
- tsx - TypeScript execution
- tsup - TypeScript bundler
- Prisma Studio - Database GUI

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- pnpm (v10 or higher) - Package manager
- PostgreSQL (v14 or higher) - Database
- Git - Version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mdmhrz/nexdrop-backend.git
cd nexdrop-backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the `.env.example` file to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/nexdrop
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:5000

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# SSL Commerz Configuration
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_SANDBOX=true
```

### 4. Set Up Database

#### Option A: Using Prisma Migrate (Recommended for development)

```bash
pnpm migrate
```

This will create the database and apply all migrations.

#### Option B: Using Prisma Push (For quick setup)

```bash
pnpm push
```

This will push the schema directly to the database without creating migration files.

### 5. Generate Prisma Client

```bash
pnpm generate
```

## Running the Project

### Development Mode

Run the project in development mode with hot reload:

```bash
pnpm dev
```

The server will start at `http://localhost:5000`

### Production Mode

Build the project and run in production mode:

```bash
pnpm build
pnpm start
```

### Database Management

Open Prisma Studio to manage your database visually:

```bash
pnpm studio
```

## API Documentation

Comprehensive API documentation is available in the `/docs` directory:

- [Auth Module API](./docs/auth-api.md) - Authentication and user management endpoints
- [User Module API](./docs/user-api.md) - User management and profile endpoints
- [Address Module API](./docs/address-api.md) - Address management endpoints
- [Rider Module API](./docs/rider-api.md) - Rider application and management endpoints
- [Parcel Module API](./docs/parcel-api.md) - Parcel management endpoints
- [Payment Module API](./docs/payment-api.md) - Payment processing endpoints
- [Rating Module API](./docs/rating-api.md) - Rating and review endpoints
- [Analytics Module API](./docs/analytics-api.md) - Analytics and statistics endpoints

### Bruno API Collection

A Bruno API collection is available at `public/NexDrop_API-documentation.html` for testing API endpoints.

### Base URL

All API endpoints are prefixed with `/api/v1`

Example: `http://localhost:5000/api/v1/auth/register`

### Authentication

Most endpoints require authentication using either:
- Session Token: Cookie `better-auth.session_token`
- Access Token: Authorization header `Bearer <token>`

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errorSources": [
    {
      "path": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

## Database Schema

The project uses Prisma ORM with PostgreSQL. Key models include:

- User: Customer, admin, and rider accounts
- Rider: Rider profiles and account status
- Parcel: Delivery parcels with tracking
- Payment: Payment transactions
- Earning: Rider earnings from deliveries
- Cashout: Rider cashout requests
- Address: User addresses
- RiderRating: Customer ratings for riders

To view the full schema, check the `prisma/schema` directory.

## Available Scripts

```bash
pnpm dev          # Run in development mode with hot reload
pnpm build        # Build the project for production
pnpm start        # Run the production build
pnpm lint         # Run ESLint
pnpm migrate      # Run Prisma migrations
pnpm generate     # Generate Prisma client
pnpm studio       # Open Prisma Studio
pnpm push         # Push schema to database (no migration)
pnpm pull         # Pull schema from database
```

## Deployment

### Railway Deployment

The project is currently deployed on Railway. To deploy your own instance:

1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Configure environment variables in Railway dashboard
4. Railway will automatically build and deploy

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

- NODE_ENV=production
- DATABASE_URL - Production PostgreSQL connection string
- BETTER_AUTH_SECRET - Strong random secret for auth
- BETTER_AUTH_URL - Production backend URL
- ACCESS_TOKEN_SECRET - Secret for access token generation
- REFRESH_TOKEN_SECRET - Secret for refresh token generation
- STRIPE_SECRET_KEY - Production Stripe secret key
- STRIPE_WEBHOOK_SECRET - Production webhook secret
- FRONTEND_URL - Production frontend URL
- BACKEND_URL - Production backend URL
- SSLCOMMERZ_STORE_ID - SSLCommerz store ID
- SSLCOMMERZ_STORE_PASSWORD - SSLCommerz store password
- SSLCOMMERZ_IS_SANDBOX=false - Set to false for production

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the project conventions
4. Run linting (`pnpm lint`)
5. Test your changes thoroughly
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Conventions

- Use TypeScript for all new code
- Follow the existing code structure and naming conventions
- Add type annotations for all functions and variables
- Use Zod for request validation
- Add API documentation for new endpoints in `/docs`
- Write clear, descriptive commit messages

## Project Structure

```
nexdrop-backend/
├── prisma/
│   └── schema/          # Database schema files
├── src/
│   ├── app/
│   │   ├── config/      # Configuration files
│   │   ├── errorHelper/ # Error handling utilities
│   │   ├── lib/         # Library files (prisma, etc.)
│   │   ├── module/      # Feature modules
│   │   │   ├── address/
│   │   │   ├── analytics/
│   │   │   ├── auth/
│   │   │   ├── parcel/
│   │   │   ├── payment/
│   │   │   ├── rating/
│   │   │   ├── rider/
│   │   │   └── user/
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # Route definitions
│   │   └── shared/      # Shared utilities
│   └── server.ts        # Server entry point
├── docs/                # API documentation
├── public/              # Public files
├── .env.example         # Environment variables template
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Troubleshooting

### Common Issues

**Issue: Prisma client not found**
```bash
pnpm generate
```

**Issue: Database connection failed**
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database credentials

**Issue: Migration conflicts**
```bash
pnpm pull
pnpm push
```

**Issue: Build fails**
```bash
pnpm install
pnpm generate
pnpm build
```

## License

This project is licensed under the ISC License.

## Author

- MD MHRZ - [GitHub](https://github.com/mdmhrz)

## Acknowledgments

- Built with modern web technologies
- Inspired by delivery management systems
- Uses open-source libraries and frameworks

## Support

For support, please open an issue on GitHub or contact the author.

---

Note: This project is under active development. Features and APIs may change as the project evolves.
