var dealsCount = 0;
var queryUrl = "https://api.discountapi.com/v2/deals?api_key=nvWHzpcy&query=food&location=fair+oaks&radius=5&category-slugs=food-grocery,food-alcohol";
$.ajax({
    url: queryUrl,
    method: "GET"
}).then(function (response) {
    console.log(response);
    console.log(response.query.total);
    console.log(response.deals[0].deal.short_title);
    console.log(response.deals[0].deal.image_url);
    console.log(response.deals[0].deal.expires_at);
    var expr = response.deals[0].deal.expires_at;
    var newDate = moment(expr).format("Do MMM dddd");
    console.log(newDate);
    console.log(response.deals[0].deal.merchant.name);
    console.log(response.deals[0].deal.merchant.address);
    console.log(response.deals[0].deal.merchant.locatlity);
    console.log(response.deals[0].deal.merchant.region);
    console.log(response.deals[0].deal.merchant.postal_code);
    console.log(response.deals[0].deal.merchant.country);

    var dealDiv = $("<div>");
    var title = $("<div>");
    title.html(response.deals[0].deal.short_title + "<br>");
    title.append("Expires at: " + response.deals[0].deal.expires_at);
    var img = $("<img>");
    img.attr("src", response.deals[0].deal.image_url);
    var addr = $("<div>");
    addr.html("<p>" + response.deals[0].deal.merchant.name + "," + response.deals[0].deal.merchant.address + "," + response.deals[0].deal.merchant.locatlity + "," + response.deals[0].deal.merchant.region + "," + response.deals[0].deal.merchant.country + "-" + response.deals[0].deal.merchant.postal_code);
    dealDiv.append(title, img, addr);

    $(".result").append(dealDiv);
});