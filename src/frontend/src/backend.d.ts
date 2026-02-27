import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Registrant {
    fullName: string;
    wantsVegetables: boolean;
    wantsRice: boolean;
    address: string;
    phoneNumber: string;
    wantsFruits: boolean;
}
export interface backendInterface {
    getAllRegistrants(): Promise<Array<Registrant>>;
    getRegistrant(phoneNumber: string): Promise<Registrant>;
    getTotalRegistrants(): Promise<bigint>;
    isRegistered(phoneNumber: string): Promise<boolean>;
    registerRegistrant(fullName: string, phoneNumber: string, address: string, wantsFruits: boolean, wantsVegetables: boolean, wantsRice: boolean): Promise<void>;
}
