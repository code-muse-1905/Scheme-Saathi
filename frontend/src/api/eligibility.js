const API_URL = 'http://localhost:5000/api/schemes'

export async function getEligibleSchemes(token) {
  const response = await fetch(`${API_URL}/eligible`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch eligible schemes')
  return data
}