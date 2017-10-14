
$(document).ready(function(){

	var arrayOfRoutes = routes;//global variable in routes.js

	//send a query to the CTA's bus tracker API
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
	function log(response){
		console.log("request successful");
		console.log("response", response);
	}


	// queryCTA("getvehicles","rt=22", log);


	//--------------------------//Utility functions//--------------------------//

	//returns an array of objects, each of which represents one of the bus routes
	function ctaRoutes(){
		console.log("ctaRoutes() called.");
		queryCTA("getroutes", "", (function(response){
			var routes = response["bustime-response"].routes;
			console.log("routes", routes);
			return routes;
		}));	
	}

	queryParams = {
		"routes": ["getroutes", "routes"],
		"directions": ["getdirections", "dir"],
		"stops": ["getstops", "stops"],
		"predictions": ["getpredictions", "prd"],
		"bulletins": ["getservicebulletins", "sb"]
	};

	// console.log(queryParams["routes"]);

	function queryCategory(category, paramObject, optionalStr = ""){
		var q = paramObject[category];
		console.log("paramObject[category]", q);
		queryCTA(q[0], optionalStr, (function(response){
			console.log("q[0]", q[0]);
			var p = response["bustime-response"][q[1]];
			console.log(p);
			return p;
		}));	
	}


	//queryCategory("predictions", queryParams, "stpid=5951&top=5");


	//returns an array of (usually 2) objects, each a direction of travel of the route
	function routeDirections(routeNum, callback){
		queryCTA("getdirections", ("rt="+routeNum), (function(response){
			console.log(response);
			return callback(response);
		}))
	}

	function getStops(routeNum, direction){
		queryCTA("getstops", ("rt="+routeNum+"&dir="+direction), (function(response){
			var stops = response["bustime-response"].stops;
			console.log("stops", stops);
			return stops;
		}))
	}


//creates dropdown menu of bus routes from an array of routes
	function routesDropdown(routesArray){
		var dropdown = $("<select required id='route-select' size=6>")
			.change(function(){
				$("#stop").empty();
				console.log("route = ", $(this).val());
				$("#route-panel-title").html("Select a route");
				return directionDropdown($(this).val());
			});
		routesArray.forEach(function(route){
			var optionText = route.rt + "–" + route.rtnm;
			var option = $("<option>").attr("value", route.rt).text(optionText);
			$(dropdown).append(option);
		});
		$("#route").append(dropdown);
	}

//creates dropdown menu of allowed route directions
	function directionDropdown(routeNumber){
		console.log("directionDropdown("+routeNumber+") called.");
		queryCTA("getdirections", ("rt="+routeNumber), (function(response){
			console.log("response = ", response);
			var directions = response["bustime-response"].directions;
			console.log("permitted directions = ", directions);
			var dropdown = $("<select required id='direction-select'>");
			dropdown.append($("<option>")
				.attr("value", null)
				.text("direction of travel"))
			//event listener to call stopsDropdown once direction is selected
			.change(function(){
				var direction = $(this).val();
				console.log("this.val() = ", $(this).val());
				if(direction !== null){
					$("#route-panel-title").html("Select your stop");
					return stopsDropdown(routeNumber, direction);
				}
			});
		directions.forEach(function(direction){
			var option = $("<option>").attr("value", direction.dir).text(direction.dir);
			$(dropdown).append(option);
		});
		$("#direction").html(dropdown);
		}))	
	}


	function stopsDropdown(routeNumber, direction){
		console.log("stopDropdown(" + routeNumber + "," + direction + ") called");
		queryCTA("getstops", ("rt="+routeNumber+"&dir="+direction), (function(response){
			console.log(response);
			var stops = response["bustime-response"].stops;
			console.log("stops = ", stops);
			var dropdown = $("<select required id='stop-select' size=6>")
			.change(function(){
				var stop = $(this).val();
				console.log("stop = ", stop);
				return getPredictions(routeNumber, stop);
			});
		stops.forEach(function(stop){
			var option = $("<option>").attr("value", stop.stpid).text(stop.stpnm);
			$(dropdown).append(option);
		});
		$("#stop").html(dropdown);
		}))	
	}

	function getPredictions(routeNumber, stopId){
		console.log('getPredictions('+ routeNumber +', '+ stopId+') called.');
		queryCTA("getpredictions", ("rt="+routeNumber+"&stpid="+stopId), (function(response){
			console.log("getPredictions response = ", response);
			var predictions = response["bustime-response"].prd;
			console.log("predictions = ", predictions);
			var div = $("<div id='predictions>")
			// .change(function(){
			// 	var stop = $(this).val();
			// 	console.log("stop = ", stop);
			// 	return getPredictions(routeNumber, stop);
			// });
		// stops.forEach(function(stop){
		// 	var option = $("<option>").attr("value", stop.stpid).text(stop.stpnm);
		// 	$(dropdown).append(option);
		// });
		$("#output").text(predictions);
		}))	

	}

	function dirTest(queryType, queryParam = "", callback){
		var queryResult;
		var language = "en";
		const apiKey = "j3yumkkQfPsQd2E3GCE3XeEAW";
		var queryURL = "https://ctabustracker.com/bustime/api/v2/"+queryType+"?key="+apiKey+"&format=json&locale="+language+"&"+queryParam;
		console.log('queryURL', queryURL);
		const corsProxyURL = "http://cors-proxy.htmldriven.com/?url=";
		var url = queryURL;// Used CORS proxy to avoid “No Access-Control-Allow-Origin header”
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

//	dirTest("direction", "rt=5", function(response){console.log(response["bustime-response"])});
	console.log(ctaRoutes());
	
	routesDropdown(arrayOfRoutes);

})//end of $(document).ready(function(){}