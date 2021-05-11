export enum TYPES {
  STRING = "string",
  NUMBER = "number",
  FLOAT = "float",
  ARRAY_STRING = "string_array",
  ARRAY_NUMBER = "number_array",
  ARRAY_FLOAT = "float_array",
  BOOLEAN = "boolean",
  CUSTOM = "custom",
}

type EnvConfigVar = {
  type: TYPES;
  isRequired?: boolean;
  customConverter?: (val: string) => unknown;
};

export type EnvConfig<T> = {
  [key in keyof T]: EnvConfigVar;
};

const returnCorrectType = <K, T extends keyof K>(
  val: string,
  configVar: EnvConfigVar,
  key: T
) => {
  let returnVal: any = val;
  switch (configVar.type) {
    case TYPES.NUMBER:
      returnVal = parseInt(val, 10);
      break;
    case TYPES.FLOAT:
      returnVal = parseFloat(val);
      break;
    case TYPES.ARRAY_STRING:
      returnVal = val.split(",");
      break;
    case TYPES.ARRAY_NUMBER:
      returnVal = val.split(",").map((i) => parseInt(i, 10));
      break;
    case TYPES.ARRAY_FLOAT:
      returnVal = val.split(",").map((i) => parseFloat(i));
      break;
    case TYPES.BOOLEAN:
      returnVal =
        val === "true" || val === "True" || val === "TRUE" ? true : false;
      break;
    case TYPES.CUSTOM:
      if (!configVar.customConverter) {
        throw new Error(
          `The env var with the name ${key} is marked as CUSTOM, but has not provided a customConverter function`
        );
      }
      returnVal = configVar.customConverter(val);
      break;
    default:
      // TYPES.STRING
      returnVal = val;
  }
  return returnVal as unknown as K[T];
};

export const configureEnv = <K>(config: EnvConfig<K>) => {
  return <T extends keyof K>(key: T): K[T] => {
    const val = process.env[key as string];
    const configVar = config[key as keyof EnvConfig<K>];
    if (configVar.isRequired) {
      if (!val) {
        throw new Error(`The env var with name ${key} is undefined.`);
      }
    } else {
      if (!val) {
        return undefined as unknown as K[T];
      }
    }
    return returnCorrectType<K, T>(val!, configVar, key);
  };
};
