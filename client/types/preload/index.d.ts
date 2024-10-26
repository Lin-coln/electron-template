declare interface Window {
  electron: {
    service: {
      invoke(name: string, chain: string[], args: any[]): Promise<any>;
      collectMetadata(name: string): Promise<service.metadata.ServiceMetadata>;
    };
  };
}
