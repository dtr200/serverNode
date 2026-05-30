import {createDefaultEsmPreset} from "ts-jest";

const tsJestCfg = createDefaultEsmPreset();

/** @type {import("jest").Config} **/
export default {
	...tsJestCfg,
	testEnvironment: "node",
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
};