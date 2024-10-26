declare interface Window {
  electron: {
    service: {
      services: string[];
      invoke(name: string, chain: string[], args: any[]): Promise<any>;
      collectMetadata(name: string): Promise<service.metadata.ServiceMetadata>;
    };
  };
}
