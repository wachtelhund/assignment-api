import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    err.status = err.status || 500;
    if (req.app.get('env') !== 'development') {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
        });
    }

    return res.status(err.status).json({
        status: err.status,
        message: err.message,
        cause: err.cause ?
        {
            status: err.cause.status,
            message: err.cause.message,
            stack: err.cause.stack,
        } :
        null,
        stack: err.stack,
    });
};