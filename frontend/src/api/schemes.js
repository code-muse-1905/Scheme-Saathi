const API_URL = 'http://localhost:5000/api/schemes'

export async function getAllSchemes() {
  const response = await fetch(API_URL)
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch schemes')
  return data
}

export async function getSchemeById(id) {
  const response = await fetch(`${API_URL}/${id}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch scheme details')
  return data
}

export async function createScheme(token, schemeData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(schemeData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to create scheme')
  return data
}

export async function updateScheme(token, id, schemeData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(schemeData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to update scheme')
  return data
}

export async function deleteScheme(token, id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to delete scheme')
  return data
}
