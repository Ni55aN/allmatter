export function InteractiveMenuItem({ label, children }: { label: string, children: any }) {
  return (
    <div onClick={e => e.stopPropagation()}>
      <div>{label}</div>
      {children}
    </div>
  )
}
