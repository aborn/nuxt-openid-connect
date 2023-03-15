import { OidcProvider } from '../../module';
export declare const initClient: (op: OidcProvider, req: any, redirectUris: string[]) => Promise<import("openid-client").BaseClient>;
