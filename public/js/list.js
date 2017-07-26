module.exports.list = function (userName, category) { 
    return ({
    "owner" : userName,
    "category" : category,
    "completed" : [],
    "planned" : [],
    "current" : [],
    "dropped" : [],
    "onHold"  : []
  });
}