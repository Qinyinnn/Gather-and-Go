# Gather&Go - UI Design Final Project

A vanilla JavaScript web application for coordinating group travel plans with Firebase backend.

## 📋 Project Overview

Gather&Go helps groups plan trips together by coordinating:

- Member availability
- Budget preferences
- Trip recommendations

## 🚀 How to Run

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Firebase account (for backend services)
- A local development server

### Instructions to Run the Program

1. **Set up Firebase**

   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Firestore Database in your Firebase project
   - Copy your Firebase configuration
   - Paste the config values into `firebase/firebase-config.js`

2. **Start a local server**

   The project requires a local server to run properly (Firebase won't work with `file://` protocol).

   **Option A: Python HTTP Server** (Recommended)

   ```bash
   # Navigate to project directory
   cd Gather-and-Go

   # Start server on port 8000
   python3 -m http.server 8000
   ```

   Then open http://localhost:8000 in your browser

   **Option B: VS Code Live Server**

   ```bash
   # Install Live Server extension in VS Code
   # Right-click index.html → "Open with Live Server"
   ```

   **Option C: Node.js http-server**

   ```bash
   # Install globally
   npm install -g http-server

   # Run in project directory
   http-server -p 8000
   ```

3. **Open the application**
   - Navigate to http://localhost:8000 in your browser
   - Start building your features!

## 📁 Project Structure

```
Gather-and-Go/
├── index.html              # Main entry page
├── styles.css              # Global styles
├── main.js                 # Main JavaScript logic
├── pages/                  # Feature-specific HTML pages
│   ├── availability.html
│   ├── budget.html
│   └── recommendations.html
├── scripts/                # Feature-specific JavaScript modules
│   ├── availability.js
│   ├── budget.js
│   └── recommendations.js
├── firebase/               # Firebase configuration and initialization
│   ├── firebase-config.js
│   └── firebase-init.js
└── assets/                 # Images, icons, and other media
```

## 🛠️ Tools and Technologies Used

### Core Technologies

- **HTML5** - Structure and markup
- **CSS3** - Styling and layout
- **JavaScript (ES6+)** - Client-side logic and interactivity
- **Firebase SDK v10.7.1** - Backend services

### Firebase Services

- **Firestore Database** - Real-time NoSQL database for storing trip data, user availability, budgets, and votes
- **Firebase App** - Core Firebase initialization and configuration

### Development Tools

- **VS Code** - Code editor
- **Live Server** / **Python HTTP Server** - Local development server
- **Chrome DevTools** - Debugging and testing

### Design Philosophy

- **Vanilla JavaScript** - No frameworks (React, Vue, etc.) to keep it simple and lightweight
- **No Build Tools** - No Webpack, Vite, or npm required
- **CDN Delivery** - Firebase SDK loaded directly from Google's CDN
- **Mobile-Responsive** - CSS Grid and Flexbox for responsive layouts

## 🙏 Acknowledgments

### External Libraries and Resources

- **Firebase** - Backend-as-a-Service platform by Google
  - Documentation: https://firebase.google.com/docs
  - CDN: https://www.gstatic.com/firebasejs/

### Image Sources

- **Unsplash** - Free stock photos for destination images
  - https://unsplash.com
  - Photographers: Unsplash community contributors

### Educational Resources

- **MDN Web Docs** - HTML, CSS, and JavaScript references
  - https://developer.mozilla.org/
- **Firebase Documentation** - Firebase setup and API guides
  - https://firebase.google.com/docs/web/setup
