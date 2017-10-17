

var BusTrackerModule = (function() { 

	//object to store details of the current request; will also be used to set preferred stop info
	var currentRequest = {
		routeNumber: null,
		direction  : null,
		stopId     : null,
		stpnm      : null
	}

	//--------------//ID selectors for display divs//--------------//
	       //change values, if needed, to match HTML//
	const idOfRouteDiv = "#routes";
	const idOfStopsDiv = "#stops";
	const idOfDirectionsDiv = "#directions";
	const idOfPanelTitleDiv = "#route-panel-title";
	const idOfOutputPanel = "#output";
	//routes is a global variable in routes.js
	const arrayOfRoutes = routes;


	var prefRequest = false;
	//object to return with public methods
	var module = {};

	//--------------------//Private Methods//---------------------//

	//send a query to the CTA's bus tracker API
	function queryCTA(queryType, queryParam = "", callback){
		var queryResult;
		var language = "en";
		const apiKey = "j3yumkkQfPsQd2E3GCE3XeEAW";
		var queryURL = "http://ctabustracker.com/bustime/api/v2/"+queryType+"?key=" + apiKey + '&format=json' + "&locale="+language+"&"+queryParam;
		console.log('queryURL', queryURL);
		const corsProxyURL = "https://cors-anywhere.herokuapp.com/";
		var url = (corsProxyURL + queryURL);// Used CORS proxy to avoid cross origin request issues. Otherwise, Access-Control-Allow-Origin or X-Requested-With request header is needed
		//ajax call to API
		$.ajax({
			url: url,
			method: "GET",
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

	//creates and displays a dropdown menu of bus routes
	function routesDropdown(routesArray, optionalCallback = null){
		var dropdown = $("<select required id='route-select' size=6>")
			.change(function(){ //event listener to call directionsDropdown once route is selected
				$(idOfStopsDiv).empty();
				var route = $(this).val();
				currentRequest.routeNumber = route;
				$(idOfPanelTitleDiv).html("Select a route");
				directionsDropdown(route, optionalCallback);
			});
		routesArray.forEach(function(route){
			var optionText = route.rt + "–" + route.rtnm;
			var option = $("<option>").attr("value", route.rt).text(optionText);
			$(dropdown).append(option);
		});
		$(idOfRouteDiv).append(dropdown);
	}

	//creates and displays a dropdown menu of allowed route directions
	function directionsDropdown(routeNumber, optionalCallback = null){
		queryCTA("getdirections", ("rt="+routeNumber), (function(response){
			var directions = response["bustime-response"].directions;
			var dropdown = $("<select required id='direction-select'>");
			dropdown.append($("<option>")
				.attr("value", null)
				.text("direction of travel"))
			.change(function(){ //event listener to call stopsDropdown once direction is selected
				var direction = $(this).val();
				currentRequest.direction = direction;
				if(direction !== null){
					$(idOfPanelTitleDiv).html("Select your stop");
					stopsDropdown(routeNumber, direction, optionalCallback);
				}
			});
		directions.forEach(function(direction){
			var option = $("<option>").attr("value", direction.dir).text(direction.dir);
			$(dropdown).append(option);
		});
		$(idOfDirectionsDiv).html(dropdown);
		}))	
	}

	//creates and displays a dropdown menu of bus stops on selected route
	function stopsDropdown(routeNumber, direction, optionalCallback = null){
		// console.log('stopsDropdown('+routeNumber+', '+direction+', '+optionalCallback);
		queryCTA("getstops", ("rt="+routeNumber+"&dir="+direction), (function(response){
			var stops = response["bustime-response"].stops;
			var dropdown = $("<select required id='stop-select' size=6>")
			.change(function(){ //event listener to call getPredictions once stop is selected
				var value = $(this).val().split(" ");
				var stopId = value[0];
				var stpnm = value.slice(1).join(" ");
				console.log('stpnm', stpnm);
				console.log('stopId', stopId);
				currentRequest.stopId = stopId;
				currentRequest.stpnm = stpnm;
				//if prefRequest, set preferences
				if (prefRequest === true) {
					prefRequest = false;
					console.log('prefRequest === true');
					return optionalCallback(currentRequest);
				}
				console.log('currentRequest', currentRequest);
				module.getPredictions(routeNumber, stopId, optionalCallback);
			});
		stops.forEach(function(stop){
			var option = $("<option>").attr("value", stop.stpid + " " + stop.stpnm).text(stop.stpnm);
			$(dropdown).append(option);
		});
		$(idOfStopsDiv).html(dropdown);
		}))	
	}

	//-----------------------//Public Methods//--------------------------//

	module.getPredictions = function(routeNumber, stopId, optionalCallback = null){
		console.log('getPredictions called.');
		queryCTA("getpredictions", ("rt="+routeNumber+"&stpid="+stopId+"&top=5"), function(response){
			var predictionsResponse = response["bustime-response"];
			if (predictionsResponse.hasOwnProperty("prd") ){
				var predictions = predictionsResponse.prd;
				if(optionalCallback !== null){
				return optionalCallback([currentRequest, predictions]);
				}else{
					return [currentRequest, predictions];
				}
			}else{
					var error = predictionsResponse.error;
					console.log('error', error);
					if(optionalCallback !== null){
						return optionalCallback([currentRequest, error]);
					}else{
						return [currentRequest, error];
					}
				}
			})
	}
	
	module.getPrefs = function(callback){
		prefRequest = true;
		return routesDropdown(arrayOfRoutes, function(response){
			callback(response);
		});
	}

	module.runQuery = function(){
		prefRequest = false;
		return routesDropdown(arrayOfRoutes);
	}

	module.routeDisplay = function(msg, isError = false){
		//display info on screen
	}

	return module;

	//--------------------------//Utility functions//--------------------------//
	//returns an array of objects, each of which represents one of the bus routes
	// function ctaRoutes(){
	// 	console.log("ctaRoutes() called.");
	// 	queryCTA("getroutes", "", (function(response){
	// 		var routes = response["bustime-response"].routes;
	// 		console.log("routes", routes);
	// 		return routes;
	// 	}));	
	// }
	// const queryParams = {
	// 	"routes": ["getroutes", "routes"],
	// 	"directions": ["getdirections", "dir"],
	// 	"stops": ["getstops", "stops"],
	// 	"predictions": ["getpredictions", "prd"],
	// 	"bulletins": ["getservicebulletins", "sb"]
	// };
	// function getStops(routeNum, direction){
	// 	queryCTA("getstops", ("rt="+routeNum+"&dir="+direction), (function(response){
	// 		var stops = response["bustime-response"].stops;
	// 		console.log("stops", stops);
	// 		return stops;
	// 	}))
	// }
	// 	function log(response){
	// 	console.log("response", response);
	// }

}());//self-invocation
//end of BusModule


BusTrackerModule.getPrefs(function(response){
	BusTrackerModule.getPredictions(response.routeNumber, response.stopId, function(response){
		response.forEach(function(item){
			console.log("item = ",item[0].prdctdn);
		});
	})
	response.routeNumber
});

BusTrackerModule.getPredictions()


