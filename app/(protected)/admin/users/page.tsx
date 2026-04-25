import { UsersTableView } from "@/components/admin/users-table-view";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminUsers } from "@/lib/admin-users";

type AdminUsersPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const [users, admin, query] = await Promise.all([
    getAdminUsers(),
    requireAdminProfile(),
    searchParams,
  ]);

  return (
    <UsersTableView
      currentAdminId={admin.id}
      status={query.status}
      users={users}
    />
  );
}
