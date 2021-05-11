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
  SOME_STRING: { type: TYPES.STRING, isRequired: true },
  NODE_ENV: { type: TYPES.STRING, isRequired: true },
  PORT: { type: TYPES.NUMBER, isRequired: true },
  MIGHT_NOT_EXIST: { type: TYPES.BOOLEAN },
  SOME_STRING_ARRAY: { type: TYPES.ARRAY_STRING, isRequired: true },
  SOME_NUMBER_ARRAY: { type: TYPES.ARRAY_NUMBER, isRequired: true },
  SOME_FLOAT_ARRAY: { type: TYPES.ARRAY_FLOAT, isRequired: true },
  SOME_FLOAT: { type: TYPES.FLOAT, isRequired: true },
  DEFINITE_BOOLEAN: { type: TYPES.BOOLEAN, isRequired: true },
  MULTIPLY_BY_TWO: {
    type: TYPES.CUSTOM,
    isRequired: true,
    customConverter: (x) => parseInt(x, 10) * 2,
  },
});
