export interface ApiError {
  message: string
  status?: number
}

export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Unable to connect. Please check your internet connection.'
  }
  
  if (error instanceof Error) {
    if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
      return 'Unable to connect. Please check your internet connection.'
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.'
    }
    return error.message
  }
  
  return 'Something went wrong. Please try again.'
}

export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      let errorMessage = `Error: ${response.status}`
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorData.message || errorMessage
      } catch {
        // Response is not JSON
      }

      return {
        data: null,
        error: {
          message: errorMessage,
          status: response.status,
        },
      }
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: {
        message: getErrorMessage(error),
        status: 0,
      },
    }
  }
}

export async function fetchApiSimple<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  
  if (!response.ok) {
    let message = `Error: ${response.status}`
    try {
      const data = await response.json()
      message = data.error || data.message || message
    } catch {}
    throw new Error(message)
  }
  
  return response.json()
}