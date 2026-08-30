const API_URL = 'http://localhost:5000/api/applications'

export async function saveScheme(token, schemeId) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ schemeId }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to save scheme')
  return data
}

export async function getMyApplications(token) {
  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch applications')
  return data
}

export async function updateApplicationStatus(token, id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to update application')
  return data
}

export async function deleteApplication(token, id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to delete application')
  return data
}