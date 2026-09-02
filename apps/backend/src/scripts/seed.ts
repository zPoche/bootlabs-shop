import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * Phase 0 seed is intentionally empty.
 * Phase 1 will add Bootlabs PLAY / CREATE / REFRESH catalog data here.
 */
export default async function seed({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  logger.info("Phase 0: no catalog seed. Add PLAY/CREATE/REFRESH products in Phase 1.")
}
