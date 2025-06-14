export interface Course {
    id: number;
    title: string;
    usersCount: number;
}

export interface DB {
    courses: Course[];
}

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};

export type HTTP_STATUSES_I = typeof HTTP_STATUSES;

export const db: DB = {
    courses: [
        { id: 1, title: "front-end", usersCount: 10 },
        { id: 2, title: "back-end", usersCount: 10 },
        { id: 3, title: "automation qa", usersCount: 10 },
        { id: 4, title: "devops", usersCount: 10 },
    ],
};