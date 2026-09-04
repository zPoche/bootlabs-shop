import { PSU_RESERVE_RATIO } from "./catalog"
import type {
  CompatibilityIssue,
  CompatibilityResult,
  ComponentRef,
  ComponentSpec,
  ComponentType,
  PowerConnector,
} from "./types"

function specOf(item: ComponentRef | undefined): ComponentSpec {
  return (item?.specifications ?? {}) as ComponentSpec
}

function pick(selected: ComponentRef[], type: ComponentType): ComponentRef | undefined {
  return selected.find((item) => item.type === type)
}

function issue(
  ruleId: CompatibilityResult["issues"][number]["ruleId"],
  severity: CompatibilityIssue["severity"],
  message: string
): CompatibilityIssue {
  return { ruleId, severity, message }
}

export function estimatePowerWatt(selected: ComponentRef[]): number {
  return selected.reduce((sum, item) => {
    if (item.type !== "cpu" && item.type !== "gpu") {
      return sum
    }
    return sum + (specOf(item).tdpWatts ?? 0)
  }, 80)
}

function gpuNeeds12vhpwr(gpu: ComponentRef | undefined): boolean {
  return specOf(gpu).powerConnector === "12vhpwr"
}

function psuHasConnector(
  psu: ComponentRef | undefined,
  connector: PowerConnector
): boolean {
  const spec = specOf(psu)
  if (connector === "12vhpwr") {
    return Boolean(spec.has12vhpwr || spec.connectors?.includes("12vhpwr"))
  }
  return Boolean(spec.connectors?.includes(connector) || spec.connectors?.includes("8+8pin"))
}

export function evaluateCompatibility(
  selected: ComponentRef[]
): CompatibilityResult {
  const cpu = pick(selected, "cpu")
  const mainboard = pick(selected, "mainboard")
  const ram = pick(selected, "ram")
  const gpu = pick(selected, "gpu")
  const cooler = pick(selected, "cooler")
  const pcCase = pick(selected, "case")
  const psu = pick(selected, "psu")

  const issues: CompatibilityIssue[] = []

  if (cpu && mainboard) {
    const cpuSocket = specOf(cpu).socket
    const boardSocket = specOf(mainboard).socket
    if (cpuSocket && boardSocket && cpuSocket !== boardSocket) {
      issues.push(
        issue(
          "cpu-socket-mainboard",
          "block",
          `CPU-Sockel ${cpuSocket} passt nicht zum Mainboard ${boardSocket}.`
        )
      )
    }
  }

  if (ram && mainboard) {
    const ramGen = specOf(ram).ramGeneration
    const boardGen = specOf(mainboard).ramGeneration
    if (ramGen && boardGen && ramGen !== boardGen) {
      issues.push(
        issue(
          "ram-generation-mainboard",
          "block",
          `RAM ${ramGen} passt nicht zum Mainboard (${boardGen}).`
        )
      )
    }
  }

  if (gpu && pcCase) {
    const gpuLength = specOf(gpu).lengthMm
    const maxLength = specOf(pcCase).maxGpuLengthMm
    if (gpuLength && maxLength && gpuLength > maxLength) {
      issues.push(
        issue(
          "gpu-dimensions-case",
          "block",
          `GPU ist ${gpuLength} mm lang, das Gehäuse erlaubt ${maxLength} mm.`
        )
      )
    }
  }

  if (cooler && pcCase) {
    const coolerSpec = specOf(cooler)
    const caseSpec = specOf(pcCase)
    if (
      coolerSpec.coolerType === "air" &&
      coolerSpec.heightMm &&
      caseSpec.maxCoolerHeightMm &&
      coolerSpec.heightMm > caseSpec.maxCoolerHeightMm
    ) {
      issues.push(
        issue(
          "cooler-dimensions-case",
          "block",
          `Kühler ist ${coolerSpec.heightMm} mm hoch, das Gehäuse erlaubt ${caseSpec.maxCoolerHeightMm} mm.`
        )
      )
    }
    if (
      coolerSpec.coolerType === "aio" &&
      coolerSpec.radiatorMm &&
      caseSpec.maxRadiatorMm &&
      coolerSpec.radiatorMm > caseSpec.maxRadiatorMm
    ) {
      issues.push(
        issue(
          "cooler-dimensions-case",
          "block",
          `Radiator ${coolerSpec.radiatorMm} mm passt nicht ins Gehäuse (max. ${caseSpec.maxRadiatorMm} mm).`
        )
      )
    }
  }

  const estimatedPowerWatt = estimatePowerWatt(selected)
  if (psu) {
    const wattage = specOf(psu).wattage ?? 0
    const required = Math.ceil(estimatedPowerWatt * PSU_RESERVE_RATIO)
    if (wattage && wattage < required) {
      issues.push(
        issue(
          "psu-power-reserve",
          "block",
          `Netzteil ${wattage} W ist zu knapp. Empfohlen: mindestens ${required} W inkl. Reserve.`
        )
      )
    }
  }

  if (gpu && psu) {
    const connector = specOf(gpu).powerConnector
    if (gpuNeeds12vhpwr(gpu) && !psuHasConnector(psu, "12vhpwr") && !specOf(mainboard).has12vhpwr) {
      issues.push(
        issue(
          "pcie-12vhpwr",
          "block",
          "Die GPU braucht 12VHPWR. Netzteil oder Mainboard liefern keinen passenden Anschluss."
        )
      )
    } else if (
      connector &&
      connector !== "12vhpwr" &&
      !psuHasConnector(psu, connector)
    ) {
      issues.push(
        issue(
          "pcie-12vhpwr",
          "block",
          `Die GPU braucht ${connector}, das Netzteil hat diesen Anschluss nicht.`
        )
      )
    }
  }

  if (cpu && cooler) {
    const cpuTdp = specOf(cpu).tdpWatts ?? 0
    const coolerTdp = specOf(cooler).tdpWatts ?? 0
    if (cpuTdp && coolerTdp && coolerTdp < cpuTdp) {
      issues.push(
        issue(
          "cpu-cooler-tdp",
          "warning",
          `Der Kühler ist mit ${coolerTdp} W für die CPU (${cpuTdp} W) knapp ausgelegt.`
        )
      )
    }
  }

  if (cpu && mainboard) {
    const generation = specOf(cpu).biosGeneration
    const ready = specOf(mainboard).biosReadyCpus ?? []
    if (generation && ready.length > 0 && !ready.includes(generation)) {
      issues.push(
        issue(
          "bios-compatibility",
          "warning",
          "BIOS-Update kann nötig sein, bevor die CPU startet."
        )
      )
    }
  }

  return {
    ok: !issues.some((item) => item.severity === "block"),
    engine: "active",
    issues,
    estimatedPowerWatt,
  }
}
