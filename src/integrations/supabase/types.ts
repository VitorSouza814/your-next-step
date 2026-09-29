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
      accounts: {
        Row: {
          auto_crm: boolean
          created_at: string
          credits: number
          display_name: string
          notify_email: boolean
          user_id: string
        }
        Insert: {
          auto_crm?: boolean
          created_at?: string
          credits?: number
          display_name?: string
          notify_email?: boolean
          user_id: string
        }
        Update: {
          auto_crm?: boolean
          created_at?: string
          credits?: number
          display_name?: string
          notify_email?: boolean
          user_id?: string
        }
        Relationships: []
      }
      crm_activities: {
        Row: {
          completed_at: string | null
          created_at: string
          detail: string
          due_at: string | null
          id: string
          kind: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          detail: string
          due_at?: string | null
          id?: string
          kind: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          detail?: string
          due_at?: string | null
          id?: string
          kind?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_entries: {
        Row: {
          amount: number
          created_at: string
          description: string
          direction: string
          due_at: string | null
          id: string
          opportunity_id: string | null
          paid_at: string | null
          recurring: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          direction: string
          due_at?: string | null
          id?: string
          opportunity_id?: string | null
          paid_at?: string | null
          recurring?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          direction?: string
          due_at?: string | null
          id?: string
          opportunity_id?: string | null
          paid_at?: string | null
          recurring?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_entries_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          analysis_status: string
          closed_at: string | null
          confidence: string | null
          created_at: string
          diagnosis: string | null
          id: string
          lead_id: string
          next_action: string | null
          next_action_at: string | null
          owner_name: string | null
          priority: string
          proposed_monthly: number | null
          proposed_oneoff: number | null
          score: number | null
          service_id: string | null
          stage_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_status?: string
          closed_at?: string | null
          confidence?: string | null
          created_at?: string
          diagnosis?: string | null
          id?: string
          lead_id: string
          next_action?: string | null
          next_action_at?: string | null
          owner_name?: string | null
          priority?: string
          proposed_monthly?: number | null
          proposed_oneoff?: number | null
          score?: number | null
          service_id?: string | null
          stage_id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_status?: string
          closed_at?: string | null
          confidence?: string | null
          created_at?: string
          diagnosis?: string | null
          id?: string
          lead_id?: string
          next_action?: string | null
          next_action_at?: string | null
          owner_name?: string | null
          priority?: string
          proposed_monthly?: number | null
          proposed_oneoff?: number | null
          score?: number | null
          service_id?: string | null
          stage_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "saved_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          id: string
          kind: string
          label: string
          sort_order: number
          user_id: string | null
        }
        Insert: {
          id: string
          kind?: string
          label: string
          sort_order: number
          user_id?: string | null
        }
        Update: {
          id?: string
          kind?: string
          label?: string
          sort_order?: number
          user_id?: string | null
        }
        Relationships: []
      }
      saved_leads: {
        Row: {
          address: string
          contacted_at: string | null
          created_at: string
          do_not_contact: boolean
          email: string | null
          google_opportunity: boolean
          id: string
          maps_url: string | null
          name: string
          notes: string
          phone: string | null
          place_id: string
          rating: number | null
          review_needed: boolean
          reviews: number | null
          sector: string | null
          status: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string
          contacted_at?: string | null
          created_at?: string
          do_not_contact?: boolean
          email?: string | null
          google_opportunity?: boolean
          id?: string
          maps_url?: string | null
          name: string
          notes?: string
          phone?: string | null
          place_id: string
          rating?: number | null
          review_needed?: boolean
          reviews?: number | null
          sector?: string | null
          status?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string
          contacted_at?: string | null
          created_at?: string
          do_not_contact?: boolean
          email?: string | null
          google_opportunity?: boolean
          id?: string
          maps_url?: string | null
          name?: string
          notes?: string
          phone?: string | null
          place_id?: string
          rating?: number | null
          review_needed?: boolean
          reviews?: number | null
          sector?: string | null
          status?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      search_leads: {
        Row: {
          lead_id: string
          search_id: string
          user_id: string
        }
        Insert: {
          lead_id: string
          search_id: string
          user_id: string
        }
        Update: {
          lead_id?: string
          search_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_leads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "saved_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_leads_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "searches"
            referencedColumns: ["id"]
          },
        ]
      }
      searches: {
        Row: {
          city: string
          created_at: string
          id: string
          results: Json
          sector: string
          status: string
          total: number
          user_id: string
          without_site: number
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          results?: Json
          sector: string
          status?: string
          total?: number
          user_id: string
          without_site?: number
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          results?: Json
          sector?: string
          status?: string
          total?: number
          user_id?: string
          without_site?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          reply: string | null
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          reply?: string | null
          status?: string
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          reply?: string | null
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_search: {
        Args: { p_city: string; p_sector: string }
        Returns: string
      }
      ensure_account: {
        Args: never
        Returns: {
          auto_crm: boolean
          created_at: string
          credits: number
          display_name: string
          notify_email: boolean
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      finish_search: {
        Args: { p_id: string; p_results: Json; p_success: boolean }
        Returns: undefined
      }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      import_search_to_crm: {
        Args: { p_place_ids?: string[]; p_search_id: string }
        Returns: Json
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
