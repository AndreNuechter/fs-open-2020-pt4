const asyncHandler = fn => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next);
};

module.exports = (method, path, cb) => ({
    method,
    path,
    controller: asyncHandler(cb)
});