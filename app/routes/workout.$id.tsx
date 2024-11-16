import { useState } from "react";

import { ClientLoaderFunctionArgs, Link, Outlet, redirect, useRevalidator } from "@remix-run/react";
import { formatRelative } from "date-fns";
import { ChevronsUpDown, Dumbbell, Loader, Plus, Trash2, Upload } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import { Heading, Paragraph } from "~/components/ui/text";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/lib/api";
import { ExercisesResponse, WorkoutExercisesResponse } from "~/lib/types";

export const loader = async ({ params }: ClientLoaderFunctionArgs) => {
  if (!params.id) {
    return redirect("/");
  }

  const workout = await api.collection("workouts").getOne(params.id);

  const workoutExercises = await api
    .collection("workout_exercises")
    .getFullList<WorkoutExercisesResponse<ExerciseSet[], { exercise_id: ExercisesResponse }>>({
      filter: `workout_id="${workout.id}"`,
      sort: "+created",
      expand: "exercise_id",
    });

  return { workout, workoutExercises };
};

export const clientLoader = cacheClientLoader;
(clientLoader as any).hydrate = true;

export default function WorkoutDetails() {
  const { workout, workoutExercises } = useCachedLoaderData<typeof loader>();

  return (
    <div className="space-y-6 pt-20">
      <hgroup className="header flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2">
          <ChevronLeft size={20} />
          <Paragraph>Home</Paragraph>
        </Link>

        <Paragraph className="capitalize" variant="label">
          {formatRelative(new Date(workout.date), new Date())}
        </Paragraph>
      </hgroup>

      <div className="space-y-4">
        {workoutExercises.map((exercise) => (
          <WorkoutExercise key={exercise.id} exercise={exercise} />
        ))}
      </div>
      <Outlet />
    </div>
  );
}

type ExerciseSet = { weight: number; reps: number };
function WorkoutExercise({
  exercise,
}: {
  exercise: WorkoutExercisesResponse<ExerciseSet[], { exercise_id: ExercisesResponse }>;
}) {
  const [sets, setSets] = useState(exercise.sets ?? []);
  const { toast } = useToast();
  const revalidator = useRevalidator();

  const exerciseInfo = exercise.expand?.exercise_id!;

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
      await api.collection("workout_exercises").update(exercise.id, { sets }, { requestKey: null });
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
        <div className="mt-2 grid grid-cols-[10%,1fr,1fr,1fr] gap-x-4 gap-y-1">
          <Paragraph className="text-sm font-medium uppercase" variant="label">
            Set
          </Paragraph>
          <Paragraph className="text-sm font-medium uppercase" variant="label">
            Weight
          </Paragraph>
          <Paragraph className="text-sm font-medium uppercase" variant="label">
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
