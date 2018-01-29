function updateNews() {
    const zipCode = currentUser.preferences.zipCode;
    const url = "https://api.everyblock.com/content/chicago/locations/" + zipCode + "/timeline/?token=44e189ef804ebea66865b04bd96fcff657f860cc"

    function display(articles) {
        $("#newsobject").empty();
        for (let i = 0; i < 10; i++) {
            //as long as embed is not null or undefined, carry on.
            if (articles[i].embed != null || articles[i].embed != undefined) {
                const article = $("<div>")
                //pulls headline and url from API and creates a hyperlink w/ headline as text & news url as the hyperlink
                const headline = articles[i].title;
                const url = articles[i].url;
                const htmlURL = $("<a>").text(headline).attr("href", url);
                htmlURL.addClass("news-heading")
                article.append(htmlURL);
                const description = articles[i].embed.description;
                const htmlContent = $("<div>").addClass("news-content").text(description);
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
    }).fail(function (err) {
        throw err;
    });

}
