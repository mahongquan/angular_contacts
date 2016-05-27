var fs = require('fs');
var path = require('path');
var COMMENTS_FILE = path.join(__dirname, 'comments.json');
var comments=[];
console.log(COMMENTS_FILE);
fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    comments = JSON.parse(data);
    console.log(comments);
});
function Contact(reqbody) {
  console.log(reqbody);
  this.firstname=reqbody.firstname;
  this.lastname=reqbody.lastname;
  this.age=reqbody.age;
  return this;
};
Contact.find = function(para,handler) {
  //console.log("find");
  //console.log(comments);
  console.log("para");
  console.log(para);
  handler(null,comments);
};
Contact.findOne = function(para,handler) {
  for(var i in comments){
    if(comments[i]._id==para._id){
      handler(null,comments[i]);
    }
  }

};
Contact.prototype.save = function() {
  comments.push(this);
};
Contact.findByIdAndUpdate = function(id,data,upsert,handler) {
for(var i in comments){
    if(comments[i]._id==id){
      console.log("data");
      console.log(data);
      data=data['$set'];
      comments[i].firstname=data.firstname;
      comments[i].lastname=data.lastname;
      comments[i].age=data.age;
      handler(null,comments[i]);
    }
  }
};
Contact.remove = function() {

};
exports.contacts = function(req, res) {
  Contact.find({}, function(err, obj) {
    //console.log("contacts");
    //console.log(obj);
    res.json(obj)
  });
};

exports.contact = function(req, res) {
  Contact.findOne({ _id: req.params.id }, function(err, obj) {
    res.json(obj);
  });
};

exports.createContact = function(req, res) {
  var contact = new Contact(req.body);
  contact.save();
  res.json(req.body);
};

exports.updateContact = function(req, res) {
  Contact.findByIdAndUpdate(req.params.id, {
    $set: { firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age }
  }, { upsert: true },
  function(err, obj) {
    return res.json(true);
  });
};

exports.destroyContact = function(req, res) {
  Contact.remove({ _id: req.params.id }, function(err) {
    res.json(true);
  });
};