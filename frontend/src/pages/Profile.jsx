import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMyProfile, saveMyProfile } from '../api/profile'

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
]
const OCCUPATIONS = ["Student", "Unemployed", "Salaried", "Self-Employed", "Farmer", "Daily Wage Laborer", "Retired", "Other"]
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"]

function Profile() {
  const { token } = useAuth()
  const [form, setForm] = useState({
    dateOfBirth: '', income: '', state: '', occupation: '', category: '', disabilityStatus: false,
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile(token)
        setForm({
          dateOfBirth: data.dateOfBirth?.slice(0, 10) || '',
          income: data.income || '',
          state: data.state || '',
          occupation: data.occupation || '',
          category: data.category || '',
          disabilityStatus: data.disabilityStatus || false,
        })
      } catch (err) {
        // No profile yet is fine — form just stays empty
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [token])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    try {
      await saveMyProfile(token, { ...form, income: Number(form.income) })
      setMessage('Profile saved successfully!')
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

        <label className="block mb-1 text-sm font-medium">Date of Birth</label>
        <input
          type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
          className="w-full p-2 border rounded mb-4" required
        />

        <label className="block mb-1 text-sm font-medium">Annual Income</label>
        <input
          type="number" name="income" value={form.income} onChange={handleChange}
          className="w-full p-2 border rounded mb-4" required min="0"
        />

        <label className="block mb-1 text-sm font-medium">State</label>
        <select name="state" value={form.state} onChange={handleChange} className="w-full p-2 border rounded mb-4" required>
          <option value="">Select state</option>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <label className="block mb-1 text-sm font-medium">Occupation</label>
        <select name="occupation" value={form.occupation} onChange={handleChange} className="w-full p-2 border rounded mb-4" required>
          <option value="">Select occupation</option>
          {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>

        <label className="block mb-1 text-sm font-medium">Category</label>
        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded mb-4" required>
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <label className="flex items-center mb-6">
          <input
            type="checkbox" name="disabilityStatus" checked={form.disabilityStatus} onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm">I have a disability</span>
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Save Profile
        </button>
      </form>
    </div>
  )
}

export default Profile