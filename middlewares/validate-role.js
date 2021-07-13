const { response } = require('express');

const isAdminRole = (req, res = response, next ) => {
    if(!req.user) {
        return res.status(500).json({
            errors: 'Role cannot be verified without validating the token first'
        });
    }

    const { role, name } = req.user;

    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            errors: `${name} is not administrator - can not do that`
        });
    }

    next();
}

const hasRole = (...roles) => {
    return (req, res = response, next) => {

        if(!req.user) {
            return res.status(500).json({
                errors: 'Role cannot be verified without validating the token first'
            });
        }

        if(!roles.includes(req.user.role)) {
            return res.status(401).json({
                errors: `Service requires one of these roles ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}