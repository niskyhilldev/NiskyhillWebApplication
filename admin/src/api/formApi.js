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

// Opens the most recently saved PDF in a new tab
// Returns true if one was opened or false if nothing has been saved yet
export const openSavedForm = async (formType, id) => {
    const win = window.open("", "_blank");

    try {
        const response = await fetch(`${API_BASE_URL}/forms/saved/${formType}/${id}`, {
            credentials: "include", 
        });

        if (response.status === 404) {   
            if (win) win.close();
            return false;
        }
        if (!response.ok) {
            throw new Error(await response.text() || "Failed to retrieve form");
        }

        const url = URL.createObjectURL(await response.blob());
        win.location.href = url;          
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        return true;
    } catch (err) {
        if (win) win.close();
        throw err;
    }
};