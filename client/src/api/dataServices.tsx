import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExRequest, WORequest } from "../Data/Requests";
import type { ExResponse, MuscleResponse, WOResponse } from "../Data/Responses";
import { checkLoggedIn, getLoginToken } from "./authServices";
import { Platform } from "react-native";
import { router } from "expo-router";

const rootURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}`;
const isWeb = Platform.OS === "web";

/*
-----------------------------------------------------------------------
Fetch Methods
-----------------------------------------------------------------------
*/

export const useFetchExercises = () => useQuery({
  queryKey: ["fetchExercises"],
  queryFn: async (): Promise<ExResponse[]> => {
    const response = await fetch(`${rootURL}/exercises`);
    if (!response.ok) throw new Error("Network error");
    return response.json();
  },
  retry: false,
  refetchOnWindowFocus: false,
});

export const useFetchMuscleGroups = () => useQuery({
  queryKey: ["fetchMuscleGroups"],
  queryFn: async (): Promise<MuscleResponse[]> => {
    const response = await fetch(`${rootURL}/musclegroups`);
    if (!response.ok) throw new Error("Network error");
    return response.json();
  },
  retry: false,
});

export const useFetchWorkouts = (email: string | undefined) => useQuery({
  queryKey: ["useFetchWorkouts", email],
  queryFn: async (): Promise<WOResponse[]> => {
    const loginToken = await getLoginToken(); // null on web

    const response = await fetch(`${rootURL}/workouts/user`, {
      credentials: "include", // sends the httpOnly cookie on web
      headers: isWeb || !loginToken ? {} : { "Authorization": `Bearer ${loginToken}` },
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Not logged in");
      throw new Error(`Network error, HTTP code ${response.status}`);
    }
    return response.json();
  },
  retry: false,
  enabled: (email != undefined)
});

/*
-----------------------------------------------------------------------
Post Methods
-----------------------------------------------------------------------
*/

// Push workout to DB
export const useCreateWorkout = () => {
  const queryClient = useQueryClient();
  const {data:userInfo} = checkLoggedIn();

  const sendWorkoutRequest = async (payload: WORequest): Promise<WOResponse> => {
    const loginToken = await getLoginToken(); // null on web

    const response = await fetch(`${rootURL}/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isWeb || !loginToken ? {} : { "Authorization": `Bearer ${loginToken}` })
        },
        credentials:"include",
        body:JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(`Error, HTTP code ${response.status}}`);
    }

    return response.json();
  }

  return useMutation({
    mutationFn:sendWorkoutRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useFetchWorkouts", userInfo?.email] })
      router.push("/");
    },
    onError: (err) => {
        console.log("Workout post failed:", err.message);
    }
  })

}


// Push new exercise to DB - currently not in use
export const useCreateExercise = async (
  payload: ExRequest,
): Promise<ExResponse> => {
  const response = await fetch(`${rootURL}/exercises`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok)
    throw new Error(`Network error, HTTP code ${response.status}`);
  return response.json();
};
