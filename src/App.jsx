import { useState } from 'react'
import { INITIAL_STUDENTS, getSteg } from './data.js'
import Header from './components/Header.jsx'
import MentorView from './components/MentorView.jsx'
import ElevhalsaView from './components/ElevhalsaView.jsx'
import RektorView from './components/RektorView.jsx'
import styles from './App.module.css'

export default function App() {
  const [role, setRole] = useState('mentor')
  const [students, setStudents] = useState(INITIAL_STUDENTS)

  function updateStudent(id, updater) {
    setStudents(prev => prev.map(s => s.id === id ? updater(s) : s))
  }

  function addLog(studentId, type, text) {
    updateStudent(studentId, s => ({
      ...s,
      logs: [
        { id: Date.now(), date: new Date().toISOString().slice(0, 10), type, text },
        ...s.logs,
      ]
    }))
  }

  function toggleSteg2Check(studentId, key) {
    updateStudent(studentId, s => ({
      ...s,
      steg2Checks: { ...s.steg2Checks, [key]: !s.steg2Checks[key] }
    }))
  }

  function toggleSteg3Check(studentId, key) {
    updateStudent(studentId, s => ({
      ...s,
      steg3Checks: { ...s.steg3Checks, [key]: !s.steg3Checks[key] }
    }))
  }

  function addStudent(data) {
    const newStudent = {
      id: Date.now(),
      ...data,
      logs: [],
      steg2Checks: { k1: false, k2: false, k3: false, k4: false },
      steg3Checks: { u1: false, u2: false, u3: false, u4: false },
    }
    setStudents(prev => [...prev, newStudent])
  }

  function updateAbsence(studentId, field, value) {
    updateStudent(studentId, s => ({ ...s, [field]: Number(value) }))
  }

  const enriched = students.map(s => ({ ...s, steg: getSteg(s) }))

  return (
    <div className={styles.app}>
      <Header role={role} setRole={setRole} />
      <main className={styles.main}>
        {role === 'mentor' && (
          <MentorView
            students={enriched}
            addLog={addLog}
            toggleSteg2Check={toggleSteg2Check}
            toggleSteg3Check={toggleSteg3Check}
            addStudent={addStudent}
            updateAbsence={updateAbsence}
          />
        )}
        {role === 'elevhalsa' && (
          <ElevhalsaView
            students={enriched}
            addLog={addLog}
            toggleSteg3Check={toggleSteg3Check}
          />
        )}
        {role === 'rektor' && (
          <RektorView students={enriched} />
        )}
      </main>
    </div>
  )
}
