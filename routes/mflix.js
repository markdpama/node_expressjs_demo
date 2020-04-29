var express = require('express');
var router = express.Router();
var ellipsis = require('text-ellipsis');


/* https://zellwk.com/blog/crud-express-mongodb/ */
var connectionString = 'mongodb+srv://dbuser01:!mdp-wCziYMJ@cluster0-pccin.mongodb.net/test?retryWrites=true&w=majority';
const { check, validationResult } = require('express-validator');
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(connectionString, {
  useUnifiedTopology: true
}, (err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
  const db = client.db('sample_mflix')
  
  //{ $text: { $search: "extraction" } }
  var dbFilter = {
      poster : { $exists: true },
      $text:{ $search: "extraction" }
  }
  
  //dbFilter.push([])  
  
  db.collection("movies").find(dbFilter).limit(50).toArray(function(err, result) {
    if (err) throw err;
    //console.log(result);
    
    /* GET mflix listing from MongoDB Atldas. */
    router.get('/', function(req, res, next) {
      res.set('Cache-Control', 'no-store')    
      res.render('mflix',{'movies':result,'ellipsis':ellipsis});
    });

    router.post('/create', function(req, res, next) {
    
      db.collection("movies").insertOne(req.body)
        .then(result => {
          console.log(result)
          res.redirect('/mflix?msg=added')
        })
        .catch(error => console.error(error))
    
    });    
   
  });
  

})

  
router.get('/create', function(req, res, next) {
  res.set('Cache-Control', 'no-store')    
  res.render('movie_form');
});




module.exports = router;