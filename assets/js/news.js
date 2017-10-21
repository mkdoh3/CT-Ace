function updateNews() {

    let zipCode = currentUser.preferences.zipCode;

    //didnt use $parm bc that assumes the paramaters are divided by & symbols, this url is divided by +
    var url = "https://api.everyblock.com/content/chicago/locations/" + zipCode + "/timeline/?token=44e189ef804ebea66865b04bd96fcff657f860cc"

    function display(articles) {
        for (var i = 0; i < 10; i++) {
            //added this because I was getting an error bc some embed objects were empty
            //this just says, as long as embed is not null or undefined, carry on.
            if (articles[i].embed != null || articles[i].embed != undefined) {

                var article = $("<div>")

                //pulls headline and url from API and creates a hyperlink w/ headline as text & news url as the hyperlink

                var headline = articles[i].title;
                var url = articles[i].url;
                var htmlURL = $("<a>").text(headline).attr("href", url);
                htmlURL.addClass("news-heading")
                article.append(htmlURL);
                var description = articles[i].embed.description;
                var htmlContent = $("<div>").addClass("news-content").text(description);
                article.append(htmlContent);

                $("#newsobject").append(article).append($("<hr>"));
            }
        };
    };



    $.ajax({
        url: url,
        method: 'GET',
        dataType: "json"
    }).done(function (data) {
        display(data.results)
        // console.log(data.results[0].embed['description']);
    }).fail(function (err) {
        throw err;
    });




}
