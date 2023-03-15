import * as _nuxt_schema from '@nuxt/schema';

type CookieSerializeOptions = {
    domain?: string | undefined;
    encode?(value: string): string;
    expires?: Date | undefined;
    httpOnly?: boolean | undefined;
    maxAge?: number | undefined;
    path?: string | undefined;
    sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean | undefined;
};
type OidcProvider = {
    issuer: string;
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    scope: Array<string>;
};
type Config = {
    secret: string;
    cookie: {};
    cookiePrefix: string;
    cookieEncrypt: boolean;
    cookieEncryptKey: string;
    cookieEncryptIV: string;
    cookieEncryptALGO: string;
    cookieMaxAge: number;
    response_type: string;
    response_mode?: string;
    cookieFlags?: {
        [key: string]: CookieSerializeOptions;
    };
    debug?: boolean | undefined;
};
interface ModuleOptions {
    addPlugin: boolean;
    op: OidcProvider;
    config: Config;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { Config, CookieSerializeOptions, ModuleOptions, OidcProvider, _default as default };
