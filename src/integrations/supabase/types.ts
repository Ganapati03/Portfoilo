export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          title: string | null
          bio: string | null
          avatar_url: string | null
          resume_url: string | null
          email: string | null
          github_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          gemini_api_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          title?: string | null
          bio?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          email?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          gemini_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          title?: string | null
          bio?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          email?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          gemini_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          proficiency: number
          icon_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          proficiency?: number
          icon_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          proficiency?: number
          icon_name?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          demo_url: string | null
          github_url: string | null
          tags: string[] | null
          featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          demo_url?: string | null
          github_url?: string | null
          tags?: string[] | null
          featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          demo_url?: string | null
          github_url?: string | null
          tags?: string[] | null
          featured?: boolean
          created_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          company: string
          position: string
          start_date: string | null
          end_date: string | null
          current: boolean
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company: string
          position: string
          start_date?: string | null
          end_date?: string | null
          current?: boolean
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company?: string
          position?: string
          start_date?: string | null
          end_date?: string | null
          current?: boolean
          description?: string | null
          created_at?: string
        }
      }
      certifications: {
        Row: {
          id: string
          name: string
          issuer: string
          issue_date: string | null
          credential_url: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          issuer: string
          issue_date?: string | null
          credential_url?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          issuer?: string
          issue_date?: string | null
          credential_url?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      ai_knowledge: {
        Row: {
          id: string
          topic: string
          description: string | null
          proficiency: number
          created_at: string
        }
        Insert: {
          id?: string
          topic: string
          description?: string | null
          proficiency?: number
          created_at?: string
        }
        Update: {
          id?: string
          topic?: string
          description?: string | null
          proficiency?: number
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      education: {
        Row: {
          id: string
          institution: string
          degree: string
          field_of_study: string
          start_date: string | null
          end_date: string | null
          grade: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          institution: string
          degree: string
          field_of_study: string
          start_date?: string | null
          end_date?: string | null
          grade?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          institution?: string
          degree?: string
          field_of_study?: string
          start_date?: string | null
          end_date?: string | null
          grade?: string | null
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}
