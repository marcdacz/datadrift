import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";

interface LocationState {
  from?: Location;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? undefined) as LocationState | undefined;

  const { setTheme, isDark } = useTheme();
  const { isAuthenticated, isLoading, error, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = state?.from ?? "/";
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, state?.from]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setValidationError("Email and password are required.");
      return;
    }

    setValidationError(null);

    try {
      await login({ email: email.trim(), password });
      const redirectTo = state?.from ?? "/";
      navigate(redirectTo, { replace: true });
    } catch {
      // Error message is handled via `error` from auth context.
    }
  };

  const effectiveError = validationError ?? error;

  return (
    <div className="flex min-h-[calc(100vh-52px)] items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-2xl md:text-3xl">
                Sign in to DataDrift
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard.
              </CardDescription>
            </div>
            <Switch
              id="login-theme-toggle"
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle theme"
              title="Toggle theme"
              uncheckedIcon={<Sun className="h-3 w-3 text-foreground" />}
              checkedIcon={<Moon className="h-3 w-3 text-foreground" />}
            />
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {effectiveError ? (
              <p className="text-sm text-destructive" role="alert">
                {effectiveError}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login"}
            </Button>
            {/* Future enhancement: forgot password link */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

