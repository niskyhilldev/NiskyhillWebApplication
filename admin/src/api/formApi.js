const API_BASE_URL = "http://localhost:8080";

// generates the forms using backend route 
export const generateForm = async (formId, fieldValues) => {
    const response = await fetch(`${API_BASE_URL}/forms/generate`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            formId,
            fieldValues,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate form");
    }

    return await response.blob();
};