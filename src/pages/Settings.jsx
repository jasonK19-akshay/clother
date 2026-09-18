import { useRef, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { useTheme } from '../hooks/useTheme'
import { useWardrobe } from '../hooks/useWardrobe'
import { createBackup, downloadBackup, resetAllData, restoreBackup } from '../services/backupService'

export default function Settings() {
  const inputRef = useRef(null)
  const { theme, setTheme } = useTheme()
  const { refresh } = useWardrobe()
  const [confirmReset, setConfirmReset] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const exportData = async () => {
    downloadBackup(await createBackup())
    setToast({ message: 'Backup exported.', type: 'success' })
  }

  const importData = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const backup = JSON.parse(await file.text())
      await restoreBackup(backup)
      refresh()
      setToast({ message: 'Backup restored successfully.', type: 'success' })
    } catch (error) {
      setToast({ message: error.message || 'Could not restore backup.', type: 'error' })
    } finally {
      event.target.value = ''
    }
  }

  const reset = async () => {
    await resetAllData()
    refresh()
    setConfirmReset(false)
    setToast({ message: 'All wardrobe data has been reset.', type: 'success' })
  }

  return (
    <div className="page narrow">
      <header className="page-header">
        <div>
          <p className="eyebrow">Preferences</p>
          <h1>Settings</h1>
        </div>
      </header>
      <section className="settings-section">
        <h2>Theme</h2>
        <div className="segmented">
          <button type="button" className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>Light</button>
          <button type="button" className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>Dark</button>
        </div>
      </section>
      <section className="settings-section">
        <h2>Data Management</h2>
        <p>Export a complete JSON backup with clothing metadata, categories, and stored images.</p>
        <div className="actions">
          <button type="button" className="button" onClick={exportData}>Export Backup</button>
          <button type="button" className="button ghost" onClick={() => inputRef.current.click()}>Import Backup</button>
          <button type="button" className="button danger" onClick={() => setConfirmReset(true)}>Reset All Data</button>
        </div>
        <input ref={inputRef} className="visually-hidden" type="file" accept="application/json" onChange={importData} />
      </section>
      <ConfirmDialog
        open={confirmReset}
        title="Reset all data?"
        message="This will permanently remove all clothing items, categories, and stored images from this browser."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={reset}
      />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  )
}
