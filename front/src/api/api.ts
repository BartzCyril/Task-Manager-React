import {AuthStatus} from "../types/types.ts";

export const api = async (method: "POST" | "GET" | "PUT" | "DELETE", action: string, body = {}, params = "", headers = {}) => {
    const payload: {
        method: string;
        headers: {
            "Content-Type": string;
            [key: string]: string;
        };
        body: string | null;
        credentials: RequestCredentials;
    } = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: null,
        credentials: "include"
    };

    if (method !== "GET" && method !== "DELETE") {
        payload.body = JSON.stringify(body);
    }

    const response = await fetch(`http://localhost:3000${action}${params}`, payload);

    const contentType = response.headers.get("Content-Type");
    let responseJson;
    if (contentType?.includes("application/json")) {
        responseJson = await response.json();
    } else {
        responseJson = null;
    }

    if ((response.status === 401 || response.status === 403) && responseJson?.message === AuthStatus.NOT_AUTHENTICATED) {
        throw new Error(responseJson?.message);
    }
    else if (response.status === 200 || response.status === 201 || response.status === 204) {
        return responseJson;
    } else {
        throw new Error(responseJson?.message || "Unknown error occurred");
    }
};