var username = null;
var page_index = -1;
var total_num_pages = -1;
var active = false;
var pid;
var title = "";
var abstract = "";
var entities = [];
var entities_info = [];
var label_list = [{"type": "", "subj": "", "obj": ""}];
var relation_types = [];
var completevalue;

var color_pool = {
  BLUE: "#0074D9",
  AQUA: "#7FDBFF",
  TEAL: "#39CCCC",
  OLIVE: "#3D9970",
  GREEN: "#2ECC40",
  LIME: "#01FF70",
  YELLOW: "#FFDC00",
  ORANGE: "#FF851B",
  RED: "#FF4136",
  FUCHSIA: "#F012BE",
  PURPLE: "#B10DC9",
  GRAY: "#AAAAAA",
  };


function newSession() {
 document.getElementById("login").innerHTML = '<input type="text", id="password", placeholder="Enter the code" />'
                                            + '<input type="button" , value="Login" onclick="userLogin()" />'
                                            + '<input type="button" , value="Logout" onclick="userLogout()" />';
}

async function userLogin() {
  let password = document.getElementById("password").value;
  // console.log(password);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"password": password})
  };

  const response = await fetch('/login', options);
  const res = await response.json();
  // const res=null;
  // fetch('/login', options).then(response => {
  //  res = response.json();});
  // console.log(res);
  if (res.status == true){
      active = true;
      total_num_pages = res.total_num_pages;
      relation_types = res.relation_types;
      username = password;
      page_index = res.browsing_history;
      document.getElementById("messages").innerHTML =
      "Login successfully! Welcome!";
      update_new_page();
    } else {
      active = false;
      total_num_pages = -1;
      relation_types = [];
      username = null;
      page_index = -1;
      document.getElementById("messages").innerHTML =
      "Invalid code. Please try again";
      update_new_page();
    }
  // console.log(relation_types);
  // console.log(username);
  
  
}

async function userLogout() {
  let password = "";
  // console.log(password);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"password": password})
  };

  const response = await fetch('/login', options);
  const res = await response.json();
  // const res=null;
  // fetch('/login', options).then(response => {
  //  res = response.json();});
  // console.log(res);
  if (res.status == true){
      active = true;
      total_num_pages = res.total_num_pages;
      relation_types = res.relation_types;
      username = password;
      page_index = res.browsing_history;
      document.getElementById("messages").innerHTML =
      "Still login";
      update_new_page();
    } else {
      active = false;
      total_num_pages = -1;
      relation_types = [];
      username = null;
      page_index = -1;
      document.getElementById("messages").innerHTML =
      "Has logged out";
      update_new_page();
    }
  // console.log(relation_types);
  // console.log(username);
  
  
}

function generateRandomColorRgb() {
  const red = Math.floor(Math.random() * 200 + 32);
  const green = Math.floor(Math.random() * 200 + 32);
  const blue = Math.floor(Math.random() * 200 + 32);
  return "rgb(" + red + ", " + green + ", " + blue + ")";
}

async function update_new_page() {
  if (active == false){
    document.getElementById("pubmedid").innerHTML = "";
    // document.getElementById("pubmed_text").innerHTML = "Title: " + title + "<br>Abstract:<br>  " + abstract;
    document.getElementById("pubmed_text").innerHTML = "";
    document.getElementById("entity_info").innerHTML = "";
    update_annotation_buttons();
    return;
  }
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   // body: JSON.stringify({"username": username, "page_number": page_index})
  // };
  const response = await fetch('/newpage?page_index=' + page_index + '&username=' + username);
  const input_data = await response.json();
  // fetch('/newpage?page_num=' + page_index + '&username=' + username).then(response => {
  //   let input_data = response.json();
  // });

  pid = input_data.pid;
  title = input_data.title;
  abstract = input_data.abstract;
  // for (var i = 0; i < input_data.entities.length; i++)
  
  entities_info = input_data.entities_info;
  entities = Object.keys(entities_info);
  label_list = input_data.relations;
  if (label_list.length == 0) {
    label_list.push({"type":"", "subj":"", "obj":""});
  }
  completevalue = input_data.complete;
  //console.log(completevalue)
  // console.log(entities.length);
  document.getElementById("messages").innerHTML =
    "Page " + (page_index + 1);
  
  entity_colors = {};
  color_pool_key = Object.keys(color_pool);
  for (var i = 0; i < entities.length; i++){
    //entity_colors[entities[i]] = Math.floor(Math.random()*16777215).toString(16);
    if (color_pool_key.length > 0){
      select_color_id = Math.floor(Math.random() * color_pool_key.length);
      entity_colors[entities[i]] = color_pool[color_pool_key[select_color_id]];
      color_pool_key.splice(select_color_id, 1);
    } else{
      entity_colors[entities[i]] = generateRandomColorRgb();
    }
  }
  
  var entities_info_str = "";
  var entity_span_to_id = [];
  for (var i = 0; i < entities.length; i++){
    var ent_info_list = entities_info[entities[i]];
    var ent_offset_str = "";
    for (var j = 0; j < ent_info_list.length; j++){
      ent_offset_str += ent_info_list[j][0] + "-" + ent_info_list[j][1] + " ";
      entity_span_to_id.push([ent_info_list[j][0], ent_info_list[j][1], entities[i], ent_info_list[0][3]]);
    }
    entities_info_str +=  '<span style="background-color:' + entity_colors[entities[i]] +';"> &nbsp;&nbsp;&nbsp; </span>'  + entities[i] + ' ' + ent_info_list[0][3] + '<br>';
    //                    " | mention = " + ent_info_list[0][2] +  " | offset = " + ent_offset_str + 
  }
  // console.log(entity_span_to_id);
  entity_span_to_id.sort(function(a,b){return - a[0] + b[0]});
  // console.log(entity_span_to_id);
  

  
  let text = title  + abstract;
  for (var i = 0; i < entity_span_to_id.length; i++){
    let start = entity_span_to_id[i][0];
    let end = entity_span_to_id[i][1];
    let entity_id = entity_span_to_id[i][2];
    let entity_type = entity_span_to_id[i][3];
    text = text.slice(0, start) + '<span class="concept"> <span class="mention ' 
       + entity_id + '", style="background-color:' + entity_colors[entity_id] +';">' 
       + text.slice(start, end) + '</span> <span class="label">' + entity_id + '<br>' 
       + entity_type + '</span></span>' + text.slice(end);
    // console.log(text.slice(end));
    // console.log(text.slice(start, end));
  }
  // console.log(text);
  document.getElementById("pubmedid").innerHTML = "PID: " + pid;
  // document.getElementById("pubmed_text").innerHTML = "Title: " + title + "<br>Abstract:<br>  " + abstract;
  document.getElementById("pubmed_text").innerHTML = text;
  document.getElementById("entity_info").innerHTML = entities_info_str;
  
  
  update_annotation_buttons();
}

function changeLabel(slot) {
  if (active == false){
    return;
  }
  // console.log(slot);
  slot_type = slot.id.slice(0, 2);
  label_index = parseInt(slot.id.slice(2));

  // console.log(slot_type);
  // console.log(label_index);
  // console.log(slot[slot.selectedIndex].text);
  if (slot_type == "e1") {
    //label_list[label_index][0] = slot[slot.selectedIndex].text;
    label_list[label_index].subj = slot[slot.selectedIndex].text;
    // console.log("update e1");
  } else if (slot_type == "e2") {
    // label_list[label_index][1] = slot[slot.selectedIndex].text;
    label_list[label_index].obj = slot[slot.selectedIndex].text;
    // console.log("update e2");
  } else {
    // label_list[label_index][2] = slot[slot.selectedIndex].text;
    label_list[label_index].type = slot[slot.selectedIndex].text;
    // console.log("update re");
  }
}

function DeleteLabel(slot){
  if (active == false){
    return;
  }
  label_index = parseInt(slot.id.slice(2));
  //label_list.splice(label_index, 1);
  label_list.splice(label_index, 1);
  update_annotation_buttons();
}

function update_annotation_buttons() {
  if (active == false){
    document.getElementById("options").innerHTML = "";
    document.getElementById("completediv").innerHTML = "";
    return;
  }

  let appended_options = "";
  for (var i = 0; i < label_list.length; i++) {
    let entity1options = "<option value='0'></option>";
    
    for (var j = 0; j < entities.length; j++) {
      let default_selection = "";
      if (entities[j] == label_list[i].subj) {
        default_selection = "' selected = 'selected'";
      }
      entity1options +=
        "<option value='entity" +
        j +
        default_selection +
        "'>" +
        entities[j] +
        "</option>";
    }

    let entity2options = "<option value='0'></option>";
    for (var j = 0; j < entities.length; j++) {
      let default_selection = "";
      if (entities[j] == label_list[i].obj) {
        default_selection = "' selected = 'selected'";
      }
      entity2options +=
        "<option value='entity" +
        j +
        default_selection +
        "'>" +
        entities[j] +
        "</option>";
    }

    let relationoptions = "<option value='0'></option>";
    for (var j = 0; j < relation_types.length; j++) {
      let default_selection = "";
      if (relation_types[j] == label_list[i].type) {
        default_selection = "' selected = 'selected'";
      }
      relationoptions +=
        "<option value='relation" +
        j +
        default_selection +
        "'>" +
        relation_types[j] +
        "</option>";
    }

    let e1options =
      'E1:<select id="e1' +
      i +
      '" onchange=changeLabel(e1' +
      i +
      ")>" +
      entity1options +
      "</select>";

    let e2options =
      ' E2:<select id="e2' +
      i +
      '" onchange=changeLabel(e2' +
      i +
      ")>" +
      entity2options +
      "</select>";

    let reloptions =
      ' Relation label:<select class="relation", id="re' +
      i +
      '" onchange=changeLabel(re' +
      i +
      ")>" +
      relationoptions +
      "</select>";

      let deletebutton = '<input type="button" , id="dl' + i + '", value="-" onclick="DeleteLabel(dl' + i+ ')" />'
      
    appended_options =
      appended_options + e1options + e2options + reloptions + deletebutton +"<br>";
  }

  
  // console.log(appended_options);
  document.getElementById("options").innerHTML = appended_options;

  let complete_string = "Status:<select id='complete' onchange='completeLabel(complete)'>";
  if (completevalue == true){
    complete_string = complete_string +  
    "<option value=true selected = 'selected'>Complete</option><option value=false>Not yet</option>";
  } else {
    complete_string = complete_string + 
    "<option value=true>Complete</option><option value=false selected = 'selected'>Not yet</option>";
  }
  complete_string += "</select>";
  document.getElementById("completediv").innerHTML = complete_string;
}

function previousPage() {
  if (active == false){
    return;
  }
  page_index--;
  if (page_index < 0) {
    document.getElementById("messages").innerHTML =
      "Already the first page!";
    page_index = 0;
    return null;
  } else {
    update_new_page();
  }
}

function nextPage() {
  if (active == false){
    return;
  }
  page_index++;
  if (page_index >= total_num_pages) {
    document.getElementById("messages").innerHTML =
      "Already the last page.";
    page_index = total_num_pages - 1;
    return null;
  } else {
    update_new_page();
  }
}

function gotoPage() {
  if (active == false){
    return;
  }
  pagenumber = document.getElementById("inputpage").value;
  // if (pagenumber == null) {
  //   return null;
  // }
  let page_index_ = parseInt(pagenumber);
  if (isNaN(page_index_)) {
    document.getElementById("messages").innerHTML =
      "Please input an integer";
    return null;
  } else {
    page_index = page_index_ - 1;
  }
  if (page_index >= total_num_pages) {
    page_index = total_num_pages - 1;
  } else if (page_index <= 0) {
    page_index = 0;
  }
  update_new_page();
}

function add_label() {
  if (active == false){
    return;
  }
  label_list.push({"type":"", "subj":"", "obj":""});
  update_annotation_buttons();
}

async function save_label() {
  if (active == false){
    return;
  }
  // console.log(label_list);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"username": username, "page_index": page_index, "relations": label_list})
  };
  const response = await fetch('/save', options);
  const res = await response.json();
  if (res.status == 'success'){
    document.getElementById("messages").innerHTML = "Saved! Now safe to move to another page.";
  } else {
    document.getElementById("messages").innerHTML = "Failed to save. Please try to save again.";
  }
  update_new_page();

}

async function completeLabel(slot) {
  if (active == false){
    return;
  }
  // console.log(slot[slot.selectedIndex].value);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"username": username, "page_index": page_index, "complete": slot[slot.selectedIndex].value})
  };
  const response = await fetch('/complete', options);
  const res = await response.json();
  if (res.status == 'success'){
    document.getElementById("messages").innerHTML = "status changed!";
  } else {
    document.getElementById("messages").innerHTML = "Failed to save status, try again";
  }
  update_new_page();
}