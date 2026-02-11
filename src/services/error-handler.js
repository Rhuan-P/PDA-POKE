export async function handleApiResponse(response) {
  if (!response.ok) {
    const error = new Error(`API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}
