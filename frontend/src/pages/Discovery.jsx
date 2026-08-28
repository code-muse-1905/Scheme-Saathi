import { useState, useEffect, useMemo } from 'react'
import { Search, SlidersHorizontal, X, Building2, FileText } from 'lucide-react'
import { getAllSchemes } from '../api/schemes'

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
]
const OCCUPATIONS = ["Student", "Unemployed", "Salaried", "Self-Employed", "Farmer", "Daily Wage Laborer", "Retired", "Other"]
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"]

function FilterPanel({ filters, setFilters, onClose }) {
  function update(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 sm:hidden">
        <h2 className="font-semibold text-navy-950">Filters</h2>
        <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
      </div>

      <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">State</label>
      <select
        value={filters.state}
        onChange={(e) => update('state', e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
      >
        <option value="">All States</option>
        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Occupation</label>
      <select
        value={filters.occupation}
        onChange={(e) => update('occupation', e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
      >
        <option value="">All Occupations</option>
        {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>

      <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
      <select
        value={filters.category}
        onChange={(e) => update('category', e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {(filters.state || filters.occupation || filters.category) && (
        <button
          onClick={() => setFilters({ state: '', occupation: '', category: '' })}
          className="text-xs font-medium text-saffron-600 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}

function Discovery() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState({ state: '', occupation: '', category: '' })
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllSchemes()
        setSchemes(data.schemes)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Debounce search input — wait 300ms after typing stops before filtering
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const matchesSearch = scheme.schemeName.toLowerCase().includes(debouncedSearch.toLowerCase())
        || scheme.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesState = !filters.state || scheme.states.includes('All') || scheme.states.includes(filters.state)
      const matchesOccupation = !filters.occupation || scheme.occupation.includes('All') || scheme.occupation.includes(filters.occupation)
      const matchesCategory = !filters.category || scheme.category.includes('All') || scheme.category.includes(filters.category)
      return matchesSearch && matchesState && matchesOccupation && matchesCategory
    })
  }, [schemes, debouncedSearch, filters])

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-navy-950 mb-1">Explore Schemes</h1>
      <p className="text-gray-500 mb-6">Browse all available government schemes and their eligibility criteria.</p>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search government schemes..."
          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900"
        />
      </div>

      <button
        onClick={() => setShowMobileFilters(true)}
        className="sm:hidden flex items-center gap-2 text-sm font-medium text-navy-900 border border-gray-200 rounded-lg px-4 py-2 mb-6"
      >
        <SlidersHorizontal size={15} /> Filters
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-6">
        <div className="hidden sm:block">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>

        {showMobileFilters && (
          <div className="sm:hidden fixed inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto">
              <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowMobileFilters(false)} />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-4 bg-navy-900 text-white text-sm font-medium py-2.5 rounded-lg"
              >
                Show {filteredSchemes.length} results
              </button>
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm">Something went wrong while loading schemes. Please try again.</p>
          ) : filteredSchemes.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
              <FileText className="mx-auto text-gray-300 mb-3" size={36} />
              <p className="font-medium text-navy-900 mb-1">No schemes found</p>
              <p className="text-sm text-gray-500">Try changing your search or filters.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{filteredSchemes.length} schemes found</p>
              <div className="space-y-4">
                {filteredSchemes.map((scheme) => (
                  <div key={scheme._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-navy-950 mb-1">{scheme.schemeName}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                      <Building2 size={12} /> {scheme.provider}
                    </p>
                    <p className="text-sm text-gray-600">{scheme.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Discovery