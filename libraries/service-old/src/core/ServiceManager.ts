import { Service, ServiceApi } from "@src/types";

class ServiceManager {
  services: Map<string, Service<unknown>>;
  constructor() {
    this.services = new Map();
  }

  appendService(service: Service<unknown>) {
    this.services.set(service.name, service);
  }

  getService<Api extends ServiceApi>(name: string): Service<Api> {
    const service = this.services.get(name);
    if (!service) {
      throw Error(`failed to get service: ${name}`);
    }
    return service;
  }
}

export default ServiceManager;
