import { MINIO_URL } from "../env";

export const getImageUrl = (imageUrl: string):string => {
    return imageUrl.replace("minio", MINIO_URL);
}