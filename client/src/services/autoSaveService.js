let timeoutId = null;

export const startAutoSave = (sandpack, projectId, delay = 5000) => {
  if (!sandpack) return;

  const unsubscribe = sandpack.listen((message) => {
    if (message.type === "update" || message.type === "fileChange") {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentFiles = sandpack.files;
        localStorage.setItem(projectId, JSON.stringify(currentFiles));
        console.log("💾 Auto-saved project to localStorage");
      }, delay);
    }
  });

  return unsubscribe; 
};

export const loadFromLocalStorage = (projectId, sandpack) => {
  const savedProject = localStorage.getItem(projectId);
  if (savedProject) {
    const parsed = JSON.parse(savedProject);
    for (const [path, file] of Object.entries(parsed)) {
      sandpack.updateFile(path, file.code);
    }
    console.log("✅ Loaded project from localStorage");
  }
};
