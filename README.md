# 🔐 SecureLens — Cybersecurity Platform

![SecureLens Banner](https://img.shields.io/badge/SecureLens-Cybersecurity-00d4ff?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?style=for-the-badge)

A full-stack cybersecurity platform that detects and prevents
phishing attacks, prompt injection, and sensitive data leaks
in real time using a Chrome Extension and Spring Boot backend.

---

## 🏗️ Architecture
Chrome Extension → Spring Boot REST API → PostgreSQL Database
↑
React Dashboard
---

## 🧠 Core Features

### 🔐 Authentication
- JWT-based stateless authentication
- BCrypt password hashing (strength 12)
- Protected API endpoints
- Token expiry and refresh

### 🌐 Chrome Extension
- Real-time phishing website detection
- Prompt injection attack detection
- Sensitive data leak prevention
- Visual threat alerts on page
- Extension popup with dashboard
- Login and register from extension

### ⚙️ Backend (Spring Boot)
- RESTful API with Spring MVC
- Spring Security with JWT filter
- Subscription system (Free vs Premium)
- Feature flag system
- Rate limiting with Bucket4j
- Global exception handling
- Detection logging to PostgreSQL

### 📊 React Dashboard
- Login and Register pages
- Detection logs with risk levels
- Threat analytics charts
- Pricing page with upgrade flow
- Protected routes with JWT

---

## 💰 Freemium Model

| Feature | Free | Premium |
|---|---|---|
| Basic Phishing Detection | ✅ | ✅ |
| Prompt Injection Detection | ✅ | ✅ |
| Sensitive Data Detection | ✅ | ✅ |
| Advanced AI Detection | ❌ | ✅ |
| Full Detection History | ❌ | ✅ |
| Real-time Monitoring | ❌ | ✅ |
| API Rate Limit | 60/min | 300/min |

---

## ⚙️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Programming language |
| Spring Boot | 3.2.0 | Backend framework |
| Spring Security | 6.x | Authentication |
| Spring Data JPA | 3.x | Database ORM |
| PostgreSQL | 17 | Database |
| JWT (jjwt) | 0.12.3 | Token authentication |
| BCrypt | - | Password hashing |
| Bucket4j | 8.7.0 | Rate limiting |
| Lombok | 1.18.30 | Code generation |
| Maven | 3.9.x | Build tool |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| React Router | 6 | Navigation |
| Axios | 1.6 | HTTP client |
| Recharts | 2.10 | Charts |
| Chrome Extension | MV3 | Browser extension |

### DevOps
| Tool | Purpose |
|---|---|
| Railway | Backend hosting |
| Vercel | Frontend hosting |
| GitHub | Version control |
| pgAdmin | Database management |

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| Backend API | https://securelens.up.railway.app |
| Web Dashboard | https://securelens-dashboard.vercel.app |
| Health Check | https://securelens.up.railway.app/api/health |

---

## 📁 Project Structure
SecureLens/
│
├── backend-java/                    # Spring Boot Backend
│   └── src/main/java/com/securelens/backend/
│       ├── config/                  # Security, JWT, CORS, Rate limiting
│       ├── controller/              # REST API endpoints
│       ├── service/                 # Business logic
│       ├── repository/              # Database access
│       ├── model/                   # Database entities
│       ├── dto/                     # Data transfer objects
│       │   ├── request/             # API request bodies
│       │   └── response/            # API response bodies
│       ├── security/                # JWT utilities
│       ├── exception/               # Global error handling
│       └── util/                    # Helper classes
│
├── frontend-extension/              # Chrome Extension
│   ├── manifest.json                # Extension config
│   ├── background.js                # Service worker
│   ├── content.js                   # Page scanner
│   ├── popup/                       # Extension popup UI
│   ├── services/                    # API calls
│   ├── detectors/                   # Threat detection logic
│   ├── storage/                     # Local storage
│   └── utils/                       # Helper functions
│
├── web-dashboard/                   # React Dashboard
│   └── src/
│       ├── pages/                   # Login, Register, Dashboard, Pricing
│       ├── components/              # Navbar, ProtectedRoute, Charts
│       ├── services/                # API and auth services
│       └── context/                 # Auth context
│
└── docs/                            # Documentation
---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |

### Detection
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/detect | Analyze content | Yes |
| GET | /api/detect/logs | Get detection logs | Yes |
| GET | /api/detect/stats | Get statistics | Yes |

### User
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/user/profile | Get profile | Yes |
| PUT | /api/user/profile | Update profile | Yes |
| PUT | /api/user/change-password | Change password | Yes |

### Subscription
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/subscription | Get subscription | Yes |
| POST | /api/subscription/upgrade | Upgrade to premium | Yes |
| POST | /api/subscription/downgrade | Downgrade to free | Yes |
| GET | /api/subscription/status | Check plan status | Yes |

### Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/admin/users | Get all users | Admin |
| DELETE | /api/admin/users/{id} | Deactivate user | Admin |
| GET | /api/admin/stats | Platform statistics | Admin |

---

## 🔐 Security Implementation

### JWT Authentication Flow
User registers/logs in
Backend validates credentials
Backend generates JWT token (24hr expiry)
Client stores token in localStorage
Every request sends token in Authorization header
JwtFilter validates token on every request
Invalid/expired tokens return 401
### Password Security

User sends plain password
BCrypt hashes password with strength 12
Hashed password stored in database
Login: BCrypt compares plain vs hashed
Original password never stored

### Rate Limiting
Free users:    60 requests per minute
Premium users: 300 requests per minute
Exceeded:      429 Too Many Requests
Implementation: Bucket4j with ConcurrentHashMap per IP
---

## 🛠️ Local Setup Guide

### Prerequisites
Java 21+
Maven 3.9+
PostgreSQL 17+
Node.js 18+
Chrome Browser
### Backend Setup
```bash
# 1. Clone repository
git clone https://github.com/kishorekumar121005/SecureLens.git
cd SecureLens/backend-java

# 2. Create database
psql -U postgres -c "CREATE DATABASE securelens_db;"

# 3. Configure application
cp src/main/resources/application.example.yml \
   src/main/resources/application.yml
# Edit application.yml with your PostgreSQL password

# 4. Run backend
mvn spring-boot:run

# 5. Test
curl http://localhost:8080/api/health
```

### Chrome Extension Setup
Open Chrome
Go to chrome://extensions/
Enable Developer Mode
Click Load Unpacked
Select frontend-extension/ folder
Click SecureLens icon in toolbar
Register and login
### React Dashboard Setup
```bash
cd SecureLens/web-dashboard
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🗄️ Database Schema

### Users Table
```sql
id          BIGSERIAL PRIMARY KEY
email       VARCHAR(255) UNIQUE NOT NULL
password    VARCHAR(255) NOT NULL  -- BCrypt hashed
full_name   VARCHAR(255) NOT NULL
role        VARCHAR(50) DEFAULT 'USER'
plan        VARCHAR(50) DEFAULT 'FREE'
is_active   BOOLEAN DEFAULT TRUE
created_at  TIMESTAMP DEFAULT NOW()
updated_at  TIMESTAMP DEFAULT NOW()
```

### Detection Logs Table
```sql
id           BIGSERIAL PRIMARY KEY
user_id      BIGINT REFERENCES users(id)
threat_type  VARCHAR(50)  -- PHISHING, PROMPT_INJECTION, SENSITIVE_DATA
url          VARCHAR(500)
details      TEXT
risk_level   VARCHAR(20)  -- LOW, MEDIUM, HIGH, CRITICAL
detected_at  TIMESTAMP DEFAULT NOW()
```

### Subscriptions Table
```sql
id          BIGSERIAL PRIMARY KEY
user_id     BIGINT REFERENCES users(id)
plan        VARCHAR(50) DEFAULT 'FREE'
status      VARCHAR(50) DEFAULT 'ACTIVE'
start_date  TIMESTAMP
end_date    TIMESTAMP
created_at  TIMESTAMP DEFAULT NOW()
```

### Feature Flags Table
```sql
id            BIGSERIAL PRIMARY KEY
feature_name  VARCHAR(100) UNIQUE
description   VARCHAR(255)
is_enabled    BOOLEAN DEFAULT TRUE
premium_only  BOOLEAN DEFAULT FALSE
```

---

## 👨‍💻 Developer

**Kishore Kumar S**
B.Tech — Artificial Intelligence and Data Science
Rajalakshmi Institute of Technology, Chennai

---

## 📄 License

This project is licensed under the MIT License.