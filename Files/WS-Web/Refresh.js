setInterval(function () {
    var str1 = "http://" + window.location.hostname + ":" + window.location.port + "/iframe/";
    $("#refresh").load(str1);
}, 500);