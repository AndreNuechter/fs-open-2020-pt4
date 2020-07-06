module.exports = (request, _, next) => {
    const authSchemeString = 'bearer ';
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith(authSchemeString)) {
        request.token = authorization.substring(authSchemeString.length);
    }
    next();
};