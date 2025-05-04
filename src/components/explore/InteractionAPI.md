# Interaction System API Endpoints

This document outlines the API endpoints required for the Innov8mate interaction system, which enables users to connect with content creators based on content categories.

## Base URL

All API endpoints are prefixed with `/api/v1`

## Authentication

All endpoints require authentication via cookies or JWT tokens in the Authorization header.

```
Authorization: Bearer <token>
```

## Endpoints

### Interaction Management

#### Create a new interaction

```
POST /interactions
```

**Request Body:**

```json
{
  "recipientId": "user123",
  "contentId": "reel456",
  "contentType": "startup",
  "interactionType": "invest",
  "message": "Hello, I'm interested in discussing investment opportunities for your startup..."
}
```

**Response:**

```json
{
  "success": true,
  "interaction": {
    "id": "interaction789",
    "senderId": "currentUserId",
    "recipientId": "user123",
    "contentId": "reel456",
    "contentType": "startup",
    "interactionType": "invest",
    "status": "pending",
    "timestamp": "2023-05-15T14:30:00Z",
    "conversation": [
      {
        "sender": "viewer",
        "text": "Hello, I'm interested in discussing investment opportunities for your startup...",
        "timestamp": "2023-05-15T14:30:00Z"
      }
    ]
  }
}
```

#### Get interactions (as creator)

```
GET /interactions
```

**Query Parameters:**

- `status` (optional): Filter by status (pending, accepted, rejected, archived, completed)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**

```json
{
  "success": true,
  "interactions": [
    {
      "id": "interaction789",
      "sender": {
        "id": "user456",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg",
        "verified": true,
        "role": "Investor"
      },
      "contentId": "reel123",
      "contentType": "startup",
      "contentTitle": "My Amazing Startup",
      "interactionType": "invest",
      "status": "pending",
      "timestamp": "2023-05-15T14:30:00Z",
      "conversation": [
        {
          "sender": "viewer",
          "text": "Hello, I'm interested in discussing investment opportunities for your startup...",
          "timestamp": "2023-05-15T14:30:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### Get interactions (as viewer)

```
GET /interactions/sent
```

**Query Parameters:**

- `status` (optional): Filter by status
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:** Same structure as creator interactions, but showing outgoing interactions

#### Get a single interaction by ID

```
GET /interactions/:interactionId
```

**Response:**

```json
{
  "success": true,
  "interaction": {
    "id": "interaction789",
    "sender": {
      "id": "user456",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "verified": true,
      "role": "Investor"
    },
    "recipient": {
      "id": "user123",
      "name": "Jane Smith",
      "avatar": "https://example.com/avatar2.jpg",
      "verified": true,
      "role": "Entrepreneur"
    },
    "contentId": "reel123",
    "contentType": "startup",
    "contentTitle": "My Amazing Startup",
    "interactionType": "invest",
    "status": "pending",
    "timestamp": "2023-05-15T14:30:00Z",
    "conversation": [
      {
        "sender": "viewer",
        "text": "Hello, I'm interested in discussing investment opportunities for your startup...",
        "timestamp": "2023-05-15T14:30:00Z"
      }
    ]
  }
}
```

#### Reply to an interaction

```
POST /interactions/:interactionId/reply
```

**Request Body:**

```json
{
  "message": "Thank you for your interest! I would be happy to discuss investment opportunities..."
}
```

**Response:**

```json
{
  "success": true,
  "message": {
    "sender": "creator",
    "text": "Thank you for your interest! I would be happy to discuss investment opportunities...",
    "timestamp": "2023-05-15T15:00:00Z"
  }
}
```

#### Update interaction status

```
PATCH /interactions/:interactionId/status
```

**Request Body:**

```json
{
  "status": "accepted"
}
```

**Response:**

```json
{
  "success": true,
  "interaction": {
    "id": "interaction789",
    "status": "accepted",
    "updatedAt": "2023-05-15T15:30:00Z"
  }
}
```

#### Delete an interaction

```
DELETE /interactions/:interactionId
```

**Response:**

```json
{
  "success": true,
  "message": "Interaction deleted successfully"
}
```

### Notification System

#### Get notifications

```
GET /notifications
```

**Query Parameters:**

- `read` (optional): Filter by read status (true/false)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**

```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif123",
      "type": "interaction_new",
      "title": "New Connection Request",
      "message": "John Doe wants to connect regarding your startup pitch",
      "read": false,
      "timestamp": "2023-05-15T14:30:00Z",
      "actionUrl": "/inbox/interaction789",
      "actionText": "View message"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### Mark notification as read

```
PATCH /notifications/:notificationId/read
```

**Response:**

```json
{
  "success": true,
  "notification": {
    "id": "notif123",
    "read": true
  }
}
```

#### Mark all notifications as read

```
POST /notifications/mark-all-read
```

**Response:**

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

#### Delete notification

```
DELETE /notifications/:notificationId
```

**Response:**

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

## Interactive Elements by Content Type

The following interaction types are available based on the content type:

### Startup Pitches

- `invest`: Investment Interest
- `mentor`: Offer Mentorship
- `demo`: Request Demo

### Innovation Ideas

- `feedback`: Provide Feedback
- `connect`: Connect & Discuss
- `resource`: Share Resources

### Collaboration Requests

- `join`: Join Project
- `partner`: Propose Partnership
- `connect`: Make Introductions

### Product Demos

- `feedback`: Give Feedback
- `try`: Request Access
- `feature`: Suggest Features

### Founder Stories

- `connect`: Connect & Share
- `introduce`: Make Introduction
- `learn`: Request Mentorship

### Funding Rounds

- `invest`: Discuss Investment
- `intro`: Investor Introduction
- `advise`: Fundraising Advice

## Notification Types

- `interaction_new`: Received a new interaction request
- `interaction_accepted`: Your interaction request was accepted
- `interaction_rejected`: Your interaction request was rejected
- `content_upvote`: Someone upvoted your content
- `content_comment`: Someone commented on your content
- `investment_interest`: Someone expressed investment interest
- `mentor_request`: Someone requested or offered mentorship
- `demo_request`: Someone requested a demo
- `connection_request`: Someone requested to connect
- `resource_share`: Someone shared resources with you
- `partnership_offer`: Someone offered partnership
- `system`: System notification
