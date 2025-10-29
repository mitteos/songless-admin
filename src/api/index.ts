import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api"; // Замените на ваш реальный URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
