'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchApi, ApiError } from '@/lib/api-client'

interface UseFetchOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  immediate?: boolean
}

interface UseFetchReturn<T> {
  data: T | null
  error: ApiError | null
  loading: boolean
  refetch: () => Promise<void>
}

export function useFetch<T>(
  url: string,
  options?: UseFetchOptions<T>
): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(options?.initialData ?? null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(options?.immediate ?? true)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await fetchApi<T>(url)

    if (result.error) {
      setError(result.error)
      options?.onError?.(result.error)
    } else {
      setData(result.data)
      options?.onSuccess?.(result.data as T)
    }

    setLoading(false)
  }, [url, options])

  useEffect(() => {
    if (options?.immediate !== false) {
      refetch()
    }
  }, [refetch, options?.immediate])

  return { data, error, loading, refetch }
}

export function useFetchMultiple<T>(
  urls: string[],
  options?: UseFetchOptions<T[]>
): {
  data: T[] | null
  errors: ApiError[]
  loading: boolean
  refetch: () => Promise<void>
} {
  const [data, setData] = useState<T[] | null>(options?.initialData ?? null)
  const [errors, setErrors] = useState<ApiError[]>([])
  const [loading, setLoading] = useState(options?.immediate ?? true)

  const refetch = useCallback(async () => {
    setLoading(true)
    setErrors([])

    const results = await Promise.all(urls.map(url => fetchApi<T>(url)))

    const allData: T[] = []
    const allErrors: ApiError[] = []

    results.forEach(result => {
      if (result.error) {
        allErrors.push(result.error)
      } else if (result.data) {
        allData.push(result.data as T)
      }
    })

    if (allErrors.length > 0) {
      setErrors(allErrors)
      options?.onError?.(allErrors[0])
    } else {
      setData(allData)
      options?.onSuccess?.(allData)
    }

    setLoading(false)
  }, [urls, options])

  useEffect(() => {
    if (options?.immediate !== false) {
      refetch()
    }
  }, [refetch, options?.immediate])

  return { data, errors, loading, refetch }
}