import { Storage } from './storage';
export declare class Oidc {
    private state;
    private $useState;
    $storage: Storage;
    constructor();
    get user(): any;
    get isLoggedIn(): any;
    setUser(user: any): void;
    fetchUser(): Promise<void>;
    login(redirect?: string): void;
    logout(): void;
}
declare const _default: any;
export default _default;
