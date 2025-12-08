import { useState, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  LayoutDashboard,
  Calculator,
  Menu,
  Trash2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { UserButton } from "@clerk/clerk-react";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { useAirQuality } from "../../hooks/useAirQuality";
import { toast, Toaster } from "sonner";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { AIAssistant } from "../../components/ai/AIAssistant";
import { cn } from "../../lib/utils";
import { COMPONENT_STYLES } from "../../lib/designTokens";

// --- Nav Logic ---
const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: Calculator, label: "Risk Calculator", path: "/risk-calculator" },
  { icon: UploadCloud, label: "Data Upload", path: "/data-upload" },
  { icon: FileText, label: "Reports", path: "/reports" },
];

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
}

export const DataUpload = () => {
  const { data } = useAirQuality({
    enablePolling: true,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload
    newFiles.forEach((fileObj) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles((currentFiles) =>
          currentFiles.map((f) =>
            f.id === fileObj.id
              ? {
                  ...f,
                  progress,
                  status: progress >= 100 ? "completed" : "uploading",
                }
              : f
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          toast.success(`${fileObj.file.name} uploaded successfully`);
        }
      }, 300);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      <Toaster position="top-center" />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[230px] flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:flex",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-20 items-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              Pro
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              QASA Research
            </span>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  isActive(item.path)
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b border-border bg-background/50 px-6 backdrop-blur-sm lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-muted-foreground"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Data Upload</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
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
                Support for CSV, JSON, and PDF sensor logs. Maximum file size
                50MB.
              </p>
              <Button className={COMPONENT_STYLES.button.primary}>
                Select Files
              </Button>
            </div>

            {/* Upload List */}
            {files.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">
                  Upload Queue
                </h3>
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
        </main>
      </div>

      <AIAssistant mode="professional" contextData={data} />
    </div>
  );
};
