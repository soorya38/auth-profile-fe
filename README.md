# Profile Authentication App - Frontend

A modern React Native application built with Expo, featuring authentication, user profiles, and responsive design for web, and mobile platforms.
Time spent: 1 day
### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Backend API** running at `http://localhost:8000` (see Backend setup)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run web      # Web browser
npm run ios      # iOS simulator
npm run android  # Android emulator
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file (optional - defaults are configured):

```env
# API Configuration
API_BASE_URL=http://localhost:8000

# Platform-specific settings handled automatically
```

### Backend Connection

The app connects to the FastAPI backend at `http://localhost:8000`. Ensure the backend is running before starting the frontend.

**Backend Requirements:**
- FastAPI server running on port 8000
- MySQL database with user profiles table
- CORS enabled for `http://localhost:8081` and `http://localhost:8082`

## Project Structure

```
app/
├── (tabs)/              # Tab-based navigation
│   ├── _layout.tsx      # Tab navigator configuration
│   ├── index.tsx        # Auto-redirect to profile
│   └── profile.tsx      # User profile screen
├── _layout.tsx          # Root layout with theme provider
├── login.tsx            # Login screen
├── signup.tsx           # Signup screen
├── edit-profile.tsx     # Edit profile screen
└── settings.tsx         # Settings screen

components/
├── ui/
│   └── icon-symbol.tsx  # Cross-platform icon component
└── haptic-tab.tsx       # Tab with haptic feedback

hooks/
└── use-responsive.tsx   # Responsive design hook (768px breakpoint)

services/
└── api.ts               # Centralized API client with Axios

constants/
└── theme.ts             # Theme colors and design tokens
```

## Key Features

### Authentication
- **Secure Login/Signup** with JWT tokens
- **Token Storage** using `expo-secure-store`
- **Auto-navigation** post-authentication
- **Logout** functionality with token cleanup

### Profile Management
- **View Profile** with avatar, name, email, and bio
- **Edit Profile** with real-time validation
- **Profile Strength Indicator** based on completeness
- **Dynamic Avatars** using UI Avatars API

### Responsive Design
- **Adaptive Layouts** for mobile (<768px) and desktop (≥768px)
- **Centered Cards** with max-width constraints on desktop
- **Touch-optimized** UI for mobile devices
- **Keyboard-aware** forms with proper behavior

## 🛠️ Technologies

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React Native + Expo | Cross-platform mobile/web development |
| **Routing** | Expo Router | File-based navigation |
| **HTTP Client** | Axios | API requests with interceptors |
| **Storage** | Expo Secure Store | Encrypted token storage |
| **Icons** | Material Icons | Consistent iconography |
| **Styling** | StyleSheet | React Native styling |
| **Language** | TypeScript | Type safety |

## Screens Overview

### Login Screen
- Email and password validation
- Show/hide password toggle
- Error handling with visual feedback
- Desktop: Two-column layout with branding

### Signup Screen
- Name, email, and password inputs
- Password strength indicator
- Real-time email validation
- Redirects to login after successful signup

### Profile Screen
- Display user avatar, name, email, and bio
- "Edit Profile" and "Log Out" buttons
- Responsive card layout
- Dynamic avatar based on user initials

### Edit Profile Screen
- Update name and bio (email read-only)
- Profile strength calculator
- Character counter for bio (150 max)
- Auto-redirect after successful save

### Settings Screen
- App preferences (notifications, dark mode)
- Account settings (privacy, security)
- Legal links (terms, privacy policy)
- Logout option

## Development

### Building for Production
```bash
# Web
npm run build:web

# iOS
npm run build:ios

# Android
npm run build:android
```

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/signup` | POST | User registration |
| `/auth/login` | POST | User authentication |
| `/profile/me` | GET | Fetch current user profile |
| `/profile/me` | PUT | Update user profile |
