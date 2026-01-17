import prisma from "@/lib/prisma";
import { notification_type } from "@prisma/client";

interface NotifyPayload {
  type: notification_type;
  title: string;
  message?: string | null;
}

function uniqueUserIds(userIds: Array<number | null | undefined>): number[] {
  return Array.from(new Set(userIds.filter((id): id is number => !!id)));
}

export async function notifyUsers(
  userIds: Array<number | null | undefined>,
  payload: NotifyPayload
) {
  const targets = uniqueUserIds(userIds);
  if (!targets.length) {
    return { count: 0 };
  }

  return prisma.notification.createMany({
    data: targets.map((user_id) => ({
      user_id,
      type: payload.type,
      title: payload.title,
      message: payload.message || null,
    })),
    skipDuplicates: true,
  });
}

export async function notifyUsersSafe(
  userIds: Array<number | null | undefined>,
  payload: NotifyPayload
) {
  try {
    return await notifyUsers(userIds, payload);
  } catch (err) {
    console.error("Failed to create notifications", err);
    return { count: 0 };
  }
}
