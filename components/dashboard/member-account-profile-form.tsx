"use client";

import { useActionState, useEffect } from "react";
import { AlertCircle, MessageCircle, Save, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  updateMemberProfileAction,
  type UpdateMemberProfileState,
} from "@/app/(protected)/dashboard/account/profile/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  memberGlassRowClass,
  memberSolidButtonClass,
  memberTextMutedClass,
  memberTextPrimaryClass,
  memberTextSecondaryClass,
} from "@/components/dashboard/member-ui";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MemberAccountProfileFormProps = {
  currentLanguage: string;
  initialWhatsapp: string;
  labels: {
    editDescription: string;
    editNote: string;
    editTitle: string;
    saveChanges: string;
    savePending: string;
    whatsapp: string;
    whatsappPlaceholder: string;
  };
};

const initialUpdateMemberProfileState: UpdateMemberProfileState = {
  fieldErrors: {},
  formValues: {
    whatsapp: "",
  },
  message: null,
  status: "idle",
};

function ProfileField({
  children,
  error,
  htmlFor,
  icon: Icon,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  htmlFor: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label className={`inline-flex items-center gap-2 text-sm font-medium ${memberTextSecondaryClass}`} htmlFor={htmlFor}>
        <Icon className="h-4 w-4 text-emerald-600" />
        {label}
      </Label>
      {children}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

export function MemberAccountProfileForm({
  currentLanguage,
  initialWhatsapp,
  labels,
}: MemberAccountProfileFormProps) {
  const [state, formAction] = useActionState<UpdateMemberProfileState, FormData>(
    updateMemberProfileAction,
    initialUpdateMemberProfileState,
  );
  const router = useRouter();
  const formValueKey = `${state.status}:${state.formValues.whatsapp}:${initialWhatsapp}`;

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className={`mt-6 space-y-5 p-5 sm:p-6 ${memberGlassRowClass}`}>
      <input name="language" type="hidden" value={currentLanguage} />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
            <Save className="h-4 w-4" />
          </span>
          <div>
            <h3 className={`text-lg font-semibold ${memberTextPrimaryClass}`}>{labels.editTitle}</h3>
            <p className={`text-sm leading-7 ${memberTextSecondaryClass}`}>{labels.editDescription}</p>
          </div>
        </div>
        <p className={`text-sm leading-7 ${memberTextMutedClass}`}>{labels.editNote}</p>
      </div>

      {state.message ? (
        <Alert className="flex items-start gap-3" variant={state.status === "success" ? "success" : "error"}>
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <div className="grid gap-4">
        <ProfileField
          error={state.fieldErrors.whatsapp}
          htmlFor="profileWhatsapp"
          icon={MessageCircle}
          label={labels.whatsapp}
        >
          <Input
            autoComplete="tel"
            className="member-row-surface text-[var(--member-text-primary)] placeholder:text-[var(--member-text-muted)]"
            defaultValue={state.formValues.whatsapp || initialWhatsapp}
            id="profileWhatsapp"
            key={`whatsapp:${formValueKey}`}
            name="whatsapp"
            placeholder={labels.whatsappPlaceholder}
            required
            type="tel"
          />
        </ProfileField>
      </div>

      <SubmitButton className={`w-full sm:w-auto ${memberSolidButtonClass}`} pendingText={labels.savePending}>
        {labels.saveChanges}
      </SubmitButton>
    </form>
  );
}
