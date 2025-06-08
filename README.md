# DWG Web Viewer

This project is a web application designed to load and display .dwg files in a browser. It features a frontend built with React and a backend built with Node.js and Express.js. The application allows users to upload a DWG file, which is then converted to SVG on the server and rendered in the browser. A sidebar allows users to toggle the visibility of layers if the DWG file contains them and the conversion process preserves them.

## High-Level Architecture

The application follows a client-server architecture:

-   **Frontend:** A React single-page application (SPA) responsible for user interaction, file uploading, and rendering the SVG output.
-   **Backend:** A Node.js server using the Express.js framework. It handles DWG file uploads, orchestrates the conversion of DWG files to SVG format using an external command-line tool, and serves the SVG data back to the frontend.

## Technologies and Libraries Used

### Backend
-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Web application framework for Node.js, used for routing and handling API requests.
-   **Multer:** Middleware for handling `multipart/form-data`, used for file uploads.
-   **Command-Line DWG to SVG Converter:** ( Placeholder - to be replaced with a specific tool like dwg2svg / Teigha File Converter etc. ) An external tool is expected to be called by the backend to perform the DWG to SVG conversion.

### Frontend
-   **React:** JavaScript library for building user interfaces.
-   **Axios:** Promise-based HTTP client for making API requests to the backend.
-   **DOMParser API:** Used to parse SVG strings for layer extraction.
-   **XMLSerializer API:** Used to serialize modified SVG DOM back to a string.

## Setup and Running the Application

You will need Node.js and npm installed on your system.

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the backend server (defaults to port 3001)
node server.js
# Or, if you have nodemon installed for automatic restarts during development:
# nodemon server.js
```
The backend server will be running on `http://localhost:3001`.

### 2. Frontend Setup

```bash
# Navigate to the frontend directory from the project root
cd frontend

# Install dependencies
npm install

# Start the React development server (defaults to port 3000)
npm start
```
The frontend development server will open automatically in your browser at `http://localhost:3000`.

### 3. Using the Application
-   Once both servers are running, open your browser and navigate to `http://localhost:3000`.
-   Use the file input to select a `.dwg` file.
-   Click "Upload DWG" to upload and view the file.

**Note on DWG Conversion:** The current version uses a placeholder for DWG to SVG conversion on the backend. For full functionality with actual DWG files, this placeholder needs to be replaced with a functional DWG to SVG conversion tool integrated into `backend/server.js`.
