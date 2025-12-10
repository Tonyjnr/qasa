import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative rounded-full p-2 text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      title="Toggle Theme"
    >
      {/* Sun icon: visible in light mode (scale-100), hidden in dark mode (scale-0) */}
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
      
      {/* Moon icon: hidden in light mode (scale-0), visible in dark mode (scale-100) */}
      <Moon className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
      
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
