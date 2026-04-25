"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useFormStatus } from "react-dom";
import { deleteUserAction } from "@/app/(protected)/admin/users/actions";
import { Button } from "@/components/ui/button";

type DeleteUserButtonProps = {
  userId: string;
  username: string;
};

function ConfirmDeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="bg-rose-600 text-white hover:bg-rose-700"
      disabled={pending}
      type="submit"
    >
      <Trash2 className="h-4 w-4" />
      {pending ? "Menghapus..." : "Ya, Hapus User"}
    </Button>
  );
}

export function DeleteUserButton({ userId, username }: DeleteUserButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="border-rose-200 text-rose-700 hover:bg-rose-50"
        onClick={() => setOpen(true)}
        size="sm"
        type="button"
        variant="outline"
      >
        <Trash2 className="h-4 w-4" />
        Hapus
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px]">
          <div
            aria-labelledby={`delete-user-title-${userId}`}
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)]"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">
                  Konfirmasi Hapus
                </p>
                <h3
                  className="mt-2 text-xl font-semibold tracking-tight text-stone-950"
                  id={`delete-user-title-${userId}`}
                >
                  Hapus user @{username}?
                </h3>
              </div>
              <button
                aria-label="Tutup"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-stone-600">
              Tindakan ini akan menghapus akun user beserta data profilnya dari sistem. Lanjutkan
              hanya jika kamu benar-benar yakin.
            </p>

            <form action={deleteUserAction} className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <input name="userId" type="hidden" value={userId} />
              <Button onClick={() => setOpen(false)} type="button" variant="outline">
                Batal
              </Button>
              <ConfirmDeleteButton />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
