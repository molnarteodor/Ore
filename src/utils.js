import dayjs from 'dayjs'

export const STORAGE_KEY = 'work_hours_v1'

// Data model: { "YYYY-MM": { "YYYY-MM-DD": { start: "08:00", end: "16:30", note:"" } } }

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : {}
}
export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function setEntry(dateISO, entry) {
  const data = loadData()
  const monthKey = dateISO.slice(0,7)
  if (!data[monthKey]) data[monthKey] = {}
  data[monthKey][dateISO] = entry
  saveData(data)
}

export function deleteEntry(dateISO) {
  const data = loadData()
  const monthKey = dateISO.slice(0,7)
  if (data[monthKey]) {
    delete data[monthKey][dateISO]
    saveData(data)
  }
}

export function calcHours(start, end) {
  // inputs "HH:mm" ; returns decimal hours (e.g. 8.5) and formatted "8:30"
  if (!start || !end) return { hours: 0, hhmm: '0:00' }
  const today = dayjs().format('YYYY-MM-DD')
  let s = dayjs(`${today}T${start}`)
  let e = dayjs(`${today}T${end}`)
  // if end before start => next day
  if (e.isBefore(s) || e.isSame(s)) e = e.add(1, 'day')
  const minutes = e.diff(s, 'minute')
  const hours = +(minutes / 60).toFixed(2)
  const hh = Math.floor(minutes/60)
  const mm = minutes % 60
  return { hours, hhmm: `${hh}:${mm.toString().padStart(2,'0')}` }
}

export function totalMonth(monthKey) {
  const data = loadData()
  const month = data[monthKey] || {}
  let total = 0
  for (const date in month) {
    const e = month[date]
    const c = calcHours(e.start, e.end)
    total += c.hours
  }
  return +total.toFixed(2)
}
