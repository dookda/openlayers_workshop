# 1 install
```bash
npm install init
npm install --save-dev parcel-bundler
npm i --save ol
npm i --save jquery
```
# add package.json
```javascript
  // add package.json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "parcel index.html",
    "build": "parcel build --public-url . index.html"
  }
```
# add craete app.js
```javascript
//   craete app.js
window.$ = require('jquery');

import 'ol/ol.css';
import {
  Map,
  View
} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';

import XYZSource from 'ol/source/XYZ';

import {
  fromLonLat
} from 'ol/proj';

import MVT from 'ol/format/MVT.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import {
  Fill,
  Stroke,
  Style
} from 'ol/style.js';

const center = fromLonLat([100.196949, 16.768026], 'EPSG:3857');

var layers = [

  new TileLayer({
    source: new OSM(),
    visible: false
  }),
  // google map
  new TileLayer({
    source: new XYZSource({
      url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
    })
  }),

  // google map
  new TileLayer({
    source: new XYZSource({
      url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
    })
  }),

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
    visible: false
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
    zIndex: 2,
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
    zIndex: 2,
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
    zIndex: 2,
    isBaseLayer: false,
    visible: false
  }),
  new VectorTileLayer({
    declutter: true,
    source: new VectorTileSource({
      format: new MVT(),
      url: 'http://119.59.125.189/mapservice/gwc/service/tms/1.0.0/' +
        'gistnu:raintam2557@EPSG:900913@pbf/{z}/{x}/{-y}.pbf'
    }),
    style: new Style({
      stroke: new Stroke({
        color: 'red',
        width: 1
      }),
      fill: new Fill({
        color: 'rgba(200,20,20,0.2)'
      })
    })
  })
];

const map = new Map({
  target: 'map',
  layers: layers,
  view: new View({
    center: center,
    zoom: 10
  })
});

```

# add page
```html
<div class="container">
  <a class="navbar-brand" href="#">Navbar</a>

  <!-- Toggler/collapsibe Button -->
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
      <span class="navbar-toggler-icon"></span>
  </button>

  <!-- Navbar links -->
  <div class="collapse navbar-collapse" id="collapsibleNavbar">
      <ul class="navbar-nav">
          <li class="nav-item">
              <a class="nav-link" href="index.html">home</a>
          </li>
          <li class="nav-item">
              <a class="nav-link" href="adddata.html">addata</a>
          </li>
          <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
          </li>
      </ul>
  </div>
</div>
```


# 14 geojson 
```js
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const jsonPro = `http://119.59.125.189:8080/mapservice/gistnu/wms?service=WFS&version=1.0.0&request=GetFeature&typeName=gistnu:hospital&outputFormat=application%2Fjson`;

new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    projection: 'EPSG:4326',
    url: jsonPro
  })
})
```

# 15.1 attribute control
```js
import {
  defaults as defaultControls,
  Attribution
} from 'ol/control';

// attribution
const attribution = new Attribution({
  collapsible: false,
  // collapsed: true
});

const map = new Map({
  target: 'map',
  layers: layers,
  view: new View({
    center: center,
    zoom: 10
  }),
  controls: defaultControls({
    attribution: false
  }).extend([
    attribution
  ])
});

function checkSize() {
  var small = map.getSize()[0] < 600;
  attribution.setCollapsible(small);
  attribution.setCollapsed(small);
}
window.addEventListener('resize', checkSize);
checkSize();

```

# 15.2 FullScreen control
```js
// control
import {
  defaults as defaultControls,
  Attribution,
  FullScreen
} from 'ol/control';

const fullscree = new FullScreen();

const map = new Map({
  target: 'map',
  layers: layers,
  view: new View({
    center: center,
    zoom: 10
  }),
  controls: defaultControls({
    attribution: false
  }).extend([
    attribution,
    fullscreen
  ])
});
```
```css
// style.css
.map:-moz-full-screen {
    height:100% ;
  }

  .map:-webkit-full-screen {
    height:100% ;
  }

  .map:-ms-fullscreen {
    height: 100% ;
  }

  .map:fullscreen {
    height: 100% ;
  }

  .ol-rotate {
    top: 50px;
  }
```

# 15.3 MousePosition  control
```js
// control
import {
  defaults as defaultControls,
  Attribution,
  FullScreen,
  MousePosition
} from 'ol/control';
import {
  createStringXY
} from 'ol/coordinate.js';

const mousePosition = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: 'EPSG:4326',
  className: 'custom-mouse-position',
  target: 'mouse-position',
  undefinedHTML: '&nbsp;'
});

const map = new Map({
  target: 'map',
  layers: layers,
  view: new View({
    center: center,
    zoom: 10
  }),
  controls: defaultControls({
    attribution: false
  }).extend([
    attribution,
    fullScreen,
    mousePosition
  ])
});
```
```html
<div class="card" style="width: 18rem;">
        <div class="card-body">
            <form>
                <div class="form-group">
                    <label>Projection </label>
                    <select class="form-control" id="projection">
                        <option value="EPSG:4326">EPSG:4326</option>
                        <option value="EPSG:3857">EPSG:3857</option>
                    </select>
                    <label>Precision </label>
                    <input class="form-control" id="precision" type="number" min="0" max="12" value="4" />
                    <div id="mouse-position"></div>
                </div>
            </form>
        </div>
    </div>
```
```js
$('#projection').change((e) => {
  mousePosition.setProjection(e.target.value);
});

$('#precision').change((e) => {
  const format = createStringXY(e.target.valueAsNumber);
  mousePosition.setCoordinateFormat(format);
});
```

# 15.4 Overview map 
```js
import {
  defaults as defaultControls,
  Attribution,
  FullScreen,
  MousePosition,
  OverviewMap
} from 'ol/control';

const overviewMap = new OverviewMap({
  layers: [new TileLayer({
    source: new OSM()
  })]
});

const map = new Map({
  target: 'map',
  layers: layers,
  view: new View({
    center: center,
    zoom: 10
  }),
  controls: defaultControls({
    attribution: false
  }).extend([
    attribution,
    fullScreen,
    mousePosition,
    overviewMap
  ])
});
```

# 15.5 zoom to extent 
```js
import {
  defaults as defaultControls,
  Attribution,
  FullScreen,
  MousePosition,
  OverviewMap,
  ZoomToExtent
} from 'ol/control';

const zoomExtent = new ZoomToExtent({
  extent: transformExtent([100.2175, 16.7877, 100.3214, 16.8362], 'EPSG:4326', 'EPSG:3857')
});

const map = new Map({
  target: 'map',
  layers: layers,
  view: new View({
    center: center,
    zoom: 10
  }),
  controls: defaultControls({
    attribution: false
  }).extend([
    attribution,
    fullScreen,
    mousePosition,
    overviewMap,
    zoomExtent
  ])
});
```

# 15.6 zoom to extent 
```js
import {
  defaults as defaultControls,
  Attribution,
  FullScreen,
  MousePosition,
  OverviewMap,
  ZoomToExtent,
  ScaleLine
} from 'ol/control';

const scaleLine = new ScaleLine();

const map = new Map({
  target: 'map',
  layers: layers,
  view: new View({
    center: center,
    zoom: 10
  }),
  controls: defaultControls({
    attribution: false
  }).extend([
    attribution,
    fullScreen,
    mousePosition,
    overviewMap,
    zoomExtent,
    scaleLine
  ])
});
```

# 15.7 zoom slider
```js
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

const zoomslider = new ZoomSlider();

const map = new Map({
  target: 'map',
  layers: layers,
  view: new View({
    center: center,
    zoom: 10
  }),
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
```
```css
// style
.ol-zoomslider {
  top: 120px;
}
```

# 16. layer switcher 
```html

<div class="container">
        <div class="row mt-3">
            <div class=" col-sm-8">
                <div class="card">
                    <div class="card-body" id="xxxxx"></div>
                </div>
            </div>
            <div class=" col-sm-4">
                <div class="card">
                    <div class="card-body"></div>
                </div>
                <div class="card">
                    <div class="card-body"></div>
                </div>
            </div>
        </div>
</div>
```

```html                  
<form>
  <div class="form-group">
      <label>Projection </label>
      <select class="form-control" id="projection">
          <option value="EPSG:4326">EPSG:4326</option>
          <option value="EPSG:3857">EPSG:3857</option>
      </select>
      <label>Precision </label>
      <input class="form-control" id="precision" type="number" min="0" max="12" value="4" />
      <div id="mouse-position"></div>
  </div>
</form>
```

# 16.2 สร้างตัวเลือกชั้นข้อมูล base map
```html
<div class="card-body">
  <label>base map </label>
  <div class="form-check">
      <input class="form-check-input" type="radio" value="osm" name="radio" checked>
      <label class="form-check-label">
          OSM
      </label>
  </div>
  <div class="form-check">
      <input class="form-check-input" type="radio" value="terrain" name="radio">
      <label class="form-check-label">
          Terrain
      </label>
  </div>
  <div class="form-check">
      <input class="form-check-input" type="radio" value="groad" name="radio">
      <label class="form-check-label">
          google road
      </label>
  </div>
  <div class="form-check">
      <input class="form-check-input" type="radio" value="ghybrid" name="radio">
      <label class="form-check-label">
          google hybrid
      </label>
  </div>
  <div class="form-check">
      <input class="form-check-input" type="radio" value="bingmap" name="radio">
      <label class="form-check-label">
          bingmap
      </label>
  </div>
</div>
```
```js
// basemap
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

  // base layer switcher 
  $(':radio').change((e) => {
    console.log(e.target.value);
    layers.forEach((l) => {
      if (l.values_.isBaseLayer === true) {
        if (l.values_.title === e.target.value) {
          l.setVisible(true);
        } else {
          l.setVisible(false);
        }
      }
    })
  })

```
# 16.3 สร้างตัวเลือกชั้นข้อมูล overlay map
```html
                  <div class="card-body">
                        <label>overlay layers</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="province" id="defaultCheck1" checked>
                            <label class="form-check-label" for="defaultCheck1">
                                ขอบเขตจังหวัด
                            </label><br>
                            <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:province">
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="amphoe" id="defaultCheck2">
                            <label class="form-check-label" for="defaultCheck2">
                                ขอบเขตอำเภอ
                            </label><br>
                            <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:amphoe">
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="tambon" id="defaultCheck3">
                            <label class="form-check-label" for="defaultCheck3">
                                ขอบเขตตำบล
                            </label><br>
                            <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:tambon">
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="ways" id="defaultCheck4">
                            <label class="form-check-label" for="defaultCheck2">
                                ถนน
                            </label><br> <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:ways">
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="village" id="defaultCheck4">
                            <label class="form-check-label" for="defaultCheck2">
                                หมู่บ้าน
                            </label><br> <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:village">
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="hospital" id="defaultCheck4">
                            <label class="form-check-label" for="defaultCheck2">
                                สถานพยาบาล
                            </label>
                            <!-- <br> <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:village"> -->
                        </div>
                    </div>
```
```js
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

```

# 17. popup 
```js
import Overlay from 'ol/Overlay';
```
```html
<div class="card">
  <div class="card-body" id="map"></div>
  <!-- popup -->
  <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
  </div>
</div>
```

```js
var container = document.getElementById(‘popup’);
var content = document.getElementById(‘popup - content’);
var closer = document.getElementById(‘popup - closer’);

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

map.on('singleclick', (e) => {
  var coordinate = e.coordinate;
  // console.log(toLonLat(e.coordinate, 'EPSG:3857'))
  content.innerHTML = '<p>You clicked here:</p><code>' + coordinate +
    '</code>';
  overlay.setPosition(coordinate);
});
```

```css
  .ol-popup {
  position: absolute;
  background-color:white;
  -webkit-filter:drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter:drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.ol-popup-closer:after {
  content: "✖";
}
```
# 18. getFeature
```js
// popup
// var container = document.getElementById('popup');
// var content = document.getElementById('popup-content');
// var closer = document.getElementById('popup-closer');
var container = $('#popup')[0];
var closer = $('#popup-closer')[0];

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
```
# 19. getLegend
```html

              <div class="card">
                    <div class="card-body">
                        <label>overlay layers</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="province" id="defaultCheck1" checked>
                            <label class="form-check-label" for="defaultCheck1">
                                ขอบเขตจังหวัด
                            </label><br>
                            <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:province">
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="amphoe" id="defaultCheck2">
                            <label class="form-check-label" for="defaultCheck2">
                                ขอบเขตอำเภอ
                            </label><br>
                            <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:amphoe">
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="tambon" id="defaultCheck3">
                            <label class="form-check-label" for="defaultCheck3">
                                ขอบเขตตำบล
                            </label><br>
                            <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:tambon">
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="ways" id="defaultCheck4">
                            <label class="form-check-label" for="defaultCheck2">
                                ถนน
                            </label><br> <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:ways">
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="village" id="defaultCheck4">
                            <label class="form-check-label" for="defaultCheck2">
                                หมู่บ้าน
                            </label><br> <img
                                src="http://119.59.125.189:8080/mapservice/gistnu/ows?service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gistnu:village">

                        </div>
                    </div>
                </div>
```

# 20. Draw and Modify
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <!-- Popper JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <!-- Latest compiled JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

    <link rel="stylesheet" href="https://openlayers.org/en/v5.3.0/css/ol.css" type="text/css">
    <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
    <script
        src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL">
    </script>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <nav class="navbar navbar-expand-md bg-dark navbar-dark">
        <div class="container">
            <!-- Brand -->
            <a class="navbar-brand" href="#">Navbar</a>

            <!-- Toggler/collapsibe Button -->
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navbar links -->
            <div class="collapse navbar-collapse" id="collapsibleNavbar">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="adddata.html">addata</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container">
        <div class="row mt-3">
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-body" id="map"></div>

                </div>
            </div>
        </div>
    </div>
</body>
<script src="adddata.js"></script>

</html>
```

```js
// adddata.js
window.$ = require('jquery');

import 'ol/ol.css';
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

// add layers
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

// create map object
const map = new Map({
  target: 'map',
  layers: [groad, prov],
  view: view
});

// create layer
var source = new VectorSource();

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

// Import Draw module 
import {
  Draw
} from 'ol/interaction';

import {
  Draw
} from 'ol/interaction';



// draw
var drawPoly = new Draw({
  source: source,
  type: 'Polygon'
});
map.addInteraction(drawPoly);

```

# create table
```sql
CREATE TABLE public.digitize(
  gid serial not null,
  name_t character varying(50) COLLATE pg_catalog.
  "default",
  desc_t character varying(50) COLLATE pg_catalog.
  "default",
  type_g text COLLATE pg_catalog.
  "default",
  geom geometry(Geometry, 4326) NOT NULL,
  CONSTRAINT addfeature_digitize_pkey PRIMARY KEY(gid)
)
```

# create node web api
```bash
npm init
npm i --save express
npm i --save body-parser
npm i --save cors
npm i --save pg
```

#node_module สร้างไฟล์ชื่อ app.js  ใน
```js
const express = require(‘express’);
const bodyParser = require(‘body - parser’);
const cors = require(‘cors’);

const app = express();
// CORS
app.use(cors());
app.options(‘ * ’, cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


const Pool = require(c).Pool
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'geodb',
  password: '1234',
  port: 5432,
});
//  insert table
app.listen(3000, () => {
  console.log(‘run on port 3000..’)
})


// node.js insert feature
app.post('/api/insertfeature', (req, res) => {
  const {
    name_t,
    geom,
    type
  } = req.body;

  const sql = `INSERT INTO digitize (name_t, geom, type_g) VALUES ( 
      '${name_t}', ST_SetSRID(st_geomfromgeojson('${geom}'), 4326), '${type}')`;

  db.query(sql)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'retrived list'
      });
    })
});

// update feature
app.post('/api/updatefeature', (req, res) => {
  const {
    name_t,
    geom
  } = req.body;

  const sql = `UPDATE digitize 
              SET geom=ST_SetSRID(st_geomfromgeojson('${geom}'), 4326) 
              WHERE name_t='${name_t}'`;

  db.query(sql)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'retrived list'
      });
    })
});
```

# 20. send to database
```js
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


const jsonPro = `http://localhost:8080/geoserver/workshop/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=workshop:digitize&maxFeatures=50&outputFormat=application%2Fjson`;

var source = new VectorSource({
  format: new GeoJSON(),
  projection: 'EPSG:3857',
  url: jsonPro
});


// node api update feature
app.post('/api/updatefeature', (req, res) => {
  const {
    name_t,
    geom
  } = req.body;

  const sql = `UPDATE digitize 
              SET geom=ST_SetSRID(st_geomfromgeojson('${geom}'), 4326) 
              WHERE name_t='${name_t}'`;

  db.query(sql)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'retrived list'
      });
    })
});

// import app.js
import {
  Draw,
  Modify
} from 'ol/interaction';

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
```
