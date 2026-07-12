"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { PROJECTS_CACHE_TAG } from "@/lib/queries";
import { requireAdminSession } from "@/lib/admin/auth";
import { assertRateLimit } from "@/lib/security/rate-limit";
import {
  assertValidProjectId,
  parseCreateProjectPayload,
} from "@/lib/admin/action-validation";

export async function logoutAction(lang: string) {
  redirect(`/${lang}`);
}

export async function createProjectAction(formData: FormData) {
  parseCreateProjectPayload(formData);
  const { user } = await requireAdminSession({ strategy: "throw" });

  assertRateLimit("create-project", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidateTag(PROJECTS_CACHE_TAG);
}

export async function deleteProjectAction(id: string) {
  const { user } = await requireAdminSession({ strategy: "throw" });

  assertRateLimit("delete-project", user.id);

  assertValidProjectId(id);

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidateTag(PROJECTS_CACHE_TAG);
}
