import React from 'react'
import { registerAffiliate } from '@/lib/api'
import type { Affiliate, RegisterAffiliateInput } from '@/types/affiliates.type'

export default function useRegisterAffiliate() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<Affiliate | null>(null)
  const [success, setSuccess] = React.useState(false)

  const register = React.useCallback(async (input: RegisterAffiliateInput) => {
    setLoading(true)
    setError(null)
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
      setError(err instanceof Error ? err.message : String(err))
      setSuccess(false)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { register, loading, error, data, success }
}
