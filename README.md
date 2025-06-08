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
-   **`dwg2svg` (LibreDWG):** The core command-line utility used for converting DWG files to SVG. See "Critical Prerequisite" section below.

### Frontend
-   **React:** JavaScript library for building user interfaces.
-   **Axios:** Promise-based HTTP client for making API requests to the backend.
-   **DOMParser API:** Used to parse SVG strings for layer extraction.
-   **XMLSerializer API:** Used to serialize modified SVG DOM back to a string.

## Critical Prerequisite: `dwg2svg` (LibreDWG)

For the core functionality of converting .dwg files to .svg, this application relies on the `dwg2svg` command-line utility, which is part of the LibreDWG package. **You must install LibreDWG and ensure `dwg2svg` is in your system's PATH for the backend to work correctly.**

**Installation Instructions:**

*   **Linux (Debian/Ubuntu-based):**
    ```bash
    sudo apt-get update
    sudo apt-get install libredwg-tools
    # Or for older versions/different naming:
    # sudo apt-get install dwg2svg
    ```
    *(Note: Package names might vary slightly depending on your distribution version. Check your package manager for `libredwg` related packages.)*

*   **Linux (Fedora-based):**
    ```bash
    sudo dnf install libredwg
    # This usually includes dwg2svg. If not, look for libredwg-tools or similar.
    ```

*   **macOS (using Homebrew):**
    ```bash
    brew install libredwg
    ```

*   **Windows:**
    LibreDWG is primarily developed for Unix-like systems. For Windows, you might consider:
    1.  Using Windows Subsystem for Linux (WSL) and installing LibreDWG within your WSL environment.
    2.  Attempting to compile LibreDWG from source using a compatibility layer like MinGW or Cygwin (this can be complex).

*   **Compiling from Source (All Platforms):**
    If pre-compiled packages are not available or suitable, you can compile LibreDWG from source. Download the latest release from the [official GNU LibreDWG page](https://www.gnu.org/software/libredwg/) (or its Savannah project page) and follow the compilation instructions (usually involving `./configure`, `make`, `sudo make install`). This typically requires build essentials (gcc, make, etc.) and other development libraries.

**Verify Installation:**
After installation, open a new terminal window and type:
```bash
dwg2svg --version
```
If it's installed correctly and in your PATH, you should see version information. If you get a "command not found" error, ensure your PATH environment variable includes the directory where `dwg2svg` was installed.

## Setup and Running the Application

You will need Node.js and npm installed on your system. **Ensure `dwg2svg` is installed and accessible as described above before proceeding with the backend setup.**

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

**Note on DWG Conversion:** The backend `server.js` is now configured to use `dwg2svg`. If this tool is not installed or not found in the system PATH, the DWG to SVG conversion will fail. The placeholder note has been removed as the application now directly attempts to use `dwg2svg`.
