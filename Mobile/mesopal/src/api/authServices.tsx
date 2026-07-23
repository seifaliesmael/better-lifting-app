import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthErrorResponse, LoginRequest, LoginResponse, UserInfo } from "../Data/AuthData";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Platform } from "react-native";

const rootURL = "http://localhost:5240/api/auth";

// Token services -> For storing login JWTs securely on the device with expo secure store
export const saveTokens      = async (data: LoginResponse): Promise<void> => (Platform.OS === "web") ? saveTokens_dev(data)  : await saveTokens_mobile(data);
export const getLoginToken   = async (): Promise<string | null>           => (Platform.OS === "web") ? getLoginToken_dev()   : await getLoginToken_mobile();
export const getRefreshToken = async (): Promise<string | null>           => (Platform.OS === "web") ? getRefreshToken_dev() : await getRefreshToken_mobile();
export const clearTokens     = async (): Promise<void>                    => (Platform.OS === "web") ? clearTokens_dev()     : await clearTokens_mobile();

// For prod and mobile -> expo secure store
export const saveTokens_mobile = async ({tokenType, accessToken, refreshToken}:LoginResponse): Promise<void> => {
    try {
        await SecureStore.setItemAsync("LOGIN_TOKEN_TYPE", tokenType);
        await SecureStore.setItemAsync ("LOGIN_TOKEN", accessToken);
        await SecureStore.setItemAsync ("REFRESH_TOKEN", refreshToken.toString());
    }
    catch (err) {
        console.log("Error in saving login tokens:", err)
    }
}

export const getLoginToken_mobile = async (): Promise<string | null> => await SecureStore.getItemAsync("LOGIN_TOKEN");
export const getRefreshToken_mobile = async (): Promise<string | null> => await SecureStore.getItemAsync("REFRESH_TOKEN"); 
export const clearTokens_mobile = async (): Promise<void> => {
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

// API services (Hooks)
export const useRegisterAttempt = () => {
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
            return Promise.reject({errors: errorData.errors})
        }

        return response.text(); // Returns empty body on successful registration
    };

    return useMutation({
        mutationFn: sendRegisterRequest,
        onSuccess: async (_, variables) => {
            console.log("Registration successful");
            await queryClient.invalidateQueries({queryKey: ["authUser"]})

            // After creating user, sign in as this user (using same credentials)
            const {mutate:login} = useLoginAttempt();
            login(variables);

            // Redirect
            router.replace("/");
        },
        onError: (err:AuthErrorResponse) => {
            console.log("Registration failed:", err.errors);
        }
    });
}

// Send login request to backend using tokens
export const useLoginAttempt = () => {
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

        const tokenData: LoginResponse = await response.json();
        await saveTokens(tokenData);

        return tokenData;
    };

    return useMutation({
        mutationFn: sendLoginRequest,
        onSuccess: (_, variables) => {
            console.log("Login successful");
            queryClient.invalidateQueries({queryKey: ["authUser"]})
            router.replace("/");

        },
        onError: (err) => {
            console.log("Login failed:", err.message);
        }
    });
}

// Send logout request to backend
export const useLogout = () => {
    const queryClient = useQueryClient();
     const sendLogoutRequest = async () => {
        const loginToken = await getLoginToken();
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
            await clearTokens();
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
        const loginToken = await getLoginToken();
        if (!loginToken) return null;

        const response = await fetch(`${rootURL}/manage/info`, {
            // Authenticate with saved login token
            headers: {"Authorization": `Bearer ${loginToken}`}
        }
        );
        if (!response.ok) {
            if (response.status === 401) await clearTokens(); // Clear saved tokens if no longer valid
            return null;
        };

        const data: UserInfo | null = await response.json();
        if (data) console.log (`Logged in, Email: ${data.email}`);
        return data;
    },
    retry:false,
    staleTime: 60000 // Keep auth valid for one minute
})