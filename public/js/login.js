function initLogin(){
  $('.panel-newchar').slideUp();
  $('.panel-newgame').slideUp();

  $('#chartabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  });

  $.post("/api/acct",{},
  function(data, status){
      if(data != "Failure"){
        loguserin();
        $('#login-form input').val(data).change();
      }else {
        loguserout();
      }
  });
}

var login = angular.module('login', []);
login.controller('mainController',function($scope, $http) {
    $scope.formData = {};
    // when submitting the add form, send the text to the node API
    $scope.login = function() {
        $http.post('/api/acct', $scope.formData)
            .then(function(response) {
                if(response.data === 'Success')
                  loguserin();
                else
                  console.log(response.data);
            })
            .catch(function(response) {
              console.error('Error', response.status, response.data);
            });
    };
    $scope.logout = function() {
        $http.post('/api/acct', {logout:true})
            .then(function(response) {
                loguserout();
                $('#login-form input').val('').change();
            })
            .catch(function(response) {
              console.error('Error', response.status, response.data);
            });
    };
});

function loguserin(){
  $('#login-form').hide();
  $('#logged-form').show();
  $('.logged').slideDown();
  initChar();
  initGames();
}

function loguserout(){
  $('#logged-form').hide();
  $('.logged').slideUp();
  $('#login-form').show();
}
