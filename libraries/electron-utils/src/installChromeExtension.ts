import { session as _session, Session } from "electron";

interface ExtensionReference {
  name?: string;
  id: string;
  electron: string;
}
interface ExtensionOptions {
  forceDownload?: boolean;
  loadExtensionOptions?: Record<any, any>;
}
type PresetExtension =
  | "EMBER_INSPECTOR"
  | "REACT_DEVELOPER_TOOLS"
  | "BACKBONE_DEBUGGER"
  | "JQUERY_DEBUGGER"
  | "ANGULARJS_BATARANG"
  | "VUEJS_DEVTOOLS"
  | "VUEJS3_DEVTOOLS"
  | "REDUX_DEVTOOLS"
  | "CYCLEJS_DEVTOOL"
  | "APOLLO_DEVELOPER_TOOLS"
  | "MOBX_DEVTOOLS";

const promiseRequestInstaller = requestInstaller();

export const installChromeExtensions = async (
  extensions: (PresetExtension | ExtensionReference)[],
  {
    session,
  }: {
    session?: Session;
  } = {},
) => {
  const { installExtension, PRESET_EXTENSION } = await promiseRequestInstaller;
  // const forceDownload = !!process.env.UPGRADE_EXTENSIONS

  // install
  await Promise.all(
    extensions
      .map((ext) =>
        typeof ext === "string" ? { ...PRESET_EXTENSION[ext], name: ext } : ext,
      )
      .map(async (ext) => {
        try {
          console.log(`[Extension] ${ext.name ?? ext.id} installing...`);
          await installExtension(ext, {
            forceDownload: false,
            loadExtensionOptions: {
              allowFileAccess: true,
            },
          });
          console.log(`[Extension] ${ext.name ?? ext.id} installed.`);
        } catch (error) {
          console.warn(
            `[Extension] ${ext.name ?? ext.id} install failed`,
            error,
          );
        }
      }),
  );

  // load
  session ??= _session.defaultSession;
  session.getAllExtensions().forEach((e) => {
    session.loadExtension(e.path);
  });
};

async function requestInstaller(): Promise<{
  installExtension(
    extensionReference: ExtensionReference,
    options?: ExtensionOptions | boolean,
  ): Promise<string>;
  PRESET_EXTENSION: Record<PresetExtension, ExtensionReference>;
}> {
  const { default: installExtension, ...PRESET_EXTENSION } = await import(
    "electron-devtools-installer"
  ).then((mod) => mod.default as any);
  return {
    installExtension,
    PRESET_EXTENSION,
  } as any;
}
