var input_data = external_data;
      var page_index = -1;
      var num_labels = 0;
      var pid = "";
      var label_list = [["", "", ""]];

      //   function loadData() {
      //     fetch("./data.json")
      //       .then(function (res) {
      //         return res.json();
      //       })
      //       .then(function (data) {
      //         for (var i = 0; i < data.length; i++) {
      //           input_data.push(data[i]);
      //         }
      //       });
      //   }

      function update_new_page() {
        document.getElementById("messages").innerHTML =
          "Page " + (page_index + 1);
        pid = input_data[page_index]["pid"];
        document.getElementById("pubmedid").innerHTML = "PID: " + pid;
        let abstract = input_data[page_index]["text"];
        document.getElementById("pubmed_text").innerHTML = abstract;
        
        label_list = [["", "", ""]];
        update_annotation_buttons();
      }

      function changeLabel(slot) {
        console.log(slot);
        slot_type = slot.id.slice(0, 2);
        label_index = parseInt(slot.id.slice(2));

        console.log(slot_type);
        console.log(label_index);
        console.log(slot[slot.selectedIndex].text);
        if (slot_type == "e1") {
          label_list[label_index][0] = slot[slot.selectedIndex].text;
          console.log("update e1");
        } else if (slot_type == "e2") {
          label_list[label_index][1] = slot[slot.selectedIndex].text;
          console.log("update e2");
        } else {
          label_list[label_index][2] = slot[slot.selectedIndex].text;
          console.log("update re");
        }
      }

      function DeleteLabel(slot){
        label_index = parseInt(slot.id.slice(2));
        label_list.splice(label_index, 1);
        update_annotation_buttons();
      }

      function update_annotation_buttons() {
        
        let entities_current_page = input_data[page_index]["entities"];
        let relation_types = [
          "chem_gene:effect",
          "chem_disease:effect",
          "gene_disease:effect",
        ];

        let appended_options = "";
        for (var i = 0; i < label_list.length; i++) {
          let entity1options = "<option value='0'></option>";
          for (var j = 0; j < entities_current_page.length; j++) {
            let default_selection = "";
            if (entities_current_page[j] == label_list[i][0]) {
              default_selection = "' selected = 'selected'";
            }
            entity1options +=
              "<option value='entity" +
              j +
              default_selection +
              "'>" +
              entities_current_page[j] +
              "</option>";
          }

          let entity2options = "<option value='0'></option>";
          for (var j = 0; j < entities_current_page.length; j++) {
            let default_selection = "";
            if (entities_current_page[j] == label_list[i][1]) {
              default_selection = "' selected = 'selected'";
            }
            entity2options +=
              "<option value='entity" +
              j +
              default_selection +
              "'>" +
              entities_current_page[j] +
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
        num_labels++;
      }

      function previousPage() {
        page_index--;
        if (page_index < 0) {
          document.getElementById("messages").innerHTML =
            "Already the first page!";
          page_index = 0;
          return null;
        } else {
          num_labels = 0;
          update_new_page();
        }
      }

      function nextPage() {
        page_index++;
        if (page_index >= input_data.length) {
          document.getElementById("messages").innerHTML =
            "Already the last page.";
          page_index = input_data.length - 1;
          return null;
        } else {
          num_labels = 0;
          update_new_page();
        }
      }

      function gotoPage() {
        pagenumber = document.getElementById("inputpage").value;
        // if (pagenumber == null) {
        //   return null;
        // }
        let page_index_ = parseInt(pagenumber);
        if (isNaN(page_index_)) {
          document.getElementById("messages").innerHTML =
            "Please input an integer";
          page_index = input_data.length - 1;
          return null;
        } else {
          page_index = page_index_ - 1;
          num_labels = 0;
        }
        if (page_index >= input_data.length) {
          page_index = input_data.length - 1;
        } else if (page_index <= 0) {
          page_index = 0;
        }
        update_new_page();
      }

      function add_label() {
        label_list.push(["", "", ""]);
        update_annotation_buttons();
      }

      function save_label() {
        console.log(label_list);
        var textFile = null;
        var data = new Blob([label_list], { type: "application/json" });
        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
        }
        window.URL.createObjectURL(data).href;
      }