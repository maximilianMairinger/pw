const InjectPlugin = require("webpack-inject-plugin")
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require("path")



module.exports = () => {
    return {
        entry: './app/app.ts',
        output: {
            filename: 'dist/pw.js',
            chunkFilename: 'dist/[name].js',
            path: path.resolve(path.dirname(''), "public"),
            publicPath: "/",
            assetModuleFilename: 'res/dist/other/[hash][ext][query]'
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.ttf$/,
                    type: 'asset/resource',

                },
                // {
                //     test: /([a-zA-Z0-9\s_\\.\-\(\):])+\.static\.([a-zA-Z0-9])+$/,
                //     use: 'raw-loader',
                // },
                // {
                //     test: /\.ttf$/,
                //     use: [
                //       {
                //         loader: 'file-loader',
                //         options: {
                //           name: '[name].[ext]',
                //           outputPath: 'fonts/'
                //         }
                //       }
                //     ]
                // },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            configFile: "tsconfig.app.json"
                        }
                    },
                },
                {
                    test: /\.csss$/,
                    use: ['to-string-loader', 'css-loader'],
                },
                {
                    test: /\.pug$/,
                    use: ['raw-loader', 'pug-html-loader']
                }
            ]
        },
        plugins: [new MonacoWebpackPlugin({
            filename: "dist/monacoWorker/[name].worker.js"
        })]
    }
};
