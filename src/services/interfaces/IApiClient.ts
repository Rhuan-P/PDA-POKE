export interface IApiClient {
  get<T>(url: string): Promise<T>;
}
