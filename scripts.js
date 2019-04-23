// Scripts
//This is the  script that will process saving the user edits, it goes in the head
function saveEdits()
{
  // Make the content uneditable again
  document.getElementById("main_header").contentEditable = "false";
  document.getElementById("main_header_section").contentEditable = "false";
  document.getElementById("team").contentEditable = "false";
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
  var current_location = window.location.search;
  var split_string = current_location.split("&");
  var split_id = split_string[0].split("=");
  var id = split_id[1].split("=");

  var index = 0, updated_sections, xmlhttp, page = "";
  var section_text = "", section_title = "";
  var list_of_sections = document.getElementsByClassName("edit_section");
  var num_of_sections = (list_of_sections.length)/2;
  var page_title = document.getElementById("main_header").innerHTML;
  var page_information = document.getElementById("main_header_section").innerHTML;
  var team = document.getElementById("team").innerHTML;
  page +=
    `{
        "page_id": ${id},
        "page_title": "${page_title}",
        "page_description": "${page_information}",
        "team":"${team}",
        "sections":[`;
  for (var i=0; i<num_of_sections; i++)
  {
    index = i+1;
    section_title = document.getElementById('section_header'.concat(index)).innerHTML;
    section_text = document.getElementById('p'.concat(index)).innerHTML;
    if (document.getElementById('image_uploader'.concat(index)).value.length <1)
    {
      if (document.getElementById('img'.concat(index)).src == null)
      {
        image_url = 'poop';
      }
      else
      {
        image_url = document.getElementById('img'.concat(index)).src;
      }
    }
    else
    {
      image_url = document.getElementById('image_uploader'.concat(index)).value;
    }
    document.getElementById('image_uploader'.concat(index)).style.display = "none";
    document.getElementById('submit_image'.concat(index)).style.display = "none";
    page +=
          `
          {
            "index":${index},
            "section_title":"${section_title}",
            "section_text":"${section_text}",
            "pic_loc":"${image_url}"
          }`;
    if (index<num_of_sections)
    {
      page += `,`;
    }
  }
  page += `]}`;

  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      // Show confirmation of some sort
      var confirmation = JSON.parse(this.responseText);
      if (confirmation.state == "1")
      {
        //window.alert("Changes Saved!");
      }
      else
      {
        //window.alert("Error. Please Try Again!");
      }
    }
  };
  xmlhttp.open("POST", "edit_page.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(page);

  // Show the user a confirmation for 3 seconds
  document.getElementById("update").innerHTML="Changes saved!";
  window.setTimeout(function()
  {
       // This will execute 5 seconds later
       var label = document.getElementById('update');
       if (label != null)
       {
           label.style.display = 'none';
           // Reload the page
           window.location.reload();
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
    document.getElementById("update").style.display = "block";
}

// This is the script to make the header editable
function edit_team()
{
    // Change the attribute of the header to be editable
    document.getElementById("team").contentEditable = "true";

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

    // Show the image upload button
    var upload_image_index = 'upload_image'.concat(index);
    document.getElementById(upload_image_index).style.display = "inline-block";

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

// Helper function to add_image()
function show_upload_button(index)
{
  var image_uploader_index = 'image_uploader'.concat(index);
  document.getElementById(image_uploader_index).style.display = "inline-block";
  var upload_image_index = 'upload_image'.concat(index);
  document.getElementById(upload_image_index).style.display = "none";
  var submit_image_index = 'submit_image'.concat(index);
  document.getElementById(submit_image_index).style.display = "inline-block";
}

// user_role checks what the user is: an admin_exec, a member, or anonymous
function permissions(user_role, page_approval)
{
  debugger;
  switch(user_role)
  {
    case 4:
      //show edit buttons
      var admin_exec = document.getElementsByClassName('user_admin_exec');

      for (var i=0; i<admin_exec.length; i++)
      {
        admin_exec[i].style.display = "inline-block";
      }
      // Hide page creation and approval buttons
      switch(page_approval)
      {

        case "0":
        case "1":
          document.getElementById("approve_page_public").style.display = "none";
          document.getElementById("approve_page_members").style.display = "none";
          document.getElementById("delete_page").style.display = "inline-block";
          break;
        case "2":
          document.getElementById("approve_page_public").style.display = "inline-block";
          document.getElementById("approve_page_members").style.display = "inline-block";
          document.getElementById("delete_page").style.display = "inline-block";
          break;
        case null:
          break;
        default:
          document.getElementById("approve_page_public").style.display = "none";
          document.getElementById("approve_page_members").style.display = "none";
          document.getElementById("delete_page").style.display = "none";
          break;
      }
      break;

    case 2:
    case 3:
      //show edit buttons
      var members = document.getElementsByClassName('user_member');

      for (var i=0; i<members.length; i++)
      {
        members[i].style.display = "inline-block";
      }
      // Hide page creation and approval buttons
      switch(page_approval)
      {
        case "0":
        case "1":
          document.getElementById("approve_page_public").style.display = "none";
          document.getElementById("approve_page_members").style.display = "none";
          document.getElementById("delete_page").style.display = "none";
          break;
        case "2":
          document.getElementById("delete_page").style.display = "none";
          document.getElementById("approve_page_public").style.display = "none";
          document.getElementById("approve_page_members").style.display = "none";
          break;
        case null:
          break;
        default:
          document.getElementById("approve_page_public").style.display = "none";
          document.getElementById("approve_page_members").style.display = "none";
          document.getElementById("delete_page").style.display = "none";
          break;
      }
      break;

    default:
      if (window.location == "https://www.yeetdog.com/Yeetipedia/user.html")
      {
        document.getElementById("admin_request").style.display = "none";
        document.getElementById("create_new_page").style.display = "none";
      }
      switch(page_approval)
      {
        case null:
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
          // Hide page creation and approval buttons
          document.getElementById("approve_page_public").style.display = "none";
          document.getElementById("approve_page_members").style.display = "none";
          document.getElementById("delete_page").style.display = "none";
          break;
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

  // Create the div that will hold pictures
  var new_image_div = document.createElement("div");
  var index_image_div = 'image_div'.concat(index_number);
  new_image_div.setAttribute("id", index_image_div);

  // Create the img tag
  var new_img = document.createElement("img");
  var index_img = 'img'.concat(index_number);
  new_img.setAttribute("id", index_img);
  new_img.setAttribute("url", 'null');
  new_img.style.display = "none";

  // Create the image input tag
  var new_image_input = document.createElement("input");
  var index_image_input = 'image_uploader'.concat(index_number);
  new_image_input.setAttribute("id", index_image_input);
  new_image_input.setAttribute("type", 'url');
  new_image_input.setAttribute("placeholder", 'URL of your image here');
  new_image_input.style.display = "none";

  // Create the image upload button
  var new_image_upload = document.createElement("button");
  var index_image_upload = 'upload_image'.concat(index_number);
  var onclick_function = 'show_upload_button('.concat(index_number,')');
  new_image_upload.setAttribute("id", index_image_upload);
  new_image_upload.setAttribute("type", 'button');
  new_image_upload.setAttribute("onclick", onclick_function);
  new_image_upload.style.display = "none";
  new_image_upload.innerHTML = "Insert Image";

  // Create the image submit button
  var new_image_submit = document.createElement("button");
  var index_image_submit = 'submit_image'.concat(index_number);
  new_image_submit.setAttribute("id", index_image_submit);
  new_image_submit.setAttribute("type", 'button');
  new_image_submit.setAttribute("onclick", 'saveEdits()');
  new_image_submit.style.display = "none";
  new_image_submit.innerHTML = "Submit Image";

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
  new_image_div.appendChild(new_img);
  new_image_div.appendChild(new_image_input);
  new_image_div.appendChild(new_image_upload);
  new_image_div.appendChild(new_image_submit);
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
  element.appendChild(new_image_div);
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

    // Delete img tag
    var section_img_index = 'img'.concat(index_number);
    var section_img_to_delete = document.getElementById(section_img_index);
    section_img_to_delete.parentNode.removeChild(section_img_to_delete);

    // Delete the input tag
    var section_input_index = 'image_uploader'.concat(index_number);
    var section_input_to_delete = document.getElementById(section_input_index);
    section_input_to_delete.parentNode.removeChild(section_input_to_delete);

    // Delete the upload button
    var section_upload_index = 'upload_image'.concat(index_number);
    var section_upload_to_delete = document.getElementById(section_upload_index);
    section_upload_to_delete.parentNode.removeChild(section_upload_to_delete);

    // Delete the submit button
    var section_submit_index = 'submit_image'.concat(index_number);
    var section_submit_to_delete = document.getElementById(section_submit_index);
    section_submit_to_delete.parentNode.removeChild(section_submit_to_delete);

    // Delete the image div
    var section_image_div_index = 'image_div'.concat(index_number);
    var section_image_div_to_delete = document.getElementById(section_image_div_index);
    section_image_div_to_delete.parentNode.removeChild(section_image_div_to_delete);

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
    var old_image_div_index, new_image_div_index, old_img_index, new_img_index;
    var old_img_input_index, new_img_input_index, old_img_upload_button_index;
    var new_img_upload_button_index, old_img_submit_button_index, new_img_submit_button_index;

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

      old_image_div_index = 'image_div'.concat(j);
      new_image_div_index = 'image_div'.concat(i);
      document.getElementById(old_image_div_index).setAttribute("id", new_image_div_index);

      old_img_index = 'img'.concat(j);
      new_img_index = 'img'.concat(i);
      document.getElementById(old_img_index).setAttribute("id", new_img_index);

      old_img_input_index = 'image_uploader'.concat(j);
      new_img_input_index = 'image_uploader'.concat(i);
      document.getElementById(old_img_input_index).setAttribute("id", new_img_input_index);

      old_img_upload_button_index = 'upload_image'.concat(j);
      new_img_upload_button_index = 'upload_image'.concat(i);
      document.getElementById(old_img_upload_button_index).setAttribute("id", new_img_upload_button_index);

      old_img_submit_button_index = 'submit_image'.concat(j);
      new_img_submit_button_index = 'submit_image'.concat(i);
      document.getElementById(old_img_submit_button_index).setAttribute("id", new_img_submit_button_index);

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

//Takes the login information and sends it to the php login file
function login()
{
  var test_username = document.getElementById("nm").value;
  var test_password = document.getElementById("pw").value;
	var login = `{"username" : "${test_username}", "password" : "${test_password}"}`;

	xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      var confirmation = JSON.parse(this.responseText);
	     // Do something here.
      if (confirmation.state == "1")
      {
        if (confirmation.access == "4")
        {
          window.location.assign("https://www.yeetdog.com/Yeetipedia/admin.html");
        }
        else
        {
          window.location.assign("https://www.yeetdog.com/Yeetipedia/user.html");
        }
      }
      else
      {
        window.alert("Username/Password Incorrect");
      }
    }
  };
  xmlhttp.open("POST", "login.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(login);
}

// Takes the signup info and sends it to the php file.
function signup()
{
  var test_username = document.getElementById("nm").value;
  var test_password = document.getElementById("pw").value;
  var test_password_confirm = document.getElementById("pwc").value;
	var signup = `{"username" : "${test_username}", "password" : "${test_password}", "password_confirm" : "${test_password_confirm}"}`;

	xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      var confirmation = JSON.parse(this.responseText);
	     // Do something here.
      if (confirmation.state == "1")
      {
        window.location.assign("https://www.yeetdog.com/Yeetipedia/login.html");
      }
      else if (confirmation.state == "Failure, Name Taken")
      {
        window.alert("Username Taken");
      }
      else
      {
        window.alert("Passwords Do Not Match");
      }
    }
  };
  xmlhttp.open("POST", "signup.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(signup);
}

// Search function on the contents page
function search()
{
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("table_body");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++)
  {
    td = tr[i].getElementsByTagName("td")[0];
    if (td)
    {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1)
      {
        tr[i].style.display = "";
      }
      else
      {
        tr[i].style.display = "none";
      }
    }
  }
}

// Gathers all information on this page for storage in the database
function create_new_page()
{
  //var format = '{"create_page" : "create"}';
  //var create = JSON.stringify(format);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      // Show confirmation of some sort
      var confirmation = JSON.parse(this.responseText);

      if (confirmation.state == "1")
      {
        var id = confirmation.page_id;
        var page_access = confirmation.access;
        var new_url = `https://www.yeetdog.com/Yeetipedia/wiki_page.html?id=${id}&access=${page_access}`;
        //window.alert("Page Created!")
        window.location.assign(new_url);
      }
      else
      {
        //window.alert("Error. Please Try Again!");
      }
    }
  };
  xmlhttp.open("POST", "new_page.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send();
}

// Sends an approval to the server for this page
function approve_page(access_level)
{
  var access_num;
  switch(access_level)
  {
    case "public":
      access_num = 0;
      break;
    case "members":
      access_num = 1;
      break;
    default:
      acess_num = 2;
      break;
  }

  var current_location = window.location.search;
  var split_string = current_location.split("&");
  var split_id = split_string[0].split("=");
  var id = split_id[1].split("=");

  // Send a page id and the new access level
  var update_access = `{"page_id" : ${id}, "access" : ${access_num}}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      // Show confirmation of some sort
      var confirmation = JSON.parse(this.responseText);
      if (confirmation.state == "1")
      {
        //window.alert("Page Approved!");
        var new_page_url = `https://www.yeetdog.com/Yeetipedia/wiki_page.html?id=${id}&access=${access_num}`;
        window.location.assign(new_page_url);
      }
      else
      {
        //window.alert("Error. Please Try Again!");
      }
    }
  };
  xmlhttp.open("POST", "approve_page.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(update_access);
}

// Changes the users rank
function change_user_rank()
{
  // Get user name from the input field
  // Get user rank to change to from the filter field
  // Send the name and new rank to the server
  var member_id = document.getElementById("change_specific_user_rank").value;
  var new_access_level = document.getElementById("select_rank").value;
  var change_message = `{"member_name":"${member_id}","access":${new_access_level}}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      // Show confirmation of some sort
      var confirmation = JSON.parse(this.responseText);
      if (confirmation.state == "1")
      {
        //window.alert("User Rank Changed!")
        window.location.reload();
      }
      else
      {
        //window.alert("Error. Please Try Again!")
      }
    }
  };
  xmlhttp.open("POST", "approve_member.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(change_message);
}

// Adds an image to the page in a certain section
function add_image()
{

}


// Delete the page from the database
function delete_page()
{
  if(window.confirm("Are you sure you wish to delete this page?"))
  {
    var current_location = window.location.search;
    var split_string = current_location.split("&");
    var split_id = split_string[0].split("=");
    var id = split_id[1].split("=");

    var page_to_delete = `{"id":${id}}`;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
      if (this.readyState == 4 && this.status == 200)
      {
        // Show confirmation of some sort
        var confirmation = JSON.parse(this.responseText);
        if (confirmation.state == "1")
        {
          //window.alert("Page Deleted!");
          window.location.assign("https://www.yeetdog.com/Yeetipedia/admin.html");
        }
        else
        {
          //window.alert("Error. Please Try Again!");
        }
      }
    };
    xmlhttp.open("POST", "delete_page.php", true);
    xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    xmlhttp.send(page_to_delete);
  }
  else
  {
    return;
  }
}

// A user can Request to become a member
function request_membership()
{
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      // Show confirmation of some sort
      var confirmation = JSON.parse(this.responseText);
      if (confirmation.state == "1")
      {
        //window.alert("You Have Applied to Become a Member!");
      }
      else if (confirmation.state == "2")
      {
        //window.alert("You Are Not Logged In!");
      }
      else if (confirmation.state == "4")
      {
        //window.alert("You Are Already a Member!");
      }
      else
      {
        //window.alert("Error. Please Try Again!");
      }
    }
  };
  xmlhttp.open("POST", "apply_member.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send();
}

// A user can request to become an admin
function request_admin()
{
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      // Show confirmation of some sort
      var confirmation = JSON.parse(this.responseText);
      if (confirmation.state == "1")
      {
        //window.alert("Applied to Become a Admin!");
      }
      else if (confirmation.state == "2")
      {
        //window.alert("You Are Not Logged In!");
      }
      else if (confirmation.state == "4")
      {
        //window.alert("You Are Already a Admin!");
      }
      else
      {
        //window.alert("Error. Please Try Again!");
      }
    }
  };
  xmlhttp.open("POST", "apply_admin.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send();
}

function logged_in(is_wiki_page)
{

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      // Show confirmation of some sort
      var page = JSON.parse(this.responseText);
      if (is_wiki_page == false)
      {
        debugger;
        if (page.logged_in == true)
        {
          // Replace the "Yeet In" button with "Your Profile"
          document.getElementById("login_button").innerHTML = "Profile";
          // Replace the "href" tag to go to the user/admin page
          if (page.access == 4)
          {
            document.getElementById("login_button").href = "admin.html";
            if (window.location == "https://www.yeetdog.com/Yeetipedia/user.html")
            {
              document.getElementById("admin_request").style.display = "inline-block";
              document.getElementById("create_new_page").style.display = "inline-block";
            }
          }
          else if (page.access == 2||page.access == 3)
          {
            if (window.location == "https://www.yeetdog.com/Yeetipedia/user.html")
            {
              document.getElementById("member_request").style.display = "none";
              document.getElementById("admin_request").style.display = "inline-block";
              document.getElementById("create_new_page").style.display = "inline-block";
            }
            document.getElementById("login_button").href = "user.html";
          }
          else
          {
            document.getElementById("login_button").href = "user.html";
          }
          // Replace the "Become a Yeeter" button with "Yeet Out"
          document.getElementById("signup_button").innerHTML = "Yeet Out";
          // Replace the href to go to the login page
          //document.getElementById("signup_button").href = "login.html";
          // Add a event handler function "logout" to the "Yeet Out" button
          document.getElementById("signup_button").addEventListener("click",
            function (event)
            {
              event.preventDefault();
              logout();
            }, false);
          //permissions(page.access, null);
        }
        else
        {
          // Replace the "Your Profile" button with "Yeet In"
          // Replace the "Yeet Out" button with "Become a Yeeter"
          //window.alert("Error. You are not logged in!");
        }
      }
      else if (is_wiki_page == true)
      {
        if (page.logged_in == true)
        {
          // Replace the "Yeet In" button with "Your Profile"
          document.getElementById("login_button").innerHTML = "Profile";
          // Replace the "href" tag to go to the user/admin page
          if (page.access == 4)
          {
            document.getElementById("login_button").href = "admin.html";
          }
          else
          {
            document.getElementById("login_button").href = "user.html";
          }
          // Replace the "Become a Yeeter" button with "Yeet Out"
          document.getElementById("signup_button").innerHTML = "Yeet Out";
          // Replace the href to go to the login page
          //document.getElementById("signup_button").href = "login.html";
          // Add a event handler function "logout" to the "Yeet Out" button
          document.getElementById("signup_button").addEventListener("click",
            function (event)
            {
              event.preventDefault();
              logout();
            }, false);
          // Get the page approval
          if (window.location.search == undefined)
          {
            permissions(page.access, null);
          }
          else
          {
            var current_location = window.location.search;
      			var split_string = current_location.split("&");
      			var split_access = split_string[1].split("=");
      			var page_approval = split_access[1];
            permissions(page.access, page_approval);
          }

        }
        else
        {
          // Replace the "Your Profile" button with "Yeet In"
          // Replace the "Yeet Out" button with "Become a Yeeter"
          permissions(0, null);
        }
      }
    }
  };
  xmlhttp.open("POST", "session.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send();
}

function logout()
{
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      // Show confirmation of some sort
      var confirmation = JSON.parse(this.responseText);
      if (confirmation.state == 1)
      {
        // Replace the href to the signup page
        //document.getElementById("signup_button").href = "signup.html";
        // Replace the "Yeet Out" button with "Become a Yeeter"
        document.getElementById("signup_button").innerHTML = "Become a Yeeter";
        // Replace the "Your Profile" button with "Yeet In"
        document.getElementById("login_button").innerHTML = "Yeet In";
        // Replace the "login_button" href back to the login page
        document.getElementById("login_button").href = "login.html";
        //window.alert("You have successfully logged out");
        // Remove the eventlistener
        document.getElementById("signup_button").removeEventListener("click",
          function (event)
          {
            event.preventDefault();
            logout();
          }, false);
        window.location.assign("https://www.yeetdog.com/Yeetipedia/login.html");
      }
      else
      {
        //window.alert("Whoops, something went wrong. Please try to logout again.")
      }
    }
  };
  xmlhttp.open("POST", "logout.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send();
}
