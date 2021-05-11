export declare enum TYPES {
    STRING = "string",
    NUMBER = "number",
    FLOAT = "float",
    ARRAY_STRING = "string_array",
    ARRAY_NUMBER = "number_array",
    ARRAY_FLOAT = "float_array",
    BOOLEAN = "boolean"
}
declare type EnvConfigVar = {
    type: TYPES;
    isRequired?: boolean;
};
export declare type EnvConfig<T> = {
    [key in keyof T]: EnvConfigVar;
};
export declare const configureEnv: <K>(config: EnvConfig<K>) => <T extends keyof K>(key: T) => K[T];
export {};
