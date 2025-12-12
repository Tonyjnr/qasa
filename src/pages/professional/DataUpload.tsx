/* eslint-disable @typescript-eslint/no-unused-vars */
/** biome-ignore-all lint/suspicious/noImplicitAnyLet: <explanation> */
/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import { useState, useCallback, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  Loader2,
  Database,
  Upload,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { cn } from "../../lib/utils";
import { COMPONENT_STYLES } from "../../lib/designTokens";
import {
  saveDataset,
  listDatasets,
  deleteDataset,
} from "../../lib/uploadStore";

interface UploadedFileState {
  id: string | number; // Can be string (temp) or number (db)
  file?: File;
  name: string;
  size?: number;
  status: "uploading" | "completed" | "error";
  createdAt?: string;
}

export const DataUpload = () => {
  const [files, setFiles] = useState<UploadedFileState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshList = async () => {
    try {
      const savedDatasets = await listDatasets();
      const mapped = savedDatasets.map((ds) => ({
        id: ds.id!, // DB id
        name: ds.name,
        status: "completed" as const,
        createdAt: ds.createdAt,
        size: JSON.stringify(ds.content).length, // Approximate size
      }));
      // Merge with currently uploading files? No, just replace completed ones.
      // Actually, simplest is to just show DB state + active uploads separate if needed.
      // But for simplicity, let's just use the DB state as the source of truth for "Completed".
      setFiles((prev) => {
        const uploading = prev.filter((f) => f.status === "uploading");
        return [...uploading, ...mapped];
      });
    } catch (error) {
      console.error("Failed to load uploads:", error);
      toast.error("Failed to load saved datasets");
    } finally {
      setIsLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    refreshList();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // 1. Add to UI as uploading
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36), // Temp ID
      file,
      name: file.name,
      size: file.size,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...newFiles, ...prev]);

    // 2. Process each
    newFiles.forEach(async (fileObj) => {
      try {
        const text = await fileObj.file!.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (e) {
          throw new Error("Invalid JSON");
        }

        // Save to DB
        await saveDataset({
          name: fileObj.name,
          content: json,
        });

        toast.success(`${fileObj.name} saved securely.`);

        // Remove the "uploading" entry and refresh from DB to get the real one
        setFiles((prev) => prev.filter((f) => f.id !== fileObj.id));
        refreshList();
      } catch (error) {
        console.error(error);
        toast.error(`Failed to upload ${fileObj.name}`);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileObj.id ? { ...f, status: "error" } : f))
        );
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      // "text/csv": [".csv"], // Parser needed for CSV
    },
    maxSize: 50 * 1024 * 1024,
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteDataset(id);
      toast.success("Dataset deleted");
      refreshList();
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Upload</h2>
          <p className="text-muted-foreground">
            Import sensor data for analysis. stored locally.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/50 px-3 py-1 rounded-full">
          <Database className="h-3 w-3" />
          IndexedDB Storage
        </div>
      </div>

      {/* New Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Datasets</p>
              <p className="text-2xl font-bold text-foreground">
                {files.length}
              </p>
            </div>
            <Database className="h-8 w-8 text-primary opacity-20" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Size</p>
              <p className="text-2xl font-bold text-foreground">
                {(
                  files.reduce((sum, f) => sum + (f.size || 0), 0) / 1024
                ).toFixed(1)}{" "}
                KB
              </p>
            </div>
            <FileText className="h-8 w-8 text-emerald-500 opacity-20" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last Upload</p>
              <p className="text-sm font-medium text-foreground">
                {files[0]?.createdAt
                  ? new Date(files[0].createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <Upload className="h-8 w-8 text-orange-500 opacity-20" />
          </CardContent>
        </Card>
      </div>

      {/* Dropzone */}
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
          Support for JSON sensor logs. Maximum file size 50MB.
        </p>
        <Button className={COMPONENT_STYLES.button.primary}>
          Select Files
        </Button>
      </div>

      {/* Updated File List with Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          Stored Datasets
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </h3>

        {!isLoading && files.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            No datasets uploaded yet.
          </p>
        )}

        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {files.map((file) => (
            <div
              key={file.id}
              className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {file.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{(file.size! / 1024).toFixed(1)} KB</span>
                  <span>•</span>
                  <span>
                    {file.createdAt
                      ? new Date(file.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500"
                  )}
                >
                  Active
                </span>
                {typeof file.id === "number" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id as number)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
