# 📚 SecureLens — Complete Project Documentation

## Table of Contents
1. Project Overview
2. System Architecture
3. Technology Decisions
4. Backend Deep Dive
5. Chrome Extension Deep Dive
6. Security Implementation
7. Database Design
8. API Reference
9. Deployment Guide
10. Interview Questions and Answers

---

## 1. Project Overview

### What is SecureLens?
SecureLens is a full-stack cybersecurity platform that protects
users from three major modern threats:

1. **Phishing Attacks** — Fake websites that steal credentials
2. **Prompt Injection** — Malicious AI instruction overrides
3. **Sensitive Data Leaks** — Accidental exposure of API keys,
   passwords, and credit card numbers

### Problem Statement
With the rise of AI tools and sophisticated phishing attacks,
users need real-time protection while browsing. Existing solutions
are either too expensive or too complex for everyday users.

### Solution
A lightweight Chrome Extension that runs silently in the background,
analyzing every page the user visits and alerting them to threats
in real time — backed by a secure Spring Boot API.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────┐
│                 USER'S BROWSER                   │
│                                                  │
│  ┌──────────────┐    ┌─────────────────────────┐│
│  │   Any Website│    │   Chrome Extension       ││
│  │              │───▶│   - content.js scans page││
│  │              │    │   - background.js calls  ││
│  │              │    │     backend API          ││
│  └──────────────┘    │   - popup shows results  ││
│                      └────────────┬────────────┘│
└───────────────────────────────────┼─────────────┘
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────┐
│            RAILWAY CLOUD SERVER                  │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │         Spring Boot Backend              │   │
│  │                                          │   │
│  │  JwtFilter → SecurityConfig              │   │
│  │       ↓                                  │   │
│  │  AuthController  DetectionController     │   │
│  │       ↓                ↓                 │   │
│  │  AuthService    DetectionService         │   │
│  │       ↓                ↓                 │   │
│  │  UserRepository  LogRepository           │   │
│  └──────────────┬───────────────────────────┘   │
│                 │                                │
│  ┌──────────────▼───────────────────────────┐   │
│  │         PostgreSQL Database              │   │
│  │  users | detection_logs | subscriptions  │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 3. Technology Decisions

### Why Spring Boot?
- Industry standard for Java REST APIs
- Built-in Spring Security for JWT
- Spring Data JPA reduces boilerplate
- Production ready with minimal config

### Why JWT over Sessions?
- Stateless — no server memory needed
- Works across different domains (extension + dashboard)
- Scales horizontally
- Standard for REST APIs

### Why PostgreSQL?
- ACID compliance for data integrity
- Better for relational data
- Free tier on Railway
- JPA/Hibernate support

### Why Chrome Extension MV3?
- Latest Manifest Version
- Better security model
- Required for Chrome Web Store
- Service Worker for background tasks

### Why Bucket4j for Rate Limiting?
- In-memory — no Redis needed
- Per-IP limiting
- Token bucket algorithm
- Thread safe

---

## 4. Backend Deep Dive

### Request Flow
```
HTTP Request
    ↓
CorsFilter         -- handles CORS headers
    ↓
RateLimiterConfig  -- checks request limit per IP
    ↓
JwtFilter          -- validates JWT token
    ↓
SecurityConfig     -- checks authorization rules
    ↓
Controller         -- handles business logic
    ↓
Service            -- processes data
    ↓
Repository         -- queries database
    ↓
HTTP Response
```

### Key Classes Explained

#### `JwtUtil.java`
Handles all JWT operations:
- `generateToken()` — creates JWT with email as subject
- `isTokenValid()` — checks signature and expiry
- `extractUsername()` — gets email from token
- Uses HMAC-SHA256 signing algorithm
- Secret key loaded from environment variable

#### `SecurityConfig.java`
Configures Spring Security:
- Disables CSRF (not needed for REST)
- Sets session to STATELESS
- Defines public vs protected endpoints
- Adds JwtFilter before authentication
- Configures BCrypt password encoder

#### `DetectionService.java`
Core detection logic:
- Pattern matching for phishing keywords
- Regex for sensitive data (API keys, cards)
- Keyword matching for prompt injection
- Saves all detections to database
- Returns risk level and details

#### `FeatureFlagService.java`
Controls premium features:
- Checks feature name against database
- Verifies user plan (FREE vs PREMIUM)
- Returns boolean availability
- Allows dynamic feature control

---

## 5. Chrome Extension Deep Dive

### File Responsibilities

| File | What It Does |
|---|---|
| `manifest.json` | Defines extension permissions and files |
| `background.js` | Service worker, runs API calls |
| `content.js` | Injects into pages, shows alerts |
| `popup/popup.js` | Controls extension popup UI |
| `services/apiService.js` | All backend API calls |
| `services/authService.js` | Login and register |
| `detectors/*.js` | Local quick checks before API |
| `storage/localStore.js` | Chrome storage management |
| `utils/constants.js` | All config values |

### How Detection Works
```
User visits website
       ↓
content.js extracts URL + page text
       ↓
Sends to background.js via chrome.runtime.sendMessage
       ↓
background.js calls Railway API 3 times in parallel:
  - POST /api/detect (PHISHING)
  - POST /api/detect (PROMPT_INJECTION)
  - POST /api/detect (SENSITIVE_DATA)
       ↓
If threat detected:
  - chrome.tabs.sendMessage → content.js
  - content.js shows alert banner on page
  - Badge icon updates with ! mark
```

---

## 6. Security Implementation

### JWT Token Structure
```
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "user@email.com", "iat": 123, "exp": 456 }
Signature: HMAC-SHA256(header + payload + secret)
```

### BCrypt Password Hashing
```
Plain password:  "mypassword123"
BCrypt output:   "$2a$12$xyz...abc" (60 chars)
Cost factor:     12 (2^12 = 4096 iterations)
Salt:            Automatically generated per password
Verification:    BCrypt.matches(plain, hashed)
```

### Rate Limiting Algorithm
```
Each IP gets a "bucket" with 60 tokens
Every request consumes 1 token
Tokens refill at 60 per minute
If bucket empty → 429 Too Many Requests
Premium users get 300 token bucket
```

### CORS Configuration
```
Allowed origins: Vercel URL, localhost, chrome-extension://*
Allowed methods: GET, POST, PUT, DELETE, OPTIONS
Allowed headers: Authorization, Content-Type
Credentials:     Allowed
```

---

## 7. Database Design

### Entity Relationships
```
User (1) ──── (1) Subscription
User (1) ──── (N) DetectionLog
FeatureFlag   (standalone)
```

### Indexing Strategy
```
users.email          → UNIQUE INDEX (fast login lookup)
detection_logs.user_id → INDEX (fast log retrieval)
feature_flags.feature_name → UNIQUE INDEX
```

---

## 8. API Reference

### Authentication APIs

#### POST /api/auth/register
```json
Request:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGci...",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "USER",
    "plan": "FREE"
  }
}

Response 400:
{
  "success": false,
  "message": "Email already registered"
}
```

#### POST /api/auth/login
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "email": "john@example.com",
    "role": "USER",
    "plan": "FREE"
  }
}

Response 401:
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### POST /api/detect
```json
Headers: Authorization: Bearer <token>

Request:
{
  "url": "http://suspicious-site.com",
  "content": "verify your account immediately",
  "threatType": "PHISHING"
}

Response 200:
{
  "success": true,
  "data": {
    "threatDetected": true,
    "threatType": "PHISHING",
    "riskLevel": "CRITICAL",
    "message": "Phishing threat detected!",
    "details": "Suspicious patterns found",
    "url": "http://suspicious-site.com"
  }
}
```

---

## 9. Deployment Guide

### Backend (Railway)
```
Platform:     Railway.app
Runtime:      Java 21
Build:        mvn clean package -DskipTests
Start:        java -Dspring.profiles.active=prod -jar target/backend-1.0.0.jar
Database:     Railway PostgreSQL (same project)
Live URL:     https://securelens.up.railway.app
```

### Environment Variables on Railway
```
SPRING_PROFILES_ACTIVE = prod
JWT_SECRET             = (256-bit secret key)
PGHOST                 = (Railway internal host)
PGPORT                 = 5432
PGDATABASE             = railway
PGUSER                 = postgres
PGPASSWORD             = (Railway generated password)
FRONTEND_URL           = https://securelens-dashboard.vercel.app
```

### Chrome Extension
```
Load locally:  chrome://extensions/ → Load Unpacked
Production:    Chrome Web Store (after review)
```

---

## 10. Interview Questions and Answers

### Q: Why did you choose Spring Boot for the backend?
**A:** Spring Boot provides a production-ready framework with
built-in support for REST APIs, security, and database access.
Spring Security made JWT implementation straightforward, and
Spring Data JPA reduced boilerplate database code significantly.
The embedded Tomcat server simplified deployment to Railway.

### Q: How does JWT authentication work in your project?
**A:** When a user logs in, the backend validates credentials,
then generates a JWT token signed with HMAC-SHA256 using a
secret key. The token contains the user's email as the subject
and expires in 24 hours. Every subsequent request includes this
token in the Authorization header. The JwtFilter intercepts all
requests, validates the token signature and expiry, and sets the
authentication in Spring Security's SecurityContext.

### Q: How did you implement rate limiting?
**A:** I used Bucket4j, a token bucket algorithm library. Each
IP address gets its own bucket with 60 tokens. Every API request
consumes one token. Tokens refill at 60 per minute. When the
bucket is empty, the request is rejected with HTTP 429. I stored
buckets in a ConcurrentHashMap for thread safety.

### Q: How does the Chrome Extension detect threats?
**A:** The content.js script runs on every page and extracts the
URL and page text. It sends this to background.js via Chrome's
messaging API. The background service worker calls the Spring Boot
backend three times in parallel — once for each threat type. If
a threat is detected, it sends a message back to content.js which
injects an alert banner into the page.

### Q: Why did you use BCrypt with strength 12?
**A:** BCrypt is a one-way hashing algorithm designed for
passwords. The strength factor 12 means 2^12 iterations, making
brute force attacks computationally expensive. Even if the database
is compromised, attackers can't reverse the hashes to get plain
passwords. Spring Security's BCryptPasswordEncoder handles the
salt generation automatically.

### Q: How does the freemium model work technically?
**A:** I implemented a FeatureFlag system with a database table
that maps feature names to boolean flags and premium-only status.
The FeatureFlagService checks if a feature is enabled and whether
the requesting user's plan meets the requirement. The Subscription
model tracks plan type, status, and dates. Upgrading updates both
the User entity and Subscription record.

### Q: What challenges did you face?
**A:** The main challenges were:
1. Hibernate lazy loading — solved with @Transactional and DTOs
2. Railway PostgreSQL connection — solved with separate PG
   environment variables instead of DATABASE_URL
3. Chrome Extension CORS — solved with proper CorsConfig
4. JWT filter blocking public endpoints — solved with explicit
   PUBLIC_PATHS list in JwtFilter

### Q: How would you scale this application?
**A:** For scaling I would:
1. Add Redis for distributed rate limiting
2. Implement horizontal scaling with load balancer
3. Add database connection pooling optimization
4. Use async processing for email alerts
5. Add caching for feature flags
6. Implement refresh tokens for better security
7. Add monitoring with Spring Actuator

### Q: What is Manifest V3 in Chrome Extensions?
**A:** Manifest V3 is the latest Chrome Extension specification.
Key changes from V2 include replacing background pages with service
workers for better performance and security, restricting remote
code execution, and improving privacy. I used MV3 because it is
required for new Chrome Web Store submissions and provides better
security isolation.

### Q: How did you handle exceptions globally?
**A:** I created a GlobalExceptionHandler class annotated with
@RestControllerAdvice. It has @ExceptionHandler methods for
different exception types — validation errors return 400 with
field details, BadCredentialsException returns 401, RuntimeException
returns 400 with the message, and all other exceptions return 500
with a generic message. This ensures consistent error response
format across all endpoints.
