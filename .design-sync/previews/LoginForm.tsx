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
    authError="Incorrect email or password"
    onForgotPassword={() => {}}
  />
);

/**
 * `authError` is shown verbatim, so failures other than a bad password are
 * labelled correctly — and `authErrorDetail` adds a supporting line.
 */
export const AuthErrorWithDetail = () => (
  <LoginForm
    logo={<Logo />}
    subtitle="Sign in to your Acme Analytics workspace."
    authError="Your account is locked"
    authErrorDetail="Too many failed attempts. Try again in 15 minutes or contact an admin."
    onForgotPassword={() => {}}
  />
);

/**
 * `identifier="username"` switches the first field to a plain text input named
 * `username` — label, type and autocomplete follow. `onSubmit` still emits the
 * value under the legacy `email` key too, so existing callers keep working.
 */
export const UsernameIdentifier = () => (
  <LoginForm
    logo={<Logo />}
    subtitle="Sign in with your Acme Analytics account."
    identifier="username"
    onForgotPassword={() => {}}
  />
);

/** Wording is overridable without forking, in either identifier mode. */
export const CustomIdentifierWording = () => (
  <LoginForm
    logo={<Logo />}
    subtitle="Sign in with your Acme Analytics account."
    identifier="username"
    identifierLabel="Operator ID"
    identifierPlaceholder="j.doe"
    errors={{ username: "That operator ID doesn't exist." }}
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
