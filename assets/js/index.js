"use strict";

$(function () {
    var Marzipano = window.Marzipano;
    var bowser = window.bowser;
    var screenfull = window.screenfull;
    var data = window.APP_DATA;

    // Grab element from DOM
    var panoCanvas = document.querySelector("#pano-canvas");

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
    window.addEventListener('touchstart', function(){
        $("body").addClass("touch");
        $("body").removeClass("no-touch");
    });

    // Use tooltip fallback mode on IE < 11
    if( bowser.msie && parseFloat(bowser.version) < 11){
        $("body").addClass("tooltip-fallback");
    }

    /**
     * Start Here
     */

    // Viewer Options
    var viewerOpts = {
        controls: {
            mouseViewMode: data.settings.mouseViewMode,
        }
    };

    // Init viewer
    var viewer = new Marzipano.Viewer( panoCanvas, viewerOpts);

    // Create Scenes
    var scenes = data.scenes.map( function(data) {
        var urlPrefix = "data/tiles";
        var imageSource = Marzipano.ImageUrlSource.fromString(
            urlPrefix + "/" + data.id + "/{z}/{f}/{y}/{x}.jpg",
            {
                cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/preview.jpg"
            }
        );

        var geometry = new Marzipano.CubeGeometry(data.levels);
        var limiter = Marzipano.RectilinearView.limit.traditional(
                data.faceSize,
                100 * Math.PI / 180,
                120 * Math.PI / 180
            );
        var view = new Marzipano.RectilinearView(
            data.initialViewParameters,
            limiter
        );

        var scene = viewer.createScene({
            source: imageSource,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
        });

        return {
            data: data,
            scene: scene,
            view: view
        }
    });

    switchScene(scenes[0]);
    
    function switchScene(scene){
        scene.view.setParameters(scene.data.initialViewParameters);
        scene.scene.switchTo();
    }

    function createInfoHotspotElement(hotspot){
        
    }
});