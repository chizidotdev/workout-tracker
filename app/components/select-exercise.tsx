import { useState } from "react";

import { useRevalidator } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
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
import { useToast } from "~/hooks/use-toast";
import { useWorkouts } from "~/hooks/use-workouts";
import { api, queryClient } from "~/lib/api";
import { ExercisesResponse, WorkoutsResponse } from "~/lib/types";
import { cn } from "~/lib/utils";
import { workoutExercisesQueryKey } from "~/routes/_app.workout.$id";

import { Button } from "./ui/button";

export function SelectExercise({ workout }: { workout: WorkoutsResponse }) {
  const [selectedExercise, setSelectedExercise] = useState<ExercisesResponse | null>(null);
  const { exercises } = useWorkouts();

  const { toast } = useToast();
  const revalidator = useRevalidator();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: object) => api.collection("workout_exercises").create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      revalidator.revalidate();
    },
    onError: (error) =>
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      }),
  });

  async function handleAddExercise() {
    if (!selectedExercise) {
      return;
    }

    const user = api.authStore.model;
    if (!user) return;

    mutate({
      user_id: user.id,
      workout_id: workout.id,
      exercise_id: selectedExercise.id,
      sets: [{ reps: 10, weight: 10 }],
    });
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
          <Button isLoading={isPending} onClick={handleAddExercise}>
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
