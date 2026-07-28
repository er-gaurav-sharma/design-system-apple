import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export interface LoginFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "title"> {
  logo?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Top-level auth error, shown verbatim as the banner headline (e.g. "Incorrect email or password"). */
  authError?: React.ReactNode;
  /** Optional supporting line under `authError` (e.g. "3 attempts remaining"). */
  authErrorDetail?: React.ReactNode;
  /** Field-level validation errors. */
  errors?: { email?: string; username?: string; password?: string };
  loading?: boolean;
  /**
   * Which identity the first field collects. `"username"` switches it to a plain
   * text input named `username`, for APIs that don't authenticate by email.
   * @default "email"
   */
  identifier?: "email" | "username";
  /** Overrides the field label ("Email" / "Username"). */
  identifierLabel?: React.ReactNode;
  /** Overrides the field placeholder. Username mode has none by default. */
  identifierPlaceholder?: string;
  onForgotPassword?: () => void;
  /**
   * The submitted values. The active identifier is emitted under both its own
   * key and the legacy `email` key, so `({ email, password }) => …` callers keep
   * working unchanged in either mode.
   */
  onSubmit?: (values: { email: string; username: string; password: string }) => void;
}

/**
 * Login form: an email or username identifier + password, inline field
 * validation, a loading submit state, and a top-level auth-error banner. Bring
 * your own auth in onSubmit.
 */
const LoginForm = React.forwardRef<HTMLFormElement, LoginFormProps>(
  (
    {
      className,
      logo,
      title = "Sign in",
      subtitle,
      authError,
      authErrorDetail,
      errors,
      loading = false,
      identifier = "email",
      identifierLabel,
      identifierPlaceholder,
      onForgotPassword,
      onSubmit,
      ...props
    },
    ref,
  ) => {
    const isEmail = identifier === "email";
    const identifierName = isEmail ? "email" : "username";
    // Username mode falls back to the legacy `email` key, mirroring the dual-key
    // emit below, so a caller mid-migration is never silently error-less.
    const identifierError = isEmail ? errors?.email : (errors?.username ?? errors?.email);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const value = String(data.get(identifierName) ?? "");
      onSubmit?.({
        email: value,
        username: value,
        password: String(data.get("password") ?? ""),
      });
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        noValidate
        className={cn(
          "w-full max-w-sm rounded-xl bg-card p-8 shadow-md",
          className,
        )}
        {...props}
      >
        {logo && <div className="mb-4 flex justify-center">{logo}</div>}
        <h1 className="text-center text-xl font-semibold">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-center text-sm text-muted-foreground">{subtitle}</p>
        )}

        {authError && (
          <Alert variant="error" className="mt-6">
            {/* The banner text is whatever the caller passed. It used to be a
                hard-coded "Incorrect email or password" with authError demoted
                to the description, which mislabelled every other failure
                (locked account, expired session, SSO required). */}
            <AlertTitle>{authError}</AlertTitle>
            {authErrorDetail && <AlertDescription>{authErrorDetail}</AlertDescription>}
          </Alert>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <Field>
            <Label htmlFor={identifierName}>
              {identifierLabel ?? (isEmail ? "Email" : "Username")}
            </Label>
            <Input
              id={identifierName}
              name={identifierName}
              type={isEmail ? "email" : "text"}
              autoComplete={isEmail ? "email" : "username"}
              placeholder={identifierPlaceholder ?? (isEmail ? "user@example.com" : undefined)}
              aria-invalid={!!identifierError}
              disabled={loading}
            />
            {identifierError && <FieldError>{identifierError}</FieldError>}
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors?.password}
              disabled={loading}
            />
            {errors?.password && <FieldError>{errors.password}</FieldError>}
          </Field>

          <Button type="submit" className="mt-1 w-full" loading={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </form>
    );
  },
);
LoginForm.displayName = "LoginForm";

export { LoginForm };
