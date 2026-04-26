export type MemberShellLabels = {
  accountGroup: string;
  accountItems: {
    profile: string;
    resetPassword: string;
  };
  adminPanel: string;
  closeMenu: string;
  dashboardTitle: string;
  guideGroup: string;
  guideItems: {
    files: string;
    setupBot: string;
    start: string;
    strategy: string;
  };
  loginAs: string;
  logout: string;
  memberArea: string;
  mobileTitles: {
    accountProfile: string;
    accountResetPassword: string;
    dashboard: string;
    fallback: string;
    guideFiles: string;
    guideSetupBot: string;
    guideStart: string;
    guideStrategy: string;
    joinAiotrade: string;
    subscription: string;
  };
  openMenu: string;
  primaryItems: {
    dashboard: string;
    joinAiotrade: string;
    subscription: string;
  };
  sidebarDescription: string;
  sidebarTitle: string;
};

export const defaultMemberShellLabels: MemberShellLabels = {
  accountGroup: "Akun",
  accountItems: {
    profile: "Profil",
    resetPassword: "Reset Password",
  },
  adminPanel: "Admin Panel",
  closeMenu: "Tutup menu",
  dashboardTitle: "Dashboard Member",
  guideGroup: "Pusat Belajar",
  guideItems: {
    files: "Cara Cuan",
    setupBot: "eCourse",
    start: "Mulai",
    strategy: "AIOTrade",
  },
  loginAs: "Login sebagai",
  logout: "Log out",
  memberArea: "Member Area",
  mobileTitles: {
    accountProfile: "Akun: Profil",
    accountResetPassword: "Akun: Reset Password",
    dashboard: "Dashboard",
    fallback: "Dashboard Member",
    guideFiles: "Pusat Belajar: Cara Cuan",
    guideSetupBot: "Pusat Belajar: eCourse",
    guideStart: "Pusat Belajar: Mulai",
    guideStrategy: "Pusat Belajar: AIOTrade",
    joinAiotrade: "Daftar AIOTrade",
    subscription: "Langganan",
  },
  openMenu: "Buka menu",
  primaryItems: {
    dashboard: "Dashboard",
    joinAiotrade: "Daftar AIOTrade",
    subscription: "Langganan",
  },
  sidebarDescription: "Akses informasi akun dan panduan.",
  sidebarTitle: "Dashboard Member",
};
