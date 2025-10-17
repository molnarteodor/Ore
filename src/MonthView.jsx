import React from 'react'
import { loadData, calcHours, totalMonth } from './utils'

export default function MonthView({ monthKey, onEdit }) {
  const data = loadData()
  const month = data[monthKey] || {}
  // show all days of month
  const [year, mon] = monthKey.split('-')
  const daysInMonth = new Date(+year, +mon, 0).getDate()
  const rows = []
  for (let d=1; d<=daysInMonth; d++) {
    const dd = `${monthKey}-${d.toString().padStart(2,'0')}`
    const entry = month[dd]
    const c = entry ? calcHours(entry.start, entry.end) : { hhmm: '0:00', hours: 0 }
    rows.push({ date: dd, start: entry?.start || '-', end: entry?.end || '-', hhmm: c.hhmm, hours: c.hours })
  }
  const total = totalMonth(monthKey)
  return (
    <div>
      <h3>Luna: {monthKey} — Total: {total} ore</h3>
      <table className="month-table">
        <thead><tr><th>Zi</th><th>Start</th><th>End</th><th>Lucrate</th><th>Acțiuni</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.date}>
              <td>{r.date}</td>
              <td>{r.start}</td>
              <td>{r.end}</td>
              <td>{r.hhmm} ({r.hours})</td>
              <td><button onClick={()=>onEdit(r.date)}>Editează</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
