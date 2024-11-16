/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Exercises = "exercises",
	ProgressMetrics = "progress_metrics",
	Users = "users",
	WorkoutExercises = "workout_exercises",
	Workouts = "workouts",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum ExercisesMuscleGroupOptions {
	"Chest" = "Chest",
	"Back" = "Back",
	"Shoulders" = "Shoulders",
	"Biceps" = "Biceps",
	"Triceps" = "Triceps",
	"Forearms" = "Forearms",
	"Abs" = "Abs",
	"Obliques" = "Obliques",
	"Glutes" = "Glutes",
	"Quadriceps" = "Quadriceps",
	"Hamstrings" = "Hamstrings",
	"Calves" = "Calves",
	"Neck" = "Neck",
	"Traps" = "Traps",
	"Lower Back" = "Lower Back",
	"Adductors" = "Adductors",
	"Abductors" = "Abductors",
}
export type ExercisesRecord = {
	muscle_group?: ExercisesMuscleGroupOptions
	name?: string
}

export type ProgressMetricsRecord = {
	metric_type?: string
	recorded?: IsoDateString
	unit?: string
	user_id?: RecordIdString
	value?: string
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

export type WorkoutExercisesRecord<Tsets = unknown> = {
	exercise_id?: RecordIdString
	sets?: null | Tsets
	workout_id?: RecordIdString
}

export type WorkoutsRecord = {
	date?: IsoDateString
	notes?: string
	user_id?: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type ExercisesResponse<Texpand = unknown> = Required<ExercisesRecord> & BaseSystemFields<Texpand>
export type ProgressMetricsResponse<Texpand = unknown> = Required<ProgressMetricsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type WorkoutExercisesResponse<Tsets = unknown, Texpand = unknown> = Required<WorkoutExercisesRecord<Tsets>> & BaseSystemFields<Texpand>
export type WorkoutsResponse<Texpand = unknown> = Required<WorkoutsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	exercises: ExercisesRecord
	progress_metrics: ProgressMetricsRecord
	users: UsersRecord
	workout_exercises: WorkoutExercisesRecord
	workouts: WorkoutsRecord
}

export type CollectionResponses = {
	exercises: ExercisesResponse
	progress_metrics: ProgressMetricsResponse
	users: UsersResponse
	workout_exercises: WorkoutExercisesResponse
	workouts: WorkoutsResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'exercises'): RecordService<ExercisesResponse>
	collection(idOrName: 'progress_metrics'): RecordService<ProgressMetricsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'workout_exercises'): RecordService<WorkoutExercisesResponse>
	collection(idOrName: 'workouts'): RecordService<WorkoutsResponse>
}
