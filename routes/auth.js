/**
 * Created by Marjo on 9/12/2016.
 */
var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');
// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/auth)

// route middleware to verify a token
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    if(req.originalUrl == '/api/login') {
        next()
    } else {
        // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['authorization'];
    console.log(token);
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                })
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
    }
});

module.exports = router;
