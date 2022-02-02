const jwt = require('jsonwebtoken');
const { secret } = require('../config.json');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next)=>{
        
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, secret, (err, user) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(403);
                }

                req.user = user;
                if (roles.length && !roles.includes(req.user.role.type)) {
                    // user's role is not authorized
                    return res.status(401).json({ message: 'Unauthorized' });
                }
        
                // authentication and authorization successful
                next();
            });
        } else {
            res.sendStatus(401);
        }

        

    }
}

/*     return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        (req, res, next) => {

            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
} */