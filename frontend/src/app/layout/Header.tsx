import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";

/**
 * Top header: app name, global search placeholder, user avatar placeholder.
 * TODO: Wire search, user menu, notifications.
 */
export function Header() {
  const { setTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, user, hasRole, logout } = useAuth();

  const canSeeSettings = isAuthenticated && hasRole(["admin", "manager"]);
  const displayInitials =
    user?.name?.trim() || user?.email
      ? (user?.name || user?.email)
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : null;

  return (
    <header className="flex items-center gap-6 h-[52px] px-6 bg-background border-b border-border">
      <span className="text-lg font-semibold text-foreground flex-shrink-0" aria-label="DataDrift">
        DataDrift
      </span>
      <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
        <Switch
          id="theme-toggle"
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          aria-label="Toggle theme"
          uncheckedIcon={<Sun className="h-3 w-3 text-foreground" />}
          checkedIcon={<Moon className="h-3 w-3 text-foreground" />}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-muted text-sm font-semibold text-muted-foreground p-0"
              title="User menu"
            >
              {displayInitials ? (
                <span aria-hidden>{displayInitials}</span>
              ) : (
                <User className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {user?.name || user?.email || "My Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {canSeeSettings ? (
              <DropdownMenuItem
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            ) : null}
            {isAuthenticated ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    navigate("/login", { replace: true });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
