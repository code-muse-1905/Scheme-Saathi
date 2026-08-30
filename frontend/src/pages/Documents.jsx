import { useState, useEffect } from 'react'
import { UploadCloud, FileText, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { uploadDocument, getMyDocuments, deleteDocument } from '../api/documents'

function Documents() {
  const { token } = useAuth()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [docType, setDocType] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyDocuments(token)
        setDocuments(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (token) load()
  }, [token])

  async function handleUpload(e) {
    e.preventDefault()
    if (!docType || !file) {
      setUploadError('Please provide both a document type and a file.')
      return
    }
    setUploading(true)
    setUploadError('')
    try {
      const newDoc = await uploadDocument(token, docType, file)
      setDocuments((prev) => {
        const withoutOld = prev.filter((d) => d.docType !== newDoc.docType)
        return [...withoutOld, newDoc]
      })
      setDocType('')
      setFile(null)
      e.target.reset()
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteDocument(token, id)
      setDocuments((prev) => prev.filter((d) => d._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-navy-950 mb-1">My Documents</h1>
      <p className="text-gray-500 mb-6">Upload documents once, reuse them across schemes.</p>

      <form onSubmit={handleUpload} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-8">
        <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Document Type
        </label>
        <input
          type="text"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          placeholder="e.g. Aadhaar Card"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
        />

        <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          File
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm mb-4"
        />

        <button
          type="submit"
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <UploadCloud size={15} />
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>

        {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
      </form>

      <h2 className="font-semibold text-navy-950 mb-4">Uploaded Documents</h2>

      {loading ? (
        <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : documents.length === 0 ? (
        <div className="text-center py-10 bg-white border border-gray-100 rounded-2xl">
          <FileText className="mx-auto text-gray-300 mb-2" size={28} />
          <p className="text-sm text-gray-500">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3"
            >
              
               <a href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-navy-950 hover:underline flex items-center gap-2 min-w-0 truncate"
              >
                <FileText size={15} className="shrink-0 text-saffron-600" />
                {doc.docType}
              </a>
              <button
                onClick={() => handleDelete(doc._id)}
                className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Documents