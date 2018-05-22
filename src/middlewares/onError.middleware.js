function onError(req, res, next) {
    res.onError = error => {
        const statusCode = error.statusCode || 500;
        const body = { success: false, message: error.message };
        res.status(statusCode).send(body);
        if (!error.statusCode) console.log(error);
    };
    next();
}

module.exports = { onError };
