import * as React from "react";
import { LoginForm } from "@claude-design/dashboard-ui";

const Logo = () => (
  <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
    A
  </span>
);

/** The default sign-in form: logo, title, subtitle, and a forgot-password link. */
export const Default = () => (
  <LoginForm
    logo={<Logo />}
    subtitle="Sign in to your Acme Analytics workspace."
    onForgotPassword={() => {}}
  />
);

/** Field-level validation via the `errors` prop. */
export const FieldErrors = () => (
  <LoginForm
    logo={<Logo />}
    subtitle="Sign in to your Acme Analytics workspace."
    errors={{
      email: "Enter a valid email address.",
      password: "Password must be at least 12 characters.",
    }}
    onForgotPassword={() => {}}
  />
);

/** A top-level auth failure renders as an error Alert above the fields. */
export const AuthError = () => (
  <LoginForm
    logo={<Logo />}
    subtitle="Sign in to your Acme Analytics workspace."
    // NOTE: LoginForm hard-codes the Alert *title* to "Incorrect email or
    // password"; `authError` only fills the description. See NOTES.md.
    authError="Check your credentials and try again, or reset your password."
    onForgotPassword={() => {}}
  />
);

/** `loading` puts the submit button into its spinner state. */
export const Loading = () => (
  <LoginForm
    logo={<Logo />}
    subtitle="Sign in to your Acme Analytics workspace."
    loading
    onForgotPassword={() => {}}
  />
);
