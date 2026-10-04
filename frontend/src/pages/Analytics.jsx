import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAnalytics } from '../api/analytics'
import { Users, FileCheck, UserCircle, FolderOpen, Flag, TrendingUp, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-navy-50 flex items-center justify-center shrink-0">
        <Icon className="text-navy-700" size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-navy-950">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

function BreakdownBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-navy-950 font-medium">{count}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const STATUS_COLORS = {
  Saved: 'bg-gray-400',
  Applied: 'bg-blue-500',
  'Under Review': 'bg-amber-500',
  Approved: 'bg-green-500',
  Rejected: 'bg-red-500',
  Pending: 'bg-amber-500',
  Reviewed: 'bg-green-500',
  Dismissed: 'bg-gray-400',
}

function Analytics() {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const result = await getAnalytics(token)
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-24 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto p-6 sm:p-8 text-center py-16">
        <ShieldAlert className="mx-auto text-gray-300 mb-3" size={36} />
        <p className="font-medium text-navy-900 mb-1">Admins only</p>
        <p className="text-sm text-gray-500 mb-4">You don't have access to this page.</p>
        <Link to="/dashboard" className="text-sm font-medium text-saffron-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const totalApplications = data.applicationsByStatus.reduce((sum, s) => sum + s.count, 0)
  const totalReports = data.reportsByStatus.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-navy-950 mb-1">Analytics</h1>
      <p className="text-gray-500 mb-6">Platform-wide usage at a glance.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Users" value={data.totalUsers} />
        <StatCard icon={FileCheck} label="Schemes" value={data.totalSchemes} />
        <StatCard icon={UserCircle} label="Profiles" value={data.totalProfiles} />
        <StatCard icon={FolderOpen} label="Documents" value={data.totalDocuments} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-navy-950 mb-4">Applications by Status</h2>
          {data.applicationsByStatus.length === 0 ? (
            <p className="text-sm text-gray-400">No applications yet.</p>
          ) : (
            data.applicationsByStatus.map((s) => (
              <BreakdownBar
                key={s._id}
                label={s._id}
                count={s.count}
                total={totalApplications}
                color={STATUS_COLORS[s._id] || 'bg-navy-900'}
              />
            ))
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-navy-950 mb-4">Reports by Status</h2>
          {data.reportsByStatus.length === 0 ? (
            <p className="text-sm text-gray-400">No reports yet.</p>
          ) : (
            data.reportsByStatus.map((s) => (
              <BreakdownBar
                key={s._id}
                label={s._id}
                count={s.count}
                total={totalReports}
                color={STATUS_COLORS[s._id] || 'bg-navy-900'}
              />
            ))
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-saffron-600" />
          <h2 className="font-semibold text-navy-950">Most Saved Schemes</h2>
        </div>
        {data.topSchemes.length === 0 ? (
          <p className="text-sm text-gray-400">No saved schemes yet.</p>
        ) : (
          <div className="space-y-2">
            {data.topSchemes.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-600">{i + 1}. {s.schemeName}</span>
                <span className="font-medium text-navy-950">{s.count} saves</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics