/* jshint browser: true, jquery: true */

'use strict'

$(document).ready(function() {
  $('#newContactForm').hide();
  $('#addContact').click(function() {
     $('#newContactForm').show();
  });
});

var FIREBASE_URL   = 'https//address-book-application.firebaseio.com',
    fb             = new Firebase(mainUrl),
    usersFbUrl;

///starts the login in piece
if (fb.getAuth()) {
  $('.login').remove();
  $('.app').toggleClass('hidden');

  usersFbUrl = FIREBASE_URL + '/users/' + fb.getAuth().uid + '/data';

    // load user's contacts from the firebase database
  $.get(usersFbUrl + '/.json', function(res){
  if(data !== null) {
    Object.keys(res).forEach(function(uuid) {
      addRowToTable(uuid, res[uuid]);
    });
   }
 });
}

$('.login input[type="button"]').click(function () {
  var $loginForm = $('.loginForm'),
      email      = $loginForm.find('[type="email"]').val(),
      pass       = $loginForm.find('[type="password"]').val(),
      data       = {email: email, password: pass};

  registerAndLogin(data, function (err, auth) {
    if (err) {
      $('.error').text(err);
    } else {
      location.reload(true);
    }
  });
});

$('.login form').submit(function(event){
  var $loginForm = $(event.target),
      email      = $loginForm.find('[type="email"]').val(),
      pass       = $loginForm.find('[type="password"]').val(),
      data       = {email: email, password: pass};

  event.preventDefault();

  fb.authWithPassword(data, function(err, auth) {
    if (err) {
      $('.error').text(err);
    } else {
      location.reload(true);
    }
  });
});

$('.logout').click(function (){
  fb.unauth();
  location.reload(true);
});

function registerAndLogin(obj, cb) {
  fb.createUser(obj, function(err) {
    if (!err) {
      fb.authWithPassword(obj, function (err, auth){
        if (!err) {
          cb(null, auth);
        } else {
          cb(err);
        }
      });
    } else {
      cb(err);
    }
  });
}


$.get(usersFbUrl + 'contactList/.json', function(res){
  Object.keys(res).forEach(function(uuid){
    addRowToTable(uuid,res[uuid]);
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
  $.post(usersFbUrl + 'contactList/.json', data, function(res){
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
  var url = usersFbUrl + uuid + '.json';
  $.ajax(url, {type: 'DELETE'});
});

