# DevTinder Web

A modern dating application backend built with Node.js and Express, featuring user authentication, profile management, connection requests, messaging, and email notifications.

## 🚀 Features

- **User Authentication**: Secure signup, login, logout with JWT tokens
- **Email Verification**: Email verification system with automated emails
- **Profile Management**: Complete profile creation and editing with photo uploads
- **Connection System**: Send and receive connection requests (interested/ignored)
- **Real-time Messaging**: Send and receive messages between matched users
- **User Feed**: Discover new people with paginated feed
- **Cloud Storage**: Profile photo uploads via Cloudinary
- **Email Notifications**: Automated emails for various user interactions

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **File Upload**: Cloudinary
- **Email Service**: Resend API for transactional emails
- **Validation**: Custom validation utilities, validator.js

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- Email service credentials

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devtinder-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/devtinder
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3001
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Resend Email Service Configuration
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
devtinder-web/
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── profile.js       # Profile management routes
│   ├── request.js       # Connection request routes
│   ├── user.js          # User-related routes
│   └── message.js       # Messaging routes
├── models/
│   ├── user.js          # User schema
│   ├── connectionRequest.js # Connection request schema
│   └── message.js       # Message schema
├── middlewares/
│   ├── auth.js          # JWT authentication middleware
│   └── cloudinaryUpload.js # Multer + Cloudinary file upload middleware
├── utils/
│   ├── validation.js    # Input validation utilities
│   ├── sendEmail.js     # Email service utilities
│   └── cloudinary.js    # Cloudinary configuration
└── app.js              # Main application file
```

## 🔐 Authentication

The application uses JWT-based authentication with the following flow:
1. User signs up with email verification
2. Email verification required before login
3. JWT tokens stored in HTTP-only cookies
4. Automatic token refresh on valid requests

## 📸 File Upload

Profile photos are handled via Cloudinary:
- Automatic image optimization
- Secure cloud storage
- Old image cleanup on updates
- Support for multiple formats

## 📧 Email System

Automated emails are sent for:
- Email verification during signup
- Connection request notifications
- Connection acceptance notifications
- Password reset (if implemented)

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use production database URL
   - Set secure JWT secret
   - Configure production frontend URL

2. **Security**
   - Enable CORS for production domains only
   - Use HTTPS in production
   - Set secure cookie flags
   - Implement rate limiting

3. **Performance**
   - Enable database indexing
   - Implement caching strategies
   - Use connection pooling
   - Monitor memory usage

## 🤝 API Integration

For frontend developers, please refer to the `API_DOCS.md` file for comprehensive API documentation including:
- Authentication endpoints
- Request/response formats
- Error handling
- Rate limiting information

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MongoDB connection string
   - Ensure MongoDB service is running

2. **Email Not Sending**
   - Verify Resend API key in environment variables
   - Ensure sender domain is verified in Resend dashboard
   - Check recipient email address format
   - Verify internet connectivity

3. **File Upload Issues**
   - Verify Cloudinary credentials in .env file
   - Check file size (must be under 5MB)
   - Ensure file format is supported (JPG, JPEG, PNG, WebP)
   - Verify Multer middleware configuration

4. **JWT Token Issues**
   - Check JWT secret configuration
   - Verify token expiration settings
   - Clear browser cookies and retry

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the API documentation for integration help

## 🔄 Version History

- **v1.0.0**: Initial release with core features
- Authentication system
- Profile management
- Connection requests
- Basic messaging
- Email notifications