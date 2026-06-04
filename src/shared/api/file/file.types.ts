// Raw API response shape — matches exactly what the server returns
export interface UploadResumeResponse {
  success: boolean
  storageUrl: string   // full public URL — e.g. "https://hel1.your-objectstorage.com/..."
  filePath: string     // relative path — e.g. "18/d294a36dd10e43a7bda234b70723dd50.docx"
}

// Normalized result returned to callers
export interface UploadResumeResult {
  filePath: string    // = file_path  — sent to API (e.g. PUT /auth/me { cvUrl: filePath })
  storageUrl: string  // = storage_url — full URL, available for UI display if needed
}
