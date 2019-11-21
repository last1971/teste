import Container from './Container';

import Express from 'express';
import { createNamespace } from 'cls-hooked';
import uuid4 from 'uuid/v4';
import EventEmitter from 'events';
import http from 'http';
import config from './config';
import pino from 'pino';
import expressPino from 'express-pino-logger';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import router from "./router";
import createError from 'http-errors';
import DatabaseConnection from './DatabaseConnection';
import DatabaseService from './DatabaseService';
/*
import Signer from './Signer';
import Session from './Session';
import Auth from './Auth';
import MailerTransport from './MailerTransport';
import Mailer from './Mailer';
import Stripe from './Stripe';
import Password from './Password';
*/

export default () => {
    const namespace = createNamespace(uuid4());

    const container = new Container(namespace);
    const express = new Express();

    express.use((req, res, next) => {
        namespace.bindEmitter(req);
        namespace.bindEmitter(res);

        namespace.run(() => {
            next();
        });
    });
    const logger = pino({ level: process.env.LOG_LEVEL || 'info', prettyPrint: true });
    express.use(expressPino({ logger }))
    express.set('views', path.join(__dirname, 'views'));
    express.set('view engine', 'pug');
    express.use(Express.json());
    express.use(Express.urlencoded({ extended: false }));
    express.use(cookieParser());
    express.use(Express.static(path.join(__dirname, 'public')));
    express.use(bodyParser.urlencoded({ extended: true }));
    express.use(bodyParser.json());
    express.use('/', router(Express));
    // catch 404 and forward to error handler
    express.use(function(req, res, next) {
        next(createError(404));
    });
    // error handler
    express.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
    container.register('namespace', () => namespace);
    container.register('config', () => config);
    container.register('express', () => express);
    container.register('events', EventEmitter);
    container.register('logger', () => logger);
    container.register('http', () => http);
    container.register('dbConnection', DatabaseConnection, ['config', 'logger', 'namespace']);
    container.register('db', DatabaseService, ['dbConnection']);
    /*
        container.register('session', Session, ['auth', 'db'], { scoped: true });

        container.register('signer', Signer, ['config']);
        container.register('mailerTransport', MailerTransport, ['config']);
        container.register('mailer', Mailer, ['config', 'logger', 'mailerTransport', 'views']);
        container.register('auth', Auth, ['config', 'logger', 'db', 'signer']);
        container.register('stripe', Stripe, ['config']);
        container.register('password', Password);
    */
    return container;
};