/* jshint browser: true, jquery: true */

'use strict'

var FIREBASE_URL   = 'https//address-book-application.firebaseio.com',
    fb             = new Firebase(FIREBASE_URL),
    usersFbUrl;

///starts the login in piece
if (fb.getAuth()) {
  $('.login').remove();
  $('.app').toggleClass('hidden');

  usersFbUrl = FIREBASE_URL + '/users/' + fb.getAuth().uid + '/data';

    // load user's contacts from the firebase database
  $.get(usersFbUrl + '/.json', function(res){
    Object.keys(res).forEach(function(uuid) {
      addRowToTable(uuid, res[uuid]);
    });
  });
}

// click login buttoni
$('body').on('click', '.loginBtn', function(event) {
  event.preventDefault();

  var email = $('#logInEmail').val();
  var password = $('#password').val();

//authenticate email and password
  fb.authWithPassword({email: email, password: password}, function(err, auth) {
    if (err) {
      $('.error').text(err);
    } else {
      location.reload(true);
    }
  });
});

// click register button
$('.registerBtn').on('click', function(event) {
  event.preventDefault();

  var email = $('#logInEmail').val();
  var password = $('#password').val();

//create new user with email and password
fb.createUser({email: email, password: password}, function(err, auth){
    if(!err){
      //log in
      fb.authWithPassword({email: email, password: password}, function(err, auth){
          location.reload(true);
      });
    } else {
      alert("User already exists");
      location.reload(true);
    }
  });

});


// click logout button
$('.logout').on('click', function() {
  console.log("clicked logout button");
  // execute unauth
  fb.unauth();
  //refresh the page
  location.reload(true);
});



//////////////////////////////////////////////////////
/////////Logic for contact form and address book////
/////////////////////////////////////////////////////

$(document).ready(function() {
  $('#newContactForm').hide();
  $('#addContact').click(function() {
     $('#newContactForm').show();
  });
});


 // when submit btn is clicked on Contact Form
$('#submitNewContact').on('click', function(event){
  event.preventDefault();

  // hide the contact Form container when submit is clicked
  $('.newContactForm').toggle();

  // collect the form data into variables
  var contactName = $('#name').val();
  var contactPhone = $('#phone').val();
  var contactEmail = $('#email').val();
  var contactTwitter = $('#twitter').val();
  var contactPhoto = $('#photoUrl').val();

  // clear user input on form
  $('#name').val('');
  $('#phone').val('');
  $('#email').val('');
  $('#twitter').val('');
  $('#photoUrl').val('');

  // make table row for contact list
  var $tr = $('<tr><td><img src="'+ contactPhoto + '"/></td><td>' + contactName + '</td><td>' + contactPhone + '</td><td>'+ contactEmail +'</td><td>'+ contactTwitter +'</td><td><button class="removeBtn">Remove</button><td></tr>');

  // post form data to firebase url
  var data = JSON.stringify({name: contactName, phone: contactPhone, email: contactEmail, twitter: contactTwitter, photoUrl: contactPhoto});
  $.post(usersFbUrl + '/.json', data, function(res){
    // add firebase uuid as attribute to table row
    $tr.attr('data-uuid', res.name);
    $('tbody').append($tr);
  });

});

//for get call adds row to table for each object it calls
function addRowToTable(uuid, obj){
  var $tr = $('<tr><td><img src="'+ obj.photoUrl + '"></td><td>' + obj.name + '</td><td>' + obj.phone + '</td><td>'+ obj.email + '</td><td>' + obj.twitter + '</td><td><button class="removeBtn">Remove</button><td></tr>');
  $tr.attr('data-uuid', uuid);
  $('tbody').append($tr);
}

// remove btn on table row
$('tbody').on('click', '.removeBtn', function(evt){
  // remove from table
  var $tr = $(evt.target).closest('tr');
  $tr.remove();

 // remove from firebase
  var uuid = $tr.data('uuid');
  var url = usersFbUrl + '/' + uuid + '.json';
  $.ajax(url, {type: 'DELETE'});
});

