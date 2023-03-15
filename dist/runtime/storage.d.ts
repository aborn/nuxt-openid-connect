export type StorageOptions = {
    localStorage: boolean;
    prefix: string;
    ignoreExceptions: boolean;
};
export declare class Storage {
    options: StorageOptions;
    private userInfoKey;
    constructor(options: StorageOptions);
    getPrefix(): string;
    setUserInfo(user: any): void;
    getUserInfo(): any;
    removeUserInfo(): void;
    isLoggedIn(): boolean;
    setLocalStorage(key: string, value: string): string | void;
    getLocalStorage(key: string): string | null;
    removeLocalStorage(key: string): void;
    isLocalStorageEnabled(): boolean;
}
