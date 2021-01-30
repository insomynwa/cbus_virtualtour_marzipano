"use strict";

$(function () {
    var Marzipano = window.Marzipano;
    var bowser = window.bowser;
    var screenfull = window.screenfull;
    var data = {scenes: null};

    var settings = window.APP_SETTING;
    var latest_scene = 0;
    // var user = firebase.auth().currentUser;

    // if(user){
    //     data = null;
    //     firebase.database().ref('/scenes').once('value')
    //     .then((snapshot) => {
    //         console.log(snapshot);
    //     });
    // }else{
    //     data = window.APP_DATA;
    //     console.log(data);
    // }

    // Grab element from DOM
    var panoElement = $("#pano-canvas")[0];
    var roomNameElement = $("#title-bar h1")[0];
    var roomListElement = $("#room-list")[0];
    var roomListUlElement = $("#room-list .rooms")[0];
    var roomElements = document.querySelectorAll("#room-list .room");
    var roomListToggleElement = $('#room-list-toggle')[0];

    // Detect desktop or mobile mode
    if (window.matchMedia) {
        var setMode = function () {
            if (mql.matches) {
                $("body").removeClass("desktop");
                $("body").addClass("mobile");
            } else {
                $("body").addClass("desktop");
                $("body").removeClass("mobile");
            }
        };
        var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
        setMode();
        mql.addListener(setMode);
    } else {
        $("body").addClass("desktop");
    }

    // Detect whether on a touch device
    $("body").addClass("no-touch");
    window.addEventListener("touchstart", function () {
        $("body").removeClass("no-touch");
        $("body").addClass("touch");
    });

    // Use tooltip fallback mode on IE < 11
    if (bowser.msie && parseFloat(bowser.version) < 11) {
        $("body").addClass("tooltip-fallback");
    }

    /**
     * Start Here
     */

    // console.log(settings);
    // Viewer Options
    var viewerOpts = {
        controls: {
            mouseViewMode: settings.mouseViewMode,
        },
    };

    // Init viewer
    var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // $("#ihs-login-form").removeClass("w3-show").addClass("w3-hide");
            // $("#ihs-register-form").removeClass("w3-show").addClass("w3-hide");

            $(".guest-nav").removeClass("visible");
            $(".user-nav").addClass("visible");

            firebase
                .database()
                .ref("/scenes")
                .once("value")
                .then((snapshot) => {
                    //console.log(snapshot.val());
                    var userData = { scenes: null };
                    userData.scenes = snapshot.val();
                    data.scenes = snapshot.val();
                    // var testUserData = {scenes: []};
                    // snapshot.forEach(function(childSnapshot) {
                    //     var item = childSnapshot.val();
                    //     item.key = childSnapshot.key;

                    //     testUserData.scenes.push(item);
                    // });
                    // console.log(snapshot.val());
                    // console.log(userData);
                    // console.log(testUserData);
                    createScene(userData);
                });

            //$("#ihs-user").addClass("w3-show").removeClass("w3-hide");
            firebase
                .database()
                .ref("/users/" + user.uid)
                .once("value")
                .then((snapshot) => {
                    var name =
                        (snapshot.val() && snapshot.val().name) || "Anonymous";
                    //$("#user-data").append("<p>"+ name + "</p>");
                    $("#user-data").text(name);
                });
        } else {
            $(".guest-nav").addClass("visible");
            $(".user-nav").removeClass("visible");

            var guestData = window.APP_DATA;
            data.scenes = guestData.scenes;
            createScene(guestData);
            //data = window.APP_DATA;
            // console.log(data);
            // $("#ihs-login-form").removeClass("w3-hide").addClass("w3-show");
            // $("#ihs-register-form").removeClass("w3-hide").addClass("w3-show");
            //$("#ihs-user").removeClass("w3-show").addClass("w3-hide");
        }
    });

    // Create Init Scenes
    var scenes = null;
    function createScene(dataScene) {
        scenes = dataScene.scenes.map(function (data) {
            var urlPrefix = "data/tiles";
            var imageSource = Marzipano.ImageUrlSource.fromString(
                urlPrefix + "/" + data.id + "/{z}/{f}/{y}/{x}.jpg",
                {
                    cubeMapPreviewUrl:
                        urlPrefix + "/" + data.id + "/preview.jpg",
                }
            );

            var geometry = new Marzipano.CubeGeometry(data.levels);
            var limiter = Marzipano.RectilinearView.limit.traditional(
                data.faceSize,
                (100 * Math.PI) / 180,
                (120 * Math.PI) / 180
            );
            var view = new Marzipano.RectilinearView(
                data.initialViewParameters,
                limiter
            );

            var scene = viewer.createScene({
                source: imageSource,
                geometry: geometry,
                view: view,
                pinFirstLevel: true,
            });
            // console.log(data.linkHotspots);

            // Create Hotspot
            var hotspotContainer = scene.hotspotContainer();

            // Link Hotspots
            data.linkHotspots.forEach(function (hotspot) {
                var element = createLinkHotspotElement(hotspot);
                hotspotContainer.createHotspot(element, {
                    yaw: hotspot.yaw,
                    pitch: hotspot.pitch,
                });
            });

            return {
                data: data,
                scene: scene,
                view: view,
            };
        });
        updateRoomList(scenes);
        switchScene(scenes[0]);
    }

    // Create Scenes
    // var scenes = data.scenes.map( function(data) {
    //     var urlPrefix = "data/tiles";
    //     var imageSource = Marzipano.ImageUrlSource.fromString(
    //         urlPrefix + "/" + data.id + "/{z}/{f}/{y}/{x}.jpg",
    //         {
    //             cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/preview.jpg"
    //         }
    //     );

    //     var geometry = new Marzipano.CubeGeometry(data.levels);
    //     var limiter = Marzipano.RectilinearView.limit.traditional(
    //             data.faceSize,
    //             100 * Math.PI / 180,
    //             120 * Math.PI / 180
    //         );
    //     var view = new Marzipano.RectilinearView(
    //         data.initialViewParameters,
    //         limiter
    //     );

    //     var scene = viewer.createScene({
    //         source: imageSource,
    //         geometry: geometry,
    //         view: view,
    //         pinFirstLevel: true
    //     });

    //     // Create Info Hotspot
    //     var hotspotContainer = scene.hotspotContainer();
    //     hotspotContainer.createHotspot(
    //         $("#ihs-login-form")[0],
    //         { yaw: 1, pitch: 0.1 }
    //     );
    //     hotspotContainer.createHotspot(
    //         $("#ihs-register-form")[0],
    //         { yaw: 1.5, pitch: 0.1 }
    //     );
    //     hotspotContainer.createHotspot(
    //         $("#ihs-user")[0],
    //         { yaw: 1, pitch: 0.1 }
    //     );

    //     return {
    //         data: data,
    //         scene: scene,
    //         view: view
    //     }
    // });

    // switchScene(scenes[0]);

    function updateRoomList(scenes){
        var list = "";
        roomListUlElement.innerHTML = "";
        $.each(scenes, function(index, value){
            // list += `<a href="#" class="room" data-id="${scenes[index].data.id}">
            //     <li class="text">${scenes[index].data.name}</li>
            // </a>`;
            var aWrapper = document.createElement('a');
            aWrapper.classList.add('room');
            aWrapper.setAttribute('data-id',scenes[index].data.id);
            var liWrapper = document.createElement('li');
            liWrapper.classList.add('text');
            liWrapper.innerHTML = scenes[index].data.name;
            aWrapper.appendChild(liWrapper);
            aWrapper.addEventListener('click', function(){
                switchScene(scenes[index]);
            });
            roomListUlElement.appendChild(aWrapper);
        });
        // $("#room-list .rooms").html(list);
        // $("a.room").click(function (e) { 
        //     e.preventDefault();
        //     switchScene(scene)
        // });
    }

    function sanitize(s) {
        return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
    }

    function switchScene(scene) {
        scene.view.setParameters(scene.data.initialViewParameters);
        scene.scene.switchTo();
        updateSceneName(scene);
        updateSceneList(scene);
    }

    function updateSceneName(scene) {
        roomNameElement.innerHTML = sanitize(scene.data.name);
    }

    function updateSceneList(scene) {
        var roomEls = document.querySelectorAll('#room-list .room');
        for (var i = 0; i < roomEls.length; i++) {
            var el = roomEls[i];
            if (el.getAttribute('data-id') === scene.data.id) {
                el.classList.add('current');
            } else {
                el.classList.remove('current');
            }
        }
    }

    function createLinkHotspotElement(hotspot) {
        // Create wrapper element to hold icon and tooltip.
        var wrapper = document.createElement("div");
        wrapper.classList.add("hotspot");
        wrapper.classList.add("link-hotspot");

        // Create image element.
        var icon = document.createElement("img");
        icon.src = "assets/img/link.png";
        icon.classList.add("link-hotspot-icon");

        // Set rotation transform.
        var transformProperties = [
            "-ms-transform",
            "-webkit-transform",
            "transform",
        ];
        for (var i = 0; i < transformProperties.length; i++) {
            var property = transformProperties[i];
            icon.style[property] = "rotate(" + hotspot.rotation + "rad)";
        }

        // Add click event handler.
        wrapper.addEventListener("click", function () {
            switchScene(findSceneById(hotspot.target));
        });

        // Prevent touch and scroll events from reaching the parent element.
        // This prevents the view control logic from interfering with the hotspot.
        stopTouchAndScrollEventPropagation(wrapper);

        // Create tooltip element.
        var tooltip = document.createElement("div");
        tooltip.classList.add("hotspot-tooltip");
        tooltip.classList.add("link-hotspot-tooltip");
        tooltip.innerHTML = findSceneDataById(hotspot.target).name;

        wrapper.appendChild(icon);
        wrapper.appendChild(tooltip);

        return wrapper;
    }

    function findSceneById(id) {
        for (var i = 0; i < scenes.length; i++) {
            if (scenes[i].data.id === id) {
                return scenes[i];
            }
        }
        return null;
    }

    function findSceneDataById(id) {
      for (var i = 0; i < data.scenes.length; i++) {
        if (data.scenes[i].id === id) {
          return data.scenes[i];
        }
      }
      return null;
    }

    // Prevent touch and scroll events from reaching the parent element.
    function stopTouchAndScrollEventPropagation(element, eventList) {
      var eventList = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel',
                        'wheel', 'mousewheel' ];
      for (var i = 0; i < eventList.length; i++) {
        element.addEventListener(eventList[i], function(event) {
          event.stopPropagation();
        });
      }
    }

    // $(document).on('click', "a.room", function () {
    //     var room_id = $(this).attr('data-id');
    // });

    $(document).on('click', "#room-list-toggle", function () {

        roomListElement.classList.toggle('enabled');
        roomListToggleElement.classList.toggle('enabled');
    });

    // $(document).on('click', ".rooms", function () {

    //     roomListElement.classList.toggle('enabled');
    //     roomListToggleElement.classList.toggle('enabled');
    // });
});
