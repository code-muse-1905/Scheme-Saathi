const API_URL = 'http://localhost:5000/api/documents'

export async function uploadDocument(token, docType, file) {
  const formData = new FormData()
  formData.append('docType', docType)
  formData.append('document', file)

  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  
  const data = await response.json()
  
  if (!response.ok) throw new Error(data.message || 'Failed to upload document')
  return data
}

export async function getMyDocuments(token) {
  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch documents')
  return data
}

export async function deleteDocument(token, id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to delete document')
  return data
}