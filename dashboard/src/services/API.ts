
const APIRoot: string = "http://127.0.0.1:8000";

const APIEndPoints = {
    home: "/"
}

async function verifyToken(token: string): Promise<boolean> {
    // Check if a token is valid
    return true;
}



async function getAuthToken(): Promise<string|null> {
    // Get the auth token from local storage if it exists
    try {
        const token = localStorage.getItem("access_token");
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }

    // // No token in local storage, get from API
    // try {
    //     const response =await fetch(APIRoot + "/auth/token", {
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //     });
    //     const data = await response.json();
        
    //     //Store token in local storage and return it
    //     localStorage.setItem("access_token", data.token);
    //     return data.token;
    // } catch (error) {
    //     console.error(error);
    //     return "";
    // }
}


export { APIRoot, getAuthToken };