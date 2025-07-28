const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode; // if res.statusCode is 200, then set the status code to 500. Else set it to the status code
    let message = err.message;

    res.status(statusCode).json({
        "error": {
            message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack // If the environment is production, then set the stack to null, else set it to the error stack
        }
    });
}

export { notFound, errorHandler };