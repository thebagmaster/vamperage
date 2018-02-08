// public/js/core.js
jQuery.fn.exists = function(){ return this.length > 0; }


$( document ).ready(function() {
  initLogin();
  createUI();
});

function submitFeedback(){
  var fb = $('#feedback').val();
  $.post("/api/feedback",{text:fb},
  function(data, status){
    if(data == 'success'){
      $('#feedback').val('');
      successmsg('.panel-body:last','Success!','Message Recieved, thank you for the feedback.');
    }
  });
}

function successmsg(parent,title,msg){
  var r='';
  r += '<div class="alert alert-info alert-dismissable">';
  r += '<a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>';
  r += '<strong>'+title+'</strong> '+msg+'</div>';
  $(parent).prepend(r);
  $(".alert").delay(4000).slideUp(200, function() {
    $(this).alert('close');
  });
}

function sortBy(field){
 return function(a, b){(a[field] > b[field]) - (a[field] < b[field])};
}

function sanitizetoid(s){
  s = s.replace(' ','_');
  s = s.replace(',','');
  return s;
}
