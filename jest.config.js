import {createDefaultEsmPreset} from "ts-jest";

const tsJestCfg = createDefaultEsmPreset({
	tsconfig: './tsconfig.test.json',
});

/** @type {import("jest").Config} **/
export default {
	...tsJestCfg,
	testEnvironment: "node",
	testMatch: [
		"**/*.test.ts",
	],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
};