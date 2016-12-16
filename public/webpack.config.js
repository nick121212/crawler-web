/**
 * Created by NICK on 16/8/9.
 */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');

module.exports = {
    context: __dirname + '/',
    cache: true,
    debug: true,
    entry: {
        'vendor': ['jquery', 'lodash', 'jquery-terminal', 'jquery-mousewheel'],
        'page/passport': __dirname + '/src/pages/passport/index.ts',
        'page/home': __dirname + '/src/pages/home/index.ts',
        'page/style': __dirname + '/src/pages/style/index.ts',
        'page/page': __dirname + '/src/pages/page/index.ts',
        'page/index': __dirname + '/src/pages/index/index.ts'
    },
    devtool: "source-map",
    output: {
        path: __dirname + '/built',
        filename: '[name].bundle.js',
        hash: true
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.jade', '.scss', '.css'],
        exclude: /node_modules/,
        root: __dirname + '/node_modules/',
        alias: {
            'tv4': 'tv4/tv4',
            'restangular': 'restangular/dist/restangular',
            'jsoneditor.js': 'jsoneditor/dist/jsoneditor',
            'jsoneditor.css': 'jsoneditor/dist/jsoneditor.css',
            'ng-jsoneditor': 'ng-jsoneditor/ng-jsoneditor',
            'svg-morpheus': 'svg-morpheus/compile/unminified/svg-morpheus',
            'angular-schema-form': 'angular-schema-form/dist/schema-form',
            'angular-schema-form-ng-material': __dirname + '/src/directives/angular-schema-form-material/material-decorator',
            'angular.material.css': 'angular-material/angular-material.css',
            'angular.ui.tree.css': 'angular-ui-tree/dist/angular-ui-tree.css',
            'angular-material-data-table.css': 'angular-material-data-table/dist/md-data-table.css',
            'angular-motion.css': 'nganimationcss/build/nga.all.css',
            'angular-loading-bar.css': 'angular-loading-bar/build/loading-bar.css',
            'angular-gridster': 'angular-gridster/dist/angular-gridster.min',
            'angular-gridster.css': 'angular-gridster/dist/angular-gridster.min.css',
            'jquery': 'jquery/dist/jquery',
            'jquery-terminal': 'jquery.terminal/js/jquery.terminal.min',
            'jquery-mousewheel': 'jquery.mousewheel/jquery.mousewheel',
            'jquery-terminal.css': 'jquery.terminal/css/jquery.terminal.min.css'
        }
    },
    module: {
        loaders: [
            // { test: require.resolve('jquery'), loader: 'expose?$!expose?jQuery' },
            { test: /\.ts$/, loader: 'ts?module=commonjs' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css") },
            { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
            { test: /\.html$/, loader: 'raw' },
            { test: /\.(png|jpg|ttf)$/, loader: 'url?limit=8192' },
            { test: /\.jade$/, loader: 'jade' },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': 'development'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: '[name].bundle.js',
            minChunks: 2
        }),
        new ExtractTextPlugin("dashboard.css"),
        new HtmlWebpackPlugin({
            title: 'My App',
            template: 'index.html',
            inject: 'head',
            hasg: 'true',
            hash: true,
            // cache: true,
            checks: ['vendor', 'page/passport', 'page/home', 'page/style', 'page/page', 'page/index'],
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        new ManifestRevisionPlugin(path.join('built', 'manifest.json'), {
            rootAssetPath: '/built',
            ignorePaths: ['/stylesheets', '/javascript']
        })
    ]
};