const API_URL = `${import.meta.env.VITE_API_URL}/api/schemes`

export async function getEligibleSchemes(token) {
  const response = await fetch(`${API_URL}/eligible`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch eligible schemes')
  return data
}