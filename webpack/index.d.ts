import { WebpackOptions, OutputOptions } from 'webpack/declarations/WebpackOptions';

export interface WebpackConfigOptionsBase {
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

export interface WebpackConfigOptions extends WebpackConfigOptionsBase {
  uses?: Array<string | [string, any?] | WebpackOptions>;
  profiles?: {
    [profile: string]: Omit<WebpackConfigOptions, 'profiles'>;
  };
  loaders?: string[] | Record<string, any>;
}

export type PluginInstance = (options: WebpackConfigOptionsBase) => WebpackOptions | Promise<WebpackOptions>;

export type Plugin<T = any> = (params: T) => PluginInstance;

declare const WebpackWrapper: (options: WebpackConfigOptions) => (env: string | Record<string, string> | undefined, argv: Record<string, any>) => Promise<WebpackOptions>;

export default WebpackWrapper;
