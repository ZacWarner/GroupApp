$(document).ready(function () {



    //makes the map
    mapboxgl.accessToken = 'pk.eyJ1IjoiemFjd2FybmVyIiwiYSI6ImNqdXVoNnZjajAxeTc0ZGtkdzVvM3ZwaGgifQ.h2Oz3m2dO3yYJJFosZeAgQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11'
    });

    //finds locations I like this one.
    // map.addControl(new MapboxGeocoder({
    //     accessToken: mapboxgl.accessToken,
    //     mapboxgl: mapboxgl
    // }?
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    //locate yourself button
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));

    // // directions this could work too
    // map.addControl(new MapboxDirections({
    //     accessToken: mapboxgl.accessToken
    // }), 'top-left');


    //this lets you put a geocoder box outside of map.
    // var geocoder = new MapboxGeocoder({
    //     accessToken: mapboxgl.accessToken,
    //     mapboxgl: mapboxgl
    // });
    // document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

    //adds directions box under map
    var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken
    });
    console.log(directions);
    document.getElementById('directions').appendChild(directions.onAdd(map));

    directions.on('route', function (ev) {
        console.log(ev.route);
        console.log(geojson)

    });








});