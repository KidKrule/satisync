module.exports = {
	extends: ["eslint:recommended", "plugin:react/recommended"],
	parser: "babel-eslint",
	parserOptions: {
		sourceType: "module"
	},
	env: {
		browser: true,
		node: true
	},
	globals: {
		__static: true
	},
	plugins: ["react-hooks"],
	rules: {
		"react-hooks/rules-of-hooks": ["error"],
		"react/prop-types": 0,
		"no-unused-vars": ["warn"]
	},
	settings: {
		react: {
			version: "detect"
		}
	}
}
