var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');


var mongoUrl = require('../public/js/mongourl.js').mongourl;

MongoClient.connect(mongoUrl, function(err, db) {

  var collection = db.collection("lists");

  // Return all lists
  router.get('/', function(req, res, next) {
    collection.find({}).toArray(function(err, docs) {
      res.render('lists', {docs : docs});
    })
  });

  router.get('/:category', function(req, res, next) {
    var username = req.cookies.username;
    if (!username) {
      res.redirect('/login');
    }
    var category = req.params.category;
    category = category.charAt(0).toUpperCase() + category.slice(1);
    if (category.toLowerCase().includes("tv")) {
      category = "TV Shows";
    }
    if (category.toLowerCase().includes("video")) {
      category = "Video Games";
    }
    collection.findOne({"owner": username, "category": category}, function(err, doc) {
      res.render('listview', {doc: doc});
    });
  });

  // Returns all the lists belonging to the particular user
  /*
  router.get('/owner/:userName', function(req, res, next) {
    var userName = req.params.userName;
    collection.find({"owner": userName}).toArray(function(err, docs) {
      res.render('listview', {docs: docs});
    })
  }); */

  router.post('/:category/:type/delete', function(req, res) {
    var index = req.body.index;
    var username = req.cookies.username;
    var category = req.params.category;
    var type = req.params.type;
    if (category.includes("TV")) {
      category = "TV Shows";
    }
    if (category.includes("Video")) {
      category = "Video Games";
    }
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


      array.splice(index, 1);
      collection.update({"owner": username, "category": category},{ $set: {[type] : array}}, function(err, doc) {
        res.redirect('/lists/' + category +  "#" + type);
      })
    })
  });

  // Submit list post
  router.post('/:category/:type', function(req, res){
    var item = req.body.item;
    var username = req.cookies.username;
    var category = req.params.category;
    var type = req.params.type;
    if (category.includes("TV")) {
      category = "TV Shows";
    }
    if (category.includes("Video")) {
      category = "Video Games";
    }
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
        res.redirect('/lists/' + category +  "#" + type);
      })
    })
  });

  router.post('/update/move/:category/:fromStatus/:toStatus', function(req, res) {
    var fromStatus = req.params.fromStatus;
    var toStatus = req.params.toStatus;
    var index = req.body.index;
    var item = req.body.item;
    var username = req.cookies.username;
    var category = req.params.category;
    if (category.toLowerCase().includes("tv")) {
      category = "TV Shows";
    }
    if (category.toLowerCase().includes("video")) {
      category = "Video Games";
    }
    collection.findOne({"owner" : username, "category" : category}, function(err, doc) {
      var fromArray;
      var toArray;
      if (fromStatus == "planned")
        fromArray = doc.planned;
      else if (fromStatus == "completed")
        fromArray = doc.completed;
      else if (fromStatus == "onHold")
        fromArray = doc.onHold;
      else if (fromStatus == "dropped")
        fromArray = doc.dropped;
      else if (fromStatus == "current")
        fromArray = doc.current;

      if (toStatus == "planned")
        toArray = doc.planned;
      else if (toStatus == "completed")
        toArray = doc.completed;
      else if (toStatus == "onHold")
        toArray = doc.onHold;
      else if (toStatus == "dropped")
        toArray = doc.dropped;
      else if (toStatus == "current")
        toArray = doc.current;

      fromArray.splice(index, 1);
      toArray.push(item);
      collection.update({"owner": username, "category": category},{ $set: {[fromStatus] : fromArray}}, function(updateErr, updatedDoc) {
        collection.update({"owner": username, "category": category},{ $set: {[toStatus] : toArray}}, function(finalErr, finalDoc) {
          res.redirect('/lists/' + category + '#' + toStatus);
        });
      });
    });
  });

});

module.exports = router;
