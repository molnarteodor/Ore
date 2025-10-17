import React, { useState } from 'react'
import DayEditor from './DayEditor'
import MonthView from './MonthView'
import { totalMonth, loadData, saveData } from './utils'
import dayjs from 'dayjs'

export default function App() {
  const today = dayjs().format('YYYY-MM-DD')
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedMonth, setSelectedMonth] = useState(today.slice(0,7))

  const refresh = ()=> {
    // force re-render by toggling state
    setSelectedDate(d=>d)
  }

  const exportJSON = () => {
    const data = loadData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `work-hours-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJSON = (files) => {
    if (!files || !files[0]) return
    const fr = new FileReader()
    fr.onload = (e) => {
      try {
        const obj = JSON.parse(e.target.result)
        saveData(obj)
        alert('Import reușit')
        refresh()
      } catch(err) {
        alert('Fișier invalid')
      }
    }
    fr.readAsText(files[0])
  }

  const goPrev = () => setSelectedDate(dayjs(selectedDate).subtract(1,'day').format('YYYY-MM-DD'))
  const goNext = () => setSelectedDate(dayjs(selectedDate).add(1,'day').format('YYYY-MM-DD'))

  return (
    <div className="container">
      <header>
        <h1>Work Hours</h1>
        <p>Monitorizează orele — PWA pentru iPhone/Android</p>
      </header>

      <section className="controls">
        <div>
          <label>Alege data</label>
          <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)}/>
          <button onClick={goPrev}>◀</button>
          <button onClick={goNext}>▶</button>
        </div>

        <div>
          <label>Alege luna</label>
          <input type="month" value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}/>
        </div>

        <div className="backup">
          <button onClick={exportJSON}>Export (backup)</button>
          <input type="file" accept="application/json" onChange={(e)=>importJSON(e.target.files)} />
        </div>

      </section>

      <main>
        <DayEditor dateISO={selectedDate} onSaved={refresh} />
        <MonthView monthKey={selectedMonth} onEdit={d=>setSelectedDate(d)} />
      </main>

      <footer>
        <small>Aplicație locală — datele se păstrează pe telefonul tău.</small>
      </footer>
    </div>
  )
}
