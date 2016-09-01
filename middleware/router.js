var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');

var config = require('./../config.json');
var Bear = require('./../app/models/bear');
var Logs = require('./../app/models/logs');
var User = require('./../app/models/user');

module.exports = {
    populate:{
        client: function (router) {
            return addToRouter({
                '/':{
                    get: function(req, res) {
                        Bear.find(function(err, bears) {
                            if (err) res.send(err);
                            Logs.find(function(err, logs) {
                                if (err) res.send(err);
                                res.render('index', {
                                    title: 'JS logger', 
                                    names: bears,
                                    logs: logs,
                                });
                            });
                        });
                    }
                },
                '/users':{
                    get: function(req, res) {
                        User.find({}, function(err, users) {
                            res.json(users);
                        });
                    }
                },
            },router);
        },

        auth: function (router) {
            return addToRouter({
                '/reg':{
                    get: function(req, res) {
                        User.findOne({name: 'Nick Cerminara'}, function(err, user) {
                            if (err) throw err;

                            if (user) {
                                res.json({ error: 'user already exist' });
                            }else{
                                // create a sample user
                                var nick = new User({ 
                                    name: 'Nick Cerminara', 
                                    password: 'password',
                                    admin: true 
                                });
                                // save the sample user
                                nick.save(function(err) {
                                    if (err) throw err;
                                    console.log('User saved successfully');
                                    res.json({ success: true });
                                });
                            }
                        });
                    }
                },
                '/login': {
                    post: function(req, res) {
                        // find the user
                        User.findOne({name: req.body.name}, function(err, user) {
                            if (err) throw err;

                            if (!user) {
                                res.json({ success: false, message: 'Authentication failed. User not found.' });
                            } else if (user) {
                                // check if password matches
                                if (user.password != req.body.password) {
                                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                                } else {
                                    // if user is found and password is right
                                    // create a token
                                    var token = jwt.sign(user, config.secret, {
                                        expiresInMinutes: 1440 // expires in 24 hours
                                    });

                                    // return the information including token as JSON
                                    res.json({
                                        success: true,
                                        message: 'Enjoy your token!',
                                        token: token
                                    });
                                }
                            }
                        });
                    },
                },
            }, router);
        },

        api: function (router) {
            return addToRouter({
                '/bears': {
                    post: function(req, res) {
                        console.log('>> API:', req.body, req.body.name)
                        var bear = new Bear(); // create a new instance of the Bear model
                        bear.name= req.body.name;
                        bear.save(function(err) {
                            if (err) res.send(err);
                            res.json({ message: 'Bear created!' });
                        });
                    },
                    get: function(req, res) {
                        Bear.find(function(err, bears) {
                            if (err) res.send(err);
                            res.json(bears);
                        });
                    }
                },
                '/bears/:bear_id':{
                    get: function(req, res) {
                        Bear.findById(req.params.bear_id, function(err, bear) {
                            if (err) res.send(err);
                            res.json(bear);
                        });
                    },
                    put: function(req, res) {
                        var bear = new Bear();
                        Bear.findById(req.params.bear_id, function(err, bear) {
                            if (err) res.send(err);
                            bear.name = req.body.name;
                            bear.save(function(err) {
                                if (err) res.send(err);
                                res.json({ message: 'Bear updated!' });
                            });
                        });
                    },
                    delete:function(req, res) {
                        Bear.remove({_id: req.params.bear_id}, function(err, bear) {
                            if (err) res.send(err);
                            res.json({ message: 'Successfully deleted' });
                        });
                    }
                }
            }, router);
        }
    } 
};

var addToRouter = function(roadmap, router){
    for(serv in roadmap){
        for(method in roadmap[serv]){
            var f = roadmap[serv][method];
            console.log('>', '['+method+']', serv)
            router.route(serv)[method](f);
        }
    }
    return router
}

