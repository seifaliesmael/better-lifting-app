import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthErrorResponse, LoginRequest, LoginResponse, UserInfo } from "../Data/AuthData";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Platform } from "react-native";

const rootURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth`;
const isWeb = Platform.OS === "web";


// Mobile only
export const saveTokens = async (data: LoginResponse): Promise<void> => {
    if (isWeb) return; // No tokens saved on web, HttpOnly cookies used instead
    try {
        await SecureStore.setItemAsync("LOGIN_TOKEN_TYPE", data.tokenType);
        await SecureStore.setItemAsync("LOGIN_TOKEN", data.accessToken);
        await SecureStore.setItemAsync("REFRESH_TOKEN", data.refreshToken.toString());
    } catch (err) {
        console.log("Error in saving login tokens:", err);
    }
};

export const getLoginToken = async (): Promise<string | null> =>
    isWeb ? null : await SecureStore.getItemAsync("LOGIN_TOKEN");

export const clearTokens = async (): Promise<void> => {
    if (isWeb) return;
    try {
        await SecureStore.deleteItemAsync("LOGIN_TOKEN");
        await SecureStore.deleteItemAsync("REFRESH_TOKEN");
    } catch (err) {
        console.log("Error in clearing tokens", err);
    }
};

// API services (Hooks)
export const useLoginAttempt = () => {
    const queryClient = useQueryClient();

    const sendLoginRequest = async (payload: LoginRequest): Promise<LoginResponse | void> => {
        const response = await fetch(
            `${rootURL}/login?useCookies=${isWeb}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            }
        );
        if (!response.ok) {
            if (response.status === 401) return Promise.reject(new Error("Invalid username or password."));
            throw new Error(`Network error, HTTP code ${response.status}`);
        }

        if (isWeb) return;

        const tokenData: LoginResponse = await response.json();
        await saveTokens(tokenData);
        return tokenData;
    };

    return useMutation({
        mutationFn: sendLoginRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            router.replace("/");
        },
        onError: (err) => {
            console.log("Login failed:", err.message);
        }
    });
};

export const useRegisterAttempt = () => {
    const queryClient = useQueryClient();

    const sendRegisterRequest = async (payload: {email:string, password:string}) => {
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
            queryClient.invalidateQueries({queryKey: ["authUser"]})

            // Log in to created account upon success
            const {mutate:triggerLogin} = useLoginAttempt();
            triggerLogin(variables);
            
            router.replace("/");
        },
        onError: (err:AuthErrorResponse) => {
            console.log("Registration failed:", err.errors);
        }
    });
}

export const useLogout = () => {
    const queryClient = useQueryClient();
    const sendLogoutRequest = async () => {
        const loginToken = await getLoginToken();
        const response = await fetch(`${rootURL}/logout`, {
            method: "POST",
            credentials: "include",
            headers: isWeb ? {} : { "Authorization": `Bearer ${loginToken}` },
        });
        if (!response.ok) {
            if (response.status === 401) return "User not presently logged in.";
            throw new Error(`Network error, HTTP code ${response.status}`);
        }
        return response.text();
    };

    return useMutation({
        mutationFn: sendLogoutRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["authUser"] });
            await clearTokens();
            router.replace("/auth/login");
        },
        onError: (err: Error) => {
            console.log("Logout failed:", err.message);
        }
    });
};

export const checkLoggedIn = () => useQuery({
    queryKey: ["authUser"],
    queryFn: async (): Promise<UserInfo | null> => {
        const loginToken = await getLoginToken();
        const response = await fetch(`${rootURL}/manage/info`, {
            credentials: "include",
            headers: isWeb || !loginToken ? {} : { "Authorization": `Bearer ${loginToken}` },
        });
        if (!response.ok) {
            if (response.status === 401) await clearTokens();
            return null;
        }
        const data: UserInfo | null = await response.json();
        return data;
    },
    retry: false,
    staleTime: 60000
});