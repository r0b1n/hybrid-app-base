var path = require("path");
var util = require("util");

var webpack = require("webpack");
var webpack_merge = require('webpack-merge');

var CopyWebpackPlugin = require("copy-webpack-plugin");
var WebpackArchivePlugin = require("webpack-archive-plugin");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var base_config = require("./webpack.config.base");
var package_config = require("./package.json");
var utils = require("./utils");

module.exports = function(env) {
    var config_template_path = utils.getBaseOrCustomPath("src/config.xml.mustache");
    var settings_template_path = utils.getBaseOrCustomPath("src/www/settings.json.mustache");

    return webpack_merge(base_config(env), {
        devtool: "source-map",
        plugins: [
            new CopyWebpackPlugin([ // Process and copy the config.xml file
                {
                    context: path.dirname(config_template_path),
                    from: path.basename(config_template_path),
                    to: "config.xml"
                },
                {
                    context: path.dirname(settings_template_path),
                    from: path.basename(settings_template_path),
                    to: path.normalize("www/settings.json")
                }
            ]),
            new WebpackArchivePlugin({ // Compress everything into a ZIP file that can be uploaded to Phonegap Build
                output: path.join("dist", util.format("appbase-%s", package_config.version)),
                format: "zip"
            }),
            new UglifyJSPlugin({
                sourceMap: true
            })
        ]
    });
};
