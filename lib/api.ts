import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL_DEV;

export const api = axios.create({
  baseURL: apiURL ?? "http://localhost:3000/api",
  withCredentials: true,
});
