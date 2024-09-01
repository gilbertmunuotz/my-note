import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string | null) => {
    if (!token) {
        return true;
    }

    try {
        const decodedToken: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; // Treat decoding errors as expired
    }
};
