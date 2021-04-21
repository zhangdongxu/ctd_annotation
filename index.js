const express = require('express');
const app = express();
app.listen(3000, () => console.log('listening to 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

var account_dict = {"apple": "", "banana": ""};
var relation_types = ["chem_gene:effect", "chem_disease:effect", "gene_disease:effect"];
var external_data = {"apple":{"browse_history": 0, "data": [
      {"text":"cat love dog, bird hates eagle", "pid":"123", "entities": ["cat", "dog", "bird", "eagle"], "labels": [["cat", "cat", ""]], "complete": false},
      {"text":"2cat love dog, bird hates eagle", "pid":"234", "entities": ["2cat", "dog", "bird", "eagle"], "labels": [["bird", "bird", ""], ["cat", "cat", ""]], "complete": false},
      {"text":"3cat love dog, bird hates eagle", "pid":"345", "entities": ["3cat", "dog", "bird", "eagle"], "labels": [["", "", ""]], "complete": false}]},
    "banana":{"browse_history": 0, "data": [
        {"text":"cat love dog, bird hates eagle", "pid":"123", "entities": ["cat", "dog", "bird", "eagle"], "labels": [["cat", "cat", ""]], "complete": false},
      {"text":"2cat love dog, bird hates eagle", "pid":"234", "entities": ["2cat", "dog", "bird", "eagle"], "labels": [["bird", "bird", ""], ["cat", "cat", ""]], "complete": false},
      {"text":"3cat love dog, bird hates eagle", "pid":"345", "entities": ["3cat", "dog", "bird", "eagle"], "labels": [["", "", ""]], "complete": false}]}
    };

var input_data = external_data;

app.post('/login', (request, response) => {
    let status_value;
    let total_num_page_value;
    let relation_types_value;
    let browse_history_value;
    console.log(request.body.password);
    // if (codelist.includes(request.body.password)){
    if (request.body.password in account_dict){
        status_value = true;
        total_num_page_value = input_data[request.body.password]["data"].length;
        relation_types_value = relation_types;
        browse_history_value = input_data[request.body.password]["browse_history"];

    } else {
        status_value = false;
        total_num_page_value = -1;
        relation_types_value = [];
        browse_history_value = -1;
    }
    console.log(status_value);
    console.log(total_num_page_value);
    response.json({
        status: status_value,
        total_num_pages: total_num_page_value,
        relation_types: relation_types_value,
        browse_history: browse_history_value,

    });
    
});

app.post('/save', (request, response) => {
    console.log(request.body);
    let username = request.body.username;
    let labels = request.body.labels;
    let page_index = request.body.page_index;
    external_data[username]["data"][page_index]["labels"] = labels;
    external_data[username]["browse_history"] = page_index;

    response.json({
        status: "success",
    });
});

app.post('/complete', (request, response) => {
    //console.log(request.body);
    let username = request.body.username;
    let page_index = request.body.page_index;
    let complete = request.body.complete;
    console.log(complete);
    external_data[username]["data"][page_index]["complete"] = complete;
    external_data[username]["browse_history"] = page_index;
    console.log(external_data[username]["data"][page_index]["complete"]);

    response.json({
        status: "success",
    });
});

app.get('/newpage', (request, response) => {
    console.log(request.query);
    let page_num = parseInt(request.query.page_num);
    let username = request.query.username;
    console.log(input_data[username]["data"][page_num]["complete"]);
    msg = {
        pid: input_data[username]["data"][page_num]["pid"],
        text: input_data[username]["data"][page_num]["text"],
        entities: input_data[username]["data"][page_num]["entities"],
        labels: input_data[username]["data"][page_num]["labels"],
        complete: input_data[username]["data"][page_num]["complete"],
    }
    response.json(msg);
});