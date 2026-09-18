import { Link } from 'react-router-dom'

export default function EmptyState({ title, actionLabel, actionTo }) {
  return (
    <section className="empty-state">
      <h2>{title}</h2>
      {actionLabel && actionTo && (
        <Link className="button" to={actionTo}>
          {actionLabel}
        </Link>
      )}
    </section>
  )
}
