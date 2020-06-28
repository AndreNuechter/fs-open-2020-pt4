module.exports = (err, _, res, next) => {
    // TODO error classes and look-up instead of conditional
    if (err.name === 'CastError') {
        return res
            .status(400)
            .send({ error: 'malformatted id' });
    } else if (err.name === 'ValidationError') {
        return res
            .status(400)
            .json({ error: err.message });
    } else if (err.name === 'NotFoundError') {
        return res
            .status(404)
            .json({ error: err.message });
    }

    next(err);
};