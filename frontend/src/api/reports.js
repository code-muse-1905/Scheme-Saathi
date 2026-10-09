const API_URL = `${import.meta.env.VITE_API_URL}/api/reports`

export async function getAllReports(token) {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch reports')
  return data
}

export async function updateReportStatus(token, id, status) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to update report')
  return data
}

export async function submitReport(token, schemeId, reason, details) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ schemeId, reason, details }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to submit report')
  return data
}