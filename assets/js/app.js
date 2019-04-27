$(document).ready(function () {

    //makes the map
    mapboxgl.accessToken = 'pk.eyJ1IjoiemFjd2FybmVyIiwiYSI6ImNqdXVoNnZjajAxeTc0ZGtkdzVvM3ZwaGgifQ.h2Oz3m2dO3yYJJFosZeAgQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11'
    });


    map.addControl(new mapboxgl.NavigationControl());

    //locate yourself button
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));


    //adds directions box under map
    var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken
    });
    console.log(directions);
    document.getElementById('directions').appendChild(directions.onAdd(map));


    //this will get us the api calls from the tools
    directions.on('route', function (ev) {
        //gives route api object
        console.log(ev.route);
        //logs the origin point
        console.log(directions.getOrigin());
        //logs destination point.
        console.log(directions.getDestination());


    });








});