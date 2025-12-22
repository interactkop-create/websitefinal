# API Contracts & Implementation Guide

## Overview
This document outlines the backend implementation for Interact Club of Kolhapur website, including API contracts, database models, and frontend-backend integration points.

## Database Models

### 1. User (Admin Authentication)
```python
{
    "_id": ObjectId,
    "email": string,
    "password": string (hashed),
    "name": string,
    "role": string (default: "admin"),
    "created_at": datetime
}
```

### 2. Board Member
```python
{
    "_id": ObjectId,
    "name": string,
    "position": string,
    "email": string,
    "image": string (URL),
    "order": int,
    "created_at": datetime,
    "updated_at": datetime
}
```

### 3. Past Event
```python
{
    "_id": ObjectId,
    "title": string,
    "date": date,
    "description": string,
    "images": [string] (array of URLs),
    "created_at": datetime,
    "updated_at": datetime
}
```

### 4. Upcoming Event
```python
{
    "_id": ObjectId,
    "title": string,
    "date": date,
    "time": string,
    "venue": string,
    "description": string,
    "registration_open": boolean,
    "created_at": datetime,
    "updated_at": datetime
}
```

### 5. News Article
```python
{
    "_id": ObjectId,
    "title": string,
    "date": date,
    "excerpt": string,
    "content": string,
    "image": string (URL),
    "created_at": datetime,
    "updated_at": datetime
}
```

### 6. Gallery Image
```python
{
    "_id": ObjectId,
    "url": string,
    "caption": string,
    "created_at": datetime
}
```

### 7. About Content
```python
{
    "_id": ObjectId,
    "section": string ("story" | "mission" | "vision" | "values"),
    "content": string,
    "updated_at": datetime
}
```

### 8. Contact Info
```python
{
    "_id": ObjectId,
    "address": string,
    "email": string,
    "phone": string (optional),
    "office_hours": string,
    "updated_at": datetime
}
```

## API Endpoints

### Authentication Endpoints
- **POST /api/auth/login** - Admin login
  - Request: `{ email, password }`
  - Response: `{ token, user: { id, email, name } }`
  
- **POST /api/auth/register** - Create admin user (protected, first-time setup)
  - Request: `{ email, password, name }`
  - Response: `{ message, user }`

- **GET /api/auth/me** - Get current user (requires token)
  - Response: `{ id, email, name, role }`

### Board Members Endpoints
- **GET /api/board-members** - Get all board members (public)
- **POST /api/board-members** - Create board member (admin only)
- **PUT /api/board-members/{id}** - Update board member (admin only)
- **DELETE /api/board-members/{id}** - Delete board member (admin only)

### Past Events Endpoints
- **GET /api/events/past** - Get all past events (public)
- **POST /api/events/past** - Create past event (admin only)
- **PUT /api/events/past/{id}** - Update past event (admin only)
- **DELETE /api/events/past/{id}** - Delete past event (admin only)

### Upcoming Events Endpoints
- **GET /api/events/upcoming** - Get all upcoming events (public)
- **POST /api/events/upcoming** - Create upcoming event (admin only)
- **PUT /api/events/upcoming/{id}** - Update upcoming event (admin only)
- **DELETE /api/events/upcoming/{id}** - Delete upcoming event (admin only)

### News Endpoints
- **GET /api/news** - Get all news articles (public)
- **POST /api/news** - Create news article (admin only)
- **PUT /api/news/{id}** - Update news article (admin only)
- **DELETE /api/news/{id}** - Delete news article (admin only)

### Gallery Endpoints
- **GET /api/gallery** - Get all gallery images (public)
- **POST /api/gallery** - Add gallery image (admin only)
- **DELETE /api/gallery/{id}** - Delete gallery image (admin only)

### About Content Endpoints
- **GET /api/about** - Get all about content (public)
- **PUT /api/about/{section}** - Update about section (admin only)

### Contact Endpoints
- **GET /api/contact/info** - Get contact information (public)
- **PUT /api/contact/info** - Update contact info (admin only)
- **POST /api/contact/submit** - Submit contact form (public)

## Authentication Flow

1. Admin logs in with email/password
2. Backend validates credentials, generates JWT token
3. Frontend stores token in localStorage
4. Frontend includes token in Authorization header for protected routes
5. Backend middleware validates token before processing admin requests

## Frontend Integration Points

### Mock Data to Remove
File: `/app/frontend/src/mock.js`
- `boardMembers` → Replace with API call to `/api/board-members`
- `pastEvents` → Replace with API call to `/api/events/past`
- `upcomingEvents` → Replace with API call to `/api/events/upcoming`
- `newsArticles` → Replace with API call to `/api/news`
- `galleryImages` → Replace with API call to `/api/gallery`

### Pages Requiring Backend Integration
1. **Home.jsx** - Fetch upcoming events and news
2. **About.jsx** - Fetch about content (future enhancement)
3. **Events.jsx** - Fetch past events
4. **UpcomingEvents.jsx** - Fetch upcoming events
5. **Board.jsx** - Fetch board members
6. **News.jsx** - Fetch news articles
7. **Contact.jsx** - Submit contact form to API
8. **AdminLogin.jsx** - Authenticate with backend

### New Admin Pages to Create
- **AdminDashboard.jsx** - Overview and navigation
- **AdminEvents.jsx** - Manage past and upcoming events
- **AdminNews.jsx** - Manage news articles
- **AdminBoard.jsx** - Manage board members
- **AdminGallery.jsx** - Manage gallery images
- **AdminAbout.jsx** - Edit about content
- **AdminContact.jsx** - Update contact info

## Implementation Steps

### Phase 1: Backend Foundation
1. Create authentication system with JWT
2. Create MongoDB models and schemas
3. Implement middleware for authentication
4. Create initial admin user setup endpoint

### Phase 2: API Development
1. Implement all CRUD endpoints for each resource
2. Add proper error handling and validation
3. Test endpoints with curl or Postman

### Phase 3: Frontend Integration
1. Create API service layer in frontend
2. Update existing pages to use API instead of mock data
3. Implement admin dashboard and management pages
4. Add authentication context and protected routes

### Phase 4: Testing & Polish
1. Test all CRUD operations
2. Test authentication flow
3. Verify all pages load correctly with real data
4. Handle loading states and errors

## Security Notes
- All passwords hashed with bcrypt
- JWT tokens with expiration
- Admin-only endpoints protected by middleware
- Input validation on all endpoints
- CORS configured for frontend domain

## Free Services Used
- MongoDB (included in stack)
- JWT authentication (Python library - pyjwt)
- Password hashing (Python library - passlib)
- No external paid APIs required
