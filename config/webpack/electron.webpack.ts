import * as path from "path";
import { Configuration } from "webpack";
import ESLintWebpackPlugin from "eslint-webpack-plugin";

const rootPath = path.resolve(__dirname, "..", "..");

const config: Configuration = {
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	devtool: "source-map",
	entry: path.resolve(rootPath, "app/src/main", "main.ts"),
	target: "electron-main",
	module: {
		rules: [
			{
				test: /\.(js|ts|tsx)$/,
				exclude: /node_modules/,
				include: /src/,
				use: {
					loader: "ts-loader",
				},
			},
		],
	},
	node: {
		__dirname: false,
	},
	output: {
		path: path.resolve(rootPath, "app", "dist"),
		filename: "[name].js",
	},
	plugins: [new ESLintWebpackPlugin({
		fix: true,
	})],
};

export default config;
