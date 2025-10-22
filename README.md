# CipherStudio - React Online Compiler

CipherStudio is a browser-based code editor for React projects, powered by CodeSandbox's Sandpack. It enables users to write, preview, and save React code with real-time feedback, featuring local autosaving, MongoDB storage, and a file explorer for managing project files.

## Features

- **Live Code Editing**: Write React code with instant preview
- **Auto-Save**: Saves projects to localStorage automatically
- **MongoDB Storage**: Persist projects to a MongoDB database
- **File Explorer**: Manage multiple files in your project
- **Theme Toggle**: Switch between dark and light themes
- **Project Renaming**: Easily rename your projects

## Tech Stack

### Frontend

- **React**: UI framework
- **Sandpack**: Code editor and preview
- **Axios**: API requests
- **Lodash**: Debouncing for autosave
- **sandpack-file-explorer**: File management UI

### Backend

- **Node.js & Express**: API server
- **MongoDB & Mongoose**: Database and schema management
- **CORS & dotenv**: Cross-origin requests and environment variables

## Project Structure

```
cipherstudio/
├── client/                 # Frontend code
│   ├── src/
│   │   ├── components/     # Editor and FileExplorer components
│   │   ├── services/       # API and autosave services
│   │   ├── assets/         # Logo and static assets
│   │   ├── App.jsx         # Main app component
│   │   └── App.css         # Styles
├── server/                 # Backend code
│   ├── models/             # Mongoose schemas
│   └── server.js           # Express server
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── README.md               # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas or local MongoDB
- npm

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cipherstudio.git
cd cipherstudio
```

#### 2. Frontend Setup

```bash
npm create vite@latest client --template react
cd client
npm install axios @codesandbox/sandpack-react sandpack-file-explorer lodash
npm run dev
```

#### 3. Backend Setup

```bash
cd ..
mkdir server
cd server
npm init -y
npm install express mongoose cors dotenv mongodb
```

#### 4. Configure Environment

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

#### 5. Run the Backend

```bash
node server.js
```

#### 6. Access the App

- **Frontend**: http://localhost:5173 (or Vite's default port)
- **Backend API**: http://localhost:5000/api/projects

## Usage

- **Edit Code**: Modify files in the editor; previews update instantly
- **Auto-Save**: Changes are saved to localStorage every few seconds
- **Save to Database**: Click "Save" to store the project in MongoDB
- **Load Project**: Use a project ID to load from MongoDB
- **Manage Files**: Add or switch files via the file explorer
- **Toggle Theme**: Switch between dark/light modes

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Save a project (`{ projectId, projectName, files }`) |
| GET | `/api/projects/:projectId` | Retrieve a project by ID |

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

## License

MIT License

## Acknowledgments

- Powered by [Sandpack](https://sandpack.codesandbox.io/)
- Inspired by online IDEs like CodePen