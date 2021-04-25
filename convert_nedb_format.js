const Datastore = require('nedb');
let database = new Datastore('data.db');
database.loadDatabase();

database.insert({account_info: true, username: 'apple', browsing_history: 0});
database.insert({account_info: true, username: 'banana', browsing_history: 0});

const fs = require('fs');
let rawdata = fs.readFileSync('test.json');
let input_data = JSON.parse(rawdata);
let type_set = {"Chemical": null, "Gene": null, "Disease": null};

for (var i=0; i < input_data.length; i++){
  var new_doc = {};
  new_doc.account_info = false;
  new_doc.index = i;
  new_doc.docid = input_data[i].docid;
  new_doc.title = input_data[i].title;
  new_doc.abstract = input_data[i].abstract;

  var entity_dict = {};
  for (var j=0; j < input_data[i].entity.length; j++){
    var eid = input_data[i].entity[j].id;
    var start = input_data[i].entity[j].start;
    var end = input_data[i].entity[j].end;
    var mention = input_data[i].entity[j].mention;
    var etype = input_data[i].entity[j].type;
    if (eid != '-' && (etype in type_set)){
      if (eid in entity_dict == false){
        entity_dict[eid] = [];
      }
      entity_dict[eid].push([start, end, mention, etype]);
    }
  }
  new_doc.entity = entity_dict;
  new_doc.relation = {'origin': {'value':[], 'complete': false}};
  for (var j = 0; j < input_data[i].relation.length; j++){
    new_doc.relation.origin.value.push(input_data[i].relation[j]);
  }
  if (new_doc.relation.length == 0){
    new_doc.relation.origin.value.push({'type': '', 'subj': '', 'obj': ''});
  }
  database.insert(new_doc, function (err, newDoc){
    ;
  });

}
