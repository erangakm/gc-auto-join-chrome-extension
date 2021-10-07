import { getStorageKey, setStorageKey } from "../lib/chromeStorageHandlers";
import { WorkerLog } from "../model/WorkerLog";

export const logError = async (error: any) => {
  await logEvent(
    {
      message: (error as unknown as any)?.message,
      stack: (error as unknown as any)?.stack,
    }
  )
}

export const logEvent = async (payload: any) => {
  const logs = await getStorageKey<WorkerLog[]>("workLog") ?? [];
  logs.push({
    time: new Date().toLocaleString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    }),
    payload,
  });

  setStorageKey("workLog", logs)
}
