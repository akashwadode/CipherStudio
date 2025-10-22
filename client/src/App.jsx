import { useState, useEffect, useRef, useCallback } from "react";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import Editor from "./components/Editor";
import FileExplorer from "./components/FileExplorer";
import { saveProject, loadProject, generateId } from "./services/api";
import { debounce } from "lodash";
import logo from "./assets/logo.webp";
import "./App.css";

function App() {
  const [files, setFiles] = useState({
    active: "/App.js",
    content: {
      "/App.js": `function App() {
  return <h1>Hello World!</h1>;
}
export default App;`,
      "/index.js": `import ReactDOM from 'react-dom/client';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
    },
  });

  const [projectId, setProjectId] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("cipherstudio_project"));
    if (saved?.projectId) return saved.projectId;
    return generateId();
  });

  const [projectName, setProjectName] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("cipherstudio_project"));
    return saved?.projectName || "Untitled";
  });

  const [isRenaming, setIsRenaming] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedRef = useRef("");

  // Debounced Auto Save to LocalStorage
  const autoSaveToLocal = useCallback(
    debounce((data) => {
      setIsSaving(true);
      localStorage.setItem("cipherstudio_project", JSON.stringify(data));
      console.log("🕒 Auto-saved full project to localStorage");
      setTimeout(() => setIsSaving(false), 1000);
    }, 2000),
    []
  );

  // Save full state whenever files, projectId, or projectName changes
  useEffect(() => {
    const projectData = {
      projectId,
      projectName,
      files,
      timestamp: new Date().toISOString(),
    };

    const serialized = JSON.stringify(projectData);
    if (serialized !== lastSavedRef.current) {
      lastSavedRef.current = serialized;
      autoSaveToLocal(projectData);
    }
  }, [files, projectId, projectName, autoSaveToLocal]);

  // Load full project from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cipherstudio_project");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.files?.content) {
          setFiles(parsed.files);
          setProjectId(parsed.projectId);
          setProjectName(parsed.projectName || "Untitled");
          console.log("✅ Project restored from localStorage");
        }
      } catch (err) {
        console.error("❌ Failed to parse local project:", err);
      }
    }
  }, []);

  // Update files when Sandpack changes
  const handleSandpackChange = (newFiles) => {
    setFiles((prev) => ({
      ...prev,
      content: newFiles,
    }));
  };

  // Manual Save to MongoDB
  const handleSave = async () => {
    try {
      const result = await saveProject(projectId, projectName, files.content);
      alert(`✅ Saved to MongoDB as: ${result.project.projectId} (${projectName})`);
    } catch (error) {
      alert("❌ Save to DB Failed!");
      console.error(error);
    }
  };

  // Load from MongoDB
  const handleLoad = async () => {
    try {
      const loaded = await loadProject(projectId);
      if (loaded) {
        setFiles({ active: Object.keys(loaded.files)[0], content: loaded.files });
        setProjectName(loaded.projectName || "Untitled");
        alert(`✅ Loaded project ID: ${projectId} (${loaded.projectName || "Untitled"})`);
      } else {
        alert("❌ No project found!");
      }
    } catch (error) {
      alert("❌ Load Failed!");
      console.error(error);
    }
  };

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const handleRename = (e) => {
    if (e.key === "Enter" && projectName.trim()) {
      setIsRenaming(false);
    }
  };

  return (
    <SandpackProvider
      template="react"
      files={files.content}
      activeFile={files.active}
      customSetup={{ entry: "/index.js" }}
      theme={theme}
      onChange={handleSandpackChange}
    >
      <div className={`app-container ${theme}`}>
        {/* Auto-save animation */}
        {isSaving && (
          <div className="autosave-bubble">
            💾 Saving locally...
          </div>
        )}

        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-brand">
            <img src={logo} alt="Logo" className="logo" />
            <span>CipherStudio</span>
          </div>
          <div className="navbar-project">
            {isRenaming ? (
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyPress={handleRename}
                onBlur={() => setIsRenaming(false)}
                autoFocus
                className="project-name-input"
              />
            ) : (
              <span
                className="project-name"
                onClick={() => setIsRenaming(true)}
                title="Click to rename"
              >
                {projectName}
              </span>
            )}
          </div>
          <div className="navbar-controls">
            <button onClick={handleSave}>💾 Save</button>
            <button onClick={handleLoad}>📂 Load</button>
            <button onClick={toggleTheme}>
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <span className="project-id">ID: {projectId.slice(-8)}</span>
          </div>
        </nav>

        {/* Workspace */}
        <div className="workspace">
          <FileExplorer theme={theme} />
          <Editor
            files={files.content}
            activeFile={files.active}
            onFilesChange={handleSandpackChange}
          />
        </div>
      </div>
    </SandpackProvider>
  );
}

export default App;