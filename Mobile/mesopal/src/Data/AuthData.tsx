// Request and response payloads for logging in (or attempting to)
export interface LoginRequest {
    email:string;
    password:string;
}
export interface LoginResponse {
    tokenType:string;
    accessToken:string;
    expiresIn:number;
    refreshToken:string;
}

export interface AuthErrorResponse {
    type?: string;
    title: string;
    status: number;
    errors: Record<string, string[]>;
    traceId?: string;
}

// returned by .NET when checking if user is logged in
export interface UserInfo {
    email: string;
    isEmailConfirmed: boolean;
}