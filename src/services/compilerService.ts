import axios from 'axios';

export interface CompilerRequest {
  language: string;
  code: string;
  stdin: string;
  filename: string;
}

export interface CompilerResponse {
  output?: string;
  error?: string;
  status?: string;
}

interface APIResponse {
  data: {
    output?: string;
    error?: string;
    codeStatus?: {
      id: number;
      description: string;
    };
    time?: string;
    memory?: number;
  };
}

const getEdgeFunctionURL = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is not configured');
  }
  return `${supabaseUrl}/functions/v1/compile-java`;
};

const extractMainClassName = (code: string): string => {
  const publicClassRegex = /public\s+class\s+(\w+)\s*\{[\s\S]*?public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*\w+\s*\)/;
  const publicMatch = code.match(publicClassRegex);
  if (publicMatch && publicMatch[1]) {
    return publicMatch[1];
  }

  const classWithMainRegex = /class\s+(\w+)\s*\{[\s\S]*?public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*\w+\s*\)/;
  const classMatch = code.match(classWithMainRegex);
  if (classMatch && classMatch[1]) {
    return classMatch[1];
  }

  const anyPublicClassRegex = /public\s+class\s+(\w+)/;
  const anyPublicMatch = code.match(anyPublicClassRegex);
  if (anyPublicMatch && anyPublicMatch[1]) {
    return anyPublicMatch[1];
  }

  return 'Main';
};

export const runJavaCode = async (code: string, stdin: string = ''): Promise<CompilerResponse> => {
  try {
    const filename = extractMainClassName(code);

    const payload: CompilerRequest = {
      language: 'java',
      code,
      stdin,
      filename
    };

    const edgeFunctionURL = getEdgeFunctionURL();

    const response = await axios.post<APIResponse>(
      edgeFunctionURL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    const apiData = response.data.data;

    if (apiData.error) {
      return {
        error: apiData.error,
        status: 'error'
      };
    }

    if (apiData.output !== undefined) {
      return {
        output: apiData.output,
        status: 'success'
      };
    }

    return {
      output: 'Code executed successfully with no output',
      status: 'success'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorData = error.response.data as any;
        return {
          error: errorData?.data?.error || errorData?.error || 'Compilation error occurred',
          status: 'error'
        };
      } else if (error.request) {
        return {
          error: 'Network error: Unable to reach compiler server. Please check your internet connection.',
          status: 'error'
        };
      } else if (error.code === 'ECONNABORTED') {
        return {
          error: 'Request timeout: The compiler took too long to respond.',
          status: 'error'
        };
      }
    }
    return {
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
      status: 'error'
    };
  }
};
