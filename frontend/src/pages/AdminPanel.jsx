import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, ShieldAlert, ShieldCheck, Loader2, LayoutGrid, Flag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getAllSchemes, createScheme, updateScheme, deleteScheme } from '../api/schemes'
import { getAllReports, updateReportStatus } from '../api/reports'

const emptyForm = {
  schemeName: '', description: '', provider: '',
  minAge: 0, maxAge: 120, maxIncome: '',
  states: 'All', occupation: 'All', category: 'All',
  disabilityRequired: false, documentsRequired: '',
}

const REPORT_STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-600 border-amber-200',
  Reviewed: 'bg-success-bg text-success border-transparent',
  Dismissed: 'bg-gray-50 text-gray-500 border-gray-200',
}

function AdminPanel() {
  const { token } = useAuth()
  const [schemes, setSchemes] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [reports, setReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [reportsError, setReportsError] = useState('')

  async function loadSchemes() {
    try {
      const data = await getAllSchemes()
      setSchemes(data.schemes)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadReports() {
    try {
      const data = await getAllReports(token)
      setReports(data)
    } catch (err) {
      setReportsError(err.message)
    } finally {
      setReportsLoading(false)
    }
  }

  useEffect(() => {
    loadSchemes()
    loadReports()
  }, [])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function startEdit(scheme) {
    setEditingId(scheme._id)
    setForm({
      schemeName: scheme.schemeName,
      description: scheme.description,
      provider: scheme.provider,
      minAge: scheme.minAge,
      maxAge: scheme.maxAge,
      maxIncome: scheme.maxIncome === null ? '' : scheme.maxIncome,
      states: scheme.states.join(','),
      occupation: scheme.occupation.join(','),
      category: scheme.category.join(','),
      disabilityRequired: scheme.disabilityRequired,
      documentsRequired: scheme.documentsRequired?.join(', ') || '',
    })
    setShowForm(true)
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setSaving(true)
    const payload = {
      ...form,
      minAge: Number(form.minAge),
      maxAge: Number(form.maxAge),
      maxIncome: form.maxIncome === '' ? undefined : Number(form.maxIncome),
      states: form.states.split(',').map((s) => s.trim()),
      occupation: form.occupation.split(',').map((s) => s.trim()),
      category: form.category.split(',').map((s) => s.trim()),
      documentsRequired: form.documentsRequired
        ? form.documentsRequired.split(',').map((d) => d.trim()).filter(Boolean)
        : [],
    }
    try {
      if (editingId) {
        await updateScheme(token, editingId, payload)
        setMessage('Scheme updated successfully')
      } else {
        await createScheme(token, payload)
        setMessage('Scheme created successfully')
      }
      cancelEdit()
      loadSchemes()
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this scheme? This cannot be undone.')) return
    try {
      await deleteScheme(token, id)
      loadSchemes()
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function handleToggleVerified(scheme) {
    try {
      await updateScheme(token, scheme._id, { verified: !scheme.verified })
      loadSchemes()
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function handleReportStatusChange(reportId, newStatus) {
    try {
      const updated = await updateReportStatus(token, reportId, newStatus)
      setReports((prev) => prev.map((r) => (r._id === reportId ? updated : r)))
    } catch (err) {
      setReportsError(err.message)
    }
  }

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900"

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-navy-950">Admin Panel</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> New Scheme
          </button>
        )}
      </div>
      <p className="text-gray-500 mb-6">Manage government schemes and eligibility rules.</p>

      {message && (
        <div className="bg-navy-50 text-navy-900 text-sm rounded-lg px-3.5 py-2.5 mb-6 flex items-center justify-between">
          {message}
          <button onClick={() => setMessage('')}><X size={14} /></button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-navy-950">{editingId ? 'Edit Scheme' : 'Create Scheme'}</h2>
            <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input name="schemeName" value={form.schemeName} onChange={handleChange} placeholder="Scheme name" className={inputClass} required />
            <input name="provider" value={form.provider} onChange={handleChange} placeholder="Provider" className={inputClass} required />
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className={`${inputClass} mb-3`} rows={2} required />

          <div className="grid grid-cols-3 gap-3 mb-3">
            <input name="minAge" type="number" value={form.minAge} onChange={handleChange} placeholder="Min age" className={inputClass} />
            <input name="maxAge" type="number" value={form.maxAge} onChange={handleChange} placeholder="Max age" className={inputClass} />
            <input name="maxIncome" type="number" value={form.maxIncome} onChange={handleChange} placeholder="Max income" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <input name="states" value={form.states} onChange={handleChange} placeholder="States (comma or 'All')" className={inputClass} />
            <input name="occupation" value={form.occupation} onChange={handleChange} placeholder="Occupations" className={inputClass} />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Categories" className={inputClass} />
          </div>

          <input name="documentsRequired" value={form.documentsRequired} onChange={handleChange} placeholder="Documents required (comma-separated)" className={`${inputClass} mb-3`} />

          <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
            <input type="checkbox" name="disabilityRequired" checked={form.disabilityRequired} onChange={handleChange} className="w-4 h-4 accent-navy-900" />
            <span className="text-sm text-navy-900">Disability required</span>
          </label>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {editingId ? 'Update Scheme' : 'Create Scheme'}
            </button>
            <button type="button" onClick={cancelEdit} className="text-sm font-medium text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex items-center gap-2 mb-4">
        <LayoutGrid size={16} className="text-gray-400" />
        <h2 className="text-sm font-semibold text-navy-900 uppercase tracking-wide">All Schemes ({schemes.length})</h2>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : schemes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <ShieldAlert className="mx-auto text-gray-300 mb-3" size={36} />
          <p className="font-medium text-navy-900">No schemes yet</p>
          <p className="text-sm text-gray-500">Create your first scheme to get started.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-10">
          {/* Desktop table header */}
          <div className="hidden sm:grid grid-cols-[1fr_140px_90px_100px_90px] gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Scheme</span>
            <span>Provider</span>
            <span>Verified</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-gray-100">
            {schemes.map((scheme) => (
              <div key={scheme._id} className="sm:grid sm:grid-cols-[1fr_140px_90px_100px_90px] gap-4 px-5 py-4 flex flex-col sm:items-center">
                <div>
                  <p className="font-medium text-navy-950 text-sm">{scheme.schemeName}</p>
                  <p className="text-xs text-gray-400 sm:hidden">{scheme.provider}</p>
                </div>
                <p className="hidden sm:block text-sm text-gray-500">{scheme.provider}</p>
                <div>
                  <button
                    onClick={() => handleToggleVerified(scheme)}
                    title={scheme.verified ? 'Click to unverify' : 'Click to mark verified'}
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      scheme.verified
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <ShieldCheck size={12} /> {scheme.verified ? 'Verified' : 'Unverified'}
                  </button>
                </div>
                <div>
                  <span className="text-xs font-medium bg-success-bg text-success px-2.5 py-1 rounded-full">Active</span>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0 sm:justify-end">
                  <button onClick={() => startEdit(scheme)} title="Edit scheme"
                    className="w-8 h-8 flex items-center justify-center rounded-full text-navy-600 bg-navy-50 hover:bg-navy-100 hover:text-navy-900 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(scheme._id)}
                    title="Delete scheme"
                    className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors" >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reported Schemes */}
      <div className="flex items-center gap-2 mb-4">
        <Flag size={16} className="text-gray-400" />
        <h2 className="text-sm font-semibold text-navy-900 uppercase tracking-wide">Reported Schemes ({reports.length})</h2>
      </div>

      {reportsLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : reportsError ? (
        <p className="text-red-500 text-sm">{reportsError}</p>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
          <Flag className="mx-auto text-gray-300 mb-2" size={28} />
          <p className="text-sm text-gray-500">No reports submitted yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-100">
          {reports.map((report) => (
            <div key={report._id} className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-medium text-navy-950 text-sm">
                    {report.schemeId?.schemeName || 'Deleted scheme'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Reported by {report.userId?.name || 'Unknown'} ({report.userId?.email || 'no email'})
                  </p>
                </div>
                <select
                  value={report.status}
                  onChange={(e) => handleReportStatusChange(report._id, e.target.value)}
                  className={`text-xs font-medium border rounded-full px-2.5 py-1.5 focus:outline-none shrink-0 ${REPORT_STATUS_STYLES[report.status]}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Dismissed">Dismissed</option>
                </select>
              </div>
              <p className="text-sm text-navy-900 font-medium mb-1">{report.reason}</p>
              {report.details && (
                <p className="text-sm text-gray-600">{report.details}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(report.createdAt).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPanel