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
