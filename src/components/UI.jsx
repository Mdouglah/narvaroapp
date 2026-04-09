import { initials } from '../data.js'
import styles from './UI.module.css'

export function Badge({ color = 'ok', children, size = 'md' }) {
  return (
    <span className={`${styles.badge} ${styles[`badge_${color}`]} ${styles[`badge_${size}`]}`}>
      {children}
    </span>
  )
}

export function Avatar({ name, color = 'ok', size = 'md' }) {
  return (
    <div className={`${styles.avatar} ${styles[`avatar_${color}`]} ${styles[`avatar_${size}`]}`}>
      {initials(name)}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>
}

export function SectionTitle({ children }) {
  return <h2 className={styles.sectionTitle}>{children}</h2>
}

export function StatPill({ label, value, color }) {
  return (
    <div className={`${styles.statPill} ${color ? styles[`statPill_${color}`] : ''}`}>
      <span className={styles.statVal}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

export function CheckItem({ checked, onClick, children }) {
  return (
    <div className={styles.checkItem} onClick={onClick}>
      <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
        {checked && <CheckIcon />}
      </div>
      <span className={`${styles.checkText} ${checked ? styles.checkTextDone : ''}`}>{children}</span>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function WarnBanner({ children }) {
  return <div className={styles.warnBanner}>{children}</div>
}

export function EmptyState({ text }) {
  return <div className={styles.empty}>{text}</div>
}

export function LogEntry({ entry }) {
  const colorMap = {
    'Notering': 'info',
    'Kontakt': 'ok',
    'Möte': 'warn',
    'Kartläggning': 'warn',
    'Utredning': 'danger',
  }
  return (
    <div className={styles.logEntry}>
      <div className={styles.logMeta}>
        <span className={styles.logDate}>{entry.date}</span>
        <Badge color={colorMap[entry.type] || 'info'} size="sm">{entry.type}</Badge>
      </div>
      <div className={styles.logText}>{entry.text}</div>
    </div>
  )
}
