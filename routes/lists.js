var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;


var mongoUrl = "mongodb://localhost:27017/Ethos";

MongoClient.connect(mongoUrl, function(err, db) {
  
  var collection = db.collection("lists");

  // Return all lists
  router.get('/', function(req, res, next) {
    collection.find({}).toArray(function(err, docs) {
      res.render('lists', JSON.parse(JSON.stringify(docs)));
    })
  });


  // Returns the list with the particular listID
  router.get('/:listID', function(req, res, next) {
    var listID = parseInt(req.params.listID);
    collection.find({"listID":listID}).toArray(function(err, docs) {
      res.json(JSON.parse(JSON.stringify(docs)));
    })
  })

  // Returns all the lists belonging to the particular user
  router.get('/owner/:userName', function(req, res, next) {
    var userName = req.params.userName;
    collection.find({"owner": userName}).toArray(function(err, docs) {
      res.json(JSON.parse(JSON.stringify(docs)));
    })
  });

  // Submit list post
  router.post('/', function(request, response){    
    console.log(request.body.newID); 
    response.render('lists', {title: request.body.newID});
  });

})

module.exports = router;