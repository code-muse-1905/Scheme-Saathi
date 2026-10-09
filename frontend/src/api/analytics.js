const API_URL = `${import.meta.env.VITE_API_URL}/api/analytics`

export async function getAnalytics(token) {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch analytics')
  return data
}