import { SandpackLayout, SandpackCodeEditor, SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";

export default function Editor({ onFilesChange }) {
  const { sandpack } = useSandpack();
  const prevFilesRef = useRef(sandpack.files);

  // ✅ Debounced onFilesChange to prevent rapid firing
  const debouncedOnChange = useCallback(
    debounce((files) => {
      prevFilesRef.current = files; // update previous files
      onFilesChange?.(files);
    }, 1000), // 1 second debounce is smoother
    [onFilesChange]
  );

  // ✅ Effect to detect changes only when necessary
  useEffect(() => {
    const currentFiles = sandpack.files;
    let hasChanged = false;

    // Compare previous and current files
    for (let key in currentFiles) {
      const prevFile = prevFilesRef.current[key];
      const currFile = currentFiles[key];

      if (!prevFile || prevFile.code !== currFile.code) {
        hasChanged = true;
        break;
      }
    }

    // Call debounced callback only if something changed
    if (hasChanged) {
      debouncedOnChange(currentFiles);
    }
  }, [sandpack.files, debouncedOnChange]);

  // ✅ Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return (
    <div className="editor-wrapper">
      <SandpackLayout className="editor-sandpack">
        <SandpackCodeEditor
          showLineNumbers
          showInlineErrors
          wrapContent
          closableTabs
          className="sandpack-code-editor"
        />
        <SandpackPreview className="sandpack-preview" />
      </SandpackLayout>
    </div>
  );
}
