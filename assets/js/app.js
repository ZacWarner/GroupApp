var categoryCount = 0;
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

        var queryUrl = "https://api.discountapi.com/v2/deals?api_key=nvWHzpcy&query=" + category1 + "+" + category2 + "+" + category3 + "&location=sacramento&radius=5";
        grabDeals(queryUrl);
    });

});