import { Dumbbell } from "lucide-react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

import { RepsPerMuscle } from "~/components/chart-visuals";

import { loader } from "./server";
import { WorkoutsList } from "./workouts-list";

export { loader };
export const clientLoader = cacheClientLoader;
clientLoader.hydrate = true;

export default function HomeRoute() {
  const { workoutExercises } = useCachedLoaderData<typeof loader>();

  return (
    <>
      <div className="space-y-12 pt-14">
        <div className="header flex items-center justify-center gap-4">
          <Dumbbell />
        </div>

        <section>
          <RepsPerMuscle workoutExercises={workoutExercises} />
          {/* <MostRecurringWorkout workoutExercises={workoutExercises} /> */}
        </section>

        <WorkoutsList />
      </div>
    </>
  );
}
