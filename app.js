const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// CORS
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'geodb',
    password: '1234',
    port: 5432,
});

app.listen(3000, () => {
    console.log('run on port 3000..')
})

// insert feature
app.post('/api/insertfeature', (req, res) => {
    const {
        name_t,
        geom,
        type
    } = req.body;

    console.log(name_t, type, geom);

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

// delete feature
app.post('/api/deletefeature', (req, res) => {
    const {
        name_t
    } = req.body;

    const sql = `DELETE FROM feature WHERE name_t='${name_t}'`;

    db.query(sql)
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'retrived list'
            });
        })
});

// get feature
app.get('/api/getfeature', (req, res) => {
    const sql = `SELECT jsonb_build_object(
        'type',     'FeatureCollection',
        'features', jsonb_agg(feature)
    )
    FROM (
      SELECT jsonb_build_object(
        'type',       'Feature',
        'id',         gid,
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(row) - 'gid' - 'geom'
      ) AS feature
      FROM (SELECT * FROM feature) row) features`;

    db.query(sql).then((data) => {
        res.status(200).json(data.rows[0].jsonb_build_object)
    })
});

// update value
app.post('/api/updatevalue', (req, res) => {
    const {
        name_t,
        desc_t
    } = req.body;

    const sql = `UPDATE feature 
                SET desc_t='${desc_t}' 
                WHERE name_t='${name_t}'`;

    db.query(sql)
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'retrived list'
            });
        })
});


// module.exports = app;