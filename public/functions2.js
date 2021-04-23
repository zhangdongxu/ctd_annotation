var username = null;
var page_index = -1;
var total_num_pages = -1;
var active = false;
var pid;
var title = "";
var abstract = "";
var entities = [];
var entities_info = [];
var label_list = [["", "", ""]];
var relation_types = [];
var completevalue;


function newSession() {
 document.getElementById("login").innerHTML = '<input type="text", id="password", placeholder="Enter the code" /> <input type="button" , value="Login" onclick="userLogin()" />';
}

async function userLogin() {
  let password = document.getElementById("password").value;
  console.log(password);
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
  console.log(res);
  if (res.status == true){
      active = true;
      total_num_pages = res.total_num_pages;
      relation_types = res.relation_types;
      username = password;
      page_index = res.browse_history;
      document.getElementById("messages").innerHTML =
      "Login successfully! Welcome!";
      update_new_page();
    } else {
      document.getElementById("messages").innerHTML =
      "Invalid code. Please try again";
    }
  console.log(relation_types);
  console.log(username);
  
  
}

async function update_new_page() {
  if (active == false){
    return;
  }
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   // body: JSON.stringify({"username": username, "page_number": page_index})
  // };
  const response = await fetch('/newpage?page_num=' + page_index + '&username=' + username);
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
  label_list = input_data.labels;
  completevalue = input_data.complete;
  console.log(entities.length);
  document.getElementById("messages").innerHTML =
    "Page " + (page_index + 1);
  
  var entities_info_str = "";
  for (var i = 0; i < entities.length; i++){
    var ent_info_list = entities_info[entities[i]];
    var ent_offset_str = "";
    for (var j = 0; j < ent_info_list.length; j++){
      ent_offset_str += ent_info_list[j][0] + "-" + ent_info_list[j][0] + " ";
    }
    entities_info_str += entities[i] + ": type = " + ent_info_list[0][3] + 
                        " | mention = " + ent_info_list[0][2] + "<br> "; // " | offset = " + ent_offset_str
  }
  document.getElementById("pubmedid").innerHTML = "PID: " + pid;
  document.getElementById("pubmed_text").innerHTML = "Title: " + title + "<br>Abstract:<br>  " + abstract;
  document.getElementById("entity_info").innerHTML = entities_info_str;
  
  
  update_annotation_buttons();
}

function changeLabel(slot) {
  if (active == false){
    return;
  }
  console.log(slot);
  slot_type = slot.id.slice(0, 2);
  label_index = parseInt(slot.id.slice(2));

  console.log(slot_type);
  console.log(label_index);
  console.log(slot[slot.selectedIndex].text);
  if (slot_type == "e1") {
    //label_list[label_index][0] = slot[slot.selectedIndex].text;
    label_list[label_index][0] = slot[slot.selectedIndex].text;
    console.log("update e1");
  } else if (slot_type == "e2") {
    // label_list[label_index][1] = slot[slot.selectedIndex].text;
    label_list[label_index][1] = slot[slot.selectedIndex].text;
    console.log("update e2");
  } else {
    // label_list[label_index][2] = slot[slot.selectedIndex].text;
    label_list[label_index][2] = slot[slot.selectedIndex].text;
    console.log("update re");
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
    return;
  }

  let appended_options = "";
  for (var i = 0; i < label_list.length; i++) {
    let entity1options = "<option value='0'></option>";
    
    for (var j = 0; j < entities.length; j++) {
      let default_selection = "";
      if (entities[j] == label_list[i][0]) {
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
      if (entities[j] == label_list[i][1]) {
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
      if (relation_types[j] == label_list[i][2]) {
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

  
  console.log(appended_options);
  document.getElementById("options").innerHTML = appended_options;

  let complete_string = "Status:<select id='complete' onchange='completeLabel(complete)'>";
  if (completevalue == 'true'){
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
  label_list.push(["", "", ""]);
  update_annotation_buttons();
}

async function save_label() {
  if (active == false){
    return;
  }
  console.log(label_list);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"username": username, "page_index": page_index, "labels": label_list})
  };
  const response = await fetch('/save', options);
  const res = await response.json();
  if (res.status == 'success'){
    document.getElementById("messages").innerHTML = "Saved! Now safe to move to another page.";
  } else {
    document.getElementById("messages").innerHTML = "Failed to save. Please try to save again.";
  }

}

async function completeLabel(slot) {
  if (active == false){
    return;
  }
  console.log(slot[slot.selectedIndex].value);
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