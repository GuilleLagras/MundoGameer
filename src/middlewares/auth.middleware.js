export const authMiddleware = (authorizedRole) => {
    return (req, res, next) => {
        if (!req.user || !authorizedRole.includes(req.user.role)) {
            console.log('Not authorized')
            return res.redirect('/error')
        }
        next();
    };
};
