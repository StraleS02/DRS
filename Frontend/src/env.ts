const loadApiUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if(!apiUrl) throw new Error('Failed to load VITE_API_URL from the .env file');
    return apiUrl;
}
const loadMINIOUrl = () => {
    const minioUrl = import.meta.env.VITE_MINIO_URL;
    if(!minioUrl) throw new Error('Failed to load VITE_MINIO_URL from the .env file');
    return minioUrl;
}
export const API_URL = loadApiUrl();
export const MINIO_URL = loadMINIOUrl();