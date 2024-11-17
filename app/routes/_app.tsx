import { Outlet, redirect } from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import { Navbar } from "~/components/navbar";
import { WorkoutsContext } from "~/hooks/use-workouts";
import { api } from "~/lib/api";

export const loader = async () => {
  const user = api.authStore.model;

  if (!user) {
    return redirect("/login");
  }

  const [workouts, exercises] = await Promise.all([
    api.collection("workouts").getFullList({ sort: "-date", filter: `user_id="${user.id}"` }),
    api.collection("exercises").getFullList(),
  ]);

  return { workouts, exercises };
};

export const clientLoader = cacheClientLoader;

(clientLoader as any).hydrate = true;

export default function App() {
  const data = useCachedLoaderData<typeof loader>();

  return (
    <WorkoutsContext.Provider
      value={{
        workouts: data?.workouts || [],
        exercises: data?.exercises || [],
      }}
    >
      <main>
        <Outlet />
        <Navbar />
      </main>
    </WorkoutsContext.Provider>
  );
}
