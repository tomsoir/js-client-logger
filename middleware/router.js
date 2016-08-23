var Bear = require('./../app/models/bear');
var Logs = require('./../app/models/logs');

module.exports = {
    populate:{
        client: function (router) {
            return addToRouter({
                '/':{
                    'get': function(req, res) {
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
                }
            }, router);
        },

        api: function (router) {
            return addToRouter({
                '/bears': {
                    'post': function(req, res) {
                        console.log('>> API:', req.body, req.body.name)
                        var bear = new Bear(); // create a new instance of the Bear model
                        bear.name= req.body.name;
                        bear.save(function(err) {
                            if (err) res.send(err);
                            res.json({ message: 'Bear created!' });
                        });
                    },
                    'get': function(req, res) {
                        Bear.find(function(err, bears) {
                            if (err) res.send(err);
                            res.json(bears);
                        });
                    }
                },
                '/bears/:bear_id':{
                    'get': function(req, res) {
                        Bear.findById(req.params.bear_id, function(err, bear) {
                            if (err) res.send(err);
                            res.json(bear);
                        });
                    },
                    'put': function(req, res) {
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
                    'delete':function(req, res) {
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
            router.route(serv)[method](f);
        }
    }
    return router
}

