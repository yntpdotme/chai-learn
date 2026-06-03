const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

function safeJsonParse(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		...init,
		credentials: "include",
		headers: {
			...(init?.body ? { "Content-Type": "application/json" } : {}),
			...init?.headers,
		},
	});

	const text = await res.text();
	const body = text ? safeJsonParse(text) : null;

	if (!res.ok) {
		const message =
			(body &&
			typeof body === "object" &&
			"message" in body &&
			typeof body.message === "string"
				? body.message
				: null) ??
			(text || res.statusText);
		throw new ApiError(res.status, message);
	}

	if (body && typeof body === "object" && "data" in body) {
		return (body as { data: T }).data;
	}
	return body as T;
}

export type Course = {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	createdAt: string;
};

export type Lesson = {
	id: string;
	courseId: string;
	title: string;
	content: string;
	order: number;
	createdAt: string;
};

export type CourseWithLessons = Course & { lessons: Lesson[] };

export type Progress = {
	id: string;
	userId: string;
	lessonId: string;
	completed: boolean;
	completedAt: string | null;
	createdAt: string;
};

export const api = {
	courses: {
		list: () => apiFetch<Course[]>("/api/courses"),
		get: (id: string) => apiFetch<CourseWithLessons>(`/api/courses/${id}`),
	},
	lessons: {
		get: (id: string) => apiFetch<Lesson>(`/api/lessons/${id}`),
	},
	progress: {
		upsert: (input: { lessonId: string; completed: boolean }) =>
			apiFetch<Progress>("/api/progress", {
				method: "POST",
				body: JSON.stringify(input),
			}),
	},
	me: {
		get: () =>
			apiFetch<{
				id: string;
				name: string;
				email: string;
				role: "student" | "admin";
			}>("/api/me"),
	},
	admin: {
		courses: {
			create: (input: { title: string; slug: string; description?: string }) =>
				apiFetch<Course>("/api/admin/courses", {
					method: "POST",
					body: JSON.stringify(input),
				}),
			update: (
				id: string,
				input: Partial<{ title: string; slug: string; description?: string }>,
			) =>
				apiFetch<Course>(`/api/admin/courses/${id}`, {
					method: "PATCH",
					body: JSON.stringify(input),
				}),
		},
		lessons: {
			create: (
				courseId: string,
				input: { title: string; content: string; order: number },
			) =>
				apiFetch<Lesson>(`/api/admin/courses/${courseId}/lessons`, {
					method: "POST",
					body: JSON.stringify(input),
				}),
			update: (
				id: string,
				input: Partial<{ title: string; content: string; order: number }>,
			) =>
				apiFetch<Lesson>(`/api/admin/lessons/${id}`, {
					method: "PATCH",
					body: JSON.stringify(input),
				}),
		},
	},
};