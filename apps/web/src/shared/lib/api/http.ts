import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND,
  timeout: 15000,
  withCredentials: true,
});

export default http;
