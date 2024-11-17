import { useState } from "react";

import {
  ClientLoaderFunctionArgs,
  Link,
  redirect,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { format } from "date-fns";
import { ChevronLeft, ChevronsUpDown, Dumbbell, Loader, Plus, Trash2, Upload } from "lucide-react";
import { SelectExercise } from "~/components/select-exercise";
import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import { Heading, Paragraph } from "~/components/ui/text";
import { useToast } from "~/hooks/use-toast";
import { api, queryClient } from "~/lib/api";
import { ExerciseSet } from "~/lib/custom-types";
import { ExercisesResponse, WorkoutExercisesResponse, WorkoutsResponse } from "~/lib/types";

const workoutExercisesQueryKey = (workoutId: string) => ["workout-exercises", workoutId];

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  if (!params.id) {
    return redirect("/");
  }

  const key = workoutExercisesQueryKey(params.id);
  const data = queryClient.getQueryData<{
    workout: WorkoutsResponse;
    workoutExercises: WorkoutExercisesResponse<ExerciseSet[], { exercise_id: ExercisesResponse }>[];
  }>(key);
  if (data) return data;

  const workout = await api.collection("workouts").getOne(params.id);
  const workoutExercises = await api
    .collection("workout_exercises")
    .getFullList<WorkoutExercisesResponse<ExerciseSet[], { exercise_id: ExercisesResponse }>>({
      filter: `workout_id="${workout.id}"`,
      sort: "+created",
      expand: "exercise_id",
    });

  queryClient.setQueryData(key, { workout, workoutExercises });

  return { workout, workoutExercises };
};

export default function WorkoutDetails() {
  const { workout, workoutExercises } = useLoaderData<typeof clientLoader>();

  return (
    <div className="space-y-6 pt-20">
      <hgroup className="header flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2">
          <ChevronLeft size={20} />
          <Paragraph>Home</Paragraph>
        </Link>

        <Paragraph className="capitalize" variant="label">
          {format(workout.date, "eeee - MMM dd, yyy")}
        </Paragraph>
      </hgroup>

      <div className="space-y-4">
        {workoutExercises.map((exercise) => (
          <WorkoutExercise key={exercise.id} exercise={exercise} />
        ))}
      </div>

      <div className="flex justify-end">
        <SelectExercise workout={workout} />
      </div>
    </div>
  );
}

function WorkoutExercise({
  exercise,
}: {
  exercise: WorkoutExercisesResponse<ExerciseSet[], { exercise_id: ExercisesResponse }>;
}) {
  const [sets, setSets] = useState(exercise.sets ?? []);
  const { toast } = useToast();
  const revalidator = useRevalidator();

  if (!exercise.expand?.exercise_id) return null;
  const exerciseInfo = exercise.expand.exercise_id;

  const isOutOfSync = sets.length !== exercise.sets?.length;

  function handleAddSet() {
    setSets((sets) => {
      const lastSet = !sets.length ? null : sets[sets.length - 1];
      const newSets = [...sets, { weight: lastSet?.weight ?? 0, reps: 0 }];
      saveChanges(newSets);

      return newSets;
    });
  }

  function handleRemoveSet(idx: number) {
    setSets((sets) => {
      const clonedSets = [...sets];
      clonedSets.splice(idx, 1);
      saveChanges(clonedSets);
      return clonedSets;
    });
  }

  function handleUpdateSets(setIdx: number, updatedSet: ExerciseSet) {
    setSets((sets) => {
      const newSets = sets.map((set, idx) => {
        if (idx === setIdx) return updatedSet;
        return set;
      });
      saveChanges(newSets);

      return newSets;
    });
  }

  async function saveChanges(sets: ExerciseSet[]) {
    try {
      await api.collection("workout_exercises").update(exercise.id, { sets });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Something went wrong";
      toast({ title: "Error", description });
    } finally {
      revalidator.revalidate();
    }
  }

  return (
    <Collapsible>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="size-4" />
          <Heading variant="h4">{exerciseInfo.name}</Heading>
          {isOutOfSync && <Loader className="size-4 animate-spin" />}
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="mt-2 grid grid-cols-[10%,1fr,1fr,1fr] gap-x-4 gap-y-2">
          <Paragraph className="text-xs font-medium uppercase" variant="label">
            Set
          </Paragraph>
          <Paragraph className="text-xs font-medium uppercase" variant="label">
            Weight
          </Paragraph>
          <Paragraph className="text-xs font-medium uppercase" variant="label">
            Reps
          </Paragraph>
          <div />

          {sets?.map((set, idx) => (
            <Set
              key={idx}
              idx={idx}
              set={set}
              handleRemoveSet={handleRemoveSet}
              handleUpdateSets={handleUpdateSets}
            />
          ))}
        </div>

        <div className="mb-6 mt-4 flex flex-col">
          <Button variant="secondary" onClick={handleAddSet}>
            <Plus /> Add Set
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function Set({
  set,
  idx,
  handleRemoveSet,
  handleUpdateSets,
}: {
  set: ExerciseSet;
  idx: number;
  handleRemoveSet: (idx: number) => void;
  handleUpdateSets: (setIdx: number, updatedSet: ExerciseSet) => void;
}) {
  const [reps, setReps] = useState(set.reps);
  const [weight, setWeight] = useState(set.weight);

  const isOutOfSync = weight !== set.weight || reps !== set.reps;

  return (
    <>
      <Paragraph className="leading-9">{idx + 1}</Paragraph>
      <Input
        value={weight}
        onChange={(e) => {
          const value = !e.target.value ? "" : e.target.value;
          if (/^[0-9]*$/.test(value)) {
            setWeight(parseFloat(value));
          }
        }}
        type="number"
      />
      <Input
        value={reps}
        onChange={(e) => {
          const value = !e.target.value ? "" : e.target.value;
          if (/^[0-9]*$/.test(value)) {
            setReps(parseFloat(value));
          }
        }}
        type="number"
      />

      <div className="flex justify-end gap-2">
        {isOutOfSync && (
          <Button
            onClick={() => handleUpdateSets(idx, { reps, weight })}
            size="icon"
            variant="outline"
          >
            <Upload />
          </Button>
        )}

        <Button onClick={() => handleRemoveSet(idx)} size="icon" variant="outline">
          <Trash2 className="text-destructive" />
        </Button>
      </div>
    </>
  );
}
