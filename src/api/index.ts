import axios from "axios";

const API_BASE_URL = "https://songless-api.onrender.com/api"; // Замените на ваш реальный URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
