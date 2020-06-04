module.exports = (method, route, cb) => ({
    method,
    route,
    cb: asyncHandler(cb)
});

function asyncHandler(fn) {
    return (req, res, next) => {
        return Promise
            .resolve(fn(req, res, next))
            .catch(next);
    };
}