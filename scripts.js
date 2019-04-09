// Scripts
//This is the  script that will process saving the user edits, it goes in the head
function saveEdits()
{
  // get the editable elements
  //var editElem1 = document.getElementById("main_header");
  //var editElem2 = document.getElementsByClassName('edit_section');

  // get the edited element content
  //var userVersion1 = editElem1.innerHTML;
  //var userVersion2 = editElem2.innerHTML;

  // save the content to local storage
  //localStorage.userEdits = userVersion1;
  //localStorage.userEdits = userVersion2;

  // Make the content uneditable again
  document.getElementById("main_header").contentEditable = "false";
  document.getElementById("main_header_section").contentEditable = "false";
  var editable_sections = document.getElementsByClassName('edit_section');
  for (var i=0; i<editable_sections.length; i++)
  {
    editable_sections[i].contentEditable = "false";
  }

  // Update the contents list
  var ol = document.getElementById("content_list");
  var list_items = ol.getElementsByTagName("li");
  var text_to_change = ol.getElementsByTagName("a");
  var number_lis = list_items.length;
  var section_header;
  var index;
  for (i=0; i<number_lis; i++)
  {
    index = 'section_header'.concat(i+1);
    section_header = document.getElementById(index).innerHTML;
    text_to_change[i].innerHTML = section_header;
  }

  // Send the updated sections to the server
  var index = 0, updated_sections, xmlhttp, page = "";
  var section_text = "", section_title = "";
  var list_of_sections = document.getElementsByClassName("edit_section");
  var num_of_sections = (list_of_sections.length)/2;
  var page_title = document.getElementById("main_header").innerHTML;
  var page_information = document.getElementById("main_header_section").innerHTML;
  page +=
    `{
        page_title: ${page_title},
        page_information: ${page_information},
        sections:[`;
  for (var i=0; i<num_of_sections; i++)
  {
    index = i+1;
    section_title = document.getElementById('section_header'.concat(index)).innerHTML;
    section_text = document.getElementById('p'.concat(index)).innerHTML;
    page +=
          `{"index":${index},"section_title":${section_title},"section_text":${section_text}}`;
    if (index<num_of_sections)
    {
      page += `,`;
    }
  }
  page += `]}`;
  updated_sections = JSON.stringify(page);
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    /*if (this.readyState == 4 && this.status == 200)
    {

    }*/
  };
  xmlhttp.open("POST", "page_test.JSON", true);
  xmlhttp.setRequestHeader("update_sections", "update");
  xmlhttp.send(updated_sections);

  // Show the user a confirmation for 3 seconds
  document.getElementById("update").innerHTML="Changes saved!";
  window.setTimeout(function()
  {
       // This will execute 5 seconds later
       var label = document.getElementById('update');
       if (label != null)
       {
           label.style.display = 'none';
       }
   }, 3000);

  // Hide the Save button
  document.getElementById("save_button").style.display = "none";

  // Hide the Delete button
  document.getElementById("remove_section_button").style.display = "none";
}

// This is the script to make the header editable
function editHeader()
{
    // Change the attribute of the header to be editable
    document.getElementById("main_header").contentEditable = "true";
    // Change the attribute of the header section to be editable
    document.getElementById("main_header_section").contentEditable = "true";

    // Show the Save button
    document.getElementById("save_button").style.display = "block";
    // Show the Save message
    document.getElementById("update").innerHTML="- This text will be updated when the submit button is hit to show confirmation.";
    document.getElementById("update").style.display = "block";
}

// This is the script to make the section of the article editable
function editSection(index)
{
    // Change the attribute of the section header to be editable
    var section_header_index = 'section_header'.concat(index);
    var edit_section_header = document.getElementById(section_header_index);
    edit_section_header.contentEditable = "true";

    // Change the attribute of the section to be editable
    var section_index = 'p'.concat(index);
    var edit_section = document.getElementById(section_index);
    edit_section.contentEditable = "true";

    // Show the Save button
    document.getElementById("save_button").style.display = "inline-block";
    // Show the Save message
    document.getElementById("update").style.display = "inline-block";

    // Show the Delete Section button
    document.getElementById("remove_section_button").style.display = "inline-block";
    // Set the Delete button to delete the section where the edit button was clicked
    // Change onclick to delete_section(index)
    var remove_button = document.getElementById("remove_section_button");
    var index_section_to_delete = 'delete_section('.concat(index,')');
    remove_button.setAttribute("onclick", index_section_to_delete);
}

// user_role checks what the user is: an admin_exec, a member, or anonymous
function permissions(user_role)
{
  switch(user_role)
  {
    case "user_admin_exec":
      //show edit buttons
      var admin_exec = document.getElementsByClassName('user_admin_exec');

      for (var i=0; i<admin_exec.length; i++)
      {
        admin_exec[i].style.display = "inline-block";
      }
      break;

    case "user_member":
      //show edit buttons
      var members = document.getElementsByClassName('user_member');

      for (var i=0; i<members.length; i++)
      {
        members[i].style.display = "inline-block";
      }
      break;

    default:
      // Hide edit buttons
      var members = document.getElementsByClassName('user_member');
      var admin_exec = document.getElementsByClassName('user_admin_exec');

      for (var i=0; i<members.length; i++)
      {
        members[i].style.display = "none";
      }
      for (var i=0; i<admin_exec.length; i++)
      {
        admin_exec[i].style.display = "none";
      }

      // Hide the update button
      document.getElementById("update").style.display = "none";
      document.getElementById("save_button").style.display = "none";

      // Make the content uneditable
      document.getElementById("main_header").contentEditable = "false";
      document.getElementById("main_header_section").contentEditable = "false";
      var editable_sections = document.getElementsByClassName('edit_section');
      for (var i=0; i<editable_sections.length; i++)
      {
        editable_sections[i].contentEditable = "false";
      }
  }
}

// Creates a new section header and section under the last section.
function create_new_section()
{
  // Get the number of sections currently in the contents
  var ol = document.getElementById("content_list");
  var index_number = ol.getElementsByTagName("li").length +1;

  // Create the section header
  var new_header = document.createElement("header");
  var index_header = 'header'.concat(index_number);
  new_header.setAttribute("id", index_header);

  var new_h2 = document.createElement("h2");
  var index_section_header = 'section_header'.concat(index_number);
  new_h2.setAttribute("id", index_section_header);
  new_h2.setAttribute("class", 'edit_section');
  new_h2.innerHTML = "Section Header";

  // Create the edit button
  var new_input_button = document.createElement("input");
  var index_edit = 'edit_button'.concat(index_number);
  new_input_button.setAttribute("id", index_edit);
  new_input_button.setAttribute("class", 'edit_button user_member user_admin_exec');
  new_input_button.setAttribute("type", 'button');
  new_input_button.setAttribute("value", 'edit');
  var edit_section_index = 'editSection('.concat(index_number,')');
  new_input_button.setAttribute("onclick", edit_section_index);
  new_input_button.style.display = "inline-block";

  // Create the div that will hold the paragraph
  var new_div = document.createElement("div");
  var index_div = 'div'.concat(index_number);
  new_div.setAttribute("id", index_div);

  // Create the paragraph
  var new_para = document.createElement("p");
  var index_p = 'p'.concat(index_number);
  new_para.setAttribute("id", index_p);
  new_para.setAttribute("class", 'edit_section');
  new_para.innerHTML = "New Section Content";

  // Connect the new section pieces
  new_header.appendChild(new_h2);
  new_header.appendChild(new_input_button);
  new_div.appendChild(new_para);

  // Create new contents bullet point
  var new_contents_li = document.createElement("li");
  var index_li = 'contents_li'.concat(index_number);
  new_contents_li.setAttribute("id", index_li);
  var new_contents_span = document.createElement("span");
  var index_span = 'contents_span'.concat(index_number);
  new_contents_span.setAttribute("id", index_span);
  var new_contents_a = document.createElement("a");
  var index_a = 'contents_href'.concat(index_number);
  new_contents_a.setAttribute("id", index_a);
  new_contents_a.innerHTML = new_h2.innerHTML;
  var index_href = '#section_header'.concat(index_number);
  new_contents_a.setAttribute("href", index_href);

  // Connect the new contents pieces
  new_contents_li.appendChild(new_contents_span);
  new_contents_span.appendChild(new_contents_a);

  // element.insertBefore(what_to_insert, element_to_insert_before)
  // Insert the new section at the end of the last section
  var element = document.getElementById("main_content");
  element.appendChild(new_header);
  element.appendChild(new_div);

  // Insert the new contents pieces at the end of the last bullet point
  var contents_element = document.getElementById("content_list");
  contents_element.appendChild(new_contents_li);
}

function delete_section(index_number)
{
  // Confirm with the user whether they want to delete the section
  if(window.confirm("Are you sure you wish to delete this section?"))
  {
    // Get the total number of sections
    var list_of_sections = document.getElementsByClassName("edit_section");
    var num_of_sections = (list_of_sections.length)/2;

    // Delete the edit button
    var section_edit_button_index = 'edit_button'.concat(index_number);
    var edit_button_to_delete = document.getElementById(section_edit_button_index);
    edit_button_to_delete.parentNode.removeChild(edit_button_to_delete);

    // Delete the h2 tag
    var section_header_text_index = 'section_header'.concat(index_number);
    var section_header_to_delete = document.getElementById(section_header_text_index);
    section_header_to_delete.parentNode.removeChild(section_header_to_delete);

    // Delete the section header
    var section_header_index = 'header'.concat(index_number);
    var header_to_delete = document.getElementById(section_header_index);
    header_to_delete.parentNode.removeChild(header_to_delete);

    // Delete the paragraph
    var section_para_index = 'p'.concat(index_number);
    var para_to_delete = document.getElementById(section_para_index);
    para_to_delete.parentNode.removeChild(para_to_delete);

    // Delete the divider
    var section_div_index = 'div'.concat(index_number);
    var div_to_delete = document.getElementById(section_div_index);
    div_to_delete.parentNode.removeChild(div_to_delete);

    // Delete the contents text
    var contents_href_index = 'contents_href'.concat(index_number);
    var contents_href_to_delete = document.getElementById(contents_href_index);
    contents_href_to_delete.parentNode.removeChild(contents_href_to_delete);

    // Delete the contents span
    var contents_span_index = 'contents_span'.concat(index_number);
    var contents_span_to_delete = document.getElementById(contents_span_index);
    contents_span_to_delete.parentNode.removeChild(contents_span_to_delete);

    // Delete the contents li
    var contents_li_index = 'contents_li'.concat(index_number);
    var contents_li_to_delete = document.getElementById(contents_li_index);
    contents_li_to_delete.parentNode.removeChild(contents_li_to_delete);

    // Hide the Delete button
    document.getElementById("remove_section_button").style.display = "none";

    // Renumber the sections after the deleted one
    var j, header, section_header, edit_button, div, p;
    var new_header_index, new_section_header_index, new_edit_button_index;
    var old_header_index, old_section_header_index, old_edit_button_index;
    var new_edit_button_onclick_index, new_div_index, new_p_index;
    var old_edit_button_onclick_index, old_div_index, old_p_index;
    var contents_li, contents_span, contents_href;
    var new_contents_li_index, new_contents_span_index, new_contents_href_index;
    var old_contents_li_index, old_contents_span_index, old_contents_href_index;

    for (var i=index_number; i<num_of_sections; i++)
    {
      j = i+1;
      old_header_index = 'header'.concat(j);
      new_header_index = 'header'.concat(i);
      document.getElementById(old_header_index).setAttribute("id", new_header_index);

      old_section_header_index = 'section_header'.concat(j);
      new_section_header_index = 'section_header'.concat(i);
      document.getElementById(old_section_header_index).setAttribute("id", new_section_header_index);

      old_edit_button_onclick_index = 'edit_button'.concat(j);
      new_edit_button_onclick_index = 'editSection('.concat(i,')');
      document.getElementById(old_edit_button_onclick_index).setAttribute("onclick", new_edit_button_onclick_index);

      old_edit_button_index = 'edit_button'.concat(j);
      new_edit_button_index = 'edit_button'.concat(i);
      document.getElementById(old_edit_button_index).setAttribute("id", new_edit_button_index);

      old_div_index = 'div'.concat(j);
      new_div_index = 'div'.concat(i);
      document.getElementById(old_div_index).setAttribute("id", new_div_index);

      old_p_index = 'p'.concat(j);
      new_p_index = 'p'.concat(i);
      document.getElementById(old_p_index).setAttribute("id", new_p_index);

      old_contents_li_index = 'contents_li'.concat(j);
      new_contents_li_index = 'contents_li'.concat(i);
      document.getElementById(old_contents_li_index).setAttribute("id", new_contents_li_index);

      old_contents_span_index = 'contents_span'.concat(j);
      new_contents_span_index = 'contents_span'.concat(i);
      document.getElementById(old_contents_span_index).setAttribute("id", new_contents_span_index);

      old_contents_href_index = 'contents_href'.concat(j);
      new_contents_href_index = 'contents_href'.concat(i);
      document.getElementById(old_contents_href_index).setAttribute("id", new_contents_href_index);

    }
  }
  else
  {
    return;
  }
}

/*function load_page()
{
    var index, section_title, section_header_text, section_text, contents_info = "", section_info = "", i;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
      if (this.readyState == 4 && this.status == 200)
      {
        var page_info = JSON.parse(this.responseText);
        for (i in page_info.sections)
        {
          index = page_info.sections[i].index;
          section_title = page_info.sections[i].section_title;
          section_text = page_info.sections[i].section_text;
          contents_info +=
            `<li id="contents_li${index}">
              <span id="contents_span${index}">
                <a id="contents_href${index}}" href="#section_header${index}">${section_title}</a>
              </span>
            </li>`;
          section_info +=
            `<header id="header${index}">
              <h2 id="section_header${index}" class="edit_section">${section_title}</h2>
              <input id="edit_button${index}" class="edit_button user_member user_admin_exec" type="button" value="edit" onclick="editSection(${index})" style="display:none;"/>
            </header>
            <div id="div${index}">
              <p id="p${index}" class="edit_section">${section_text}</p>
            </div>`;
          document.getElementById("content_list").innerHTML = contents_info;
          document.getElementById("main_content").innerHTML = section_info;
        }
      }
    };
    xmlhttp.open("GET", "page_test.JSON", true);
    xmlhttp.send();
}*/
