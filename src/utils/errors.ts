import axios from "axios";

export type AppError = {
  message: string;
  statusCode?: number;
  details?: unknown;
};

export function toAppError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message || "Request failed",
      statusCode: error.response?.status,
      details: error.response?.data?.details,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Unexpected error" };
}
