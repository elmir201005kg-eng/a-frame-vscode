/** Shared policy; never infer administrator access from a client-controlled field. */
export function isAdminRole(role: string | undefined): role is "ADMIN" | "SUPER_ADMIN" {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}
