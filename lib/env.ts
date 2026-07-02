export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,

    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    jwksUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/.well-known/jwks.json`,

    databaseUrl: process.env.DATABASE_URL,

    directUrl: process.env.DIRECT_URL,

    roleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  database: {},
} as const;
