const API_URL = 'http://localhost:5000/api/profile'

export async function getMyProfile(token) {
  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch profile')
  return data
}

export async function saveMyProfile(token, profileData) {
  const response = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to save profile')
  return data
}
export async function extractProfile(token, text) {
  const response = await fetch(`${API_URL}/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to extract profile')
  return data
}