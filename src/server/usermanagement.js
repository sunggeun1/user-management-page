/* eslint-disable require-jsdoc */
/* globals module */
/**
 * @author kecso / https://github.com/kecso
 */

'use strict';

var express = require('express'),
    path = require('path'),
    ejs = require('ejs'),
    fs = require('fs'),
    // eslint-disable-next-line
    router = express.Router(),
    bodyParser = require('body-parser'),
    DIST_DIR = path.join(__dirname, '..', '..', 'dist'),
    version = require('../../package.json').version,
    logger;

function serveFile(fileName, res) {
    const options = {
        root: DIST_DIR,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
        }
    };

    logger.debug('serving file', fileName);
    res.sendFile(fileName, options, function(err) {
        if (err) {
            logger.error('Failed to send ' + fileName, err);
            res.status(err.status).end();
        }
    });
}

function initialize(middlewareOpts) {
    const ensureAuthenticated = middlewareOpts.ensureAuthenticated;

    logger = middlewareOpts.logger.fork('UserManagementPage');
    logger.debug('initializing ...');

    router.use(bodyParser.json({}));
    router.use(bodyParser.urlencoded({extended: true}));
    router.use('*', function(req, res, next) {
        // res.setHeader('X-WebGME-Media-Type', 'webgme.v2');
        next();
    });

    // Detecting if its a file name
    router.get(/\./, function (req, res) {
        // eslint-disable-next-line
        var onlyFileExtension = req.originalUrl.match(/[^\/]+$/)[0]; // this is the file name
        serveFile(onlyFileExtension, res);
    });

    router.get(['/login', '/register', /\/reset\/\w+\/\w+$/], function(req, res) {
        logger.debug('Login path taken:', req.originalUrl);

        fs.readFile(path.join(DIST_DIR, 'login.html'), 'utf8', function(err, indexTemplate) {
            if (err) {
                logger.error(err);
                res.send(404);
            } else {
                res.contentType('text/html');
                res.send(ejs.render(indexTemplate, {
                    baseUrl: middlewareOpts.getMountedPath(req),
                    mountPath: req.baseUrl,
                    version: version,
                }));
            }
        });
    });

    const ROUTES = [
        '/',
        '/home',
        '/profile',
        '/tokens',
        '/projects', /\/projects\/\w+$/, /\/projects\/\w+\/\w+$/,
        '/organizations', /\/organizations\/\w+$/,
        '/users', /\/users\/\w+$/,
        '/newuser',
        '/status',
    ];

    router.get(ROUTES, ensureAuthenticated, function(req, res) {

        fs.readFile(path.join(DIST_DIR, 'index.html'), 'utf8', function(err, indexTemplate) {
            if (err) {
                logger.error(err);
                res.send(404);
            } else {
                res.contentType('text/html');
                res.send(ejs.render(indexTemplate, {
                    baseUrl: middlewareOpts.getMountedPath(req),
                    mountPath: req.baseUrl,
                    version: version,
                }));
            }
        });
    });

    logger.debug('ready');
}

module.exports = {
    initialize: initialize,
    router: router,
    start: function (callback) {
        callback(null);
    },
    stop: function (callback) {
        callback(null);
    }
};
