declare global {
  interface Window {
    electron: {
      get_services_schema(): Promise<Record<string, ServiceSchema>>;
      invoke_service(
        name: string,
        chain: string[],
        args: any[],
      ): Promise<unknown>;
    };
  }
}
