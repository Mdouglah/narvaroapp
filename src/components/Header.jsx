import styles from './Header.module.css'

const ROLES = [
  { value: 'mentor', label: 'Mentor' },
  { value: 'elevhalsa', label: 'Elevhälsan' },
  { value: 'rektor', label: 'Rektor' },
]

export default function Header({ role, setRole }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>N</div>
          <div>
            <div className={styles.title}>Närvaro</div>
            <div className={styles.school}>Bergvretenskolan</div>
          </div>
        </div>
        <div className={styles.roleBar}>
          <span className={styles.roleLabel}>Roll:</span>
          <div className={styles.roleTabs}>
            {ROLES.map(r => (
              <button
                key={r.value}
                className={`${styles.roleBtn} ${role === r.value ? styles.active : ''}`}
                onClick={() => setRole(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
