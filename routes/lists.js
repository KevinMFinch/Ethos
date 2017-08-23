var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');


var mongoUrl = "mongodb://localhost:27017/Ethos";

MongoClient.connect(mongoUrl, function(err, db) {

  var collection = db.collection("lists");

  // Return all lists
  router.get('/', function(req, res, next) {
    collection.find({}).toArray(function(err, docs) {
      res.render('lists', {docs : docs});
    })
  });

  // Returns all the lists belonging to the particular user
  router.get('/owner/:userName', function(req, res, next) {
    var userName = req.params.userName;
    collection.find({"owner": userName}).toArray(function(err, docs) {
      res.render('listview', {docs: docs});
    })
  });

  // Submit list post
  router.post('/:category/:type', function(req, res){
    var item = req.body.item;
    var username = req.cookies.username;
    var category = req.params.category;

    var type = req.params.type;
    collection.findOne({"owner" : username, "category" : category}, function(err, doc) {
      var array;
      if (type == "planned")
        array = doc.planned;
      else if (type == "completed")
        array = doc.completed;
      else if (type == "onHold")
        array = doc.onHold;
      else if (type == "dropped")
        array = doc.dropped;
      else if (type == "current")
        array = doc.current;
      array.push(item);
      collection.update({"owner": username, "category": category},{ $set: {[type] : array}}, function(err, doc) {
        res.redirect('/lists/owner/' + username + "#" + type);
      })
    })
  });

})

module.exports = router;
