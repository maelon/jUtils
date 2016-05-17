'use strict'

const path = require('path');
const webpack = require('webpack');

module.exports = {
    'entry':  {
        'jUtils': [path.resolve(__dirname, 'jUtils.js')]
    },
    'output': {
        'path': path.resolve(__dirname, 'dist'),
        'filename': '[name].min.js',
        'sourceMapFilename': '[name].min.js.map'
    },
    'devtool': 'source-map',
    'resolveLoader': {
        'modulesDirectories': [path.resolve(__dirname, '../node_modules')]
    },
    'plugins': [
        new webpack.optimize.UglifyJsPlugin({
            'compress': {
                'warnings': false
            }
        })
    ]
}
