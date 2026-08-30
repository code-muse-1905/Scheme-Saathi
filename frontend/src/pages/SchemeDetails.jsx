import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMyApplications } from '../api/applications'
import { getMyDocuments } from '../api/documents'
import {
  ArrowLeft,
  Building2,
  Users,
  FileText,
  Gift,
  ClipboardList,
  Info,
  ExternalLink,
  Bookmark,
  Check,
  X as XIcon,
} from 'lucide-react'
import { getSchemeById } from '../api/schemes'
import { saveScheme } from '../api/applications'
import { useAuth } from '../context/AuthContext'

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-saffron-600" />
        <h2 className="font-semibold text-navy-950">{title}</h2>
      </div>

      {children}
    </div>
  )
}

function EligibilityRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0 gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="text-navy-950 font-medium text-right">
        {value}
      </span>
    </div>
  )
}

function SchemeDetails() {
  const { id } = useParams()
  const { token } = useAuth()

  const [scheme, setScheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveState, setSaveState] = useState('idle')
  const [saveMessage, setSaveMessage] = useState('')
  const [myDocuments, setMyDocuments] = useState([])

  useEffect(() => {
    async function loadScheme() {
      try {
        setLoading(true)
        setError('')

        const data = await getSchemeById(id)

        // Supports both:
        // { scheme: {...} }
        // and directly returned scheme object
        setScheme(data.scheme || data)
      } catch (err) {
        setError(err.message || 'Failed to load scheme')
      } finally {
        setLoading(false)
      }
    }

    loadScheme()
  }, [id])

  useEffect(() => {
    async function checkIfSaved() {
      if (!token || !scheme) return
      try {
        const apps = await getMyApplications(token)
        const alreadySaved = apps.some((a) => a.schemeId?._id === scheme._id)
        if (alreadySaved) setSaveState('saved')
      } catch {
        // silently ignore — don't block the page over this check
      }
    }
    checkIfSaved()
  }, [token, scheme])

  useEffect(() => {
    async function loadDocs() {
      if (!token) return
      try {
        const docs = await getMyDocuments(token)
        setMyDocuments(docs)
      } catch {
        // silently ignore — checklist just won't show upload status
      }
    }
    loadDocs()
  }, [token])

  function isDocUploaded(docName) {
    return myDocuments.some(
      (d) => d.docType.trim().toLowerCase() === docName.trim().toLowerCase()
    )
  }

  async function handleSave() {
    if (!token || !scheme?._id) return

    setSaveState('saving')
    setSaveMessage('')

    try {
      await saveScheme(token, scheme._id)
      setSaveState('saved')
    } catch (err) {
      setSaveState('error')
      setSaveMessage(err.message || 'Failed to save scheme')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error || !scheme) {
    return (
      <div className="max-w-4xl mx-auto p-6 sm:p-8 text-center py-16">
        <FileText
          className="mx-auto text-gray-300 mb-3"
          size={36}
        />

        <p className="font-medium text-navy-900 mb-1">
          Scheme not found
        </p>

        <p className="text-sm text-gray-500 mb-4">
          {error || 'This scheme may have been removed.'}
        </p>

        <Link
          to="/schemes"
          className="text-sm font-medium text-saffron-600 hover:underline"
        >
          Back to Schemes
        </Link>
      </div>
    )
  }

  // Safely format array-based fields
  const formatList = (arr) => {
    if (
      !arr ||
      !Array.isArray(arr) ||
      arr.length === 0 ||
      arr.includes('All')
    ) {
      return 'All'
    }

    return arr.join(', ')
  }

  // Safely format income
  const incomeLabel =
  scheme.maxIncome === null || scheme.maxIncome === undefined
    ? 'No income limit'
    : `Up to ₹${Number(scheme.maxIncome).toLocaleString('en-IN')} / year`
  // Safely format age
  const ageLabel =
    scheme.minAge !== null &&
    scheme.minAge !== undefined &&
    scheme.maxAge !== null &&
    scheme.maxAge !== undefined
      ? `${scheme.minAge} - ${scheme.maxAge} years`
      : 'Not specified'

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8">

      {/* Back Button */}
      <Link
        to="/schemes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy-900 mb-6"
      >
        <ArrowLeft size={15} />
        Back to Schemes
      </Link>

      {/* Overview */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
        <h1 className="text-2xl font-bold text-navy-950 mb-1">
          {scheme.schemeName || 'Unnamed Scheme'}
        </h1>

        {scheme.provider && (
          <p className="text-sm text-gray-400 flex items-center gap-1 mb-4">
            <Building2 size={13} />
            {scheme.provider}
          </p>
        )}

        {scheme.description && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {scheme.description}
          </p>
        )}
      </div>

      <div className="space-y-4">

        {/* Benefits */}
        {scheme.benefits && (
          <Section icon={Gift} title="Benefits">
            <p className="text-sm text-gray-600 leading-relaxed">
              {scheme.benefits}
            </p>
          </Section>
        )}

        {/* Eligibility Criteria */}
        <Section icon={Users} title="Eligibility Criteria">
          <EligibilityRow
            label="Age Range"
            value={ageLabel}
          />

          <EligibilityRow
            label="Income"
            value={incomeLabel}
          />

          <EligibilityRow
            label="States"
            value={formatList(scheme.states)}
          />

          <EligibilityRow
            label="Occupation"
            value={formatList(scheme.occupation)}
          />

          <EligibilityRow
            label="Category"
            value={formatList(scheme.category)}
          />

          <EligibilityRow
            label="Disability"
            value={
              scheme.disabilityRequired
                ? 'Required'
                : 'Not required'
            }
          />
        </Section>

        {/* Required Documents — now a checklist against uploaded documents */}
        {Array.isArray(scheme.documentsRequired) &&
          scheme.documentsRequired.length > 0 && (
            <Section icon={FileText} title="Required Documents">
              <ul className="space-y-2">
                {scheme.documentsRequired.map((doc, i) => {
                  const uploaded = token && isDocUploaded(doc)
                  return (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="flex items-center gap-2 text-gray-600">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            uploaded ? 'bg-green-500' : 'bg-saffron-500'
                          }`}
                        />
                        {doc}
                      </span>
                      {!token ? null : uploaded ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                          <Check size={13} /> Uploaded
                        </span>
                      ) : (
                        <Link
                          to="/documents"
                          className="flex items-center gap-1 text-xs font-medium text-red-500 hover:underline"
                        >
                          <XIcon size={13} /> Missing
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
              {!token && (
                <p className="text-xs text-gray-400 mt-3">
                  <Link to="/login" className="text-saffron-600 hover:underline">
                    Log in
                  </Link>{' '}
                  to track which documents you've uploaded.
                </p>
              )}
            </Section>
          )}

        {/* Application Process */}
        {scheme.applicationProcess && (
          <Section
            icon={ClipboardList}
            title="Application Process"
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              {scheme.applicationProcess}
            </p>
          </Section>
        )}

        {/* Important Info */}
        {scheme.importantInfo && (
          <Section icon={Info} title="Important Info">
            <p className="text-sm text-gray-600 leading-relaxed">
              {scheme.importantInfo}
            </p>
          </Section>
        )}

        {/* Official Application Link */}
        {scheme.applicationUrl && (
          
           <a href={scheme.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-navy-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-navy-950 transition-colors"
          >
            Apply Officially
            <ExternalLink size={15} />
          </a>
        )}

        {/* Save / Track Application */}
        {!token ? (
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 border border-gray-200 text-navy-900 text-sm font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Bookmark size={15} />
            Log in to save this scheme
          </Link>
        ) : saveState === 'saved' ? (
          <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 text-sm font-medium py-3 rounded-xl">
            <Check size={15} />
            Saved to your applications
          </div>
        ) : (
          <div>
            <button
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className="w-full flex items-center justify-center gap-2 border border-navy-900 text-navy-900 text-sm font-medium py-3 rounded-xl hover:bg-navy-50 transition-colors disabled:opacity-50"
            >
              <Bookmark size={15} />

              {saveState === 'saving'
                ? 'Saving...'
                : 'Save this scheme'}
            </button>

            {saveState === 'error' && (
              <p className="text-xs text-red-500 mt-2 text-center">
                {saveMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SchemeDetails