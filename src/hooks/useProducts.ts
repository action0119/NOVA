import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Tables } from '../types/database'

export type ProductWithBrand = Tables<'product'> & {
  brand: { brand_id: string; brand_name: string } | null
}

export interface ProductFilters {
  category?: string | null
  mood?: string | null
  tag?: string | null
  brandNames?: string[]
  search?: string
}

export function useProducts(filters: ProductFilters) {
  const [products, setProducts] = useState<ProductWithBrand[]>([])
  const [loading, setLoading] = useState(true)

  const { category, mood, tag, search } = filters
  const brandNames = filters.brandNames?.join(',') ?? ''

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function run() {
      let query = supabase
        .from('product')
        .select('*, brand!product_brand_id_fkey(brand_id, brand_name), category(category_name, parent_category:parent_category_id(category_name))')

      if (mood) query = query.eq('mood', mood)
      if (tag) query = query.eq('product_tag', tag)
      if (search) query = query.ilike('product_name', `%${search}%`)

      const { data } = await query.order('created_at', { ascending: false })
      if (cancelled) return

      let rows = (data as (ProductWithBrand & { category: { category_name: string; parent_category: { category_name: string } | null } | null })[]) ?? []

      if (category) {
        rows = rows.filter(
          (r) => r.category?.parent_category?.category_name === category || r.category?.category_name === category
        )
      }
      if (brandNames) {
        const set = new Set(brandNames.split(','))
        rows = rows.filter((r) => r.brand && set.has(r.brand.brand_name))
      }

      setProducts(rows)
      setLoading(false)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [category, mood, tag, search, brandNames])

  return { products, loading }
}
