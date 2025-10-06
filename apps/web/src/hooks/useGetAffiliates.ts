import React from 'react'
import { getAffiliates } from '@/lib/api'
import type { PaginatedAffiliates } from '@/types/affiliates.type'

export default function useGetAffiliates(initialPage = 1, initialLimit = 5) {
  const [data, setData] = React.useState<PaginatedAffiliates>({
    items: [],
    totalItems: 0,
    page: initialPage,
    limit: initialLimit,
    hasPrev: false,
    hasNext: false
  })
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const pageRef = React.useRef<number>(initialPage)
  const limitRef = React.useRef<number>(initialLimit)

  const fetchAffiliates = React.useCallback(async (page = initialPage, limit = initialLimit) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAffiliates(page, limit)
      setData(res.data as PaginatedAffiliates)
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [initialPage, initialLimit])

  React.useEffect(() => {
    fetchAffiliates(pageRef.current, limitRef.current)
  }, [fetchAffiliates])

  const refetch = React.useCallback((page?: number, limit?: number) => {
    if (typeof page === 'number') pageRef.current = page
    if (typeof limit === 'number') limitRef.current = limit
    fetchAffiliates(pageRef.current, limitRef.current)
  }, [fetchAffiliates])

  const setPage = React.useCallback((p: number) => {
    refetch(p)
  }, [refetch])

  return {
    data,
    error,
    loading,
    refetch,
    setPage,
  }
}
