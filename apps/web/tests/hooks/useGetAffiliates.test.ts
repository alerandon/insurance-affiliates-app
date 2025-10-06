import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useGetAffiliates from '@/hooks/useGetAffiliates'
import * as api from '@/lib/api'
import type { PaginatedAffiliates } from 'myguardcare-affiliates-types'

vi.mock('@/lib/api')

describe('useGetAffiliates', () => {
  const mockAffiliatesData: { data: PaginatedAffiliates } = {
    data: {
      items: [
        {
          _id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          dni: '12345678',
          age: 35,
          usdAnnualFee: 15,
          fullName: 'Juan Pérez',
        },
        {
          _id: '2',
          firstName: 'María',
          lastName: 'González',
          dni: '87654321',
          age: 28,
          usdAnnualFee: 15,
          fullName: 'María González',
        },
      ],
      page: 1,
      limit: 5,
      totalItems: 2,
      hasPrev: false,
      hasNext: false,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default values', async () => {
    vi.mocked(api.getAffiliates).mockResolvedValue(mockAffiliatesData)

    const { result } = renderHook(() => useGetAffiliates())

    // Initial state before fetch completes
    expect(result.current.data).toEqual({
      items: [],
      totalItems: 0,
      page: 1,
      limit: 5,
      hasPrev: false,
      hasNext: false,
    })

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(null)
  })

  it('should fetch affiliates on mount', async () => {
    vi.mocked(api.getAffiliates).mockResolvedValue(mockAffiliatesData)

    const { result } = renderHook(() => useGetAffiliates())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(api.getAffiliates).toHaveBeenCalledWith(1, 5, undefined)
    expect(result.current.data).toEqual(mockAffiliatesData.data)
    expect(result.current.error).toBe(null)
  })

  it('should fetch affiliates with custom initial page and limit', async () => {
    vi.mocked(api.getAffiliates).mockResolvedValue(mockAffiliatesData)

    const { result } = renderHook(() => useGetAffiliates(2, 10))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(api.getAffiliates).toHaveBeenCalledWith(2, 10, undefined)
  })

  it('should handle API errors', async () => {
    const errorMessage = 'Network error'
    vi.mocked(api.getAffiliates).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useGetAffiliates())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.data.items).toEqual([])
  })

  it('should update loading state during fetch', async () => {
    vi.mocked(api.getAffiliates).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockAffiliatesData), 100)),
    )

    const { result } = renderHook(() => useGetAffiliates())

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should refetch data when calling refetch', async () => {
    vi.mocked(api.getAffiliates).mockResolvedValue(mockAffiliatesData)

    const { result } = renderHook(() => useGetAffiliates())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Clear previous calls
    vi.clearAllMocks()

    // Refetch with new parameters
    result.current.refetch(2, 10, '123')

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(api.getAffiliates).toHaveBeenCalledWith(2, 10, '123')
  })

  it('should change page using setPage', async () => {
    vi.mocked(api.getAffiliates).mockResolvedValue(mockAffiliatesData)

    const { result } = renderHook(() => useGetAffiliates())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    vi.clearAllMocks()

    // Change page
    result.current.setPage(3)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(api.getAffiliates).toHaveBeenCalledWith(3, 5, undefined)
  })

  it('should filter by DNI using setFilter', async () => {
    vi.mocked(api.getAffiliates).mockResolvedValue(mockAffiliatesData)

    const { result } = renderHook(() => useGetAffiliates(2, 5))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    vi.clearAllMocks()

    // Set filter (should reset to page 1)
    result.current.setFilter('12345')

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(api.getAffiliates).toHaveBeenCalledWith(1, 5, '12345')
  })

  it('should clear filter when setFilter is called with undefined', async () => {
    vi.mocked(api.getAffiliates).mockResolvedValue(mockAffiliatesData)

    const { result } = renderHook(() => useGetAffiliates())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // First set a filter
    result.current.setFilter('123')

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    vi.clearAllMocks()

    // Clear filter
    result.current.setFilter(undefined)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(api.getAffiliates).toHaveBeenCalledWith(1, 5, undefined)
  })

  it('should handle multiple refetches correctly', async () => {
    vi.mocked(api.getAffiliates).mockResolvedValue(mockAffiliatesData)

    const { result } = renderHook(() => useGetAffiliates())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Multiple refetches
    result.current.refetch(2)
    result.current.refetch(3)
    result.current.refetch(4)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should call with the last parameters
    expect(api.getAffiliates).toHaveBeenLastCalledWith(4, 5, undefined)
  })
})
