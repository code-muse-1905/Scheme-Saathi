import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileCheck, UserCircle, AlertCircle, Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getEligibleSchemes } from '../api/eligibility'
import { getMyProfile } from '../api/profile'

function Dashboard() {
  const { token } = useAuth()
  const [schemes, setSchemes] = useState([])
  const [profileComplete, setProfileComplete] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [eligibleData] = await Promise.all([getEligibleSchemes(token)])
        setSchemes(eligibleData.schemes)
        setProfileComplete(true)
      } catch (err) {
        setError(err.message)
        // Check separately if it's specifically a missing-profile issue
        try {
          await getMyProfile(token)
        } catch {
          setProfileComplete(false)
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [token])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-navy-950 mb-1">Your Dashboard</h1>
      <p className="text-gray-500 mb-8">Schemes matched to your profile, updated in real time.</p>

      {profileComplete === false ? (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={22} />
          <div>
            <h2 className="font-semibold text-navy-950 mb-1">Complete your profile to see matches</h2>
            <p className="text-sm text-gray-600 mb-4">
              We need a few details about you to check your eligibility against real schemes.
            </p>
            <Link
              to="/profile"
              className="inline-block bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center shrink-0">
              <FileCheck className="text-navy-700" size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-950">{schemes.length}</p>
              <p className="text-sm text-gray-500">Eligible schemes found for you</p>
            </div>
          </div>

          <h2 className="font-semibold text-navy-950 mb-4">Schemes You're Eligible For</h2>

          {schemes.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
              <UserCircle className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="font-medium text-navy-900 mb-1">No matching schemes found</p>
              <p className="text-sm text-gray-500">Try updating your profile details.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schemes.map((scheme) => (
                <div key={scheme._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-navy-950">{scheme.schemeName}</h3>
                    <span className="shrink-0 text-xs font-medium bg-success-bg text-success px-2.5 py-1 rounded-full">
                      Eligible
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                    <Building2 size={12} /> {scheme.provider}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                  {scheme.documentsRequired?.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Documents needed</p>
                      <div className="flex flex-wrap gap-1.5">
                        {scheme.documentsRequired.map((doc) => (
                          <span key={doc} className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2.5 py-1 rounded-full">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard