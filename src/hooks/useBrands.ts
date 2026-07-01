import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Tables } from '../types/database'

export function useBrands() {
  const [brands, setBrands] = useState<Tables<'brand'>[]>([])

  useEffect(() => {
    supabase
      .from('brand')
      .select('*')
      .order('brand_name')
      .then(({ data }) => setBrands(data ?? []))
  }, [])

  return brands
}
