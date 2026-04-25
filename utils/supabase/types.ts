export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          referral_link: string | null;
          whatsapp: string | null;
          username: string;
          is_lp_active: boolean;
          referred_by: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          referral_link?: string | null;
          whatsapp?: string | null;
          username: string;
          is_lp_active?: boolean;
          referred_by?: string | null;
        };
        Update: {
          email?: string | null;
          referral_link?: string | null;
          whatsapp?: string | null;
          username?: string;
          is_lp_active?: boolean;
          referred_by?: string | null;
        };
        Relationships: [];
      };
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
