import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthErrorResponse, LoginRequest, LoginResponse } from "../Data/AuthData";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Platform } from "react-native";

const rootURL = "http://localhost:5240/api/auth";

// returned by .NET when checking if user is logged in
interface UserInfo {
    email: string;
    isEmailConfirmed: boolean;
}
// Token services -> For storing login JWTs securely on the device with expo secure store

// For prod and mobile -> expo secure store
export const saveTokens = async ({tokenType, accessToken, refreshToken}:LoginResponse): Promise<void> => {
    try {
        await SecureStore.setItemAsync("LOGIN_TOKEN_TYPE", tokenType);
        await SecureStore.setItemAsync ("LOGIN_TOKEN", accessToken);
        await SecureStore.setItemAsync ("REFRESH_TOKEN", refreshToken.toString());
    }
    catch (err) {
        console.log("Error in saving login tokens:", err)
    }
}

export const getLoginToken = async (): Promise<string | null> => await SecureStore.getItemAsync("LOGIN_TOKEN");
export const getRefreshToken = async (): Promise<string | null> => await SecureStore.getItemAsync("REFRESH_TOKEN"); 
export const clearTokens = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync("LOGIN_TOKEN");
        await SecureStore.deleteItemAsync("REFRESH_TOKEN");
    }
    catch (err) {
        console.log("Error in clearing tokens", err);
    }
}

// FOR DEV ONLY -> Web local storage
export const saveTokens_dev = ({tokenType, accessToken, refreshToken}:LoginResponse): void => {
    try {
        localStorage.setItem("LOGIN_TOKEN_TYPE", tokenType);
        localStorage.setItem ("LOGIN_TOKEN", accessToken);
        localStorage.setItem ("REFRESH_TOKEN", refreshToken.toString());
    }
    catch (err) {
        console.log("DEV: Error in saving login tokens:", err)
    }
}
export const getLoginToken_dev = (): string | null => localStorage.getItem("LOGIN_TOKEN");
export const getRefreshToken_dev = (): string | null => localStorage.getItem("REFRESH_TOKEN"); 
export const clearTokens_dev = (): void => {
    try {
        localStorage.removeItem("LOGIN_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");
    }
    catch (err) {
        console.log("Error in clearing tokens", err);
    }
}
// End token services

// API services
export const attemptRegister = () => {
    const queryClient = useQueryClient();

    const sendRegisterRequest = async (payload: LoginRequest) => {
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
        mutationFn: sendRegisterRequest,
        onSuccess: async (data, variables) => {
            console.log("Registration successful:", data);
            await queryClient.invalidateQueries({queryKey: ["authUser"]})
            router.replace("/(tabs)");
        },
        onError: (err:AuthErrorResponse) => {
            console.log("Registration failed:", err.errors);
        }
    });
}

// Send login request to backend using tokens
export const attemptLogin = () => {
    const queryClient = useQueryClient();

    const sendLoginRequest = async (payload : LoginRequest): Promise<LoginResponse> => {
        const response = await fetch(`${rootURL}/login?useCookies=false`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": ""},
            body: JSON.stringify(payload),
        }); 
        if (!response.ok)
        {
            if (response.status === 401) return Promise.reject(new Error("Invalid username or password."));
            throw new Error(`Network error, HTTP code ${response.status}`);
        }
        // console.log("Received login response:", await response.text());

        const tokenData: LoginResponse = await response.json();
        if (Platform.OS === "web") saveTokens_dev(tokenData);
        else await saveTokens(tokenData);

        return tokenData;
    };

    return useMutation({
        mutationFn: sendLoginRequest,
        onSuccess: async (_, variables) => {
            console.log("Login successful:");
            await queryClient.invalidateQueries({queryKey: ["authUser"]})
            router.replace("/(tabs)");

        },
        onError: (err) => {
            console.log("Login failed:", err.message);
        }
    });
}

// Send logout request to backend
export const attemptLogout = () => {
    const queryClient = useQueryClient();
     const sendLogoutRequest = async () => {
        const loginToken = (Platform.OS === "web") ? getLoginToken_dev() : await getLoginToken();
        const response = await fetch(`${rootURL}/logout`, {
            method: "POST",
            headers: {"Authorization": `Bearer ${loginToken}`}
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
        onSuccess: async (_, variables) => {
            console.log("Logout successful:");
            await queryClient.invalidateQueries({queryKey: ["authUser"]});
            (Platform.OS === "web") ? clearTokens_dev() : await clearTokens();
            router.replace("/auth/login");

        },
        onError: (err:Error) => {
            console.log("Logout failed:", err.message);
        }
    });   
}

// Verify login status using saved tokens
export const checkLoggedIn = () => useQuery({
    queryKey: ["authUser"],
    queryFn: async (): Promise<UserInfo | null> => {
        const loginToken = (Platform.OS === "web") ? getLoginToken_dev() : await getLoginToken();
        // If not currently logged in
        if (!loginToken) return null;


        const response = await fetch(`${rootURL}/manage/info`, {
            // Authenticate with saved login token
            headers: {"Authorization": `Bearer ${loginToken}`}
        }
        );
        if (!response.ok) {
            if (response.status === 401) { (Platform.OS === "web") ? clearTokens_dev() : await clearTokens(); } // Clear saved tokens if no longer valid
            return null;
        };

        return response.json(); 
    },
    retry:false,
    staleTime: 60000 // Keep auth valid for one minute
})