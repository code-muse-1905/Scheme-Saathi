import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEligibleSchemes } from '../api/eligibility'

function Dashboard() {
  const { token } = useAuth()
  const [schemes, setSchemes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEligible() {
      try {
        const data = await getEligibleSchemes(token)
        setSchemes(data.schemes)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadEligible()
  }, [token])

  if (loading) return <p className="p-8">Loading your matches...</p>

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500 mb-4">{error}</p>
        {error.includes('profile') && (
          <Link to="/profile" className="text-blue-600 underline">
            Complete your profile
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">Schemes You're Eligible For</h1>
      <p className="text-gray-500 mb-6">{schemes.length} matching schemes found</p>

      {schemes.length === 0 && (
        <p className="text-gray-500">No matching schemes found yet.</p>
      )}

      <div className="space-y-4">
        {schemes.map((scheme) => (
          <div key={scheme._id} className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold">{scheme.schemeName}</h2>
            <p className="text-sm text-gray-500 mb-2">{scheme.provider}</p>
            <p className="text-sm">{scheme.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard