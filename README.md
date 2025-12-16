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
   - Enable Firestore Database in your Firebase project (Start in **test mode** for development)
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

3. **First-time setup: Load data to Firebase**

   - Navigate to `pages/recommendations.html`
   - Click the **"🚀 Load Events to Firebase"** button
   - This seeds your Firestore database with 10 event recommendations
   - Page will refresh automatically

4. **Test the app**

   - Click stars to rate events (1-5 stars)
   - Ratings and votes are **persisted to Firestore**
   - Refresh the page - your data stays!
   - Open in another browser/tab - votes are synced

   ````

   **Option C: Node.js http-server**

   ```bash
   # Install globally
   npm install -g http-server

   # Run in project directory
   http-server -p 8000
   ````

5. **Open the application**
   - Navigate to http://localhost:8000 in your browser
   - Start building your features!

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
