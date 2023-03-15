export declare const isUnset: (o: unknown) => boolean;
export declare const isSet: (o: unknown) => boolean;
export declare const getRedirectUrl: (uri: string | null | undefined) => string;
export declare function getCallbackUrl(callbackUrl: string, redirectUrl: string, host: string | undefined): string;
export declare function getDefaultBackUrl(redirectUrl: string, host: string | undefined): string;
/**
   * Response Mode
   *   The Response Mode determines how the Authorization Server returns result parameters from the Authorization Endpoint.
   *   Non-default modes are specified using the response_mode request parameter. If response_mode is not present in a request, the default Response Mode mechanism specified by the Response Type is used.
   *
   * REF:
   *   https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html (English)
   *   https://linianhui.github.io/authentication-and-authorization/05-openid-connect-extension/  (Chinese)
   *
   * response_mode
   * 1. query
   *    In this mode, Authorization Response parameters are encoded in the query string added to the redirect_uri when redirecting back to the Client.
   *    callback http.method: 'GET'
   *    example: https://client.lnh.dev/oauth2-callback?code=SplxlOBeZQQYbYS6WxSbIA&state=xyz
   * 2. fragment
   *    In this mode, Authorization Response parameters are encoded in the fragment added to the redirect_uri when redirecting back to the Client.
   *    callback http.method: 'GET'
   *    example: http://client.lnh.dev/oauth2-callback#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&expires_in=3600
   * 3. form_post (Callback method 'POST') (REF: https://openid.net/specs/oauth-v2-form-post-response-mode-1_0.html)
   *
   * Hints:
   * i)   For purposes of this specification, the default Response Mode for the OAuth 2.0 code Response Type is the query encoding.
   * ii)  For purposes of this specification, the default Response Mode for the OAuth 2.0 token Response Type is the fragment encoding.
   * iii) Response_mode 'query' not allowed for implicit or hybrid flow
   */
export declare function getResponseMode(config: any): string;
