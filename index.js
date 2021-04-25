const express = require('express');
// const Datastore = require('nedb');
const Datastore = require('nedb-promises')

const app = express();
app.listen(3000, () => console.log('listening to 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const fs = require('fs');
// let rawdata = fs.readFileSync('data.json');
// let input_data = JSON.parse(rawdata);

// let input_data = new Datastore('data.db');
// input_data.loadDatabase();
let input_data = Datastore.create('data.db');

let relation_types_dict_str = fs.readFileSync('relation_map.json');
let relation_types = Object.keys(JSON.parse(relation_types_dict_str));
// var relation_types = ["chem_gene:effect", "chem_disease:effect", "gene_disease:effect"];

let username_dict = {};
// input_data.find({'account_info': true}, function (err, docs) {
//     for (var i=0; i < docs.length; i++) {
//         username_dict[docs[i].username] = docs[i].browsing_history;
//         console.log(docs[i]);
//     }
// });
(async () => {
    const docs = await input_data.find({account_info: true});
    // await console.log(docs);
    for (var i=0; i < docs.length; i++) {
        username_dict[docs[i].username] = docs[i].browsing_history;
        // console.log(docs[i]);
    }
    console.log(username_dict);
   }) ()

// var account_dict = {"apple": 0, "banana": 0}; // save account name, page of most recent save

app.post('/login', async function (request, response) {
    let status_value;
    let total_num_page_value;
    let relation_types_value;
    let browsing_history_value;
    // console.log(request.body.password);
    // if (codelist.includes(request.body.password)){
    if (request.body.password in username_dict) {
        status_value = true;
        // input_data.find({username: ''}, function(err, docs) {total_num_page_value = docs.length;});
        const length_ = await input_data.count({account_info: false});
        console.log(length_);
        total_num_page_value = length_;
        relation_types_value = relation_types;
        const user_info_ = await input_data.findOne({account_info: true, username: request.body.password});
        console.log(user_info_);
        browsing_history_value = user_info_.browsing_history;

    } else {
        status_value = false;
        total_num_page_value = -1;
        relation_types_value = [];
        browsing_history_value = -1;
    }
    // console.log(status_value);
    // console.log(browsing_history_value);
    // console.log(total_num_page_value);

    response.json({
        status: status_value,
        total_num_pages: total_num_page_value,
        relation_types: relation_types_value,
        browsing_history: browsing_history_value,
    });
    
});

app.post('/save', async function (request, response) {
    // console.log(request.body);
    let username = request.body.username;
    let relations = request.body.relations;
    let page_index = request.body.page_index;
    const doc = await input_data.findOne({index: page_index});
    doc.relation[username] = {value: relations, complete: false};
    // console.log(doc.relation[username]);
    await input_data.update({index: page_index}, {index: page_index, docid: doc.docid, title: doc.title, abstract: doc.abstract, entity: doc.entity, relation: doc.relation});
    await input_data.update({account_info: true, username: username}, {$set: {browsing_history: page_index}});
    const user_info = await input_data.find({account_info: true, username: username});
    // console.log(user_info);

    response.json({
        status: "success",
    });
});

app.post('/complete', async function (request, response) {
    //console.log(request.body);
    let username = request.body.username;
    let page_index = request.body.page_index;
    let complete = (request.body.complete == 'true');
    //console.log(complete);
    const doc = await input_data.findOne({index: page_index});
    if (!(username in doc.relation)) {
      doc.relation[username] = {complete: complete, value: doc.relation.origin.value};
        
    } else {
      doc.relation[username] = {complete: complete, value: doc.relation[username].value};
    }
    // console.log(doc.relation);
    // console.log(doc.relation[username]);
    await input_data.update({index: page_index}, {index: page_index, docid: doc.docid, title: doc.title, abstract: doc.abstract, entity: doc.entity, relation: doc.relation});
    await input_data.update({account_info: true, username: username}, {$set: {browsing_history: page_index}});

    const doc_ =  await input_data.findOne({index: page_index});
    // console.log(doc_.relation);
    // console.log(doc_.relation[username]);

    response.json({
        status: "success",
    });
});

app.get('/newpage', async function (request, response) {
    // console.log(request.query);
    let page_index = parseInt(request.query.page_index);
    // console.log(page_index);
    let username = request.query.username;
    const doc = await input_data.findOne({index: page_index});
    //console.log(doc);
    //console.log(username);
    // console.log(doc.relation);

    if (!(username in doc.relation)) {
      //console.log('here');
      // console.log(username);
      doc.relation[username] = doc.relation.origin;
    }

    // console.log(doc);
    

    // input_data.findOne({index: page_index}, function (err, doc) {
    //     console.log(doc);
    //     newdoc = doc;
    //     if ((username in newdoc.relation) == false) {
    //         newdoc.relation.username = newdoc.relation.origin;
    //     }
    // });

    // console.log(page_index);
    // console.log(doc);
    // console.log(newdoc.entity);
    // console.log(Object.keys(newdoc.entity));
    msg = {
        pid: doc.docid,
        title: doc.title,
        abstract: doc.abstract,
        entities_info: doc.entity,
        relations: doc.relation[username].value,
        complete: doc.relation[username].complete,
    }
    response.json(msg);
});