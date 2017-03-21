/**
 * Created by cimacastdev on 3/20/17.
 */

(function () {

    /* crea la variable head que trae el HEAD del DOM */
    var head = document.getElementsByTagName('head')[0];

    //<link href="http://vjs.zencdn.net/5.18.4/video-js.css" rel="stylesheet">


    /* Adiciona el css de videoJs al HEAD del documento */
    var cssvideojs = document.createElement('link');
    cssvideojs.rel = 'stylesheet';
    cssvideojs.href = './bower_components/video.js/dist/video-js.css';
    head.appendChild(cssvideojs);

    var jsvideojs = document.createElement('script');
    jsvideojs.type = 'text/javascript';
    jsvideojs.src = './bower_components/video.js/dist/video.js';
    //jsvideojs.src = location.protocol + //vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js';
    head.appendChild(jsvideojs);


    var videos = document.getElementsByClassName("video-cimacast");

    for (var i = 0; i < videos.length; i++) {

        //if (videos[i].classList.contains("create"))
        //    return false;
        //else {
            videos[i].classList.add("create");

            var container = videos[i];
            var id_elem = container.id;
            var id_player = 'player_' + id_elem;
            var id_iframe = 'iframe_' + id_elem;

            videoAuthorized(container.id);
            //loadJSON(id_elem, id_player, id_iframe);
        //}
    }


    /**
     * Verifica si el video está autorizado y trae los datos del video
     * 
     * 
     * @param video_id
     */
    function videoAuthorized(video_id) {

        console.log(document.domain);

        var url = "http://localhost:8000/video-data/" + video_id + '?domain=' + document.domain;

        var http_req = new XMLHttpRequest();

        http_req.onreadystatechange = function () {
            if(http_req.readyState == 4) {
                var data = JSON.parse(http_req.responseText);
                var _container = document.getElementById(video_id);

                if (data.unknow) {
                    _container.innerHTML = data.html;
                    return 0;
                }

                else if (data.video) {
                    var pixelTracking = document.createElement("img");
                    pixelTracking.setAttribute("src", "http://localhost:8000/video-print/" + video_id + "?vid=" + data.video + "&ccid=" + data.ccid + "&pid=" + data.pid + "&domain=" + document.domain);
                    pixelTracking.style.display = 'none';
                    _container.appendChild(pixelTracking);

                    /* Crea un div para insertar la etiqueta video */
                    var _player = document.createElement("div");
                    _player.className = "container-player";
                    _player.style.width = "100%";
                    _player.style.maxWidth = data.width + "px";
                    _player.style.Margin = "0 auto";

                    /* Inserta la etiqueta video */
                    var _video = document.createElement("video");
                    _video.id = "video-" + video_id;
                    _video.className = "video-js vjs-fluid";
                    _video.setAttribute('data-setup', '{"controls": true}');

                    _player.appendChild(_video);
                    _container.appendChild(_player);


                    /* Traemos los datos del video */
                    var url = 'http://localhost:8000/app_dev.php/video-js/' + data.video + '?pvidt=' + id_elem + '&h=' + data.height + '&w=' + data.width + '&ccid=' + data.ccid + '&pid=' + data.pid + '&adv=' + data.advertiser + '&qty=' + data.qty + '&domain=' + document.domain + '?v2';


                    video_request.open("GET", url, true);
                    video_request.send();

                }
            }
        };

        var video_request = new XMLHttpRequest();

        video_request.onreadystatechange = function () {

            if(video_request.readyState == 4 ) {
                var data = JSON.parse(video_request.responseText);
                var video = document.getElementsByName("video");

                console.log(data);
                console.log(video);

                var cimaPlayer = videojs("video-" + data.video.token);

                cimaPlayer.src(data.video.video);

                cimaPlayer.ready(function() {
                    var lengthOfVideo = cimaPlayer.duration();
                });
            }
        } ;

        http_req.open("GET", url, true);
        http_req.send();
        
    }
    
    function videojsPlayer(video_id) {

        var cimaPlayer = videojs(video_id);

    }

})();