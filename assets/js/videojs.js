/**
 * Created by cimacastdev on 3/20/17.
 */

(function () {

    /* crea la variable head que trae el HEAD del DOM */
    var head = document.getElementsByTagName('head')[0];

    //<link href="http://vjs.zencdn.net/5.18.4/video-js.css" rel="stylesheet">


    /* Adiciona los css de videoJs al HEAD del documento */
    var cssvideojs = document.createElement('link');
    cssvideojs.rel = 'stylesheet';
    cssvideojs.href = './bower_components/video.js/dist/video-js.css';
    head.appendChild(cssvideojs);

    var cssvideojsads = document.createElement('link');
    cssvideojsads.rel = 'stylesheet';
    cssvideojsads.href = './bower_components/videojs-contrib-ads/src/videojs.ads.css';
    head.appendChild(cssvideojsads);

    var cssvideojsima = document.createElement('link');
    cssvideojsima.rel = 'stylesheet';
    cssvideojsima.href = './bower_components/videojs-ima/src/videojs.ima.css';
    head.appendChild(cssvideojsima);

    /* Adiciona los js de videoJs al HEAD del documento */
    var jsvideojs = document.createElement('script');
    jsvideojs.type = 'text/javascript';
    jsvideojs.src = './bower_components/video.js/dist/video.js';
    //jsvideojs.src = location.protocol + //vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js';
    document.body.appendChild(jsvideojs);

    var ima3 = document.createElement('script');
    ima3.type = 'text/javascript';
    ima3.src = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
    document.body.appendChild(ima3);

    var jsvideojsads = document.createElement('script');
    jsvideojsads.type = 'text/javascript';
    jsvideojsads.src = './bower_components/videojs-contrib-ads/src/videojs.ads.js';
    document.body.appendChild(jsvideojsads);

    var jsvideojsima = document.createElement('script');
    jsvideojsima.type = 'text/javascript';
    jsvideojsima.src = './bower_components/videojs-ima/src/videojs.ima.js';
    document.body.appendChild(jsvideojsima);


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

                console.log(data);

                videojsPlayer("video-" + data.video.token, data.urlAds, data.video.video);


            }
        } ;

        http_req.open("GET", url, true);
        http_req.send();
        
    }
    
    function videojsPlayer(id, adsUrl, videoUrl ) {

        var cimaPlayer = videojs(id);

        cimaPlayer.src(videoUrl);

        var options = {
            id: id,
            adTagUrl: 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&' +
        'iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&' +
        'impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&' +
        'cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&' +
        'vid=short_onecue&correlator='
        };


        // This must be called before player.play() below.
        cimaPlayer.ima(options);
        cimaPlayer.ima.requestAds();
        // On mobile devices, you must call initializeAdDisplayContainer as the result
        // of a user action (e.g. button click). If you do not make this call, the SDK
        // will make it for you, but not as the result of a user action. For more info
        // see our examples, all of which are set up to work on mobile devices.
        // player.ima.initializeAdDisplayContainer();

        // This must be called after player.ima(...) above.
        cimaPlayer.play();

    }

})();