import { Mail, MessageCircle, UserRound } from "lucide-react";
import { requireCurrentProfile } from "@/lib/auth";
import { MemberAccountProfileForm } from "@/components/dashboard/member-account-profile-form";
import {
  memberGlassPanelClass,
  memberGlassRowClass,
  memberIconSurfaceClass,
  MemberPageHeader,
  memberTextMutedClass,
  memberTextPrimaryClass,
  memberTextSecondaryClass,
} from "@/components/dashboard/member-ui";

type CurrentProfile = Awaited<ReturnType<typeof requireCurrentProfile>>;

type MemberAccountOverviewLabels = {
  editDescription: string;
  editNote: string;
  editTitle: string;
  email: string;
  pageBadge: string;
  pageDescription: string;
  pageTitle: string;
  saveProfileChanges: string;
  saveProfilePending: string;
  sectionDescription: string;
  sectionTitle: string;
  username: string;
  whatsapp: string;
  whatsappPlaceholder: string;
};

const defaultLabels: MemberAccountOverviewLabels = {
  editDescription: "Perbarui nomor WhatsApp akun Anda dari sini.",
  editNote: "Pastikan nomor WhatsApp Anda aktif agar tim kami mudah menghubungi Anda bila diperlukan.",
  editTitle: "Edit info akun",
  email: "Email",
  pageBadge: "Akun Member",
  pageDescription: "Informasi utama akun Anda.",
  pageTitle: "Profil akun",
  saveProfileChanges: "Simpan perubahan",
  saveProfilePending: "Menyimpan perubahan...",
  sectionDescription: "Detail profil dan kontak utama yang tersimpan pada akun member Anda.",
  sectionTitle: "Info akun",
  username: "Username",
  whatsapp: "WhatsApp",
  whatsappPlaceholder: "Masukkan nomor WhatsApp",
};

export function MemberAccountOverview({
  currentLanguage,
  labels = defaultLabels,
  profile,
}: {
  currentLanguage: string;
  labels?: MemberAccountOverviewLabels;
  profile: CurrentProfile;
}) {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
      <MemberPageHeader
        badge={labels.pageBadge}
        description={labels.pageDescription}
        icon={UserRound}
        title={labels.pageTitle}
        toneClassName="bg-[linear-gradient(135deg,rgba(59,130,246,0.12)_0%,rgba(255,255,255,0)_44%,rgba(16,185,129,0.1)_100%)]"
      />

      <section className={`px-6 py-6 sm:px-7 sm:py-7 ${memberGlassPanelClass}`}>
        <div className="flex items-start gap-3">
          <span className={memberIconSurfaceClass}>
            <UserRound className="h-5 w-5" />
          </span>
          <div>
            <h2 className={`text-[1.32rem] font-semibold tracking-tight sm:text-[1.48rem] ${memberTextPrimaryClass}`}>{labels.sectionTitle}</h2>
            <p className={`mt-1 text-sm leading-7 ${memberTextSecondaryClass}`}>
              {labels.sectionDescription}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className={memberGlassRowClass}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-800">
                <UserRound className="h-4 w-4" />
              </span>
              <div>
                <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextMutedClass}`}>{labels.username}</p>
                <p className={`mt-2 text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>@{profile.username}</p>
              </div>
            </div>
          </div>

          <div className={memberGlassRowClass}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-800">
                <Mail className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextMutedClass}`}>{labels.email}</p>
                <p className={`mt-2 break-all text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>{profile.email ?? "-"}</p>
              </div>
            </div>
          </div>

          <div className={memberGlassRowClass}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-800">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextMutedClass}`}>{labels.whatsapp}</p>
                <p className={`mt-2 text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>{profile.whatsapp ?? "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <MemberAccountProfileForm
          currentLanguage={currentLanguage}
          initialWhatsapp={profile.whatsapp ?? ""}
          labels={{
            editDescription: labels.editDescription,
            editNote: labels.editNote,
            editTitle: labels.editTitle,
            saveChanges: labels.saveProfileChanges,
            savePending: labels.saveProfilePending,
            whatsapp: labels.whatsapp,
            whatsappPlaceholder: labels.whatsappPlaceholder,
          }}
        />
      </section>
    </div>
  );
}
