export type AdminBootstrapEnv = {
  email?: string | undefined
  password?: string | undefined
}

export type AdminBootstrapDecision =
  | { action: "skip_unset" }
  | { action: "skip_partial"; present: string[]; missing: string[] }
  | { action: "skip_exists"; email: string }
  | { action: "create"; email: string; password: string }

/**
 * Decide whether the optional one-time admin bootstrap should create a user.
 * Never include the password in logs — callers must treat `password` as secret.
 */
export function resolveAdminBootstrapDecision(
  env: AdminBootstrapEnv,
  userAlreadyExists: boolean
): AdminBootstrapDecision {
  const email = env.email?.trim() ?? ""
  const password = env.password ?? ""

  const emailSet = email.length > 0
  const passwordSet = password.length > 0

  // Inactive when the password is absent — that is the supported post-bootstrap
  // deactivation path (email may remain in .env).
  if (!passwordSet) {
    return { action: "skip_unset" }
  }

  // Password without email is a misconfiguration.
  if (!emailSet) {
    return {
      action: "skip_partial",
      present: ["MEDUSA_ADMIN_PASSWORD"],
      missing: ["MEDUSA_ADMIN_EMAIL"],
    }
  }

  if (userAlreadyExists) {
    return { action: "skip_exists", email }
  }

  return { action: "create", email, password }
}
