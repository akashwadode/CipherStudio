import { SandpackLayout, SandpackCodeEditor, SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
export default function Editor({ onFilesChange }) {
  const { sandpack } = useSandpack();
  const prevFilesRef = useRef(sandpack.files);

  const debouncedOnChange = useCallback(
    debounce((files) => {
      prevFilesRef.current = files;
      onFilesChange?.(files);
    }, 1300),
    [onFilesChange]
  );
  
  useEffect(() => {
    const currentFiles = sandpack.files;
    let hasChanged = false;
    for (let key in currentFiles) {
      if (!prevFilesRef.current[key] || prevFilesRef.current[key].code !== currentFiles[key].code) {
        hasChanged = true;
        break;
      }
    }
    if (hasChanged) {
      debouncedOnChange(currentFiles);
    }
  }, [sandpack.files, debouncedOnChange]);

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
        <SandpackPreview 
          className="sandpack-preview"
        />
      </SandpackLayout>
    </div>
  );
}
