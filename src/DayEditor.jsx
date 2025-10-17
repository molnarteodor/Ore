import React, { useState, useEffect } from 'react'
import { setEntry, deleteEntry, loadData, calcHours } from './utils'

export default function DayEditor({ dateISO, onSaved }) {
  const [entry, setE] = useState({ start: '', end: '', note: '' })

  useEffect(()=>{
    const data = loadData()
    const monthKey = dateISO.slice(0,7)
    if (data[monthKey] && data[monthKey][dateISO]) setE(data[monthKey][dateISO])
    else setE({ start:'', end:'', note:'' })
  }, [dateISO])

  const save = () => {
    setEntry(dateISO, entry)
    onSaved()
  }
  const del = () => {
    deleteEntry(dateISO)
    setE({ start:'', end:'', note:'' })
    onSaved()
  }
  const c = calcHours(entry.start, entry.end)

  return (
    <div className="card">
      <h3>Zi: {dateISO}</h3>
      <div className="row">
        <label>Ora sosire</label>
        <input type="time" value={entry.start} onChange={e=>setE({...entry, start: e.target.value})}/>
      </div>
      <div className="row">
        <label>Ora plecare</label>
        <input type="time" value={entry.end} onChange={e=>setE({...entry, end: e.target.value})}/>
      </div>
      <div className="row">
        <label>Notițe</label>
        <input value={entry.note} onChange={e=>setE({...entry, note: e.target.value})}/>
      </div>
      <div className="row">
        <strong>Lucrate:</strong> {c.hhmm} ({c.hours} ore)
      </div>
      <div className="actions">
        <button onClick={save}>Salvează</button>
        <button onClick={del} className="danger">Șterge</button>
      </div>
    </div>
  )
}
