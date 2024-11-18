import { Link, redirect, useLoaderData } from "@remix-run/react";
import { format, formatDistanceToNow } from "date-fns";
import { Dumbbell, History, MoveUpRight } from "lucide-react";
import { RecordAuthResponse } from "pocketbase";
import { Fragment } from "react/jsx-runtime";
import { RepsPerMuscle } from "~/components/chart-visuals";
import { Button } from "~/components/ui/button";
import { Heading, Paragraph } from "~/components/ui/text";
import { useWorkouts } from "~/hooks/use-workouts";
import { api, authQueryKey, queryClient } from "~/lib/api";
import { WorkoutExercisesExpanded } from "~/lib/custom-types";
import { UsersResponse } from "~/lib/types";
import { cn } from "~/lib/utils";

const workoutExercisesQueryKey = ["workouts-exercises"];

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

  const data = queryClient.getQueryData<{ workoutExercises: WorkoutExercisesExpanded[] }>(
    workoutExercisesQueryKey
  );
  if (data) return data;

  const workoutExercises = await api
    .collection("workout_exercises")
    .getFullList<WorkoutExercisesExpanded>({
      expand: "exercise_id,workout_id",
      sort: "+created",
      filter: `user_id="${userData.record.id}"`,
    });

  queryClient.setQueryData(workoutExercisesQueryKey, { workoutExercises });

  return { workoutExercises };
};

export default function HomeRoute() {
  const { workoutExercises } = useLoaderData<typeof clientLoader>();

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

        <div>
          <WorkoutsList />
        </div>
      </div>
    </>
  );
}

function WorkoutsList() {
  const { workouts } = useWorkouts();

  if (!workouts.length) {
    return (
      <div className="my-10 space-y-4 text-center">
        <Paragraph variant="label">No workouts logged.</Paragraph>
        <Link to="/workout" className="mx-auto mt-8 block w-fit">
          <Button>
            <Dumbbell />
            New workout
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Heading className="mb-4" variant="h3">
        Recent Activity
      </Heading>

      {workouts.slice(0, 5).map((workout, idx) => (
        <Fragment key={workout.id}>
          <div className={cn("w-full", idx !== 0 && "border-t")} />
          <Link to={`/workout/${workout.id}`} className="flex items-center gap-2 py-4">
            <History className="size-4 text-muted-foreground" />
            <Paragraph>
              {format(workout.date, "eee do")} -{" "}
              {formatDistanceToNow(workout.date, { addSuffix: true })}
            </Paragraph>

            <MoveUpRight className="ml-auto size-4" />
          </Link>
        </Fragment>
      ))}

      <Link to="/workout" className="mx-auto mt-8 block w-fit">
        <Button>
          <Dumbbell />
          New workout
        </Button>
      </Link>
    </>
  );
}
