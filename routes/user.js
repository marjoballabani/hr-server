/**
 * Created by Marjo on 9/12/2016.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User = require('../models/user');

/* get all tables */
router.get('/', function(req, res, next) {
    User.find({}, { password: 0 }, function(err, data){
        res.json(data);
    })
});

/* Get table by id */
router.get('/:id', function(req, res, next) {
    var id = (req.params.id.length == 12)  ? req.params.id : '000000000000';
    User.find({'_id': new ObjectId(id)}, function(err, data){
        res.json(data);
    })
});

module.exports = router;
