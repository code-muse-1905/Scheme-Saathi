const API_URL = 'http://localhost:5000/api/analytics'

export async function getAnalytics(token) {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch analytics')
  return data
}