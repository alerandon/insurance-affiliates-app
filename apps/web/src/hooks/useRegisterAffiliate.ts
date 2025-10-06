import React from 'react'
import { registerAffiliate } from '@/lib/api'
import { ApiError, type ApiValidationError } from '@/lib/api/error'
import type { Affiliate, RegisterAffiliateInput } from '@/types/affiliates.type'

export default function useRegisterAffiliate() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [validationErrors, setValidationErrors] = React.useState<ApiValidationError[]>([])
  const [data, setData] = React.useState<Affiliate | null>(null)
  const [success, setSuccess] = React.useState(false)

  const register = React.useCallback(async (input: RegisterAffiliateInput) => {
    setLoading(true)
    setError(null)
    setValidationErrors([])
    setSuccess(false)
    try {
      const body = {
        ...input,
        birthDate: input.birthDate instanceof Date ? input.birthDate.toISOString() : input.birthDate,
      }

      const res = await registerAffiliate(body)
      setData(res)
      setSuccess(true)
      return res
    } catch (err: unknown) {
      console.error(err)

      if (err instanceof ApiError) {
        setError(err.message)
        if (err.validationErrors && err.validationErrors.length > 0) {
          setValidationErrors(err.validationErrors)
        }
      } else {
        setError(err instanceof Error ? err.message : String(err))
      }

      setSuccess(false)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { register, loading, error, validationErrors, data, success }
}
