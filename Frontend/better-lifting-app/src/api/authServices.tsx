import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthErrorResponse, LoginRequest } from "../Data/AuthData";

const rootURL = "http://localhost:5240/api/auth";

interface RequestProps {
    payload: LoginRequest;
    updateView:(page:string) => void;
}

interface LogoutProps {
    updateView:(page:string) => void;
}

// returned by .NET when checking if user is logged in
interface UserInfo {
    email: string;
    isEmailConfirmed: boolean;
}


export const attemptRegister = () => {
    const queryClient = useQueryClient();

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
            queryClient.invalidateQueries({queryKey: ["authUser"]})
            variables.updateView("default");
        },
        onError: (err:AuthErrorResponse) => {
            console.log("Registration failed:", err.errors);
        }
    });
}

export const attemptLogin = () => {
    const queryClient = useQueryClient();

    const sendLoginRequest = async ({payload} : RequestProps) => {
        const response = await fetch(`${rootURL}/login?useCookies=true`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials:"include"
        });
        if (!response.ok)
        {
            if (response.status === 401) return Promise.reject(new Error("Invalid username or password."));
            throw new Error(`Network error, HTTP code ${response.status}`);
        }
        return response.text();
    };

    return useMutation({
        mutationFn:sendLoginRequest,
        onSuccess: (_, variables) => {
            console.log("Login successful:");
            queryClient.invalidateQueries({queryKey: ["authUser"]})
            variables.updateView("default");

        },
        onError: (err) => {
            console.log("Login failed:", err.message);
        }
    });
}

export const attemptLogout = () => {
    const queryClient = useQueryClient();

     const sendLogoutRequest = async ({} : LogoutProps) => {
        const response = await fetch(`${rootURL}/logout`, {
            method: "POST",
            credentials:"include"
        });
        if (!response.ok)
        {
            if (response.status == 401) return "User not presently logged in.";
            throw new Error(`Network error, HTTP code ${response.status}`);
        }
        return response.text();
    };

    return useMutation({
        mutationFn:sendLogoutRequest,
        onSuccess: (_, variables) => {
            console.log("Logout successful:");
            queryClient.invalidateQueries({queryKey: ["authUser"]})
            variables.updateView("default");

        },
        onError: (err:Error) => {
            console.log("Logout failed:", err.message);
        }
    });   
}

export const checkLoggedIn = () => useQuery({
    queryKey: ["authUser"],
    queryFn: async (): Promise<UserInfo | null> => {
        const response = await fetch(`${rootURL}/manage/info`, {credentials:"include"});
        if (!response.ok) return null;
        return response.json(); 
    },
    retry:false,
    staleTime: 60000 // Keep auth valid for one minute

})