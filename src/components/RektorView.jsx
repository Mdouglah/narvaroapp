import { getStegColor, getStegLabel } from '../data.js'
import { Badge, Avatar, Card } from './UI.jsx'
import styles from './RektorView.module.css'

export default function RektorView({ students }) {
  const steg1 = students.filter(s => s.steg === 1)
  const steg2 = students.filter(s => s.steg === 2)
  const steg3 = students.filter(s => s.steg === 3)

  const avgAbsence = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.totalProcent, 0) / students.length)
    : 0

  const klasserMap = {}
  students.forEach(s => {
    if (!klasserMap[s.klass]) klasserMap[s.klass] = []
    klasserMap[s.klass].push(s)
  })

  return (
    <div>
      <div className={styles.metricGrid}>
        <div className={styles.metric}>
          <div className={styles.metricVal} style={{ color: 'var(--accent)' }}>{steg1.length}</div>
          <div className={styles.metricLabel}>Normal närvaro</div>
          <div className={styles.metricSub}>Trappsteg 1</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricVal} style={{ color: 'var(--warn)' }}>{steg2.length}</div>
          <div className={styles.metricLabel}>Hög frånvaro</div>
          <div className={styles.metricSub}>Trappsteg 2</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricVal} style={{ color: 'var(--danger)' }}>{steg3.length}</div>
          <div className={styles.metricLabel}>Problematisk</div>
          <div className={styles.metricSub}>Trappsteg 3</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricVal}>{students.length}</div>
          <div className={styles.metricLabel}>Totalt antal elever</div>
          <div className={styles.metricSub}>Genomsnitt {avgAbsence}% frånvaro</div>
        </div>
      </div>

      {steg3.length > 0 && (
        <Card className={styles.alertCard}>
          <div className={styles.alertTitle}>Elever med problematisk frånvaro – kräver åtgärd</div>
          {steg3.map(s => (
            <div key={s.id} className={styles.alertRow}>
              <Avatar name={s.name} color="danger" size="sm" />
              <span className={styles.alertName}>{s.name}</span>
              <span className={styles.alertKlass}>{s.klass}</span>
              <span className={styles.alertStats}>{s.totalProcent}% total frånvaro</span>
              <Badge color="danger">Steg 3</Badge>
            </div>
          ))}
        </Card>
      )}

      {Object.entries(klasserMap).sort().map(([klass, elever]) => (
        <Card key={klass} className={styles.klassCard}>
          <div className={styles.klassHeader}>
            <span className={styles.klassTitle}>{klass}</span>
            <span className={styles.klassCount}>{elever.length} elever</span>
          </div>
          {elever.map(s => (
            <div key={s.id} className={styles.elevRow}>
              <Avatar name={s.name} color={getStegColor(s.steg)} size="sm" />
              <span className={styles.elevName}>{s.name}</span>
              <span className={styles.elevStats}>{s.dagarIFoljd}d · {s.separataTillfallen}t · {s.totalProcent}%</span>
              <Badge color={getStegColor(s.steg)} size="sm">{getStegLabel(s.steg)}</Badge>
            </div>
          ))}
        </Card>
      ))}
    </div>
  )
}
