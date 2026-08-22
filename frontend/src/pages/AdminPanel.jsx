import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllSchemes, createScheme, updateScheme, deleteScheme } from '../api/schemes'

const emptyForm = {
  schemeName: '', description: '', provider: '',
  minAge: 0, maxAge: 120, maxIncome: '',
  states: 'All', occupation: 'All', category: 'All',
  disabilityRequired: false,
}

function AdminPanel() {
  const { token } = useAuth()
  const [schemes, setSchemes] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  async function loadSchemes() {
    try {
      const data = await getAllSchemes()
      setSchemes(data.schemes)
    } catch (err) {
      setMessage(err.message)
    }
  }

  useEffect(() => {
    loadSchemes()
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
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    const payload = {
      ...form,
      minAge: Number(form.minAge),
      maxAge: Number(form.maxAge),
      maxIncome: form.maxIncome === '' ? undefined : Number(form.maxIncome),
      states: form.states.split(',').map((s) => s.trim()),
      occupation: form.occupation.split(',').map((s) => s.trim()),
      category: form.category.split(',').map((s) => s.trim()),
    }
    try {
      if (editingId) {
        await updateScheme(token, editingId, payload)
        setMessage('Scheme updated!')
      } else {
        await createScheme(token, payload)
        setMessage('Scheme created!')
      }
      cancelEdit()
      loadSchemes()
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this scheme?')) return
    try {
      await deleteScheme(token, id)
      loadSchemes()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="font-semibold mb-4">{editingId ? 'Edit Scheme' : 'Create Scheme'}</h2>

        <input name="schemeName" value={form.schemeName} onChange={handleChange} placeholder="Scheme name" className="w-full p-2 border rounded mb-3" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded mb-3" required />
        <input name="provider" value={form.provider} onChange={handleChange} placeholder="Provider" className="w-full p-2 border rounded mb-3" required />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input name="minAge" type="number" value={form.minAge} onChange={handleChange} placeholder="Min age" className="p-2 border rounded" />
          <input name="maxAge" type="number" value={form.maxAge} onChange={handleChange} placeholder="Max age" className="p-2 border rounded" />
        </div>

        <input name="maxIncome" type="number" value={form.maxIncome} onChange={handleChange} placeholder="Max income (leave blank = no limit)" className="w-full p-2 border rounded mb-3" />

        <input name="states" value={form.states} onChange={handleChange} placeholder="States (comma-separated, or 'All')" className="w-full p-2 border rounded mb-3" />
        <input name="occupation" value={form.occupation} onChange={handleChange} placeholder="Occupations (comma-separated, or 'All')" className="w-full p-2 border rounded mb-3" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Categories (comma-separated, or 'All')" className="w-full p-2 border rounded mb-3" />

        <label className="flex items-center mb-4">
          <input type="checkbox" name="disabilityRequired" checked={form.disabilityRequired} onChange={handleChange} className="mr-2" />
          <span className="text-sm">Disability required</span>
        </label>

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? 'Update Scheme' : 'Create Scheme'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="font-semibold mb-4">All Schemes ({schemes.length})</h2>
      <div className="space-y-3">
        {schemes.map((scheme) => (
          <div key={scheme._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-medium">{scheme.schemeName}</p>
              <p className="text-sm text-gray-500">{scheme.provider}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(scheme)} className="text-blue-600 text-sm">Edit</button>
              <button onClick={() => handleDelete(scheme._id)} className="text-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPanel