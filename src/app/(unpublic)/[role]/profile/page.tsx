import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">
        👤 Профиль пользователя
      </h1>

      <div className="space-y-3">
        <div>
          <span className="font-semibold">Имя:</span>{" "}
          {user?.name || "Не указано"}
        </div>

        <div>
          <span className="font-semibold">Email:</span>{" "}
          {user?.email || "Не указано"}
        </div>

        <div>
          <span className="font-semibold">Роль:</span> {user?.role || "—"}
        </div>
      </div>

      <div className="mt-6 text-center">
        <a
          href={`/${user.role?.toLowerCase()}/settings`}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Редактировать профиль
        </a>
      </div>
    </div>
  );
}
