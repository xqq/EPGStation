import auth from 'basic-auth';
import express from 'express';

export default (user: string, pass: string) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void => {
        const result = auth(req);

        if (typeof result === 'undefined' || result.name !== user || result.pass !== pass) {
            res.set('WWW-Authenticate', 'Basic realm="EPGStation"');
            return res.status(401).send();
        }

        return next();
    };
};
