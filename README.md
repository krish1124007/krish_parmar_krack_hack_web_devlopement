# Aegis Learning Management System

Welcome to the Aegis project! This guide will help you set up and run the application locally on your machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or a cloud URI)
- Git

## Project Structure

- **backend/**: Express.js API server
- **frontend/aegis/**: React.js + Vite frontend application

---

## 🚀 Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a new file named `.env` in the `backend` directory and add the following contents. Update the values as needed.

    ```env
    PORT=8000
    # MongoDB Connection String (Localhost example)
    DB_URL=mongodb://localhost:27017/AEGIS
    # Cloudinary Config (for file uploads)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    # JWT Secret
    JWT_SECRET=your_secret_key_here
    ```

4.  **Run the Backend Server:**
    ```bash
    npm run dev
    ```
    The server should start on `http://localhost:8000`.

    > **Note:** On first startup, if no Admin exists, the system will automatically create a default admin account:
    > - **Email:** `admin@gmail.com`
    > - **Password:** `admin`

---

## 💻 Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend/aegis
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a new file named `.env` in the `frontend/aegis` directory. **This is crucial for connecting to your local backend.**

    ```env
    VITE_API_BASE_URL=http://localhost:8000
    ```

4.  **Run the Frontend Application:**
    ```bash
    npm run dev
    ```
    The application will typically run on `http://localhost:5173`.

---

## 🔑 Login Features & Credentials

To make testing easier, the Login page is equipped with auto-fill features:

### Admin Login
- Select the **Admin** tab.
- The credentials `admin@gmail.com` / `admin` will be auto-filled.

### Student & Faculty Login
- Select the **Student** or **Faculty** tab.
- Type any email address (e.g., `john@example.com`).
- The password field will **automatically populate** using the formula: `First 3 letters of email` + `@123` (e.g., `joh@123`).

### Authority Login
- Standard login (no auto-fill).

---

## 📄 API Documentation

An OpenAPI specification file is available in the root directory: `openapi.json`.
You can import this file into tools like **Requestly** or **Postman** to explore and test the API endpoints manually.
