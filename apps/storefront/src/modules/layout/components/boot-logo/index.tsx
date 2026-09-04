import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BootLogoProps = {
  size?: number
  href?: string
  className?: string
}

export default function BootLogo({
  size = 35,
  href = "/",
  className,
}: BootLogoProps) {
  const mark = (
    <>
      <span className="boot-logo-word">BOOT</span>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="boot-logo-icon"
      >
        <path
          d="M50 10 V46"
          stroke="currentColor"
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M27 24 A32 32 0 1 0 73 24"
          stroke="currentColor"
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="boot-logo-word">LABS</span>
    </>
  )

  const classes = ["boot-logo", className].filter(Boolean).join(" ")

  if (href.startsWith("http")) {
    return (
      <a className={classes} href={href}>
        {mark}
      </a>
    )
  }

  return (
    <LocalizedClientLink className={classes} href={href}>
      {mark}
    </LocalizedClientLink>
  )
}
