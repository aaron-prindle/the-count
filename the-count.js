Partiers = new Meteor.Collection("partiers");

function updatePerc(){
  var total = 0;
  var count = 0;
  var perc = 0;
  Partiers.find().forEach(function(partier){ //slow
    if (partier.type==="boys"){
      count = partier.count;
    }
    total += partier.count;
  });
  if (total === 0)
    perc = 0;
  else
    perc = 100*count/total;
  Partiers.update(Partiers.findOne({type: "boys"}), {$set: {perc: perc}});
  count = 0;
  Partiers.find().forEach(function(partier){ //slow
    if (partier.type==="girls"){
      count = partier.count;
    }
  });
  if (total === 0)
    perc = 0;
  else
    perc = 100*count/total;

  Partiers.update(Partiers.findOne({type: "girls"}), {$set: {perc: perc}});
}

if (Meteor.isClient) {
  Template.info.partiers = function () {
    return Partiers.find();
  };
  
  Template.buttons.events = {
    'click input.add_boy': function(){
      Partiers.update(Partiers.findOne({type: "boys"}), {$inc: {count: 1}});
      updatePerc();
    },
    'click input.subtract_boy': function(){
      if(!Partiers.findOne({type: "boys"}).count == 0)
	Partiers.update(Partiers.findOne({type: "boys"}), {$inc: {count: -1}});
      updatePerc();
    },
    'click input.add_girl': function(){
      Partiers.update(Partiers.findOne({type: "girls"}), {$inc: {count: 1}});
      updatePerc();
    },
    'click input.subtract_girl': function(){
      if(!Partiers.findOne({type: "girls"}).count == 0)
	Partiers.update(Partiers.findOne({type: "girls"}), {$inc: {count: -1}});
      updatePerc();
    }
  }
  
  Template.info.total = function(){
    var total = 0;
    Partiers.find().forEach(function(partier){
      total += partier.count;
    });
    return total;
  }
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Partiers.find().count() === 0) {
      var partier_types = ["boys",
			   "girls"];
    
      for (var i = 0; i < partier_types.length; i++)
	Partiers.insert({type: partier_types[i], count: 0, perc: 0});
    }
  });
}
