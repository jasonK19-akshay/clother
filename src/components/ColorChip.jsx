export default function ColorChip({ color, removable = false, onRemove, compact = false }) {
  return (
    <span className={`color-chip ${compact ? 'compact' : ''}`}>
      <span
        className="swatch"
        style={{ backgroundColor: color.hex }}
        aria-hidden="true"
      />
      <span>{color.name}</span>
      {removable && (
        <button type="button" className="chip-remove" onClick={onRemove} aria-label={`Remove ${color.name}`}>
          x
        </button>
      )}
    </span>
  )
}
