



function queryCTA(queryType, queryParam = "", callback){
	var queryResult;
	var language = "en";
	const apiKey = "j3yumkkQfPsQd2E3GCE3XeEAW";
	var queryURL = "http://ctabustracker.com/bustime/api/v2/"+queryType+"?key="+apiKey+"&format=json&locale="+language+"&"+queryParam;
	console.log('queryURL', queryURL);
	const corsProxyURL = "http://cors-proxy.htmldriven.com/?url=";
	var url = (corsProxyURL + queryURL);// Used CORS proxy to avoid “No Access-Control-Allow-Origin header”
	//ajax call to API
	$.ajax({
		url: url,
		method: "GET"
	}).done(function(response) {
		callback(response);
	})
	.fail(function(error) {
		console.log("error", error);
	})
	.always(function() {
		console.log("request complete");
	});
}

queryCTA("getdirection", "rt=8", function(respone){
	console.log("the response was:", response);
	return response;
})