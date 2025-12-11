/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import { useState, useCallback, useEffect } from "react";
import { UploadCloud, FileText, CheckCircle2, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { COMPONENT_STYLES } from "../../lib/designTokens";
import { saveUpload, getUploads } from "../../lib/db";

interface UploadedFile {
  id: string;
  file: File; // or Blob
  progress: number;
  status: "uploading" | "completed" | "error";
  uploadedAt?: Date;
}

export const DataUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  // Load persisted uploads on mount
  useEffect(() => {
    const loadUploads = async () => {
      try {
        const saved = await getUploads();
        if (saved && saved.length > 0) {
          // Map DB objects back to UI state
          setFiles(
            saved.map((item: any) => ({
              id: item.id,
              file: item.file || new File([], item.name || "Unknown"), // Fallback if file missing
              progress: 100,
              status: "completed",
              uploadedAt: item.uploadedAt,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load uploads:", error);
      }
    };
    loadUploads();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "uploading" as const,
      uploadedAt: new Date(),
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Process and Save
    newFiles.forEach(async (fileObj) => {
      try {
        // Save to IndexedDB
        await saveUpload({
          id: fileObj.id,
          name: fileObj.file.name,
          size: fileObj.file.size,
          type: fileObj.file.type,
          file: fileObj.file, // IDB can store Blobs/Files
          uploadedAt: fileObj.uploadedAt,
        });

        // Simulate progress for UI feedback
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          setFiles((currentFiles) =>
            currentFiles.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    progress: Math.min(progress, 100),
                    status: progress >= 100 ? "completed" : "uploading",
                  }
                : f
            )
          );

          if (progress >= 100) {
            clearInterval(interval);
            toast.success(`${fileObj.file.name} saved locally`);
          }
        }, 100);
      } catch (error) {
        console.error("Save failed:", error);
        toast.error(`Failed to save ${fileObj.file.name}`);
        setFiles((current) =>
          current.map((f) =>
            f.id === fileObj.id ? { ...f, status: "error" } : f
          )
        );
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
      "application/pdf": [".pdf"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        const errorMsg = rejection.errors[0]?.message || "File rejected";
        toast.error(`${rejection.file.name}: ${errorMsg}`);
      });
    },
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 lg:p-8">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 transition-all cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-card hover:bg-accent/50 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="mb-4 rounded-full bg-primary/10 p-6 text-primary">
          <UploadCloud className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {isDragActive ? "Drop files here" : "Drag & drop datasets"}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
          Support for CSV, JSON, and PDF sensor logs. Maximum file size 50MB.
        </p>
        <Button className={COMPONENT_STYLES.button.primary}>
          Select Files
        </Button>
      </div>

      {/* Upload List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Upload Queue</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {files.map((file) => (
              <div key={file.id} className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.file.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {file.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
                <div className="shrink-0">
                  {file.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
