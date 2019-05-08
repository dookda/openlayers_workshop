window.$ = require('jquery');

// import 'ol/ol.css';
import {
    Map,
    View
} from 'ol';

// layer
import TileWMS from 'ol/source/TileWMS';
import XYZSource from 'ol/source/XYZ';

import {
    Tile as TileLayer,
    Vector as VectorLayer
} from 'ol/layer';

import {
    OSM,
    Vector as VectorSource
} from 'ol/source';

import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
} from 'ol/style';

import {
    Draw,
    Modify,
    Snap
} from 'ol/interaction';

import {
    fromLonLat,
    toLonLat,
    transformExtent
} from 'ol/proj';

import GeoJSON from 'ol/format/GeoJSON';

// google xyz tile
const groad = new TileLayer({
    source: new XYZSource({
        url: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}'
    }),
    title: 'groad',
    zIndex: 0,
    isBaseLayer: true,
    visible: true
});
// overlay layers
const prov = new TileLayer({
    source: new TileWMS({
        url: 'http://119.59.125.189:8080/mapservice/gistnu/wms?',
        params: {
            'LAYERS': 'gistnu:province',
            'TILED': true
        },
        serverType: 'geoserver',
        transition: 0
    }),
    title: 'province',
    zIndex: 2,
    isBaseLayer: false,
    visible: true
});

const center = fromLonLat([100.5496, 16.9990], 'EPSG:3857');

// create view
let view = new View({
    center: center,
    zoom: 9
});

const jsonPro = `http://localhost:8080/geoserver/workshop/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=workshop:digitize&maxFeatures=50&outputFormat=application%2Fjson`;

var source = new VectorSource({
    format: new GeoJSON(),
    projection: 'EPSG:3857',
    url: jsonPro
});

var vector = new VectorLayer({
    source: source,
    style: new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new CircleStyle({
            radius: 7,
            fill: new Fill({
                color: '#ffcc33'
            })
        })
    })
});

// create map
const map = new Map({
    target: 'map',
    layers: [groad, prov, vector],
    view: view
});

// draw
var drawPoly = new Draw({
    source: source,
    type: 'Polygon'
});
drawPoly.on('drawend', (e) => {
    // console.log(e);
    let parser = new GeoJSON();
    let geom = parser.writeFeatureObject(e.feature, {
        featureProjection: 'EPSG:3857'
    });
    let id = 'id' + Date.now();
    let data = {
        name_t: id,
        geom: JSON.stringify(geom.geometry),
        type: 'geom'
    };
    $.post('http://localhost:3000/api/insertfeature', data).done((e) => {
        console.log(e)
    });
    map.removeInteraction(drawPoly);
});
map.addInteraction(drawPoly);

// var snap = new Snap({
//     source: source
// });
// map.addInteraction(snap);


// modify
var modifyPoly = new Modify({
    source: source
});
modifyPoly.on('modifyend', (e) => {
    let f = e.features.array_;
    f.forEach((e) => {
        if (e.revision_ !== 2) {
            let parser = new GeoJSON();
            let geom = parser.writeFeatureObject(e, {
                featureProjection: 'EPSG:3857'
            });
            let id = e.values_.name_t;
            console.log(id);
            let data = {
                name_t: id,
                geom: JSON.stringify(geom.geometry)
            };
            $.post('http://localhost:3000/api/updatefeature', data).done((e) => {
                console.log(e)
            });
        }
    })
});
map.addInteraction(modifyPoly);


// $('#type').change((e) => {
//     // console.log(e.target.value)
//     var draw = new Draw({
//         source: source,
//         type: e.target.value
//     });

//     draw.on('drawend', (e) => {
//         let parser = new GeoJSON();
//         let geom = parser.writeFeatureObject(e.feature, {
//             featureProjection: 'EPSG:4326'
//         });

//         let data = {
//             name_t: 'test',
//             geom: JSON.stringify(geom.geometry),
//             type: 'geom'
//         }

//         console.log(geom.geometry)
//         $.post('http://localhost:3000/api/insertfeature', data).done((e) => {
//             console.log(e)
//         })

//         map.removeInteraction(draw);
//     });

//     map.addInteraction(draw);
// });

// function addInteractions() {
//     draw = new Draw({
//         source: source,
//         type: typeSelect.value
//     });
//     map.addInteraction(draw);
//     snap = new Snap({
//         source: source
//     });
//     map.addInteraction(snap);

// }

// /**
//  * Handle change event.
//  */
// typeSelect.onchange = function () {
//     map.removeInteraction(draw);
//     map.removeInteraction(snap);
//     addInteractions();
// };

// createFeature();