'use strict'

const path = require('path');
const webpack = require('webpack');

module.exports = {
    'entry':  {
        'jUtils': [path.resolve(__dirname, 'jUtils.js')]
    },
    'output': {
        'path': path.resolve(__dirname, 'dist'),
        'filename': '[name].min.js'
    },
    'devtool': false,
    'resolveLoader': {
        'modulesDirectories': [path.resolve(__dirname, './node_modules')]
    },
    'plugins': [
        new webpack.optimize.UglifyJsPlugin({
            'compress': {
                'warnings': false
            }
        })
    ]
}
