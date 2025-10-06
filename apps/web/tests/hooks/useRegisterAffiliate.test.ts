import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import useRegisterAffiliate from '@/hooks/useRegisterAffiliate'
import * as api from '@/lib/api'
import { ApiError } from '@/lib/api/error'
import type { Affiliate, RegisterAffiliateInput } from '@myguardcare-affiliates-types'

vi.mock('@/lib/api')

describe('useRegisterAffiliate', () => {
  const mockRegisterInput: RegisterAffiliateInput = {
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    phoneNumber: '+584121234567',
    dni: '12345678',
    gender: 'M',
    birthDate: new Date('1990-01-15'),
  }

  const mockAffiliateResponse: Affiliate = {
    _id: '507f1f77bcf86cd799439011',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    phoneNumber: '+584121234567',
    dni: '12345678',
    gender: 'M',
    birthDate: new Date('1990-01-15'),
    age: 35,
    usdAnnualFee: 15,
    fullName: 'Carlos Rodríguez',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useRegisterAffiliate())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.validationErrors).toEqual([])
    expect(result.current.data).toBe(null)
    expect(result.current.success).toBe(false)
  })

  it('should register an affiliate successfully', async () => {
    vi.mocked(api.registerAffiliate).mockResolvedValue(mockAffiliateResponse)

    const { result } = renderHook(() => useRegisterAffiliate())

    let registeredAffiliate: Affiliate | undefined

    await act(async () => {
      registeredAffiliate = await result.current.register(mockRegisterInput)
    })

    expect(api.registerAffiliate).toHaveBeenCalledWith({
      ...mockRegisterInput,
      birthDate: mockRegisterInput.birthDate.toISOString(),
    })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.validationErrors).toEqual([])
    expect(result.current.data).toEqual(mockAffiliateResponse)
    expect(result.current.success).toBe(true)
    expect(registeredAffiliate).toEqual(mockAffiliateResponse)
  })

  it('should convert Date to ISO string before sending', async () => {
    vi.mocked(api.registerAffiliate).mockResolvedValue(mockAffiliateResponse)

    const { result } = renderHook(() => useRegisterAffiliate())

    const inputWithDate = {
      ...mockRegisterInput,
      birthDate: new Date('1995-06-20'),
    }

    await act(async () => {
      await result.current.register(inputWithDate)
    })

    expect(api.registerAffiliate).toHaveBeenCalledWith({
      ...inputWithDate,
      birthDate: '1995-06-20T00:00:00.000Z',
    })
  })

  it('should handle birthDate as string', async () => {
    vi.mocked(api.registerAffiliate).mockResolvedValue(mockAffiliateResponse)

    const { result } = renderHook(() => useRegisterAffiliate())

    const inputWithStringDate = {
      ...mockRegisterInput,
      birthDate: '1995-06-20',
    } as unknown as RegisterAffiliateInput

    await act(async () => {
      await result.current.register(inputWithStringDate)
    })

    expect(api.registerAffiliate).toHaveBeenCalledWith({
      ...inputWithStringDate,
      birthDate: '1995-06-20',
    })
  })

  it('should set loading state during registration', async () => {
    let resolvePromise: (value: Affiliate) => void
    const delayedPromise = new Promise<Affiliate>((resolve) => {
      resolvePromise = resolve
    })

    vi.mocked(api.registerAffiliate).mockReturnValue(delayedPromise)

    const { result } = renderHook(() => useRegisterAffiliate())

    // Start registration
    act(() => {
      result.current.register(mockRegisterInput)
    })

    // Should be loading
    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    // Resolve the promise
    await act(async () => {
      resolvePromise!(mockAffiliateResponse)
      await delayedPromise
    })

    // Should not be loading after completion
    expect(result.current.loading).toBe(false)
    expect(result.current.success).toBe(true)
  })

  it('should handle ApiError with validation errors', async () => {
    const validationErrors = [
      { field: 'dni', message: 'DNI already exists' },
      { field: 'phoneNumber', message: 'Invalid phone number format' },
    ]

    const apiError = new ApiError('Validation failed', 400, validationErrors)
    vi.mocked(api.registerAffiliate).mockRejectedValue(apiError)

    const { result } = renderHook(() => useRegisterAffiliate())

    await act(async () => {
      await result.current.register(mockRegisterInput).catch(() => {
        // Expected to throw
      })
    })

    expect(result.current.error).toBe('Validation failed')
    expect(result.current.validationErrors).toEqual(validationErrors)
    expect(result.current.success).toBe(false)
    expect(result.current.data).toBe(null)
  })

  it('should handle ApiError without validation errors', async () => {
    const apiError = new ApiError('DNI already exists', 409)
    vi.mocked(api.registerAffiliate).mockRejectedValue(apiError)

    const { result } = renderHook(() => useRegisterAffiliate())

    await act(async () => {
      await result.current.register(mockRegisterInput).catch(() => {
        // Expected to throw
      })
    })

    expect(result.current.error).toBe('DNI already exists')
    expect(result.current.validationErrors).toEqual([])
    expect(result.current.success).toBe(false)
  })

  it('should handle generic errors', async () => {
    const genericError = new Error('Network error')
    vi.mocked(api.registerAffiliate).mockRejectedValue(genericError)

    const { result } = renderHook(() => useRegisterAffiliate())

    await act(async () => {
      await result.current.register(mockRegisterInput).catch(() => {
        // Expected to throw
      })
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.validationErrors).toEqual([])
    expect(result.current.success).toBe(false)
  })

  it('should handle non-Error objects', async () => {
    vi.mocked(api.registerAffiliate).mockRejectedValue('String error')

    const { result } = renderHook(() => useRegisterAffiliate())

    await act(async () => {
      await result.current.register(mockRegisterInput).catch(() => {
        // Expected to throw
      })
    })

    expect(result.current.error).toBe('String error')
    expect(result.current.success).toBe(false)
  })

  it('should reset state before each registration attempt', async () => {
    const apiError = new ApiError('First error', 400)
    vi.mocked(api.registerAffiliate).mockRejectedValueOnce(apiError)

    const { result } = renderHook(() => useRegisterAffiliate())

    // First attempt with error
    await act(async () => {
      await result.current.register(mockRegisterInput).catch(() => {
        // Expected to throw
      })
    })

    expect(result.current.error).toBe('First error')
    expect(result.current.success).toBe(false)

    // Second attempt successful
    vi.mocked(api.registerAffiliate).mockResolvedValueOnce(mockAffiliateResponse)

    await act(async () => {
      await result.current.register(mockRegisterInput)
    })

    // State should be reset
    await waitFor(() => {
      expect(result.current.error).toBe(null)
    })
    expect(result.current.validationErrors).toEqual([])
    expect(result.current.success).toBe(true)
    expect(result.current.data).toEqual(mockAffiliateResponse)
  })

  it('should throw error after setting state', async () => {
    const apiError = new ApiError('Registration failed', 500)
    vi.mocked(api.registerAffiliate).mockRejectedValue(apiError)

    const { result } = renderHook(() => useRegisterAffiliate())

    let thrownError: Error | undefined

    await act(async () => {
      try {
        await result.current.register(mockRegisterInput)
      } catch (err) {
        thrownError = err as Error
      }
    })

    expect(thrownError).toBeDefined()
    expect(thrownError?.message).toBe('Registration failed')
    expect(result.current.error).toBe('Registration failed')
  })

  it('should handle multiple registration attempts in sequence', async () => {
    vi.mocked(api.registerAffiliate).mockResolvedValue(mockAffiliateResponse)

    const { result } = renderHook(() => useRegisterAffiliate())

    // First registration
    await act(async () => {
      await result.current.register(mockRegisterInput)
    })

    expect(result.current.success).toBe(true)
    expect(api.registerAffiliate).toHaveBeenCalledTimes(1)

    // Second registration
    const secondInput = { ...mockRegisterInput, dni: '87654321' }
    await act(async () => {
      await result.current.register(secondInput)
    })

    expect(result.current.success).toBe(true)
    expect(api.registerAffiliate).toHaveBeenCalledTimes(2)
  })
})
