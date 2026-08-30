import type { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"
import { resolveAdminBootstrapDecision } from "../lib/admin-bootstrap"

/**
 * Optional one-time Medusa admin bootstrap for Docker/production.
 *
 * Runs only when BOTH MEDUSA_ADMIN_EMAIL and MEDUSA_ADMIN_PASSWORD are set.
 * Skips cleanly if the email already exists. Never logs the password.
 *
 * After the first successful create, remove MEDUSA_ADMIN_PASSWORD from the
 * production .env (and ideally MEDUSA_ADMIN_EMAIL too) so later boots stay inert.
 */
export default async function bootstrapAdmin({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const userModule = container.resolve(Modules.USER)
  const authModule = container.resolve(Modules.AUTH)
  const workflowEngine = container.resolve(Modules.WORKFLOW_ENGINE)

  const emailEnv = process.env.MEDUSA_ADMIN_EMAIL
  const passwordEnv = process.env.MEDUSA_ADMIN_PASSWORD

  const emailHint = emailEnv?.trim()
  let alreadyExists = false

  if (emailHint) {
    const existing = await userModule.listUsers({ email: emailHint })
    alreadyExists = existing.length > 0
  }

  const decision = resolveAdminBootstrapDecision(
    { email: emailEnv, password: passwordEnv },
    alreadyExists
  )

  switch (decision.action) {
    case "skip_unset":
      logger.info(
        "Admin bootstrap inactive (MEDUSA_ADMIN_EMAIL and MEDUSA_ADMIN_PASSWORD unset)."
      )
      return
    case "skip_partial":
      logger.warn(
        `Admin bootstrap skipped: set both MEDUSA_ADMIN_EMAIL and MEDUSA_ADMIN_PASSWORD. Missing: ${decision.missing.join(", ")}.`
      )
      return
    case "skip_exists":
      logger.info(
        `Admin bootstrap skipped: user ${decision.email} already exists. Remove MEDUSA_ADMIN_PASSWORD from .env.`
      )
      return
    case "create":
      break
  }

  let userRoles: string[] = []
  const rbacEnabled = FeatureFlag.isFeatureEnabled("rbac")
  if (rbacEnabled) {
    const rbacService = container.resolve(Modules.RBAC)
    const superAdminRoles = await rbacService.listRbacRoles({
      id: "role_super_admin",
    })
    if (superAdminRoles.length > 0) {
      userRoles = [superAdminRoles[0].id]
      logger.info("Admin bootstrap: assigning super admin role.")
    }
  }

  const { result: users } = await workflowEngine.run("create-users-workflow", {
    input: {
      users: [
        {
          email: decision.email,
          roles: userRoles,
        },
      ],
    },
  })

  const user = users[0]
  const { authIdentity, error } = await authModule.register("emailpass", {
    body: {
      email: decision.email,
      password: decision.password,
    },
  })

  if (error || !authIdentity) {
    logger.error(
      `Admin bootstrap failed while registering auth identity for ${decision.email}.`
    )
    throw new Error(error ? String(error) : "Auth identity was not created.")
  }

  await authModule.updateAuthIdentities({
    id: authIdentity.id,
    app_metadata: {
      user_id: user.id,
    },
  })

  logger.info(
    `Admin bootstrap created user ${decision.email}. Remove MEDUSA_ADMIN_PASSWORD from the production .env before the next deploy.`
  )
}
