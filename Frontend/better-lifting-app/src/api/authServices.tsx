import { useMutation } from "@tanstack/react-query";
import type { AuthErrorResponse, LoginRequest, LoginResponse } from "../Data/AuthData";

const rootURL = "http://localhost:5240/api/auth";

interface RequestProps {
    payload: LoginRequest;
    updateView:(page:string) => void;
}

export const attemptRegister = () => {
    const sendRegisterRequest = async ({payload}: RequestProps) => {
        const response = await fetch(`${rootURL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok)
        {
            const errorData = await response.json();
            throw errorData;
        }

        return response.text(); // Returns empty body on successful registration
    };

    return useMutation({
        mutationFn:sendRegisterRequest,
        onSuccess: (data, variables) => {
            console.log("Registration successful:", data);
            variables.updateView("default");
        },
        onError: (err:AuthErrorResponse) => {
            console.log("Registration failed:", err.errors);
        }
    });
}

export const attemptLogin = () => {
    const sendLoginRequest = async ({payload} : RequestProps): Promise<LoginResponse> => {
        const response = await fetch(`${rootURL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok)
            throw new Error(`Network error, HTTP code ${response.status}`);
        return response.json();
    };

    return useMutation({
        mutationFn:sendLoginRequest,
        onSuccess: (data:LoginResponse, variables) => {
            console.log("Login successful:", data);

            // TODO: Save access token, refresh token.

            variables.updateView("default");

        },
        onError: (err:AuthErrorResponse) => {
            console.log("Login failed:", err.errors);
        }
    });
}