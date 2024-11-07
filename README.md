> just an electron template for myself

---

## Prerequisite

- node
- pnpm
- nvm

## Install

- electron: 33.0.2
  - chrome: 130
  - node: 20.18.0

## Build

- build: compile all ts files and dependencies into executable js code
- pack: package the compiled products and resource files into a standard desktop application
- make: make the packaged application into an installer file

---

## PresetTools

@tools/api

```ts
interface api {
  // execute ts script
  ts(target: string, env?: Record<string, string | boolean>): Promise<void>;
}
```

@tools/commands

```md
ts <target>
```
