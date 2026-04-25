"use client";

import { useActionState } from "react";
import { AlertCircle, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import {
  changePasswordAction,
  type ChangePasswordActionState,
} from "@/app/(protected)/account/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  memberGlassPanelClass,
  memberGlassRowClass,
  memberSolidButtonClass,
  memberTextPrimaryClass,
  memberTextSecondaryClass,
  MemberPageHeader,
} from "@/components/dashboard/member-ui";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ChangePasswordViewProps = {
  copy?: {
    confirmPassword: string;
    currentPassword: string;
    currentPlaceholder: string;
    description: string;
    newPassword: string;
    newPlaceholder: string;
    noteBody: string;
    noteTitle: string;
    saveButton: string;
    savePending: string;
    title: string;
  };
  description: string;
  title: string;
};

const initialChangePasswordState: ChangePasswordActionState = {
  fieldErrors: {},
  message: null,
  status: "idle",
};

function PasswordField({
  autoComplete,
  error,
  icon: Icon,
  id,
  label,
  name,
  placeholder,
}: {
  autoComplete: string;
  error?: string;
  icon: typeof KeyRound;
  id: string;
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="inline-flex items-center gap-2 text-sm font-medium text-[var(--member-text-secondary)]" htmlFor={id}>
        <Icon className="h-4 w-4 text-emerald-600" />
        {label}
      </Label>
      <Input
        autoComplete={autoComplete}
        className={`member-row-surface text-[var(--member-text-primary)] placeholder:text-[var(--member-text-muted)] ${error ? "border-rose-300 focus-visible:ring-rose-400/30" : ""}`}
        id={id}
        name={name}
        placeholder={placeholder}
        required
        type="password"
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

const defaultCopy = {
  confirmPassword: "Konfirmasi Password Baru",
  currentPassword: "Password Saat Ini",
  currentPlaceholder: "Masukkan password saat ini",
  description: "Masukkan password lama Anda, lalu simpan password baru yang ingin dipakai saat login.",
  newPassword: "Password Baru",
  newPlaceholder: "Minimal 8 karakter",
  noteBody: "Setelah password diganti, login berikutnya akan memakai password baru ini.",
  noteTitle: "Catatan",
  saveButton: "Simpan Password Baru",
  savePending: "Menyimpan password...",
  title: "Reset Password",
};

export function ChangePasswordView({ copy = defaultCopy, description, title }: ChangePasswordViewProps) {
  const [state, formAction] = useActionState<ChangePasswordActionState, FormData>(
    changePasswordAction,
    initialChangePasswordState,
  );

  return (
    <div className="space-y-6 px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
      <MemberPageHeader
        badge="Account Security"
        description={description}
        icon={ShieldCheck}
        title={title}
        toneClassName="bg-[linear-gradient(135deg,rgba(16,185,129,0.12)_0%,rgba(255,255,255,0)_46%,rgba(59,130,246,0.1)_100%)]"
      />

      <Card className={`max-w-2xl rounded-[30px] border-transparent ${memberGlassPanelClass}`}>
        <CardHeader>
          <CardTitle className={memberTextPrimaryClass}>{copy.title}</CardTitle>
          <CardDescription className={memberTextSecondaryClass}>
            {copy.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            {state?.message ? (
              <Alert className="flex items-start gap-3" variant={state.status === "success" ? "success" : "error"}>
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{state.message}</p>
              </Alert>
            ) : null}

            <PasswordField
              autoComplete="current-password"
              error={state.fieldErrors.currentPassword}
              icon={KeyRound}
              id="currentPassword"
              label={copy.currentPassword}
              name="currentPassword"
              placeholder={copy.currentPlaceholder}
            />

            <PasswordField
              autoComplete="new-password"
              error={state.fieldErrors.newPassword}
              icon={LockKeyhole}
              id="newPassword"
              label={copy.newPassword}
              name="newPassword"
              placeholder={copy.newPlaceholder}
            />

            <PasswordField
              autoComplete="new-password"
              error={state.fieldErrors.confirmPassword}
              icon={LockKeyhole}
              id="confirmPassword"
              label={copy.confirmPassword}
              name="confirmPassword"
              placeholder={copy.confirmPassword}
            />

            <div className={`rounded-[24px] p-4 ${memberGlassRowClass}`}>
              <p className={`text-sm font-medium ${memberTextPrimaryClass}`}>{copy.noteTitle}</p>
              <p className={`mt-2 text-sm leading-7 ${memberTextSecondaryClass}`}>
                {copy.noteBody}
              </p>
            </div>

            <SubmitButton
              className={`w-full sm:w-auto ${memberSolidButtonClass}`}
              pendingText={copy.savePending}
            >
              {copy.saveButton}
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
