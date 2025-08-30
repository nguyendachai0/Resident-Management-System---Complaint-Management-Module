# Resident Management System - Backend API

## Overview
Backend API for the Resident Management System, built with Node.js, Express, TypeScript, and PostgreSQL.

## Features
- 🔐 JWT Authentication with role-based access control
- 📝 Complete complaint management system
- 👥 User management with different roles
- 🏢 Building and apartment management
- 💬 Comment system for complaints
- 📊 Statistics and reporting
- 🛡️ Security middleware and rate limiting
- ✅ Input validation and error handling

## Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Testing**: Jest with Supertest
- **Security**: Helmet, CORS, Rate limiting

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resident-management-system/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your database credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/resident_management"
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Create and migrate database
   npx prisma db push

   # Seed with sample data
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at [http://localhost:5000/api](http://localhost:5000/api)

## API Documentation

### Authentication Endpoints
| Method | Endpoint              | Description       | Access     |
|--------|-----------------------|-------------------|------------|
| POST   | /api/auth/register    | Register new user | Public     |
| POST   | /api/auth/login       | User login        | Public     |
| GET    | /api/auth/profile     | Get user profile  | Protected  |
| PUT    | /api/auth/profile     | Update profile    | Protected  |
| POST   | /api/auth/logout      | User logout       | Protected  |

### Complaint Management
| Method | Endpoint                        | Description            | Access    |
|--------|---------------------------------|------------------------|-----------|
| GET    | /api/complaints                 | List complaints        | Protected |
| POST   | /api/complaints                 | Create complaint       | Protected |
| GET    | /api/complaints/:id             | Get complaint details  | Protected |
| PUT    | /api/complaints/:id             | Update complaint       | Protected |
| DELETE | /api/complaints/:id             | Delete complaint       | Protected |
| POST   | /api/complaints/:id/comments    | Add comment            | Protected |

### User Management
| Method | Endpoint                  | Description        | Access        |
|--------|---------------------------|--------------------|---------------|
| GET    | /api/users                | List all users     | Admin/Manager |
| GET    | /api/users/:id            | Get user details   | Admin/Manager |
| PUT    | /api/users/:id            | Update user        | Admin         |
| DELETE | /api/users/:id            | Delete user        | Admin         |
| GET    | /api/users/stats/overview | User statistics    | Admin/Manager |

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "message": string,
  "data": any, // Optional
  "error": string // Optional
}
```

## Error Codes
| Code | Description                           |
|------|---------------------------------------|
| 400  | Bad Request - Invalid input           |
| 401  | Unauthorized - Invalid/missing token  |
| 403  | Forbidden - Insufficient permissions  |
| 404  | Not Found - Resource doesn't exist    |
| 409  | Conflict - Duplicate entry            |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error                 |

## User Roles
- **SUPER_ADMIN**: Full system access  
- **BUILDING_MANAGER**: Manage building operations  
- **STAFF**: Handle complaints and maintenance  
- **RESIDENT**: Submit complaints and manage profile  

## Test Accounts
After running the seed script, these accounts are available:
- **Admin**: `admin@abc-apartment.com` (password: `admin123`)
- **Manager**: `manager@abc-apartment.com` (password: `manager123`)
- **Staff**: `staff1@abc-apartment.com` (password: `staff123`)
- **Residents**:  
  - `resident1@gmail.com` (password: `resident123`)  
  - `resident2@gmail.com` (password: `resident123`)  
  - `resident3@gmail.com` (password: `resident123`)  

## Development

### Running Tests
```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
```

### Database Operations
```bash
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Create and run migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database with sample data
```

### Building for Production
```bash
npm run build          # Build TypeScript to dist/
npm start              # Start production server
```

## Security Features
- Password hashing with bcrypt  
- JWT token authentication  
- Rate limiting on all endpoints  
- CORS configuration  
- Input validation and sanitization  
- SQL injection prevention via Prisma  
- Security headers with Helmet.js  

## Architecture
```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── middleware/      # Custom middleware
├── routes/          # API routes
├── types/           # TypeScript types
├── utils/           # Utility functions
├── config/          # Configuration files
└── app.ts           # Express app setup
```

## Contributing
1. Create feature branch  
2. Write tests for new features  
3. Ensure all tests pass  
4. Submit pull request  

## License
MIT
