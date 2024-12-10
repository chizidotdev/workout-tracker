import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";

import { loadAPI, requireAuth } from "~/lib/api";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const api = await loadAPI(request);

  const activeWorkout = await api
    .collection("workouts")
    .getFirstListItem(`status="pending"`)
    .catch((e) => console.log(e.message));

  if (!activeWorkout) return {};

  return redirect(`/workout/${activeWorkout.id}`);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const api = await loadAPI(request);
  const userData = await requireAuth(api);

  const formData = await request.formData();
  const date = formData.get("date")!.toString();
  const notes = formData.get("notes")!.toString();

  if (!date) {
    return { error: "Date is required" };
  }

  try {
    const workout = await api.collection("workouts").create({
      user_id: userData.id,
      date: new Date(date),
      status: "pending",
      notes,
    });

    return redirect(`/workout/${workout.id}`);
  } catch (e) {
    console.log(e);
    return { error: e };
  }
};
