import { useFetcher } from "@remix-run/react";
import { useState } from "react";

import { Check } from "lucide-react";
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
import { ExercisesResponse, WorkoutsResponse } from "~/lib/types";
import { cn } from "~/lib/utils";

import { action, loader } from "./server";

export function SelectExercise({ workout }: { workout: WorkoutsResponse }) {
  const [selectedExercise, setSelectedExercise] = useState<ExercisesResponse | null>(null);
  const { exercises } = useCachedLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

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
        <Button className="mx-auto">Add exercise</Button>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>Add Exercise</DrawerTitle>
          {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
        </DrawerHeader>

        <Command>
          <CommandInput placeholder="Search exercise..." />
          <CommandList>
            <CommandEmpty>No exercises found.</CommandEmpty>
            <CommandGroup>
              {exercises?.map((exercise) => (
                <CommandItem
                  key={exercise.id}
                  value={exercise.id}
                  onSelect={(currentValue) => {
                    setSelectedExercise(
                      currentValue === selectedExercise?.id
                        ? null
                        : (exercises.find((e) => e.id === currentValue) ?? null)
                    );
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedExercise?.id === exercise.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {exercise.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <DrawerFooter>
          <Button isLoading={fetcher.state !== "idle"} onClick={handleAddExercise}>
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
