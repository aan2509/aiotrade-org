"use client";

import { useActionState } from "react";
import { AlertCircle, PlusCircle, UserPlus } from "lucide-react";
import {
  createAdminUserAction,
  type CreateAdminUserState,
} from "@/app/(protected)/admin/users/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialCreateAdminUserState: CreateAdminUserState = {
  fieldErrors: {},
  formValues: {
    email: "",
    password: "",
    username: "",
  },
  message: null,
  status: "idle",
};

function FormField({
  children,
  error,
  htmlFor,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

export function AdminCreateUserForm() {
  const [state, formAction] = useActionState<CreateAdminUserState, FormData>(
    createAdminUserAction,
    initialCreateAdminUserState,
  );
  const formValueKey = `${state.status}:${state.formValues.username}:${state.formValues.email}:${state.formValues.password}`;

  return (
    <form action={formAction} className="rounded-[30px] border border-transparent px-6 py-6 admin-glass-panel">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="admin-icon-surface inline-flex h-12 w-12 items-center justify-center rounded-2xl">
            <UserPlus className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-[1.25rem] font-semibold tracking-tight text-[var(--admin-text-primary)]">
              Tambah User Manual
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-7 text-[var(--admin-text-secondary)]">
              Admin bisa membuat akun member langsung dari sini. Nomor WhatsApp nanti bisa dilengkapi atau diubah sendiri oleh user dari halaman member area.
            </p>
          </div>
        </div>
        <span className="admin-page-badge inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
          <PlusCircle className="h-3.5 w-3.5" />
          Manual Insert
        </span>
      </div>

      {state.message ? (
        <Alert className="mt-5 flex items-start gap-3" variant={state.status === "success" ? "success" : "error"}>
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <FormField error={state.fieldErrors.username} htmlFor="adminCreateUsername" label="Username">
          <Input
            autoCapitalize="none"
            autoComplete="off"
            defaultValue={state.status === "success" ? "" : state.formValues.username}
            id="adminCreateUsername"
            key={`username:${formValueKey}`}
            name="username"
            placeholder="username_member"
            required
            spellCheck={false}
          />
        </FormField>

        <FormField error={state.fieldErrors.email} htmlFor="adminCreateEmail" label="Email">
          <Input
            autoCapitalize="none"
            autoComplete="email"
            defaultValue={state.status === "success" ? "" : state.formValues.email}
            id="adminCreateEmail"
            key={`email:${formValueKey}`}
            name="email"
            placeholder="member@email.com"
            required
            type="email"
          />
        </FormField>

        <FormField error={state.fieldErrors.password} htmlFor="adminCreatePassword" label="Password">
          <Input
            autoComplete="new-password"
            defaultValue={state.status === "success" ? "" : state.formValues.password}
            id="adminCreatePassword"
            key={`password:${formValueKey}`}
            name="password"
            placeholder="Minimal 8 karakter"
            required
            type="password"
          />
        </FormField>
      </div>

      <div className="mt-5 flex justify-end">
        <SubmitButton className="admin-solid-button w-full sm:w-auto" pendingText="Membuat user...">
          Buat User
        </SubmitButton>
      </div>
    </form>
  );
}
