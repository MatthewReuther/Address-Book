'use strict'

$(document).ready(function() {
  $('#newContactForm').hide();
  $('#addContact').click(function() {
     $('#newContactForm').show();
  });
});

$.get('https://address-book-application.firebaseio.com/contactList.json', function(res){
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
  var url = 'https://address-book-application.firebaseio.com/contactList.json';
  var data = JSON.stringify({name: contactName, phone: contactPhone, email: contactEmail, twitter: contactTwitter, photoUrl: contactPhoto});
  $.post(url, data, function(res){
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
  var url = 'https://address-book-application.firebaseio.com/contactList/' + uuid + '.json';
  $.ajax(url, {type: 'DELETE'});
});

