
$(document).ready(function() {

  $('#newContactForm').hide();
  $('#addContact').click(function() {
     $('#newContactForm').show();
  });
});

var FIREBASE_URL= 'https://address-book-application.firebaseio.com';

$.get(FIREBASE_URL , function (res) {
  Object.keys(res).forEach(function (uuid) {
    addRowToTable(uuid, res[uuid]);
  });
});


var firstName = $('#firstName').val()
var lastName = $('#lastName').val()
var phoneNumber = $('#phoneNumber').val()
var eMail  = $('#eMail').val()
var twitter = $('#twitter').val()
var photoUrl = $('#photoUrl').val()



var data = JSON.stringify({Name: firstName + ' ' + lastName, Phone: phoneNumber, Email: eMail, Twitter: twitter, Photo: photoUrl});
var url = 'https://c8friendsclass.firebaseio.com/test/friends.json';
  $.post(url, data, function(response){
    $tr.attr('data-uuid', res.name)
    $tbody.append($tr);
});
