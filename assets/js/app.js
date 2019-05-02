$(document).ready(function () {

    var categoryCount = 0, brkPnts = [], destLoc = [], stationsAtBrkpnt = [];
    var category1 = "", category2 = "", category3 = "";
    var locationCoordinates = "38.581021,-121.4939328"; //Setting default to sacramento
    var features = [];
    function populateDealCategory() {
        for (let i = 0; i < dealCategories.length; i++) {
            var newOption = $("<option>");
            newOption.text(dealCategories[i].category.name);
            $(".category").append(newOption);
        }
    }

    function grabDeals(queryUrl) {
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $(".lead").html(" ");
            for (let i = 0; i < response.deals.length; i++) {
                var expr = response.deals[i].deal.expires_at;
                var newDate = moment(expr).format("Do MMM dddd");

                var dealDiv = $("<div>");
                dealDiv.addClass("card bg-warning slide");
                dealDiv.attr("style", "width: 18rem;");

                var title = $("<div>");
                title.html(response.deals[i].deal.short_title);
                title.addClass("card-title");

                var img = $("<img>");
                img.addClass("card-img-top image");
                img.attr("src", response.deals[i].deal.image_url);
                img.attr("width", "200");
                img.attr("height", "150");
                img.attr("max-height", "200");

                var subDealDiv = $("<div>");
                subDealDiv.addClass("middle");

                var purchase = $("<a>");
                purchase.addClass("text");
                purchase.html("<a href=\"" + response.deals[i].deal.url + "\">**Purchase**</a>");

                var expire = $("<p>");
                expire.html("<b><i>Valid till " + newDate + "</i></b>");
                expire.addClass("text");

                subDealDiv.append(purchase, expire);

                dealDiv.append(img, title, subDealDiv);

                $(".slider").prepend(dealDiv);

                //adds points to geoJSon
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [response.deals[i].deal.merchant.longitude, response.deals[i].deal.merchant.latitude]
                    },
                    properties: {
                        title: response.deals[i].deal.short_title,
                        description: response.deals[i].deal.description,
                    }
                });

            };
            console.log(features);
            var geojson = {
                type: 'FeatureCollection',
                features: features,
            };

            console.log("works")
            console.log("geojson: " + geojson.features);

            // add markers to map
            geojson.features.forEach(function (marker) {

                // create a HTML element for each feature
                var el = document.createElement('div');
                el.className = 'marker';

                // make a marker for each feature and add to the map
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
                    .addTo(map);
            });

            $('.slider').slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
            });
        });
    }
    function populateElecInfo() {
        var gasQueryUrl = "";
        stationsAtBrkpnt = [];

        // Build Query for break points
        for (let i = 0; i < brkPnts.length; i++) {
            gasQueryUrl = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=awKj0iJVNXb0QimB3G77NzbCMl0iZjlwLxVaRcBQ&latitude=" + brkPnts[i][1] + "&longitude=" + brkPnts[i][0] + "&fuel_type=ELEC&limit=5";
            // API call to NREL
            $.ajax({
                url: gasQueryUrl,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                stationsAtBrkpnt.push(response.fuel_stations);
            });
        }

        // Build Query for destination
        gasQueryUrl = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=awKj0iJVNXb0QimB3G77NzbCMl0iZjlwLxVaRcBQ&latitude=" + destLoc[1] + "&longitude=" + destLoc[0] + "&fuel_type=ELEC&limit=5";

        // API call to NREL
        $.ajax({
            url: gasQueryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            stationsAtBrkpnt.push(response.fuel_stations);

            $(".modal-body").empty();
            // Populate into app
            for (let i = 0; i < stationsAtBrkpnt.length; i++) {
                var newDivHeader = $("<h5>");
                newDivHeader.text(stationsAtBrkpnt[i][0].city);
                var lineBreak = $("<hr>");
                $(".modal-body").append(newDivHeader, lineBreak);
                for (let j = 0; j < stationsAtBrkpnt[i].length; j++) {
                    var newDiv = $("<div>");
                    var stationName = $("<p>");
                    stationName.text(stationsAtBrkpnt[i][j].station_name);
                    var stationAddr = $("<p>");
                    stationAddr.text(stationsAtBrkpnt[i][j].street_address);
                    var stationZip = $("<p>");
                    stationZip.text(stationsAtBrkpnt[i][j].zip);
                    var lineBreak = $("<hr>");
                    newDiv.append(stationName, stationAddr, stationZip, lineBreak);

                    $(".modal-body").append(newDiv);
                }
            }
        });

    }


    populateDealCategory();

    $("select.category").change(function () {
        categoryCount++;
        if (categoryCount < 4) {
            var selectedCategory = $(this).children("option:selected").val();
            $(".item-" + categoryCount).text(selectedCategory);
        }
    });

    $("#find-deals").on("click", function (event) {
        event.preventDefault();

        var tmp = $("li.list-group-item");
        var category1 = tmp[0].innerText;
        var category2 = tmp[1].innerText;
        var category3 = tmp[2].innerText;

        var queryUrl = "https://api.discountapi.com/v2/deals?api_key=nvWHzpcy&query=" + category1 + "+" + category2 + "+" + category3 + "&location=" + locationCoordinates + "&radius=50";

        grabDeals(queryUrl);
    });

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

        var destination = directions.getDestination();
        destLoc = destination.geometry.coordinates;
        locationCoordinates = destLoc[1] + "," + destLoc[0];
        //destLoc is an array with long at destLoc[0] and lat at destLoc[1]
        console.log(locationCoordinates);

        // Find Break Points every 200 miles
        var storeRouteArray = ev.route;
        let calculateDistance = 0;
        brkPnts = [];
        for (let i = 0; i < storeRouteArray[0].legs[0].steps.length; i++) {
            // 321869 meters = 200 miles
            if (calculateDistance < 321869) {
                calculateDistance += storeRouteArray[0].legs[0].steps[i].distance;
            } else {
                let newBrkPnt = storeRouteArray[0].legs[0].steps[i].maneuver.location;
                brkPnts.push(newBrkPnt);
                calculateDistance = storeRouteArray[0].legs[0].steps[i].distance;
            }
        }
        console.log("Break Points Array: " + brkPnts);
        // Pull info on electric gas feed
        populateElecInfo();
    });



});