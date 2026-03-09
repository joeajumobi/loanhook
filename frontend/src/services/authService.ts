const API_URL = 'http://localhost:5001/api/auth';

export interface AuthResponse {
  token?: string;
  message?: string;
  error?: string;
}


export const signup = async (fullName: string, email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:5001/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();

    // Log this to see exactly what the backend is sending you!
    console.log("Full backend response:", data);

    if (!response.ok) {
      return { error: data.message || "Signup failed" };
    }

    return data; // This MUST be here to send the token to the SignupScreen
  } catch (error) {
    console.error("Fetch Error:", error);
    return { error: "Could not connect to backend. Is it running on port 5001?" };
  }
};

// 2. Ensure you have the 'export' keyword before 'const login'
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// services/authService.ts

export const loginAsGuest = async () => {
  const response = await fetch("http://localhost:5001/api/auth/guest-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  return await response.json();
};