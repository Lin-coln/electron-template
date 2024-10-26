declare interface Window {
  // todo: fix process type issue
  process: any;
}

declare type ServiceSchema = service.schema.ServiceSchema;

declare interface ElectronState {
  services_schema: Record<string, ServiceSchema>;
}
