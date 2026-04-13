import type { AxiosResponse } from "axios";

export async function withApiFallback<T>(request: () => Promise<AxiosResponse<T>>, fallback: () => Promise<T> | T): Promise<T> {
  try {
    const response = await request();
    return response.data;
  } catch {
    return await fallback();
  }
}
