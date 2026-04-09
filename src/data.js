export const INITIAL_STUDENTS = [
  {
    id: 1,
    name: 'Alva Bergström',
    klass: '7A',
    mentor: 'Mentor',
    dagarIFoljd: 7,
    separataTillfallen: 3,
    totalProcent: 8,
    logs: [
      { id: 1, date: '2026-03-10', type: 'Möte', text: 'Möte med vårdnadshavare. Frånvaro och orsaker diskuterades.' },
      { id: 2, date: '2026-03-05', type: 'Kontakt', text: 'Telefonsamtal med hemmet angående frånvaro på måndagar.' },
    ],
    steg2Checks: { k1: true, k2: false, k3: false, k4: false },
    steg3Checks: { u1: false, u2: false, u3: false, u4: false },
  },
  {
    id: 2,
    name: 'Björn Lindqvist',
    klass: '7A',
    mentor: 'Mentor',
    dagarIFoljd: 2,
    separataTillfallen: 2,
    totalProcent: 4,
    logs: [
      { id: 1, date: '2026-03-12', type: 'Notering', text: 'Frånvaro registrerad. Inga åtgärder behövs ännu.' },
    ],
    steg2Checks: { k1: false, k2: false, k3: false, k4: false },
    steg3Checks: { u1: false, u2: false, u3: false, u4: false },
  },
  {
    id: 3,
    name: 'Cecilia Morin',
    klass: '8B',
    mentor: 'Mentor',
    dagarIFoljd: 6,
    separataTillfallen: 6,
    totalProcent: 16,
    logs: [
      { id: 1, date: '2026-03-01', type: 'Utredning', text: 'Ärendet överlämnat till elevhälsan för fördjupad utredning.' },
      { id: 2, date: '2026-02-20', type: 'Möte', text: 'Samrådsmöte genomfört. Handlingsplan upprättad.' },
      { id: 3, date: '2026-02-10', type: 'Kartläggning', text: 'Kartläggning 1 genomförd tillsammans med elev och vårdnadshavare.' },
    ],
    steg2Checks: { k1: true, k2: true, k3: true, k4: true },
    steg3Checks: { u1: true, u2: false, u3: false, u4: false },
  },
  {
    id: 4,
    name: 'David Ekman',
    klass: '8B',
    mentor: 'Mentor',
    dagarIFoljd: 1,
    separataTillfallen: 1,
    totalProcent: 2,
    logs: [],
    steg2Checks: { k1: false, k2: false, k3: false, k4: false },
    steg3Checks: { u1: false, u2: false, u3: false, u4: false },
  },
  {
    id: 5,
    name: 'Elsa Nilsson',
    klass: '9C',
    mentor: 'Mentor',
    dagarIFoljd: 4,
    separataTillfallen: 5,
    totalProcent: 11,
    logs: [
      { id: 1, date: '2026-03-08', type: 'Kontakt', text: 'Kontakt tagen med hemmet. Möte inbokat till nästa vecka.' },
    ],
    steg2Checks: { k1: true, k2: false, k3: false, k4: false },
    steg3Checks: { u1: false, u2: false, u3: false, u4: false },
  },
]

export function getSteg(student) {
  const { dagarIFoljd, separataTillfallen, totalProcent } = student
  if (dagarIFoljd >= 6 && separataTillfallen >= 6 && totalProcent >= 15) return 3
  if (dagarIFoljd >= 6 || separataTillfallen >= 6 || totalProcent >= 15) return 2
  return 1
}

export function getStegLabel(steg) {
  if (steg === 3) return 'Problematisk'
  if (steg === 2) return 'Hög frånvaro'
  return 'Normal'
}

export function getStegColor(steg) {
  if (steg === 3) return 'danger'
  if (steg === 2) return 'warn'
  return 'ok'
}

export function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}
