import { useFetcher } from "@remix-run/react";
import { useState } from "react";

import { useCachedLoaderData } from "remix-client-cache";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Paragraph } from "~/components/ui/text";
import { ExercisesMuscleGroupOptions, ExercisesResponse, WorkoutsResponse } from "~/lib/types";
import { cn, getMuscleGroups } from "~/lib/utils";

import { action, loader } from "./server";

export function SelectExercise({ workout }: { workout: WorkoutsResponse }) {
  const fetcher = useFetcher<typeof action>();
  const { exercises } = useCachedLoaderData<typeof loader>();
  const muscleGroups = getMuscleGroups(exercises);

  const [selectedExercise, setSelectedExercise] = useState<ExercisesResponse | null>(null);
  const [selectedGroupExercises, setSelectedGroupExercises] = useState<ExercisesResponse[] | null>(
    null
  );

  function handleSelectGroup(group: ExercisesMuscleGroupOptions | "all") {
    if (group === "all") return setSelectedGroupExercises(null);

    const muslceGroupExercises = muscleGroups[group];
    if (!muslceGroupExercises) return;

    setSelectedGroupExercises(muslceGroupExercises);
  }

  async function handleAddExercise() {
    if (!selectedExercise) {
      return;
    }

    fetcher.submit(
      { workout_id: workout.id, exercise_id: selectedExercise.id },
      { method: "POST" }
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Add exercise</Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90dvh] px-4">
        <DrawerHeader>
          <DrawerTitle>Add Exercise</DrawerTitle>
          {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
        </DrawerHeader>

        <Select
          value={!selectedGroupExercises ? "all" : selectedGroupExercises[0].muscle_group}
          onValueChange={handleSelectGroup}
        >
          <SelectTrigger className="my-2">
            <SelectValue placeholder="Select Muscle Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Muscle Groups</SelectItem>
            {Object.keys(muscleGroups).map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Command>
          <CommandInput placeholder="Search exercise..." />
          <CommandList>
            <CommandEmpty>No exercises found.</CommandEmpty>
            <CommandGroup>
              {(selectedGroupExercises ?? exercises).map((exercise) => (
                <CommandItem
                  key={exercise.id}
                  value={exercise.name}
                  onSelect={(currentValue) => {
                    setSelectedExercise(
                      currentValue === selectedExercise?.name
                        ? null
                        : (exercises.find((e) => e.name === currentValue) ?? null)
                    );
                  }}
                >
                  <div
                    className={cn(
                      "transition-all",
                      selectedExercise?.id === exercise.id && "border-l-2 border-primary pl-2"
                    )}
                  >
                    <Paragraph>{exercise.name}</Paragraph>
                    <Paragraph variant="label">{exercise.muscle_group}</Paragraph>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <DrawerFooter>
          <Button
            disabled={!selectedExercise}
            isLoading={fetcher.state !== "idle"}
            onClick={handleAddExercise}
          >
            Submit
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
