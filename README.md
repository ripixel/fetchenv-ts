# fetchenv-ts

The TypeScript friendly environment variable getter

## Why?

All `process.env[var]` values are `string` or `undefined` by default. This package allows you to define TypeScript types for it easily, and ensure types are converted correctly out the other end, so happy TypeScript intellisense!

## Installation

```bash
npm i --save fetchenv-ts
```

or

```bash
yarn add fetchenv-ts
```

## Usage

### Types

Possible types (for conversion) are:

```typescript
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
```

When using the `CUSTOM` type, you must also define a `customConverter` function to be used when processing (see below)

### Config

When using `configureEnv`, you pass in an `EnvConfig`-shape object, of type:

```typescript
type EnvConfig<T> = {
  [key in keyof T]: EnvConfigVar;
};

type EnvConfigVar = {
  type: TYPES;
  isRequired?: boolean;
  customConverter?: (val: string) => unknown;
};
```

When using `TYPES.CUSTOM` as the `type`, you must also define the transformation function in `customConverter`, which will be used when processing that key.

You must also define the TypeScript-side of the equation, as you would any other object:

```typescript
interface EnvShape {
  SOME_ENVIRONMENT_VAR: number;
}
```

You can see the code example below for usage in-situ.

### Code Example

First, configure your environment:

```typescript
import { configureEnv, TYPES } from "fetchenv-ts";

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
```

Now across your code, you can use:

```typescript
import { fetchEnv } from "./configure";

process.env.SOME_STRING = "https://somestring.com";
process.env.NODE_ENV = "development";
process.env.PORT = "1234";
process.env.SOME_STRING_ARRAY = "dave,tom,james";
process.env.SOME_NUMBER_ARRAY = "1,2,3";
process.env.SOME_FLOAT_ARRAY = "1.23,4.56,7.89";
process.env.SOME_FLOAT = "1.429";
process.env.DEFINITE_BOOLEAN = "true";
process.env.MULTIPLY_BY_TWO = "5";

const url = fetchEnv("SOME_STRING"); // string
const env = fetchEnv("NODE_ENV"); // "development" | "production"
const port = fetchEnv("PORT"); // number
const notAllowed = fetchEnv("MIGHT_NOT_EXIST"); // boolean | undefined
const someStringArray = fetchEnv("SOME_STRING_ARRAY"); // string[]
const someNumberArray = fetchEnv("SOME_NUMBER_ARRAY"); // number[]
const someFloatArray = fetchEnv("SOME_FLOAT_ARRAY"); // number[]
const someFloat = fetchEnv("SOME_FLOAT"); // number
const definiteBoolean = fetchEnv("DEFINITE_BOOLEAN"); // boolean
const shouldBeTen = fetchEnv("MULTIPLY_BY_TWO"); // number

console.log(url, typeof url); // https://somestring.com string
console.log(env, typeof env); // development string
console.log(port, typeof port); // 1234 number
console.log(notAllowed, typeof notAllowed); // undefined undefined
console.log(someStringArray, typeof someStringArray); // [ 'dave', 'tom', 'james' ] object
console.log(someNumberArray, typeof someNumberArray); // [ 1, 2, 3 ] object
console.log(someFloatArray, typeof someFloatArray); // [ 1.23, 4.56, 7.89 ] object
console.log(someFloat, typeof someFloat); // 1.429 number
console.log(definiteBoolean, typeof definiteBoolean); // true boolean
console.log(shouldBeTen, typeof shouldBeTen); // 10 number
```

## Limitations

Due to the inability to inspect TypeScript types _within_ your code in a nice way, unfortunately the "double-defining" has to exist (ie you must define the TypeScript interface for your environment, as well as the env config object using `TYPES.[type]`).
