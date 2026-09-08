export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  token_type?: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}
