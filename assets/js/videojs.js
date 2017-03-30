/**
 * Created by cimacastdev on 3/20/17.
 */

(function () {

    var base_url = 'http://dev-cimahub.cmcst.4cloud.co';

    /* crea la variable head que trae el HEAD del DOM */
    var head = document.getElementsByTagName('head')[0];

    //<link href="http://vjs.zencdn.net/5.18.4/video-js.css" rel="stylesheet">


    /* Adiciona los css de videoJs al HEAD del documento */
    var cssvideojs = document.createElement('link');
    cssvideojs.rel = 'stylesheet';
    //cssvideojs.href = './node_modules/video.js/dist/video-js.css';
    cssvideojs.href = '//vjs.zencdn.net/5.19.0/video-js.css';
    head.appendChild(cssvideojs);

    var cssvideojsads = document.createElement('link');
    cssvideojsads.rel = 'stylesheet';
    cssvideojsads.href = './node_modules/videojs-contrib-ads/src/videojs.ads.css';
    head.appendChild(cssvideojsads);

    var cssvideojsima = document.createElement('link');
    cssvideojsima.rel = 'stylesheet';
    cssvideojsima.href = './node_modules/videojs-ima/src/videojs.ima.css';
    head.appendChild(cssvideojsima);

    /* Adiciona los js de videoJs al HEAD del documento */
    var jsvideojs = document.createElement('script');
    jsvideojs.type = 'text/javascript';
    //jsvideojs.src = './node_modules/video.js/dist/video.js';
    jsvideojs.src =  'http://vjs.zencdn.net/5.19.0/video.js';
    document.body.appendChild(jsvideojs);


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

        var url = base_url + "/app_dev.php/video-data/" + video_id + '?domain=' + document.domain;
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


                    var ima3 = document.createElement('script');
                    ima3.type = 'text/javascript';
                    ima3.src = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
                    document.body.appendChild(ima3);

                    var jsvideojsads = document.createElement('script');
                    jsvideojsads.type = 'text/javascript';
                    jsvideojsads.src = './node_modules/videojs-contrib-ads/src/videojs.ads.js';
                    document.body.appendChild(jsvideojsads);

                    var jsvideojsima = document.createElement('script');
                    jsvideojsima.type = 'text/javascript';
                    jsvideojsima.src = './node_modules/videojs-ima/src/videojs.ima.js';
                    document.body.appendChild(jsvideojsima);


                    var pixelTracking = document.createElement("img");
                    pixelTracking.setAttribute("src", base_url + "/app_dev.php/video-print/" + video_id + "?vid=" + data.video + "&ccid=" + data.ccid + "&pid=" + data.pid + "&domain=" + document.domain);
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
                    _video.className = "video-js vjs-fluid vjs-default-skin";
                   // _video.setAttribute('data-setup', '{"controls": true}');
                    _video.setAttribute('preload', 'auto');
                    _video.setAttribute('controls', '');

                    _player.appendChild(_video);
                    _container.appendChild(_player);


                    /* Trae los datos del video */
                    var url = base_url + '/app_dev.php/video-js/' + data.video + '?pvidt=' + id_elem + '&h=' + data.height + '&w=' + data.width + '&ccid=' + data.ccid + '&pid=' + data.pid + '&adv=' + data.advertiser + '&qty=' + data.qty + '&domain=' + document.domain + '?v2';


                    video_request.open("GET", url, true);
                    video_request.send();

                }
            }
        };

        var video_request = new XMLHttpRequest();

        video_request.onreadystatechange = function () {

            if(video_request.readyState == 4 ) {




                var data = JSON.parse(video_request.responseText);


                var _video_player  = document.getElementsByTagName('video');

                _video_player[0].setAttribute("src", data.video);
                _video_player[0].setAttribute("type", "video/mp4");


                //videojsPlayerAds(data);

                var player = videojs(_video_player[0].id);

                var options = {
                    id: _video_player[0].id,
                    adTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=400x300|640x480&iu=/62207337/CIMAPLAY/pulzo_demo&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]'

//        adTagUrl: '{{ urlAds }}'
                };


                player.ima(options);


                console.log(_video_player[0].id + '_html5_api');

                // Remove controls from the player on iPad to stop native controls from stealing
                // our click
                var contentPlayer =  document.getElementById(_video_player[0].id + '_html5_api');

                if ((navigator.userAgent.match(/iPad/i) ||
                    navigator.userAgent.match(/Android/i)) &&
                    contentPlayer.hasAttribute('controls')) {
                    contentPlayer.removeAttribute('controls');
                }

                // Initialize the ad container when the video player is clicked, but only the
                // first time it's clicked.
                var startEvent = 'click';
                if (navigator.userAgent.match(/iPhone/i) ||
                    navigator.userAgent.match(/iPad/i) ||
                    navigator.userAgent.match(/Android/i)) {
                    startEvent = 'touchend';
                }

                player.one(startEvent, function() {
                    player.ima.initializeAdDisplayContainer();
                    player.ima.requestAds();
                    player.play();
                });


            }
        } ;

        http_req.open("GET", url, true);
        http_req.send();
        
    }

/*
    function videojsPlayerAds(data ) {


        console.log(data.token);

        var _player_id = "video-" + data.token;

        var player = videojs(_player_id);

        console.log(_player_id);

        var options = {
            id: _player_id,
            adTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=400x300|640x480&iu=/62207337/CIMAPLAY/pulzo_demo&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]'

//        adTagUrl: '{{ urlAds }}'
        };

        player.ima(options);

        // Remove controls from the player on iPad to stop native controls from stealing
        // our click
        var contentPlayer =  document.getElementById('content_video_html5_api');

        if ((navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/Android/i)) &&
            contentPlayer.hasAttribute('controls')) {
            contentPlayer.removeAttribute('controls');
        }

        // Initialize the ad container when the video player is clicked, but only the
        // first time it's clicked.
        var startEvent = 'click';
        if (navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/Android/i)) {
            startEvent = 'touchend';
        }

        player.one(startEvent, function() {
            player.ima.initializeAdDisplayContainer();
            player.ima.requestAds();
            player.play();
        });


    }
*/

})();