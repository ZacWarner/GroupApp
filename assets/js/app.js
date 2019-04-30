var categoryCount = 0;
var locationCoordinates;
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

            var addr = $("<div>");
            addr.addClass("text");
            addr.html("<p>" + response.deals[i].deal.merchant.name + "," + response.deals[i].deal.merchant.address + "," + response.deals[i].deal.merchant.locality + "," + response.deals[i].deal.merchant.region + "-" + response.deals[i].deal.merchant.postal_code);

            var expire = $("<p>");
            expire.html("<b><i>Valid till " + newDate + "</i></b>");
            expire.addClass("deal-validity text");

            subDealDiv.append(addr, expire);

            dealDiv.append(img, title, subDealDiv);

            $(".slider").prepend(dealDiv);

        }
        $('.slider').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
        });
    });
}

$(document).ready(function () {

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

        console.log("co-ords: " + locationCoordinates + "cat1: " + category1 + "cat2: " + category2 + "cat3: " + category3);
        console.log(queryUrl);

        grabDeals(queryUrl);
    });

    // ===========

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
        var destLoc = destination.geometry.coordinates;
        locationCoordinates = destLoc[1] + "," + destLoc[0];
        //destLoc is an array with long at destLoc[0] and lat at destLoc[1]
        console.log(locationCoordinates);

    });
});