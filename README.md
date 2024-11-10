# Employee Admin Application

This project is a full-stack employee management application that allows for creating, updating, and managing employee data. The application is divided into two main sections: the admin-client (frontend) and server (backend).

## Project Structure

```
├── README.md                    # Main README file
├── admin-client                 # Frontend application
│   ├── README.md                # Frontend-specific README
│   ├── eslint.config.js         # ESLint configuration file
│   ├── index.html               # HTML entry point for the frontend
│   ├── package-lock.json        # Dependency lock file
│   ├── package.json             # Frontend dependencies and scripts
│   ├── public
│   │   └── vite.svg             # Vite default SVG
│   ├── src
│   │   ├── App.css              # Global CSS for the application
│   │   ├── App.jsx              # Main App component
│   │   ├── assets               # Static assets
│   │   │   ├── Logo.svg         # Application logo
│   │   │   └── react.svg        # React logo
│   │   ├── components           # React components
│   │   │   ├── CreateEmployee.jsx   # Form to add a new employee
│   │   │   ├── Dashboard.jsx        # Main dashboard for viewing data
│   │   │   ├── EditEmployeeDialog.jsx # Dialog to edit employee details
│   │   │   ├── EmployeeList.jsx      # List of employees
│   │   │   ├── SignIn.jsx            # Sign-in component
│   │   │   └── SignUp.jsx            # Sign-up component
│   │   ├── config.js              # Configuration file for frontend
│   │   ├── index.css              # Base styles for the app
│   │   └── main.jsx               # Entry point for the React app
│   └── vite.config.js             # Vite configuration file for build optimization
└── server                         # Backend server
    ├── assets
    │   └── images                 # Image assets used on the server
    ├── db
    │   └── db.js                  # Database connection and schema setup
    ├── index.js                   # Main server entry point
    ├── middlewares
    │   ├── auth.js                # Middleware for authentication
    │   └── upload.js              # Middleware for handling file uploads
    ├── package-lock.json          # Dependency lock file
    ├── package.json               # Backend dependencies and scripts
    └── routes
        └── admin.js               # Admin-specific routes

```

### Installation and Setup

#### Prerequisites

- Node.js and npm
- MongoDB for database storage

### Configure environment variables

Create a .env file in the server directory to store necessary configuration values, such as the MongoDB URI, JWT secret, email credentials, etc.

Example .env:

```
SECRET=<Your JWT SECRET>
MONGO_USER=<Your Mongo Username>
MONGO_PASSWORD=<Your Mongo password>
GMAIL_USER = <GMAIL_USER> # For Nodemailer to send mails
GMAIL_PASS = <GMAIL_PASS>
```

### Backend Setup

- Navigate to the server directory:

```
cd server
```

- Install backend dependencies:

```
npm install

```

- Start the backend server:

```
node index.js
```

#### Frontend Setup

- Navigate to the admin-client directory

```
cd admin-client
```

- Install frontend dependencies:

```
npm install
```

- Start the frontend development server:

```
npm run dev

```

### Running Both Frontend and Backend Simultaneously

```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "cd ../admin-client && npm i && npm run build && rm -rf ../server/public && mkdir -p ../server/public && mv ./dist/* ../server/public && cd ../server && node index.js"
  },
```

```
[Run simultaneously frontend & backend -  http://localhost:3000]
npm run start

```

### Usage

- Access the frontend at http://localhost:5173
- Access the backend at http://localhost:3000

### Project Features

#### Frontend (admin-client)

- **Authentication:** Sign in and sign-up components for user access control.
- **Employee Management:** Create, edit, and view a list of employees.
- **Dashboard Interface:** A main dashboard for managing employee-related data.

#### Backend (server)

- **API Routes:** Contains all backend routes under /routes/admin.js to handle admin functionalities.
- **Database Integration:** MongoDB connection via db/db.js to persist employee data.
- **Middleware:** Authentication (auth.js) and file upload (upload.js) middlewares.
