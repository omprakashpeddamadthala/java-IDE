export interface AppConfig {
  app: {
    name: string;
    version: string;
  };
  theme: {
    defaultTheme: 'light' | 'dark';
  };
  database: {
    supabase: {
      url: string;
      anonKey: string;
    };
  };
  compiler: {
    serviceUrl?: string;
  };
}

const validateEnvVariable = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getConfig = (): AppConfig => {
  return {
    app: {
      name: import.meta.env.VITE_APP_NAME || 'Java Practice Platform',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    },
    theme: {
      defaultTheme: (import.meta.env.VITE_DEFAULT_THEME as 'light' | 'dark') || 'dark',
    },
    database: {
      supabase: {
        url: validateEnvVariable('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
        anonKey: validateEnvVariable('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
      },
    },
    compiler: {
      serviceUrl: import.meta.env.VITE_COMPILER_SERVICE_URL,
    },
  };
};

export const appConfig = getConfig();
