import { configureEnv, TYPES } from "../src/index";

interface EnvShape {
  SOME_STRING: string;
  NODE_ENV: "development" | "production";
  PORT: number;
  MIGHT_NOT_EXIST?: boolean;
  SOME_STRING_ARRAY: string[];
  SOME_NUMBER_ARRAY: number[];
  SOME_FLOAT_ARRAY: number[];
  SOME_FLOAT: number;
  DEFINITE_BOOLEAN: boolean;
  MULTIPLY_BY_TWO: number;
}

export const fetchEnv = configureEnv<EnvShape>({
  SOME_STRING: { type: TYPES.STRING },
  NODE_ENV: { type: TYPES.STRING },
  PORT: { type: TYPES.NUMBER },
  MIGHT_NOT_EXIST: { type: TYPES.BOOLEAN, isOptional: true },
  SOME_STRING_ARRAY: { type: TYPES.ARRAY_STRING },
  SOME_NUMBER_ARRAY: { type: TYPES.ARRAY_NUMBER },
  SOME_FLOAT_ARRAY: { type: TYPES.ARRAY_FLOAT },
  SOME_FLOAT: { type: TYPES.FLOAT },
  DEFINITE_BOOLEAN: { type: TYPES.BOOLEAN },
  MULTIPLY_BY_TWO: {
    type: TYPES.CUSTOM,
    isOptional: true,
    customConverter: (x) => parseInt(x, 10) * 2,
  },
});
