(function () {
    var validategal = false;
    function loadJSON(video, player, iframe) {
        var data_file = "http://localhost:8000/video-data/" + video + '?domain=' + document.domain;;
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
                validategal = data.playlist;

                if (data.unknow) {
                    _container.innerHTML = data.html;
                    return 0;
                }
                else if (data.video) {
                    var pixelTracking = document.createElement("img");
                    pixelTracking.setAttribute("src", "http://localhost:8000/video-print/" + video + "?vid=" + data.video + "&ccid=" + data.ccid + "&pid=" + data.pid + "&domain=" + document.domain);
                    pixelTracking.style.display = 'none';
                    _container.appendChild(pixelTracking);

                    var wWidget = window.innerWidth;
                    if(validategal){
                        if(wWidget<720){
                            valp = "95%"
                        }else{
                            valp = "75%"
                        }
                    }else{
                        valp = "56%"
                    }
                    // render video
                    var _player = document.createElement("div");
                    _player.className = "container-player";
                    _player.style.width = "100%";
                    _player.style.maxWidth = data.width + "px";
                    _player.style.Margin = "0 auto";

                    var _id = document.createElement("div");
                    _id.className = player;
                    _id.style.position = "relative";
                    _id.style.paddingBottom = valp;
                    _id.style.paddingTop = "0";
                    _id.style.height = "0";

                    var w = (parseInt(data.width) + 35);
                    var h = (parseInt(data.height) + 35);
                    var url = 'http://localhost:8000/publish/show/' + data.video + '?pvidt=' + id_elem + '&h=' + data.height + '&w=' + data.width + '&ccid=' + data.ccid + '&pid=' + data.pid + '&adv=' + data.advertiser + '&qty=' + data.qty + '&domain=' + document.domain + '?v2';

                    var iFrame = document.createElement("iframe");
                    iFrame.setAttribute("id", iframe);
                    iFrame.setAttribute("frameborder", "0");
                    iFrame.setAttribute("allowfullscreen", "allowfullscreen");
                    iFrame.setAttribute("src", url);
                    iFrame.style.position = "absolute";
                    iFrame.style.top = "0";
                    iFrame.style.left = "0";
                    iFrame.style.width = "100%";
                    iFrame.style.height = "100%";

                    _id.appendChild(iFrame);
                    _player.appendChild(_id);
                    _container.appendChild(_player);
                }
            }
        };

        http_request.open("GET", data_file, true);
        http_request.send();
    }

    var videos = document.getElementsByClassName("video-cimacast");

    for (var i = 0; i < videos.length; i++) {
        if (videos[i].classList.contains("create"))
            return false;
        else {
            videos[i].classList.add("create");

            var container = videos[i];
            var id_elem = container.id;
            var id_player = 'player_' + id_elem;
            var id_iframe = 'iframe_' + id_elem;

            loadJSON(id_elem, id_player, id_iframe);
        }
    }

}());
