import { configureEnv, TYPES } from ".";

const types = Object.values(TYPES);
const expectedInputsAndVals: [
  TYPES,
  string,
  any,
  ((val: string) => unknown) | undefined
][] = [
  [TYPES.STRING, "someString", "someString", undefined],
  [TYPES.NUMBER, "1234", 1234, undefined],
  [TYPES.FLOAT, "12.34", 12.34, undefined],
  [TYPES.ARRAY_STRING, "tom,dave,james", ["tom", "dave", "james"], undefined],
  [TYPES.ARRAY_NUMBER, "1,2,3", [1, 2, 3], undefined],
  [TYPES.ARRAY_FLOAT, "1.2,3.4,5.6", [1.2, 3.4, 5.6], undefined],
  [TYPES.BOOLEAN, "true", true, undefined],
  [TYPES.BOOLEAN, "True", true, undefined],
  [TYPES.BOOLEAN, "TRUE", true, undefined],
  [TYPES.BOOLEAN, "false", false, undefined],
  [TYPES.BOOLEAN, "not_true", false, undefined],
  [TYPES.CUSTOM, "2", 4, (x) => parseInt(x, 10) * 2],
];

const createEnvConfigItem = ({
  type,
  isOptional,
  customConverter,
}: {
  type: TYPES;
  isOptional?: boolean;
  customConverter?: (val: string) => unknown;
}) => ({
  type,
  isOptional,
  customConverter,
});

describe("configureEnv", () => {
  beforeEach(() => {
    process.env = {};
  });

  describe("accepts a legitimate envConfig object without erroring", () => {
    it("empty envConfig", () => {
      const envConfig = {};

      const fetchEnv = configureEnv(envConfig);
      expect(fetchEnv).toBeDefined();
    });

    it("full envConfig", () => {
      const envConfig = {
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
          customConverter: (x: string) => parseInt(x, 10) * 2,
        },
      };

      const fetchEnv = configureEnv(envConfig);
      expect(fetchEnv).toBeDefined();
    });
  });

  describe("handles non-optional items", () => {
    describe("when env value is undefined", () => {
      it.each(types)("for %p type throws error", (type) => {
        const envConfig = {
          SOME_VAR: createEnvConfigItem({ type }),
        };

        const fetchEnv = configureEnv(envConfig);

        expect(() => fetchEnv("SOME_VAR")).toThrowError(
          "The env var with name SOME_VAR is undefined"
        );
      });
    });

    describe("when env value is defined", () => {
      it.each(expectedInputsAndVals)(
        "for %p type returns the correct value",
        (type, inputVal, expectedVal, customConverter) => {
          const envConfig = {
            SOME_VAR: createEnvConfigItem({
              type,
              isOptional: true,
              customConverter,
            }),
          };
          process.env.SOME_VAR = inputVal;

          const fetchEnv = configureEnv<any>(envConfig as any);

          expect(fetchEnv("SOME_VAR")).toEqual(expectedVal);
        }
      );
    });

    it("throws an error if type is CUSTOM but no customConverter supplied", () => {
      const envConfig = {
        SOME_VAR: createEnvConfigItem({
          type: TYPES.CUSTOM,
        }),
      };

      process.env.SOME_VAR = "test";

      const fetchEnv = configureEnv<any>(envConfig as any);

      expect(() => fetchEnv("SOME_VAR")).toThrowError(
        `The env var with the name SOME_VAR is marked as CUSTOM, but has not provided a customConverter function`
      );
    });
  });

  describe("handles optional items", () => {
    describe("when env value is undefined", () => {
      it.each(types)("for %p type returns undefined", (type) => {
        const envConfig = {
          SOME_VAR: createEnvConfigItem({ type, isOptional: true }),
        };

        const fetchEnv = configureEnv(envConfig);

        expect(fetchEnv("SOME_VAR")).toBeUndefined();
      });
    });

    describe("when env value is defined", () => {
      it.each(expectedInputsAndVals)(
        "for %p type returns the correct value",
        (type, inputVal, expectedVal, customConverter) => {
          const envConfig = {
            SOME_VAR: createEnvConfigItem({
              type,
              isOptional: true,
              customConverter,
            }),
          };
          process.env.SOME_VAR = inputVal;

          const fetchEnv = configureEnv<any>(envConfig as any);

          expect(fetchEnv("SOME_VAR")).toEqual(expectedVal);
        }
      );
    });
  });
});
