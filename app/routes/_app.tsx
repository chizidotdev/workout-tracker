import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { type RecordAuthResponse } from "pocketbase";
import { Navbar } from "~/components/navbar";
import { WorkoutsContext } from "~/hooks/use-workouts";
import { api, authQueryKey, queryClient } from "~/lib/api";
import { ExercisesResponse, UsersResponse, WorkoutsResponse } from "~/lib/types";

const workoutsQueryKey = ["workouts"];

export const clientLoader = async () => {
  let userData = queryClient.getQueryData<RecordAuthResponse<UsersResponse<unknown>>>(authQueryKey);

  try {
    if (!userData) {
      userData = await api.collection("users").authRefresh();
      queryClient.setQueryData(authQueryKey, userData);
    }
  } catch (e) {
    return redirect("/login");
  }

  if (!userData.record) {
    return redirect("/login");
  }

  const data = queryClient.getQueryData<{
    workouts: WorkoutsResponse[];
    exercises: ExercisesResponse[];
  }>(workoutsQueryKey);
  if (data) return data;

  const [workouts, exercises] = await Promise.all([
    api.collection("workouts").getFullList({
      sort: "-date",
      filter: `user_id="${userData.record.id}"`,
    }),
    api.collection("exercises").getFullList(),
  ]);

  queryClient.setQueryData(workoutsQueryKey, { workouts, exercises });

  return { workouts, exercises };
};

export default function AppLayout() {
  const { workouts, exercises } = useLoaderData<typeof clientLoader>();

  return (
    <WorkoutsContext.Provider value={{ workouts, exercises }}>
      <main>
        <Outlet />
        <Navbar />
      </main>
    </WorkoutsContext.Provider>
  );
}
