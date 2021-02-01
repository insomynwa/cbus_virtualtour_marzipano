var APP_DATA = {
    "scenes": [
        {
            "id": "scene_01",
            "name": "scene_01",
            "levels": [
                {
                    "tileSize": 256,
                    "size": 256,
                    "fallbackOnly": true
                },
                {
                    "tileSize": 512,
                    "size": 512
                },
                {
                    "tileSize": 512,
                    "size": 1024
                }
            ],
            "faceSize": 1000,
            "initialViewParameters": {
                "yaw": -0.9639214039841448,
                "pitch": -0.03480265243788949,
                "fov": 1.3544032240414072
            },
            "linkHotspots": [
                {
                    "yaw": -1.0346346110321196,
                    "pitch": 0.022879362891034205,
                    "rotation": 11.780972450961727,
                    "target": "scene_02"
                }
            ],
            "infoHotspots": []
        },
        {
            "id": "scene_02",
            "name": "scene_02",
            "levels": [
                {
                    "tileSize": 256,
                    "size": 256,
                    "fallbackOnly": true
                },
                {
                    "tileSize": 512,
                    "size": 512
                },
                {
                    "tileSize": 512,
                    "size": 1024
                }
            ],
            "faceSize": 1000,
            "initialViewParameters": {
                "yaw": 1.2282702813548632,
                "pitch": 0.14508473091724028,
                "fov": 1.3544032240414072
            },
            "linkHotspots": [
                {
                    "yaw": -1.619867005026876,
                    "pitch": 0.16168833640911728,
                    "rotation": 0,
                    "target": "scene_01"
                }
            ],
            "infoHotspots": [
                {
                    "yaw": 1.0,
                    "pitch": -0.03,
                    "title": "Pusat Informasi",
                    "text": "Lorem ipsum dolor sit amet"
                }
            ]
        }
    ]
};
var APP_SETTING = {
    mouseViewMode: "drag",
    autorotateEnabled: false,
    fullscreenButton: true,
    viewControlButtons: false,
};
