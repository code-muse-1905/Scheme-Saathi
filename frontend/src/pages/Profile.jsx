import { useState, useEffect } from 'react'
import { CalendarDays, IndianRupee, MapPin, Briefcase, Users, CheckCircle2, Loader2 } from 'lucide-react'
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

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={16} className="text-saffron-600" />
      <h2 className="text-sm font-semibold text-navy-900 uppercase tracking-wide">{title}</h2>
    </div>
  )
}

function Profile() {
  const { token } = useAuth()
  const [form, setForm] = useState({
    dateOfBirth: '', income: '', state: '', occupation: '', category: '', disabilityStatus: false,
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
      } catch {
        // No profile yet — form stays empty
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
    setSaving(true)
    try {
      await saveMyProfile(token, { ...form, income: Number(form.income) })
      setMessage('Profile saved successfully!')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900"
  const labelClass = "block mb-1.5 text-sm font-medium text-navy-900"

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-navy-950 mb-1">My Profile</h1>
      <p className="text-gray-500 mb-8">Used to match you against real scheme eligibility criteria.</p>

      {message && (
        <div className={`flex items-center gap-2 text-sm rounded-lg px-3.5 py-2.5 mb-6 ${
          message.includes('success') ? 'bg-success-bg text-success' : 'bg-red-50 text-red-600'
        }`}>
          {message.includes('success') && <CheckCircle2 size={16} />}
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">

        <div>
          <SectionHeader icon={CalendarDays} title="Personal Information" />
          <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputClass} required />
        </div>

        <div>
          <SectionHeader icon={MapPin} title="Location" />
          <label className={labelClass}>State <span className="text-red-500">*</span></label>
          <select name="state" value={form.state} onChange={handleChange} className={inputClass} required>
            <option value="">Select state</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <SectionHeader icon={IndianRupee} title="Financial Information" />
          <label className={labelClass}>Annual Income (₹) <span className="text-red-500">*</span></label>
          <input type="number" name="income" value={form.income} onChange={handleChange} className={inputClass} required min="0" />
        </div>

        <div>
          <SectionHeader icon={Briefcase} title="Professional Information" />
          <label className={labelClass}>Occupation <span className="text-red-500">*</span></label>
          <select name="occupation" value={form.occupation} onChange={handleChange} className={inputClass} required>
            <option value="">Select occupation</option>
            {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <SectionHeader icon={Users} title="Additional Information" />
          <label className={labelClass}>Category <span className="text-red-500">*</span></label>
          <select name="category" value={form.category} onChange={handleChange} className={`${inputClass} mb-4`} required>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox" name="disabilityStatus" checked={form.disabilityStatus} onChange={handleChange}
              className="w-4 h-4 accent-navy-900"
            />
            <span className="text-sm text-navy-900">I have a disability</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}

export default Profile