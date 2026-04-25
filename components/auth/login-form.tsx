"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, KeyRound, Mail } from "lucide-react";
import { loginAction, type LoginActionState } from "@/app/(auth)/login/actions";
import { AuthFieldShell } from "@/components/auth/auth-field-shell";
import { SubmitButton } from "@/components/auth/submit-button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialLoginState: LoginActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

type LoginFormProps = {
  labels?: {
    email: string;
    emailPlaceholder: string;
    helperBody: string;
    helperTitle: string;
    loginButton: string;
    loginPending: string;
    noAccount: string;
    password: string;
    passwordPlaceholder: string;
    signupLink: string;
  };
};

const defaultLabels = {
  email: "Email",
  emailPlaceholder: "you@example.com",
  helperBody: "Pakai email yang sama seperti saat daftar agar Anda bisa masuk tanpa repot.",
  helperTitle: "Siap lanjut",
  loginButton: "Masuk",
  loginPending: "Sedang masuk...",
  noAccount: "Belum punya akun?",
  password: "Password",
  passwordPlaceholder: "Masukkan password Anda",
  signupLink: "Daftar di sini",
};

export function LoginForm({ labels = defaultLabels }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialLoginState);
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      {state?.message ? (
        <Alert
          className="flex items-start gap-3"
          variant={state.status === "error" ? "error" : "success"}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <div className="space-y-4">
        <div className="space-y-2">
          <AuthFieldShell error={fieldErrors.email}>
            <Label className="mb-2 inline-flex items-center gap-2 text-slate-700" htmlFor="email">
              <Mail className="h-4 w-4 text-sky-500" />
              {labels.email}
            </Label>
            <Input
              autoComplete="email"
              className="border-0 bg-transparent px-0 text-base shadow-none focus:ring-0"
              defaultValue={state.formValues?.email ?? ""}
              id="email"
              name="email"
              placeholder={labels.emailPlaceholder}
              required
              type="email"
            />
          </AuthFieldShell>
          {fieldErrors.email ? <p className="text-sm text-rose-600">{fieldErrors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <AuthFieldShell error={fieldErrors.password}>
            <Label className="mb-2 inline-flex items-center gap-2 text-slate-700" htmlFor="password">
              <KeyRound className="h-4 w-4 text-sky-500" />
              {labels.password}
            </Label>
            <Input
              autoComplete="current-password"
              className="border-0 bg-transparent px-0 text-base shadow-none focus:ring-0"
              id="password"
              name="password"
              placeholder={labels.passwordPlaceholder}
              required
              type="password"
            />
          </AuthFieldShell>
          {fieldErrors.password ? (
            <p className="text-sm text-rose-600">{fieldErrors.password}</p>
          ) : null}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm font-medium text-slate-700">{labels.helperTitle}</p>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          {labels.helperBody}
        </p>
      </div>

      <SubmitButton
        className="h-12 w-full rounded-lg bg-sky-500 text-base font-semibold text-white shadow-[0_16px_30px_rgba(14,165,233,0.22)] hover:bg-sky-600"
        pendingText={labels.loginPending}
      >
        {labels.loginButton}
      </SubmitButton>

      <p className="text-center text-sm text-slate-600">
        {labels.noAccount}{" "}
        <Link
          className="font-medium text-slate-950 underline decoration-slate-300 underline-offset-4"
          href="/signup"
        >
          {labels.signupLink}
        </Link>
      </p>
    </form>
  );
}
