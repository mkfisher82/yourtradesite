(function() {
    var publishButton = document.querySelector(".btn-publish");

    var pathArray = window.location.pathname.split('/');
    var id = pathArray[pathArray.length-1];

    console.log(id);

    document.addEventListener('DOMContentLoaded', function() {
        console.log("Ready for action")
    }, false);

    function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };
      xmlhttp.open(method, url, true);
      xmlhttp.send();
    }


    publishButton.addEventListener('click', function() {
        ajaxRequest('GET','/publish/' + id, function() {
            console.log('Done');
        });
    }, false);

})();
