import React from 'react'
import { getAffiliates } from '@/lib/api'
import type { PaginatedAffiliates } from '@myguardcare-affiliates-types'

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
  const filterByDniRef = React.useRef<string | undefined>(undefined)

  const fetchAffiliates = React.useCallback(async (
    page = initialPage,
    limit = initialLimit,
    filterByDni?: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAffiliates(page, limit, filterByDni)
      setData(res.data as PaginatedAffiliates)
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [initialPage, initialLimit])

  React.useEffect(() => {
    fetchAffiliates(pageRef.current, limitRef.current, filterByDniRef.current)
  }, [fetchAffiliates])

  const refetch = React.useCallback((page?: number, limit?: number, filterByDni?: string) => {
    if (typeof page === 'number') pageRef.current = page
    if (typeof limit === 'number') limitRef.current = limit
    if (typeof filterByDni === 'string' || filterByDni === undefined) {
      filterByDniRef.current = filterByDni
    }
    fetchAffiliates(pageRef.current, limitRef.current, filterByDniRef.current)
  }, [fetchAffiliates])

  const setPage = React.useCallback((p: number) => {
    refetch(p, undefined, filterByDniRef.current)
  }, [refetch])

  const setFilter = React.useCallback((filterByDni?: string) => {
    // Resetear a la página 1 cuando se cambia el filtro
    pageRef.current = 1
    refetch(1, undefined, filterByDni)
  }, [refetch])

  return {
    data,
    error,
    loading,
    refetch,
    setPage,
    setFilter,
  }
}
