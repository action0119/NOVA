export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_styling: {
        Row: {
          brand_name: string | null
          mood: string | null
          price_range: string | null
          product_id: string | null
          recommendation_id: string
          recommended_at: string
          user_id: string
        }
        Insert: {
          brand_name?: string | null
          mood?: string | null
          price_range?: string | null
          product_id?: string | null
          recommendation_id?: string
          recommended_at?: string
          user_id: string
        }
        Update: {
          brand_name?: string | null
          mood?: string | null
          price_range?: string | null
          product_id?: string | null
          recommendation_id?: string
          recommended_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_styling_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      brand: {
        Row: {
          brand_description: string | null
          brand_id: string
          brand_image: string | null
          brand_logo: string | null
          brand_mood: string | null
          brand_name: string
          featured_product_id: string | null
        }
        Insert: {
          brand_description?: string | null
          brand_id?: string
          brand_image?: string | null
          brand_logo?: string | null
          brand_mood?: string | null
          brand_name: string
          featured_product_id?: string | null
        }
        Update: {
          brand_description?: string | null
          brand_id?: string
          brand_image?: string | null
          brand_logo?: string | null
          brand_mood?: string | null
          brand_name?: string
          featured_product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_featured_product_fk"
            columns: ["featured_product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      cart: {
        Row: {
          cart_id: string
          created_at: string
          product_id: string
          quantity: number
          selected_color: string | null
          selected_size: string | null
          user_id: string
        }
        Insert: {
          cart_id?: string
          created_at?: string
          product_id: string
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
          user_id: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          product_id?: string
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      category: {
        Row: {
          category_id: string
          category_name: string
          parent_category_id: string | null
        }
        Insert: {
          category_id?: string
          category_name: string
          parent_category_id?: string | null
        }
        Update: {
          category_id?: string
          category_name?: string
          parent_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
        ]
      }
      coupon: {
        Row: {
          coupon_id: string
          coupon_name: string
          coupon_status: string
          discount_rate: number
          expired_at: string | null
          issued_at: string
          user_id: string
        }
        Insert: {
          coupon_id?: string
          coupon_name: string
          coupon_status?: string
          discount_rate: number
          expired_at?: string | null
          issued_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          coupon_name?: string
          coupon_status?: string
          discount_rate?: number
          expired_at?: string | null
          issued_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event: {
        Row: {
          discount_rate: number | null
          end_date: string | null
          event_description: string | null
          event_id: string
          event_image: string | null
          event_title: string
          start_date: string | null
        }
        Insert: {
          discount_rate?: number | null
          end_date?: string | null
          event_description?: string | null
          event_id?: string
          event_image?: string | null
          event_title: string
          start_date?: string | null
        }
        Update: {
          discount_rate?: number | null
          end_date?: string | null
          event_description?: string | null
          event_id?: string
          event_image?: string | null
          event_title?: string
          start_date?: string | null
        }
        Relationships: []
      }
      order_details: {
        Row: {
          order_detail_id: string
          order_id: string
          product_id: string
          product_price: number
          quantity: number
          selected_color: string | null
          selected_size: string | null
        }
        Insert: {
          order_detail_id?: string
          order_id: string
          product_id: string
          product_price: number
          quantity: number
          selected_color?: string | null
          selected_size?: string | null
        }
        Update: {
          order_detail_id?: string
          order_id?: string
          product_id?: string
          product_price?: number
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_details_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_details_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      orders: {
        Row: {
          order_date: string
          order_id: string
          order_status: string
          payment_method: string | null
          shipping_address: string | null
          total_price: number
          user_id: string
        }
        Insert: {
          order_date?: string
          order_id?: string
          order_status?: string
          payment_method?: string | null
          shipping_address?: string | null
          total_price: number
          user_id: string
        }
        Update: {
          order_date?: string
          order_id?: string
          order_status?: string
          payment_method?: string | null
          shipping_address?: string | null
          total_price?: number
          user_id?: string
        }
        Relationships: []
      }
      product: {
        Row: {
          brand_id: string | null
          category_id: string | null
          color: string[]
          created_at: string
          discount_rate: number
          mood: string | null
          product_description: string | null
          product_id: string
          product_image: string | null
          product_name: string
          product_price: number
          product_tag: string | null
          size: string[]
          stock: number
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          color?: string[]
          created_at?: string
          discount_rate?: number
          mood?: string | null
          product_description?: string | null
          product_id?: string
          product_image?: string | null
          product_name: string
          product_price: number
          product_tag?: string | null
          size?: string[]
          stock?: number
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          color?: string[]
          created_at?: string
          discount_rate?: number
          mood?: string | null
          product_description?: string | null
          product_id?: string
          product_image?: string | null
          product_name?: string
          product_price?: number
          product_tag?: string | null
          size?: string[]
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "product_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
        ]
      }
      recent_view: {
        Row: {
          product_id: string
          recent_view_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          product_id: string
          recent_view_id?: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          product_id?: string
          recent_view_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recent_view_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      review: {
        Row: {
          created_at: string
          product_id: string
          rating: number
          review_content: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          rating: number
          review_content: string
          review_id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          rating?: number
          review_content?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      search_keyword: {
        Row: {
          keyword: string
          keyword_id: string
          searched_at: string
          user_id: string | null
        }
        Insert: {
          keyword: string
          keyword_id?: string
          searched_at?: string
          user_id?: string | null
        }
        Update: {
          keyword?: string
          keyword_id?: string
          searched_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          auto_login: boolean
          email: string
          id: string
          join_date: string
          marketing_agree: boolean
          phone_number: string | null
          user_login_id: string
          user_name: string
        }
        Insert: {
          address?: string | null
          auto_login?: boolean
          email: string
          id: string
          join_date?: string
          marketing_agree?: boolean
          phone_number?: string | null
          user_login_id: string
          user_name: string
        }
        Update: {
          address?: string | null
          auto_login?: boolean
          email?: string
          id?: string
          join_date?: string
          marketing_agree?: boolean
          phone_number?: string | null
          user_login_id?: string
          user_name?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          product_id: string
          user_id: string
          wishlist_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          user_id: string
          wishlist_id?: string
        }
        Update: {
          created_at?: string
          product_id?: string
          user_id?: string
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_login_id_available: {
        Args: { p_login_id: string }
        Returns: boolean
      }
      get_email_by_login_id: { Args: { p_login_id: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
