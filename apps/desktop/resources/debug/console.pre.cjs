const { ipcRenderer } = require("electron");

void main();

function main() {
  const scope = "main";
  const color = "#1f64f8";
  const prefix = [
    `%c` + scope,
    `border-radius: 4px; background: ${color}; color: white; padding: 2px 6px`,
  ];
  const logger = {
    log: (...args) => console.log(...prefix, ...args),
  };
  ipcRenderer.on(`ConsoleWindow#console`, (ipcEvent, field, ...args) => {
    if (!Object.keys(logger).includes(field)) {
      console.warn(`failed to log: unknown field ${field}`);
      return;
    }
    logger[field](...args);
  });
}
