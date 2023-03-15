import { Config } from '../../module';
export declare const encrypt: (text: string, config: Config) => Promise<string>;
export declare const decrypt: (text: string, config: Config) => Promise<string | undefined>;
