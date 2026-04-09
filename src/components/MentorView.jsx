import { useState } from 'react'
import { getStegColor, getStegLabel } from '../data.js'
import { Badge, Avatar, Card, StatPill, WarnBanner, EmptyState, LogEntry, CheckItem } from './UI.jsx'
import styles from './MentorView.module.css'

const STEG2_ITEMS = [
  { key: 'k1', label: 'Hemmet informerat – möte bokat (kartläggning 1)' },
  { key: 'k2', label: 'Kartläggning genomförd med elev och vårdnadshavare' },
  { key: 'k3', label: 'Åtgärder beslutade och dokumenterade' },
  { key: 'k4', label: 'Samrådsmöte/handlingsplan upprättad' },
]

const LOG_TYPES = ['Notering', 'Kontakt', 'Möte', 'Kartläggning', 'Utredning']

export default function MentorView({ students, addLog, toggleSteg2Check, toggleSteg3Check, addStudent, updateAbsence }) {
  const [activeTab, setActiveTab] = useState('elever')
  const [selectedId, setSelectedId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', klass: '', dagarIFoljd: 0, separataTillfallen: 0, totalProcent: 0 })
  const [logText, setLogText] = useState('')
  const [logType, setLogType] = useState('Notering')

  const selected = students.find(s => s.id === selectedId)
  const warnings = students.filter(s => s.steg >= 2)

  function handleAddLog() {
    if (!logText.trim() || !selectedId) return
    addLog(selectedId, logType, logText)
    setLogText('')
  }

  function handleAddStudent(e) {
    e.preventDefault()
    if (!newStudent.name.trim() || !newStudent.klass.trim()) return
    addStudent(newStudent)
    setNewStudent({ name: '', klass: '', dagarIFoljd: 0, separataTillfallen: 0, totalProcent: 0 })
    setShowAddForm(false)
  }

  return (
    <div>
      <div className={styles.tabs}>
        {['elever', 'trappa', 'dokumentation'].map(t => (
          <button key={t} className={`${styles.tab} ${activeTab === t ? styles.active : ''}`} onClick={() => setActiveTab(t)}>
            {t === 'elever' ? 'Elever' : t === 'trappa' ? 'Trappguide' : 'Dokumentation'}
          </button>
        ))}
      </div>

      {activeTab === 'elever' && (
        <div>
          {warnings.length > 0 && (
            <WarnBanner>
              <div className={styles.warnTitle}>Elever som kräver åtgärd ({warnings.length})</div>
              {warnings.map(s => {
                const reasons = []
                if (s.dagarIFoljd >= 6) reasons.push(`${s.dagarIFoljd} dagar i följd`)
                if (s.separataTillfallen >= 6) reasons.push(`${s.separataTillfallen} separata tillfällen`)
                if (s.totalProcent >= 15) reasons.push(`${s.totalProcent}% total frånvaro`)
                return (
                  <div key={s.id} className={styles.warnItem} onClick={() => { setSelectedId(s.id); setActiveTab('trappa') }}>
                    <strong>{s.name}</strong> — {reasons.join(', ')}
                    <span className={styles.warnArrow}>→</span>
                  </div>
                )
              })}
            </WarnBanner>
          )}

          <div className={styles.listHeader}>
            <span className={styles.listCount}>{students.length} elever</span>
            <button className={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
              + Lägg till elev
            </button>
          </div>

          {showAddForm && (
            <Card className={styles.addForm}>
              <div className={styles.formTitle}>Ny elev</div>
              <form onSubmit={handleAddStudent} className={styles.formGrid}>
                <input placeholder="Namn" value={newStudent.name} onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))} className={styles.input} />
                <input placeholder="Klass (t.ex. 7A)" value={newStudent.klass} onChange={e => setNewStudent(p => ({ ...p, klass: e.target.value }))} className={styles.input} />
                <div className={styles.absRow}>
                  <label>Dagar i följd</label>
                  <input type="number" min="0" value={newStudent.dagarIFoljd} onChange={e => setNewStudent(p => ({ ...p, dagarIFoljd: Number(e.target.value) }))} className={styles.inputNum} />
                </div>
                <div className={styles.absRow}>
                  <label>Separata tillfällen</label>
                  <input type="number" min="0" value={newStudent.separataTillfallen} onChange={e => setNewStudent(p => ({ ...p, separataTillfallen: Number(e.target.value) }))} className={styles.inputNum} />
                </div>
                <div className={styles.absRow}>
                  <label>Total frånvaro (%)</label>
                  <input type="number" min="0" max="100" value={newStudent.totalProcent} onChange={e => setNewStudent(p => ({ ...p, totalProcent: Number(e.target.value) }))} className={styles.inputNum} />
                </div>
                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveBtn}>Spara</button>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowAddForm(false)}>Avbryt</button>
                </div>
              </form>
            </Card>
          )}

          <div className={styles.studentList}>
            {students.map(s => {
              const color = getStegColor(s.steg)
              return (
                <Card key={s.id} className={`${styles.studentCard} ${selectedId === s.id ? styles.selectedCard : ''}`}>
                  <div className={styles.studentRow} onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}>
                    <Avatar name={s.name} color={color} />
                    <div className={styles.studentInfo}>
                      <div className={styles.studentName}>{s.name}</div>
                      <div className={styles.studentKlass}>{s.klass}</div>
                    </div>
                    <div className={styles.studentStats}>
                      <StatPill label="i följd" value={s.dagarIFoljd} color={s.dagarIFoljd >= 6 ? 'danger' : undefined} />
                      <StatPill label="tillfällen" value={s.separataTillfallen} color={s.separataTillfallen >= 6 ? 'danger' : undefined} />
                      <StatPill label="totalt" value={`${s.totalProcent}%`} color={s.totalProcent >= 15 ? 'danger' : s.totalProcent >= 10 ? 'warn' : undefined} />
                    </div>
                    <Badge color={color}>{getStegLabel(s.steg)}</Badge>
                  </div>

                  {selectedId === s.id && (
                    <div className={styles.expandedStudent}>
                      <div className={styles.absenceEdit}>
                        <div className={styles.absTitle}>Uppdatera frånvaro</div>
                        <div className={styles.absFields}>
                          <div className={styles.absField}>
                            <label>Dagar i följd</label>
                            <input type="number" min="0" value={s.dagarIFoljd} onChange={e => updateAbsence(s.id, 'dagarIFoljd', e.target.value)} className={styles.inputNum} />
                          </div>
                          <div className={styles.absField}>
                            <label>Separata tillfällen</label>
                            <input type="number" min="0" value={s.separataTillfallen} onChange={e => updateAbsence(s.id, 'separataTillfallen', e.target.value)} className={styles.inputNum} />
                          </div>
                          <div className={styles.absField}>
                            <label>Total (%)</label>
                            <input type="number" min="0" max="100" value={s.totalProcent} onChange={e => updateAbsence(s.id, 'totalProcent', e.target.value)} className={styles.inputNum} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.expandedActions}>
                        <button className={styles.actionBtn} onClick={() => { setSelectedId(s.id); setActiveTab('trappa') }}>Öppna trappguide →</button>
                        <button className={styles.actionBtn} onClick={() => { setSelectedId(s.id); setActiveTab('dokumentation') }}>Se dokumentation →</button>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'trappa' && (
        <div>
          <div className={styles.studentPicker}>
            <span className={styles.pickerLabel}>Välj elev:</span>
            <div className={styles.pickerList}>
              {students.map(s => (
                <button key={s.id} className={`${styles.pickerBtn} ${selectedId === s.id ? styles.pickerActive : ''}`} onClick={() => setSelectedId(s.id)}>
                  <Avatar name={s.name} color={getStegColor(s.steg)} size="sm" />
                  <span>{s.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {!selected && <EmptyState text="Välj en elev ovan för att se trappguiden." />}

          {selected && (
            <div>
              <div className={styles.trappHeader}>
                <Avatar name={selected.name} color={getStegColor(selected.steg)} size="lg" />
                <div>
                  <div className={styles.trappName}>{selected.name}</div>
                  <div className={styles.trappKlass}>{selected.klass} · <Badge color={getStegColor(selected.steg)}>{getStegLabel(selected.steg)}</Badge></div>
                </div>
              </div>

              <div className={styles.stepProgress}>
                {[1, 2, 3].map((n, i) => (
                  <div key={n} className={styles.stepProgressItem}>
                    <div className={`${styles.stepDot} ${selected.steg >= n ? styles.stepDotActive : ''} ${selected.steg > n ? styles.stepDotDone : ''}`}>{n}</div>
                    {i < 2 && <div className={`${styles.stepLine} ${selected.steg > n ? styles.stepLineDone : ''}`} />}
                  </div>
                ))}
              </div>

              <Card className={styles.stegCard}>
                <div className={`${styles.stegStripe} ${styles.stripe1}`} />
                <div className={styles.stegContent}>
                  <div className={styles.stegNum}>Trappsteg 1 – Frånvaro</div>
                  <div className={styles.stegRole}>Ansvarig: Mentor</div>
                  <div className={styles.stegItems}>
                    {[
                      'Registrera frånvaro dagligen i Infomentor',
                      'Veckovisa avstämningar – närvaro som punkt på arbetslagsmöten',
                      'Kontakta hemmet om orsaken till frånvaro',
                      'Ta upp närvaro på utvecklingssamtal',
                    ].map((item, i) => <div key={i} className={styles.stegItem}>• {item}</div>)}
                  </div>
                </div>
              </Card>

              {selected.steg >= 2 && (
                <Card className={styles.stegCard}>
                  <div className={`${styles.stegStripe} ${styles.stripe2}`} />
                  <div className={styles.stegContent}>
                    <div className={styles.stegNum}>Trappsteg 2 – Hög frånvaro</div>
                    <div className={styles.stegRole}>Ansvarig: Mentor + Elevhälsan</div>
                    <div className={styles.triggerBox}>
                      Utlöses vid: 6 dagar i följd, 6 separata tillfällen, eller 15% total frånvaro (utan medicinsk orsak)
                    </div>
                    <div className={styles.checkSection}>
                      <div className={styles.checkTitle}>Checklista</div>
                      {STEG2_ITEMS.map(item => (
                        <CheckItem key={item.key} checked={selected.steg2Checks[item.key]} onClick={() => toggleSteg2Check(selected.id, item.key)}>
                          {item.label}
                        </CheckItem>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {selected.steg >= 3 && (
                <Card className={styles.stegCard}>
                  <div className={`${styles.stegStripe} ${styles.stripe3}`} />
                  <div className={styles.stegContent}>
                    <div className={styles.stegNum}>Trappsteg 3 – Problematisk frånvaro</div>
                    <div className={styles.stegRole}>Ansvarig: Elevhälsan</div>
                    <div className={styles.triggerBox} style={{ background: 'var(--danger-light)', borderColor: '#e8a5a5' }}>
                      Ärendet överlämnas nu till elevhälsan för fördjupad utredning.
                    </div>
                    <div className={styles.checkSection}>
                      <div className={styles.checkTitle}>Status utredning</div>
                      {[
                        { key: 'u1', label: 'Ärendet överlämnat till elevhälsan' },
                        { key: 'u2', label: 'Fördjupad utredning genomförd' },
                        { key: 'u3', label: 'Tvärprofessionell analys klar' },
                        { key: 'u4', label: 'Samråds-/nätverksmöte genomfört' },
                      ].map(item => (
                        <CheckItem key={item.key} checked={selected.steg3Checks[item.key]} onClick={() => toggleSteg3Check(selected.id, item.key)}>
                          {item.label}
                        </CheckItem>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {selected.steg < 2 && (
                <div className={styles.noActionNeeded}>
                  <div className={styles.noActionIcon}>✓</div>
                  <div>Inga åtgärder krävs ännu. Fortsätt med rutinmässig närvaroregistrering.</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'dokumentation' && (
        <div>
          <div className={styles.studentPicker}>
            <span className={styles.pickerLabel}>Välj elev:</span>
            <div className={styles.pickerList}>
              {students.map(s => (
                <button key={s.id} className={`${styles.pickerBtn} ${selectedId === s.id ? styles.pickerActive : ''}`} onClick={() => setSelectedId(s.id)}>
                  <Avatar name={s.name} color={getStegColor(s.steg)} size="sm" />
                  <span>{s.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {!selected && <EmptyState text="Välj en elev ovan för att se dokumentationen." />}

          {selected && (
            <Card>
              <div className={styles.docHeader}>
                <Avatar name={selected.name} color={getStegColor(selected.steg)} />
                <div>
                  <div className={styles.docName}>{selected.name}</div>
                  <div className={styles.docKlass}>{selected.klass}</div>
                </div>
              </div>

              <div className={styles.logForm}>
                <select value={logType} onChange={e => setLogType(e.target.value)} className={styles.logSelect}>
                  {LOG_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <input
                  className={styles.logInput}
                  placeholder="Skriv anteckning..."
                  value={logText}
                  onChange={e => setLogText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddLog()}
                />
                <button className={styles.logBtn} onClick={handleAddLog}>Spara</button>
              </div>

              <div className={styles.logList}>
                {selected.logs.length === 0
                  ? <EmptyState text="Inga loggposter ännu." />
                  : selected.logs.map(l => <LogEntry key={l.id} entry={l} />)
                }
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
