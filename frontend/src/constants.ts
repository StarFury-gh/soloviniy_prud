type ENV = "prod" | "dev";

const ENV_TYPE: ENV = "dev";

let API_URL: string = "CHECK_CONSTANTS";
let AI_API_URL: string = "CHECK_CONSTANTS";

if (ENV_TYPE === "dev") {
  API_URL = "http://localhost:8000";
  AI_API_URL = "http://localhost:8001";
} else if (ENV_TYPE === "prod") {
  API_URL = "/api";
  AI_API_URL = "/ai";
}

export const STATIC_API_URL = `${API_URL}/static`;
// Название поля токена в localStorage
export const LS_ACCESS_TOKEN = "access_token";

export { API_URL, AI_API_URL };
