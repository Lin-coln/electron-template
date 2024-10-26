class ServiceManager {
  services: Map<string, service.Service<unknown>>;
  constructor() {
    this.services = new Map();
  }

  appendService(service: service.Service<unknown>) {
    this.services.set(service.name, service);
  }

  getService<Api extends service.ServiceApi>(
    name: string,
  ): service.Service<Api> {
    const service = this.services.get(name);
    if (!service) {
      throw Error(`failed to get service: ${name}`);
    }
    return service;
  }
}

export default ServiceManager;
