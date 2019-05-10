window.$ = require('jquery');

// import 'ol/ol.css';
import {
    Map,
    View
} from 'ol';

// layer
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';

import XYZSource from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import Overlay from 'ol/Overlay';

import {
    fromLonLat,
    toLonLat,
    transformExtent
} from 'ol/proj';

import BingMaps from 'ol/source/BingMaps';
// control
import {
    defaults as defaultControls,
    Attribution,
    FullScreen,
    MousePosition,
    OverviewMap,
    ZoomToExtent,
    ScaleLine,
    ZoomSlider
} from 'ol/control';

import {
    createStringXY
} from 'ol/coordinate';

const center = fromLonLat([100.5496, 16.9990], 'EPSG:3857');
var lyr = [];
const jsonPro = `http://119.59.125.189:8080/mapservice/gistnu/wms?service=WFS&version=1.0.0&request=GetFeature&typeName=gistnu:hospital&outputFormat=application%2Fjson`;

// base map


const layers = [
    // tile layer
    new TileLayer({
        source: new OSM(),
        title: 'osm',
        zIndex: 0,
        isBaseLayer: true,
        visible: true
    }),
    // xyz tile
    new TileLayer({
        source: new XYZSource({
            url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
        }),
        title: 'terrain',
        zIndex: 0,
        isBaseLayer: true,
        visible: false
    }),
    // google xyz tile
    new TileLayer({
        source: new XYZSource({
            url: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}'
        }),
        title: 'groad',
        zIndex: 0,
        isBaseLayer: true,
        visible: false
    }),
    new TileLayer({
        source: new XYZSource({
            url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        }),
        title: 'ghybrid',
        zIndex: 0,
        isBaseLayer: true,
        visible: false
    }),
    // bing map
    new TileLayer({
        preload: Infinity,
        source: new BingMaps({
            key: 'AvcFXgENVxj3HQY8YhCixoJrX_IwBzRil0jsOFCzD1EZjzZv88Wyumh7B5r_MhFg',
            imagerySet: 'AerialWithLabels'
            // use maxZoom 19 to see stretched tiles instead of the BingMaps
            // "no photos at this zoom level" tiles
            // maxZoom: 19
        }),
        title: 'bingmap',
        zIndex: 0,
        isBaseLayer: true,
        visible: false
    }),
    // overlay layers
    new TileLayer({
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
    }),
    new TileLayer({
        source: new TileWMS({
            url: 'http://119.59.125.189:8080/mapservice/gistnu/wms?',
            params: {
                'LAYERS': 'gistnu:amphoe',
                'TILED': true
            },
            serverType: 'geoserver',
            transition: 0
        }),
        title: 'amphoe',
        zIndex: 2,
        isBaseLayer: false,
        visible: false
    }),
    new TileLayer({
        source: new TileWMS({
            url: 'http://119.59.125.189:8080/mapservice/gistnu/wms?',
            params: {
                'LAYERS': 'gistnu:tambon',
                'TILED': true
            },
            serverType: 'geoserver',
            transition: 0
        }),
        title: 'tambon',
        zIndex: 1,
        isBaseLayer: false,
        visible: false
    }),

    new TileLayer({
        source: new TileWMS({
            url: 'http://119.59.125.189:8080/mapservice/gistnu/wms?',
            params: {
                'LAYERS': 'gistnu:ways',
                'TILED': true
            },
            serverType: 'geoserver',
            transition: 0
        }),
        title: 'ways',
        zIndex: 3,
        isBaseLayer: false,
        visible: false
    }),

    new TileLayer({
        source: new TileWMS({
            url: 'http://119.59.125.189:8080/mapservice/gistnu/wms?',
            params: {
                'LAYERS': 'gistnu:village',
                'TILED': true
            },
            serverType: 'geoserver',
            transition: 0
        }),
        title: 'village',
        zIndex: 3,
        isBaseLayer: false,
        visible: false
    }),
    // ่json
    new VectorLayer({
        source: new VectorSource({
            format: new GeoJSON(),
            projection: 'EPSG:4326',
            url: jsonPro
        }),
        title: 'hospital',
        zIndex: 4,
        isBaseLayer: false,
        visible: false
    }),
    // vector tile
        new VectorTileLayer({
            declutter: true,
            source: new VectorTileSource({
                format: new MVT(),
                url: 'http://119.59.125.189/mapservice/gwc/service/tms/1.0.0/' +
                    'gistnu:raintam2557@EPSG:900913@pbf/{z}/{x}/{-y}.pbf'
            }),
            style: new Style({
                fill: new Fill({
                    color: 'red',
                    opacity: 0.2
                }),
                stroke: new Stroke({
                    color: 'white',
                    width: 1
                })
            })
        })
]

// base layer switcher 
$(':radio').change((e) => {
    // console.log(e.target.value);
    layers.forEach((l) => {
        if (l.values_.isBaseLayer === true) {
            if (l.values_.title === e.target.value) {
                l.setVisible(true);
            } else {
                l.setVisible(false);
            }
        }
    })
});

// overlay layers
$(':checkbox').click((e) => {
    let chk = e.currentTarget.checked;
    let lyr = e.currentTarget.defaultValue;
    layers.forEach((l) => {
        if (l.values_.title === e.currentTarget.defaultValue) {
            if (e.currentTarget.checked === true) {
                l.setVisible(true);
            } else {
                l.setVisible(false);
            }
        }
    })
});

// attribution
const attribution = new Attribution({
    collapsible: false,
    // collapsed: true
});
// full screen
const fullScreen = new FullScreen();
// mouse position
const mousePosition = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: 'mouse-position',
    undefinedHTML: '&nbsp;'
});
$('#projection').change((e) => {
    mousePosition.setProjection(e.target.value);
});
$('#precision').change((e) => {
    const format = createStringXY(e.target.valueAsNumber);
    mousePosition.setCoordinateFormat(format);
});
// overview map
const overviewMap = new OverviewMap({
    layers: [new TileLayer({
        source: new OSM()
    })]
});
// zoom to extent
const zoomExtent = new ZoomToExtent({
    extent: transformExtent([100.2175, 16.7877, 100.3214, 16.8362], 'EPSG:4326', 'EPSG:3857')
});
// scale line
const scaleLine = new ScaleLine();
// zoom slidere
const zoomslider = new ZoomSlider();
// popup
// var container = document.getElementById('popup');
// var content = document.getElementById('popup-content');
// var closer = document.getElementById('popup-closer');
var container = $('#popup')[0];
var closer = $('#popup-closer')[0];

var overlay = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

// create view
let view = new View({
    center: center,
    zoom: 9
})

// create map
const map = new Map({
    target: 'map',
    layers: layers,
    view: view,
    overlays: [overlay],
    controls: defaultControls({
        attribution: false
    }).extend([
        attribution,
        fullScreen,
        mousePosition,
        overviewMap,
        zoomExtent,
        scaleLine,
        zoomslider
    ])
});

map.on('singleclick', (e) => {
    var coordinate = e.coordinate;
    var lonlat = toLonLat(e.coordinate, 'EPSG:3857');
    // console.log(toLonLat(e.coordinate, 'EPSG:3857'))
    // content.innerHTML = '<p>You clicked here:</p><code>' + coordinate +
    //     '</code>';
    let jsonUrl = `http://119.59.125.189:8080/mapservice/gistnu/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gistnu%3Aamphoe&outputFormat=application%2Fjson&CQL_FILTER=INTERSECTS(geom,Point(${lonlat[0]} ${lonlat[1]}))`;
    $.getJSON(jsonUrl, (res) => {
        if (res.features.length >= 1) {
            console.log(res.features);
            let val = res.features[0].properties;
            $('#popup-content').html(`<h2>อำเภอ ${val.amp_th}</h2><br>
            จังหวัด ${val.prov_th}<br>
            เนื้อที่ ${(val.area / 1000000).toFixed(2)} ตร.กม.
            `);
            overlay.setPosition(coordinate);
        } else {
            overlay.setPosition(undefined);
        }
    })
});

// attribution
function checkSize() {
    var small = map.getSize()[0] < 600;
    attribution.setCollapsible(small);
    attribution.setCollapsed(small);
}
window.addEventListener('resize', checkSize);
checkSize();