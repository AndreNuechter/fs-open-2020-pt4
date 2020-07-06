module.exports = (err, _, res, next) => {
    if (err.name === 'CastError') {
        return res
            .status(400)
            .send({ error: 'malformatted id' });
    } else if (err.name === 'ValidationError') {
        return res
            .status(400)
            .json({ error: err.message });
    } else if (err.name === 'JsonWebTokenError') {
        return res
            .status(401)
            .json({ error: err.message });
    }

    next(err);
};