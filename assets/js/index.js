"use strict";

$(function () {
    var Marzipano = window.Marzipano;
    var bowser = window.bowser;
    var screenfull = window.screenfull;
    var data = { scenes: null };

    var settings = window.APP_SETTING;
    var curSceneIndex = 0;
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
    var fullscreenToggleElement = document.querySelector("#full-screen-toggle");

    // Detect desktop or mobile mode
    if (window.matchMedia) {
        var setMode = function () {
            if (mql.matches) {
                $("body").removeClass("desktop");
                $("body").addClass("mobile");
                $(".guest-nav").addClass("hengpon");
            } else {
                $("body").addClass("desktop");
                $("body").removeClass("mobile");
                $(".guest-nav").removeClass("hengpon");
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

    // Set up fullscreen mode, if supported.
    if (screenfull.enabled && settings.fullscreenButton) {
        document.body.classList.add("fullscreen-enabled");
        fullscreenToggleElement.addEventListener("click", function () {
            screenfull.toggle();
        });
        screenfull.on("change", function () {
            if (screenfull.isFullscreen) {
                fullscreenToggleElement.classList.add("enabled");
            } else {
                fullscreenToggleElement.classList.remove("enabled");
            }
        });
    } else {
        document.body.classList.add("fullscreen-disabled");
    }

    /**
     * Start Here
     */

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
            $(".guest-nav").removeClass("visible");
            $(".user-nav").addClass("visible");

            firebase
                .database()
                .ref("/scenes")
                .once("value")
                .then((snapshot) => {
                    var userData = { scenes: null };
                    userData.scenes = snapshot.val();
                    data.scenes = snapshot.val();
                    createScene(userData);
                });

            firebase
                .database()
                .ref("/users/" + user.uid)
                .once("value")
                .then((snapshot) => {
                    var name =
                        (snapshot.val() && snapshot.val().name) || "Anonymous";
                    $("#user-data").text(name);
                });
        } else {
            $(".guest-nav").addClass("visible");
            $(".user-nav").removeClass("visible");

            var guestData = window.APP_DATA;
            data.scenes = guestData.scenes;
            createScene(guestData);
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
            
            if( typeof data.infoHotspots !== 'undefined'){
                // Link Info Hotspot
                data.infoHotspots.forEach(function (hotspot) {
                    var element = createInfoHotspotElement(hotspot);
                    hotspotContainer.createHotspot(element, {
                            yaw: hotspot.yaw,
                            pitch: hotspot.pitch,
                        });
                });
            }

            return {
                data: data,
                scene: scene,
                view: view,
            };
        });
        // updateRoomList(scenes);
        Room.updateList(scenes);
        switchScene(scenes[curSceneIndex]);
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

    function switchScene(scene) {
        scene.view.setParameters(scene.data.initialViewParameters);
        scene.scene.switchTo();
        Room.updateName(scene.data.name);
        Scene.updateList(scene.data.id);
    }

    function sanitize(s) {
        return s
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;");
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
            switchScene(Scene.findById(hotspot.target));
        });

        // Prevent touch and scroll events from reaching the parent element.
        // This prevents the view control logic from interfering with the hotspot.
        stopTouchAndScrollEventPropagation(wrapper);

        // Create tooltip element.
        var tooltip = document.createElement("div");
        tooltip.classList.add("hotspot-tooltip");
        tooltip.classList.add("link-hotspot-tooltip");
        tooltip.innerHTML = Scene.findDataById(hotspot.target).name;

        wrapper.appendChild(icon);
        wrapper.appendChild(tooltip);

        return wrapper;
    }

    function createInfoHotspotElement(hotspot) {
        // Create wrapper element to hold icon and tooltip.
        var wrapper = document.createElement("div");
        wrapper.classList.add("hotspot");
        wrapper.classList.add("info-hotspot");

        // Create hotspot/tooltip header.
        var header = document.createElement("div");
        header.classList.add("info-hotspot-header");

        // Create image element.
        var iconWrapper = document.createElement("div");
        iconWrapper.classList.add("info-hotspot-icon-wrapper");
        var icon = document.createElement("img");
        icon.src = "assets/img/info.png";
        icon.classList.add("info-hotspot-icon");
        iconWrapper.appendChild(icon);

        // Create title element.
        var titleWrapper = document.createElement("div");
        titleWrapper.classList.add("info-hotspot-title-wrapper");
        var title = document.createElement("div");
        title.classList.add("info-hotspot-title");
        title.innerHTML = hotspot.title;
        titleWrapper.appendChild(title);

        // Create close element.
        var closeWrapper = document.createElement("div");
        closeWrapper.classList.add("info-hotspot-close-wrapper");
        var closeIcon = document.createElement("img");
        closeIcon.src = "assets/img/close.png";
        closeIcon.classList.add("info-hotspot-close-icon");
        closeWrapper.appendChild(closeIcon);

        // Construct header element.
        header.appendChild(iconWrapper);
        header.appendChild(titleWrapper);
        header.appendChild(closeWrapper);

        // Create text element.
        var text = document.createElement("div");
        text.classList.add("info-hotspot-text");
        text.innerHTML = hotspot.text;

        // Place header and text into wrapper element.
        wrapper.appendChild(header);
        wrapper.appendChild(text);

        // Create a modal for the hotspot content to appear on mobile mode.
        var modal = document.createElement("div");
        modal.innerHTML = wrapper.innerHTML;
        modal.classList.add("info-hotspot-modal");
        document.body.appendChild(modal);

        var toggle = function () {
            wrapper.classList.toggle("visible");
            modal.classList.toggle("visible");
        };

        // Show content when hotspot is clicked.
        wrapper
            .querySelector(".info-hotspot-header")
            .addEventListener("click", toggle);

        // Hide content when close icon is clicked.
        modal
            .querySelector(".info-hotspot-close-wrapper")
            .addEventListener("click", toggle);

        // Prevent touch and scroll events from reaching the parent element.
        // This prevents the view control logic from interfering with the hotspot.
        stopTouchAndScrollEventPropagation(wrapper);

        return wrapper;
    }

    // Prevent touch and scroll events from reaching the parent element.
    function stopTouchAndScrollEventPropagation(element, eventList) {
        var eventList = [
            "touchstart",
            "touchmove",
            "touchend",
            "touchcancel",
            "wheel",
            "mousewheel",
        ];
        for (var i = 0; i < eventList.length; i++) {
            element.addEventListener(eventList[i], function (event) {
                event.stopPropagation();
            });
        }
    }

    var FormModal = {
        init: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            $("#login-form").on("submit", this.doLogin);
            $("#register-form").on("submit", this.doRegister);
            $("#logout-button").click(this.doLogout);
        },
        doLogin: function (e) {
            e.preventDefault();
            var email = $("#login-email").val();
            var password = $("#login-password").val();

            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // var user = userCredential.user;
                    $("#login-form-modal").hide();
                    FormModal.clearLogin();
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("Gagal Login");
                });
        },
        doRegister: function (e) {
            e.preventDefault();
            var name = $("#register-name").val();
            var phone = $("#register-phone").val();
            var email = $("#register-email").val();
            var reemail = $("#register-reemail").val();
            var password = $("#register-password").val();

            if (name.trim().length < 3) {
                console.log("name failed");
            } else if (phone.trim().length < 9) {
                console.log("phone failed");
            } else if (email.trim() == "") {
                console.log("email failed");
            } else if (email != reemail) {
                console.log("email reemail failed");
            } else if (password.trim().length < 7) {
                console.log("password failed");
            } else {
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        var user = userCredential.user;

                        firebase
                            .database()
                            .ref("users/" + user.uid)
                            .set({
                                name: name,
                                phone: phone,
                            });
                        $("#register-form-modal").hide();
                        FormModal.clearRegister();
                        $("#user-data").text(name);
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log("Gagal Register");
                    });
            }
        },
        doLogout: function (e) {
            e.preventDefault();
            firebase
                .auth()
                .signOut()
                .then(() => {
                    Scene.updateIndex();
                })
                .catch((error) => {
                    console.log(error.message);
                });
        },
        clearLogin: function () {
            $("#login-form")
                .find("input[type=email], input[type=password]")
                .val("");
        },
        clearRegister: function () {
            $("#register-form")
                .find(
                    "input[type=text], input[type=email], input[type=password]"
                )
                .val("");
        },
    };
    FormModal.init();

    var Room = {
        name: $("#title-bar h1"),
        listElement: $("#room-list"),
        listElementWrapper: $("#room-list .rooms")[0],
        listToggleElement: $("#room-list-toggle"),
        init: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            this.listToggleElement.click(this.toggleList);
        },
        toggleList: function () {
            Room.listElement[0].classList.toggle("enabled");
            this.classList.toggle("enabled");
        },
        updateList: function (scenes) {
            this.listElementWrapper.innerHTML = "";
            $.each(scenes, function (index, value) {
                var scene_id = scenes[index].data.id;
                var scene_name = scenes[index].data.name;
                var aWrapper = document.createElement("a");
                aWrapper.classList.add("room");
                aWrapper.setAttribute("data-id", scene_id);
                var liWrapper = document.createElement("li");
                liWrapper.classList.add("text");
                liWrapper.innerHTML = scene_name;
                aWrapper.appendChild(liWrapper);

                aWrapper.addEventListener("click", function () {
                    curSceneIndex = index;
                    switchScene(scenes[index]);
                    if (document.body.classList.contains("mobile")) {
                        Room.hideList();
                    }
                });

                Room.listElementWrapper.appendChild(aWrapper);
            });
        },
        updateName: function (name) {
            this.name.html(sanitize(name));
        },
        hideList: function () {
            Room.listElement[0].classList.remove("enabled");
            Room.listToggleElement[0].classList.remove("enabled");
        },
    };
    Room.init();

    var Scene = {
        findById: function (sceneId) {
            for (var i = 0; i < scenes.length; i++) {
                if (scenes[i].data.id === sceneId) {
                    curSceneIndex = i;
                    return scenes[i];
                }
            }
            return null;
        },
        findDataById: function (sceneId) {
            for (var i = 0; i < data.scenes.length; i++) {
                if (data.scenes[i].id === sceneId) {
                    return data.scenes[i];
                }
            }
            return null;
        },
        updateList: function (curId) {
            var roomEls = document.querySelectorAll("#room-list .room");
            for (var i = 0; i < roomEls.length; i++) {
                var el = roomEls[i];
                if (el.getAttribute("data-id") === curId) {
                    el.classList.add("current");
                } else {
                    el.classList.remove("current");
                }
            }
        },
        updateIndex: function () {
            if (curSceneIndex >= 1) {
                curSceneIndex = 1;
            }
        },
    };
});
