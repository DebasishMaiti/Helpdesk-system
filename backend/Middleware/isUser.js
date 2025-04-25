const jwt = require('jsonwebtoken');

exports.isUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({
                message: 'Please provide Authorization token'
            });
        }

        const tokenData = await jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user's role is 'customer'
        if (tokenData.role && tokenData.role === 'customer') {
            next(); // User is a customer, continue to the next middleware or route handler
        } else {
            const err = new Error('Unauthorized');
            err.status = 401;
            next(err); // Unauthorized access
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: error.message
        });
    }
};
