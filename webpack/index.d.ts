import { WebpackOptions, OutputOptions } from 'webpack/declarations/WebpackOptions';

interface WebpackConfigOptionsBase {
  target?:
  | 'web'
  | 'webworker'
  | 'node'
  | 'async-node'
  | 'node-webkit'
  | 'electron-main'
  | 'electron-renderer'
  | 'electron-preload';
  url?: string;
  entry?: string;
  output?: string | OutputOptions;
  loaders?: Record<string, any>;
}

interface WebpackConfigOptions extends WebpackConfigOptionsBase {
  uses?: Array<WebpackOptions | string | [string, any?] >;
  profiles?: {
    [profile: string]: Omit<WebpackConfigOptions, 'profiles'>;
  };
  loaders?: string[] | Record<string, any>;
}

type PluginInstance = (options: WebpackConfigOptionsBase) => WebpackOptions | Promise<WebpackOptions>;

type Plugin<T = any> = (params: T) => PluginInstance;

declare const WebpackWrapper: (options: WebpackConfigOptions) => (env: string | Record<string, string> | undefined, argv: Record<string, any>) => Promise<WebpackOptions>;

export = WebpackWrapper;
