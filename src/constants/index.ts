import dayjs from "dayjs";

export const API_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const formatDate = (date: string | Date) => {
    return dayjs(date).format("MM/DD/YYYY");
};