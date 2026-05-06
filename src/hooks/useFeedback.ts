import { App } from "antd";
import { AppError } from "../utils/errors";

export function useFeedback() {
  const { message, notification } = App.useApp();

  return {
    success(content: string) {
      void message.success(content);
    },
    error(error: AppError | string) {
      const description = typeof error === "string" ? error : error.message;
      void notification.error({
        message: "Something went wrong",
        description,
      });
    },
  };
}
