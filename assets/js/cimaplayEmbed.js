/**
 * Created by cimacastdev on 3/20/17.
 */
(function () {

    /* crea la variable head que trae el HEAD del DOM */
    var head = document.getElementsByTagName('head')[0];

    /* Adiciona el archivo jwplayer al HEAD del documento */
    var scrjwplayer = document.createElement('script');
    scrjwplayer.type = 'text/javascript';
    scrjwplayer.src = location.protocol + '//w2-dev-2cmp1.cmcst.4cloud.co/assets/jwplayer/jwplayer-7.8.2/jwplayer.js';
    head.appendChild(scrjwplayer);


    function loadJSON(video, player) {

        var geo_data_file = location.protocol + '//freegeoip.net/json/';
        var geo_http_request = new XMLHttpRequest();

        /* Crea el objeto XMLHttpRequest para las peticiones */
        try {
            // Opera 8.0+, Firefox, Chrome, Safari
            geo_http_request = new XMLHttpRequest();
        } catch (e) {
            // Internet Explorer Browsers
            try {
                geo_http_request = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    geo_http_request = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    // Something went wrong
                    alert("Your browser broke!");
                    return false;
                }
            }
        }

        geo_http_request.onreadystatechange = function () {

            if (geo_http_request.readyState == 4) {
                var data = JSON.parse(geo_http_request.responseText);
                var countryCode = data.country_code;

                /* crea la variable head que trae el HEAD del DOM */
                var head = document.getElementsByTagName('head')[0];

                /* Adiciona el Key del player */
                //var jwkey = document.createElement('script');
                //jwkey.type = 'text/javascript';
                //jwkey.text = 'jwplayer.key = "mzqFXqxXUk6JypE7VjMtK/bWFFPLfrELwYWoNg==";';
                //head.appendChild(jwkey);


                /* Envía la peticion al API y si está autorizado devuelve el Id del Video */
                var data_file = location.protocol + '//w2-dev-2cmp1.cmcst.4cloud.co/callback/videos/' + video + '/data/video?domain=' + document.domain + '&countryCode=' + countryCode;

                http_request.open("GET", data_file, true);
                http_request.send();
            }
        };

        var http_request = new XMLHttpRequest();
        try {
            // Opera 8.0+, Firefox, Chrome, Safari
            http_request = new XMLHttpRequest();
        } catch (e) {
            // Internet Explorer Browsers
            try {
                http_request = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    http_request = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    // Something went wrong
                    alert("Your browser broke!");
                    return false;
                }
            }
        }

        http_request.onreadystatechange = function () {

            if (http_request.readyState == 4) {
                // Javascript function JSON.parse to parse JSON data
                var data = JSON.parse(http_request.responseText);
                var _container = document.getElementById(video);

                if (data.unknow) {
                    _container.innerHTML = data.html;
                    return 0;
                }
                else if (data.video) {

                    //w2-dev-2cmp1.cmcst.4cloud.co

                    var url = location.protocol + '//w2-dev-2cmp1.cmcst.4cloud.co/callback/videos/' + data.video + '/player/video';

                    /*hace la consulta para obtener las url */
                    http_request_video.open("GET", url, true);
                    http_request_video.send();

                }
            }
        };

        var http_request_video = new XMLHttpRequest();
        try {
            // Opera 8.0+, Firefox, Chrome, Safari
            http_request_video = new XMLHttpRequest();
        } catch (e) {
            // Internet Explorer Browsers
            try {
                http_request_video = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    http_request_video = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    // Something went wrong
                    alert("Your browser broke!");
                    return false;
                }
            }
        }

        http_request_video.onreadystatechange = function () {

            if (http_request_video.readyState == 4) {
                var data = JSON.parse(http_request_video.responseText);
                var _container = document.getElementById(video);
                var _videoImg = '';

                // render video
                var _player = document.createElement("div");
                _player.className = "container-player";
                _player.style.width = "100%";
                _player.style.maxWidth = data.width + "px";
                _player.style.Margin = "0 auto";

                var _id = document.createElement("div");
                _id.className = player;
                _id.style.position = "relative";
                _id.style.paddingBottom = "56%";
                _id.style.paddingTop = "0";
                _id.style.height = "0";

                _player.appendChild(_id);
                _container.appendChild(_player);

                if(undefined == data.url_image) {
                    _videoImg = 'http://w2-dev-2cmp1.cmcst.4cloud.co/assets/img/pic_default.png';
                } else {
                    _videoImg = 'https://elemental-origin.s3.amazonaws.com/origin/' + data.url_image;
                }

                var playerConfig = {
                    image: _videoImg,
                    width: '100%',
                    aspectratio: '16:9',
                    androidhls: 'true',
                    autostart: false
                };
                playerConfig.logo = {
                    file: 'http://cimacast.s3.amazonaws.com/img/cimacast-logo-player-white.png',
                    position: 'top-left'
                };
                playerConfig.advertising = {
                    client: "googima"
                }



                if(!data.crm) {

                    playerConfig.file = data.archivos.filters.passthrough.endpoint_uri;

                    jwplayer.key = "mzqFXqxXUk6JypE7VjMtK/bWFFPLfrELwYWoNg==";

                    var playerInstance = jwplayer(data.id).setup(playerConfig);
                    // Listeners for JW
                    playerInstance.on('ready', function (event) {sendDataLog('load');});
                    playerInstance.on('complete', function (event) {sendDataLog('complete');});
                    playerInstance.on('play', function (event) {sendDataLog('play');});

                    // Ads

                    if(undefined !== data.monetize) {

                        var _ads = data.monetize.ads;

                        _ads.forEach(function(ads_data){
                            if(ads_data.ad_position == 'pre-roll') {

                                console.log(ads_data);

                                playerInstance.on('beforePlay', function (event) {
                                    playerInstance.playAd(ads_data.ad_tag);
                                });

                            }


                            if(ads_data.ad_position == 'post-roll') {

                                console.log(ads_data);

                                playerInstance.on('beforeComplete', function (event) {
                                    playerInstance.playAd(ads_data.ad_tag);
                                });

                            }

                        })
                    }



                } else if(data.browser.filter !== 'playready') {

                    playerConfig.playlist = [{
                        sources: [{
                            file: data.videoUrl,
                            drm: {
                                widevine: {
                                    url: 'http://widevine.licensekeyserver.com',
                                    customData: 'PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxLZXlPU0F1dGhlbnRpY2F0aW9uWE1MPjxEYXRhPjxXaWRldmluZVBvbGljeSBmbF9DYW5QZXJzaXN0PSJmYWxzZSIgZmxfQ2FuUGxheT0idHJ1ZSIvPjxXaWRldmluZUNvbnRlbnRLZXlTcGVjIFRyYWNrVHlwZT0iSEQiPjxTZWN1cml0eUxldmVsPjE8L1NlY3VyaXR5TGV2ZWw+PC9XaWRldmluZUNvbnRlbnRLZXlTcGVjPjxMaWNlbnNlIHR5cGU9InNpbXBsZSIvPjxHZW5lcmF0aW9uVGltZT4yMDE2LTEyLTIzIDE5OjA5OjU5LjAwMDwvR2VuZXJhdGlvblRpbWU+PEV4cGlyYXRpb25UaW1lPjIwMTctMDEtMDYgMTk6MDk6NTkuMDAwPC9FeHBpcmF0aW9uVGltZT48VW5pcXVlSWQ+NjM3Y2RmODUyYWFiZDc3NjE5M2IwZGM1NzgyNDcxZWU8L1VuaXF1ZUlkPjxSU0FQdWJLZXlJZD4zNWY2ODZiNGI1YTAwZDZiNDIyNzMzZjcwYjkzM2VjZjwvUlNBUHViS2V5SWQ+PC9EYXRhPjxTaWduYXR1cmU+TXFCZ20vU1hxWVBCanQrdnA2RDVZcmFJNytSblZvaGtNTDJRcVl6L2FGZ0EyWXozYk8wTUxndFNpdzA2czVMSmpndFZiQ0pxSE16aGt4aGVpamRGTkgxd0djVEg4cE1ZbW1qcFlSalFZQ0hyU2hrbGVwNkV1c28vMGpNckZac2p3QTJXV3JwcXRRclY4MlhNQmF4RzRRQkFTTGRkN2lVdXdqNU54Sjgwa3VtRzZEQVFpbWl5Yk8wMzVodkM0Wld0TmthRnFBbEJ2S3VMRzlqWWhZbzFneitKYUNscDRUR00rcHRQVWRDYUx6MFowSktraXB0OVllUEU2TEdqYmlpZys3YWxCMEx2VUtFenY5TklLUFlGT2VsWW9oa1IvaUw5Y0YzbDdjUU5pbG11d2ZjakRrMEg3NVlrRTJ1SkdvdzI1Y0paeGYzS2svc284OWpYdFhOZXZRPT08L1NpZ25hdHVyZT48L0tleU9TQXV0aGVudGljYXRpb25YTUw+Cg=='                                }
                            }
                        }]
                    }]


                    jwplayer.key = "mzqFXqxXUk6JypE7VjMtK/bWFFPLfrELwYWoNg==";

                    var playerInstance = jwplayer(data.videoId).setup(playerConfig);
                    // Listeners for JW
                    playerInstance.on('ready', function (event) {sendDataLog('load');});
                    playerInstance.on('complete', function (event) {sendDataLog('complete');});
                    playerInstance.on('play', function (event) {sendDataLog('play');});
                } else {

                    if (isSilverlightInstalled()) {
                        // Append HTML to DOM
                        var playersl = '<div id="mainContainer"><video id="contentElement" muted class="azuremediaplayer amp-default-skin amp-big-play-centered" tabindex="0"></video><div id="adContainer"></div></div>';
                        $('body').append(playersl);
                        //basic setup AMP
                        var myOptions = {
                            "nativeControlsForTouch": false,
                            "logo": {"enabled": false},
                            controls: true,
                            autoplay: false,
                            poster: '',//"{{ _videoImg | raw }}",
                            width: windowcp.w,
                            height: windowcp.h,
                        }
                        //Execute AMP Player
                        function initsl() {
                            myPlayer = amp("contentElement", myOptions);
                            myPlayer.src([{
                                "src": "{{ video.drmFiles['playready'] | raw }}",
                                "type": "application/vnd.ms-sstr+xml",
                                "streamingFormats": [
                                    "SMOOTH"
                                ],
                                "protectionInfo": [{
                                    "type": "PlayReady",
                                    "authenticationToken": "PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxLZXlPU0F1dGhlbnRpY2F0aW9uWE1MPjxEYXRhPjxXaWRldmluZVBvbGljeSBmbF9DYW5QZXJzaXN0PSJmYWxzZSIgZmxfQ2FuUGxheT0idHJ1ZSIvPjxXaWRldmluZUNvbnRlbnRLZXlTcGVjIFRyYWNrVHlwZT0iSEQiPjxTZWN1cml0eUxldmVsPjE8L1NlY3VyaXR5TGV2ZWw+PC9XaWRldmluZUNvbnRlbnRLZXlTcGVjPjxMaWNlbnNlIHR5cGU9InNpbXBsZSIvPjxHZW5lcmF0aW9uVGltZT4yMDE2LTExLTIzIDE1OjM2OjIzLjAwMDwvR2VuZXJhdGlvblRpbWU+PEV4cGlyYXRpb25UaW1lPjIwMTYtMTItMDcgMTU6MzY6MjMuMDAwPC9FeHBpcmF0aW9uVGltZT48VW5pcXVlSWQ+ZmQxMTg0Nzk2ZmYxOWYzYzBlNzFkNmQ3NTkzMWRlMmM8L1VuaXF1ZUlkPjxSU0FQdWJLZXlJZD4zNWY2ODZiNGI1YTAwZDZiNDIyNzMzZjcwYjkzM2VjZjwvUlNBUHViS2V5SWQ+PC9EYXRhPjxTaWduYXR1cmU+YzEzVTJuNDV3UXg5a25QTzJKL3hFcjU0Skt0clcvelR1WDJBeEQvWDJhUVhxd1VzOXFTYzVaRmRZSlJtazM4eDVVWjFaYzZxU0FiWVAvdVpGME1iVUM2Zk1uMnlJMTlDTTgwOVdjUWV3UlhvbG5XN3pKRlk5MFdUSk1vaHZXbkFWb1RmUHZTMVMvUzYxY0ZIZFlLUVpoUzc2UDZNSTd0NXhZUCtNeGVPZ21CWCtURi9JRDRGaTNmNWlvYW0rbVllVS8wUDAzblIwZDV4bnl0RnU1dGZnVFUzRk9SVTNJaWREVjE4TTZpRFN3QnVjaUNUS3RnVGRHd0NEMzhEdGZYMWdLM3ZUdWlGL2pWcUhzbWVIYnBTMlJGVi9MdlVSTkZVdjRsbHA0RkRtck0zVTUvRE1jQzRDR2lrbXRVSEIyRFBkdiszSTc5ZEdTaVlDZXU4a2w2ZW1RPT08L1NpZ25hdHVyZT48L0tleU9TQXV0aGVudGljYXRpb25YTUw+Cg=="
                                }]
                            }]);
                        }

                        initsl();
                    } else {
                        // Silverlight is not installed
                        var mssg = '<div id="mainContainer"><div id="alert_ms"><a href="https://www.microsoft.com/getsilverlight/Get-Started/Install/Default.aspx" target="_blank"><img src="http://cimacast.s3.amazonaws.com/images/video/2015/10/58430920b4f14.png" /></a></div></div>';
                        $('body').append(mssg);
                    }

                }
            }
        };


        geo_http_request.open("GET", geo_data_file, true);
        geo_http_request.send();
    }


    var videos = document.getElementsByClassName("video-cimaplay2");

    for (var i = 0; i < videos.length; i++) {
        if (videos[i].classList.contains("create"))
            return false;
        else {
            videos[i].classList.add("create");
            var container = videos[i];
            var id_elem = container.id;
            var id_player = 'player_' + id_elem;

            loadJSON(id_elem, id_player);
        }
    }


    function sendDataLog(action, data) {
        var data = action + data;
        //console.log(data);
        $.ajax({
            type: 'post',
            url: location.protocol + '//w2-dev-2cmp1.cmcst.4cloud.co/analytics',
            data: 'data=' + data,
            success: function (data) {
                //console.log(data + ' ' + action);
            }
        });
    }


    // is Silveright Installed ?
    function isSilverlightInstalled() {
        var isSilverlightInstalled = false;
        try {
            try{
                var slControl = new ActiveXObject('AgControl.AgControl');

                console.log(slControl);

                isSilverlightInstalled = true;
            } catch (e) {
                if ( navigator.plugins["Silverlight Plug-In"] ){
                    isSilverlightInstalled = true;
                }
            }
        } catch (e) {}
        return isSilverlightInstalled;
    }

}());
