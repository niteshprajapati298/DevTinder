# DevTinder Web - API Documentation

## Base URL
```
Development: http://localhost:3000
Production: https://your-domain.com
```

## Authentication
Authentication is handled via JWT tokens stored in HTTP-only cookies. The middleware validates tokens and attaches the authenticated user to the request object.

---

## 🔐 Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

Create a new user account and send verification email.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Verification email sent. Please check your inbox."
}
```

**Error Response (400):**
```json
{
  "error": "Email already registered."
}
```

### 2. Verify Email
**GET** `/auth/verify-email/:token`

Verify user email with token from verification email.

**Parameters:**
- `token` (string): Email verification token

**Success Response:**
- Redirects to `${FRONTEND_URL}/login?verified=true`

**Error Response:**
- Returns HTML error message for expired/invalid tokens

### 3. Login
**POST** `/auth/login`

Authenticate user and set JWT cookie.

**Request Body:**
```json
{
  "emailId": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "_id": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john.doe@example.com",
  "age": 25,
  "gender": "male",
  "photoUrl": "https://cloudinary.com/image.jpg",
  "about": "User bio",
  "skills": ["JavaScript", "React"],
  "isEmailVerified": true
}
```

**Error Response (401):**
```json
{
  "error": "Please verify your email. A new verification link has been sent."
}
```

**Error Response (400):**
```json
{
  "error": "INVALID CREDENTIALS"
}
```

### 4. Logout
**POST** `/auth/logout`

Clear authentication cookie.

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 👤 Profile Endpoints

### 1. View Profile
**GET** `/profile/view`

Get current user's profile information.

**Headers:**
- Requires authentication cookie

**Response (200):**
```json
{
  "_id": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john.doe@example.com",
  "age": 25,
  "gender": "male",
  "photoUrl": "https://cloudinary.com/image.jpg",
  "about": "Software developer passionate about creating amazing apps",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### 2. Edit Profile
**PATCH** `/profile/edit`

Update user profile with optional photo upload.

**Headers:**
- Requires authentication cookie
- `Content-Type: multipart/form-data` (for photo upload)

**Request Body (Form Data):**
```
firstName: "John"
lastName: "Doe"  
age: 26
gender: "male"
about: "Updated bio"
skills: "JavaScript,React,Node.js"
photo: [file] (optional)
```

**Response (200):**
```json
{
  "message": "John, your profile was updated successfully.",
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "age": 26,
    "photoUrl": "https://cloudinary.com/new-image.jpg",
    "about": "Updated bio",
    "skills": ["JavaScript", "React", "Node.js"]
  }
}
```

---

## 🤝 Connection Request Endpoints

### 1. Send Connection Request
**POST** `/request/send/:status/:toUserId`

Send a connection request to another user.

**Parameters:**
- `status` (string): "interested" | "ignored"
- `toUserId` (string): Target user ID

**Headers:**
- Requires authentication cookie

**Response (200):**
```json
{
  "message": "Connection Request Sent Successfully",
  "data": {
    "_id": "request_id",
    "fromUserId": "sender_user_id",
    "toUserId": "recipient_user_id", 
    "status": "interested",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Connection Request Already Exists"
}
```

### 2. Review Connection Request
**POST** `/request/review/:status/:requestId`

Accept or reject a received connection request.

**Parameters:**
- `status` (string): "accepted" | "rejected"
- `requestId` (string): Connection request ID

**Headers:**
- Requires authentication cookie

**Response (200):**
```json
{
  "message": "Connection request accepted",
  "data": {
    "_id": "request_id",
    "fromUserId": "sender_user_id",
    "toUserId": "recipient_user_id",
    "status": "accepted",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## 👥 User Endpoints

### 1. Get Received Connection Requests
**GET** `/user/connection/received`

Get all pending connection requests received by the current user.

**Headers:**
- Requires authentication cookie

**Response (200):**
```json
{
  "message": "Received connection requests",
  "data": [
    {
      "_id": "request_id",
      "fromUserId": {
        "_id": "sender_user_id",
        "firstName": "Jane",
        "lastName": "Smith",
        "emailId": "jane@example.com",
        "photoUrl": "https://cloudinary.com/jane.jpg",
        "age": 24,
        "gender": "female",
        "about": "Designer and artist"
      },
      "status": "interested",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

### 2. Get My Connections
**GET** `/user/connections`

Get all accepted connections for the current user.

**Headers:**
- Requires authentication cookie

**Response (200):**
```json
{
  "message": "My Connections", 
  "connections": [
    {
      "_id": "user_id",
      "firstName": "Jane",
      "lastName": "Smith",
      "emailId": "jane@example.com",
      "photoUrl": "https://cloudinary.com/jane.jpg",
      "age": 24,
      "gender": "female",
      "about": "Designer and artist"
    }
  ]
}
```

### 3. Get User Feed
**GET** `/feed`

Get paginated list of users for discovery (excluding already connected/requested users).

**Headers:**
- Requires authentication cookie

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 50)

**Response (200):**
```json
{
  "message": "People you may know",
  "data": [
    {
      "_id": "user_id",
      "firstName": "Mike",
      "lastName": "Johnson", 
      "emailId": "mike@example.com",
      "photoUrl": "https://cloudinary.com/mike.jpg",
      "age": 28,
      "gender": "male",
      "about": "Travel enthusiast and photographer"
    }
  ]
}
```

---

## 💬 Message Endpoints

### 1. Get Messages
**GET** `/messages/:userId`

Get paginated conversation history between current user and specified user.

**Parameters:**
- `userId` (string): Other user's ID

**Headers:**
- Requires authentication cookie

**Query Parameters:**
- `page` (number, optional): Page number (default: 1) 
- `limit` (number, optional): Messages per page (default: 20)

**Response (200):**
```json
{
  "messages": [
    {
      "_id": "message_id",
      "fromUserId": "sender_user_id",
      "toUserId": "recipient_user_id",
      "message": "Hello! How are you?",
      "timestamp": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

### 2. Delete Message
**DELETE** `/messages/:id`

Delete a message (only message sender can delete).

**Parameters:**
- `id` (string): Message ID

**Headers:**
- Requires authentication cookie

**Response (200):**
```json
{
  "message": "Deleted successfully",
  "id": "message_id"
}
```

**Error Response (403):**
```json
{
  "message": "Unauthorized"
}
```

---

## ⚠️ Error Responses

All endpoints may return these common error responses:

### 401 Unauthorized
```json
{
  "message": "Please login to access this resource"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 500 Server Error
```json
{
  "message": "Server Error: [specific error message]"
}
```

### 400 Bad Request
```json
{
  "error": "[Specific validation error message]"
}
```

---

## 📝 Request/Response Notes

### Authentication
- JWT tokens are stored in HTTP-only cookies with name "token"
- Include `credentials: 'include'` in fetch requests
- Tokens expire after 15 minutes (configurable)
- Authentication middleware verifies token and loads user data
- Missing token returns "Please login to access this resource"

### File Uploads
- Profile photos: Use `multipart/form-data` with Multer + Cloudinary
- Supported formats: JPG, JPEG, PNG, WebP
- Max file size: 5MB
- Images automatically optimized and stored in Cloudinary CDN
- Old images automatically deleted when updating profile

### Validation Rules
- **Email**: Must be valid email format
- **Password**: Minimum 6 characters
- **Name fields**: Required, trimmed
- **Age**: Must be number between 18-100
- **Skills**: Comma-separated string, converted to array

### Rate Limiting
- Authentication endpoints: 5 requests per minute
- File upload endpoints: 10 requests per hour
- General endpoints: 100 requests per hour

### Pagination
- Default page size: 10-20 items depending on endpoint
- Maximum page size: 50 items
- Page numbers start from 1
- Use `page` and `limit` query parameters

---

## 🔧 Frontend Integration Examples

### JavaScript/Fetch Example
```javascript
// Login request
const login = async (emailId, password) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ emailId, password })
  });
  
  return await response.json();
};

// Get profile with authentication
const getProfile = async () => {
  const response = await fetch('/profile/view', {
    credentials: 'include'
  });
  
  return await response.json();
};

// Upload profile photo
const updateProfile = async (formData) => {
  const response = await fetch('/profile/edit', {
    method: 'PATCH',
    credentials: 'include',
    body: formData // FormData object with photo + other fields
  });
  
  return await response.json();
};
```

### React/Axios Example
```javascript
import axios from 'axios';

// Set default config
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000';

// Send connection request
const sendConnectionRequest = async (userId, status) => {
  try {
    const response = await axios.post(`/request/send/${status}/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
```

---

## 📞 Support

For API-related questions:
- Check error messages for specific guidance
- Ensure proper authentication headers
- Verify request body format matches documentation
- Test with tools like Postman for debugging