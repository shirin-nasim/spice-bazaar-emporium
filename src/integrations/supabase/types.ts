export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: number
          created_at: string
          gift_box_id: number | null
          id: number
          pack_size: string | null
          product_id: number
          quantity: number
          updated_at: string
        }
        Insert: {
          cart_id: number
          created_at?: string
          gift_box_id?: number | null
          id?: number
          pack_size?: string | null
          product_id: number
          quantity: number
          updated_at?: string
        }
        Update: {
          cart_id?: number
          created_at?: string
          gift_box_id?: number | null
          id?: number
          pack_size?: string | null
          product_id?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_gift_box_id_fkey"
            columns: ["gift_box_id"]
            isOneToOne: false
            referencedRelation: "gift_boxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      gift_boxes: {
        Row: {
          created_at: string
          description: string
          featured: boolean | null
          id: number
          image_url: string | null
          items: string[]
          name: string
          price: number
          slug: string
        }
        Insert: {
          created_at?: string
          description: string
          featured?: boolean | null
          id?: number
          image_url?: string | null
          items?: string[]
          name: string
          price: number
          slug: string
        }
        Update: {
          created_at?: string
          description?: string
          featured?: boolean | null
          id?: number
          image_url?: string | null
          items?: string[]
          name?: string
          price?: number
          slug?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          gift_box_id: number | null
          id: number
          order_id: number
          pack_size: string | null
          price: number
          product_id: number | null
          product_name: string
          quantity: number
        }
        Insert: {
          created_at?: string
          gift_box_id?: number | null
          id?: number
          order_id: number
          pack_size?: string | null
          price: number
          product_id?: number | null
          product_name: string
          quantity: number
        }
        Update: {
          created_at?: string
          gift_box_id?: number | null
          id?: number
          order_id?: number
          pack_size?: string | null
          price?: number
          product_id?: number | null
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_gift_box_id_fkey"
            columns: ["gift_box_id"]
            isOneToOne: false
            referencedRelation: "gift_boxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          id: number
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          id?: number
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          id?: number
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: number | null
          created_at: string
          description: string | null
          featured: boolean | null
          hs_code: string | null
          id: number
          image_url: string | null
          in_stock: boolean | null
          is_bulk_available: boolean | null
          is_gift_suitable: boolean | null
          name: string
          origin: string | null
          pack_sizes: string[] | null
          price: number
          rating: number | null
          sale_price: number | null
          shelf_life: string | null
          slug: string
          sourcing: string | null
          sourcing_city: string | null
          subcategory_id: number | null
          supplier_details: string | null
          tags: string[] | null
          updated_at: string
          use_case: string | null
          weight: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          hs_code?: string | null
          id?: number
          image_url?: string | null
          in_stock?: boolean | null
          is_bulk_available?: boolean | null
          is_gift_suitable?: boolean | null
          name: string
          origin?: string | null
          pack_sizes?: string[] | null
          price: number
          rating?: number | null
          sale_price?: number | null
          shelf_life?: string | null
          slug: string
          sourcing?: string | null
          sourcing_city?: string | null
          subcategory_id?: number | null
          supplier_details?: string | null
          tags?: string[] | null
          updated_at?: string
          use_case?: string | null
          weight?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          hs_code?: string | null
          id?: number
          image_url?: string | null
          in_stock?: boolean | null
          is_bulk_available?: boolean | null
          is_gift_suitable?: boolean | null
          name?: string
          origin?: string | null
          pack_sizes?: string[] | null
          price?: number
          rating?: number | null
          sale_price?: number | null
          shelf_life?: string | null
          slug?: string
          sourcing?: string | null
          sourcing_city?: string | null
          subcategory_id?: number | null
          supplier_details?: string | null
          tags?: string[] | null
          updated_at?: string
          use_case?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          product_id: number
          rating: number
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          product_id: number
          rating: number
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          product_id?: number
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: number | null
          created_at: string
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          id: number
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          product_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
