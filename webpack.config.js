
module.exports = {
    entry: './index.js',
    output: {
        path: __dirname,
        filename: 'dist/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    },
    devtool: "source-map"

};