export const api = async (method: "POST" | "GET" | "UPDATE" | "DELETE", action: string, body = {}, params = "", headers = {}) => {
    const payload: {
        method: string;
        headers: {
            "Content-Type": string;
            [key: string]: string;
        };
        body: string | null;
    } = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: null,
    };

    if (method !== "GET" && method !== "DELETE") {
        payload.body = JSON.stringify(body);
    }

    const response = await fetch(`https://localhost:3000${action}${params}`, payload);

    const contentType = response.headers.get("Content-Type");
    let responseJson;
    if (contentType?.includes("application/json")) {
        responseJson = await response.json();
    } else {
        responseJson = null;
    }

    if (response.status === 200 || response.status === 201) {
        return responseJson;
    } else {
        throw new Error(responseJson?.message || "Unknown error occurred");
    }
};