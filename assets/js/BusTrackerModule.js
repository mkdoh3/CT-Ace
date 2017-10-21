var BusTrackerModule = (function () {

    //object to store details of the current request; will also be used to set preferred stop info
    var currentRequest = {
        routeNumber: null,
        direction: null,
        stopId: null,
        stpnm: null
    }

    //--------------//ID selectors for display divs//--------------//

    //change values, if needed, to match HTML//
    const idOfPanelTitleDiv = "#modalText";
    const idOfDropdownDiv = "#dropDowns";
    const idOfOutputPanel = "#output";

    //routes is a global variable in routes.js
    const arrayOfRoutes = routes;
    // console.log('routes', routes);

    //this will help stopsDropdown determine whether to call getPredictions, or just return user preferences
    var prefRequest = false;
    //object to return with public methods
    var module = {};

    //--------------------//Private Methods//---------------------//

    //send a query to the CTA's bus tracker API
    function queryCTA(queryType, queryParam = "", callback) {
        var queryResult;
        var language = "en";
        const apiKey = "j3yumkkQfPsQd2E3GCE3XeEAW";
        var queryURL = "http://ctabustracker.com/bustime/api/v2/" + queryType + "?key=" + apiKey + '&format=json' + "&locale=" + language + "&" + queryParam;
        // console.log('queryURL', queryURL);

        const corsProxyURL = "https://cors-anywhere.herokuapp.com/";
        //-------a couple of other CORS proxies to try if the first fails-------//
        // const corsProxyURL = "http://cors-proxy.htmldriven.com/?url=";
        // const corsProxyURL = "http://crossorigin.me/";

        var url = (corsProxyURL + queryURL); // Used CORS proxy to avoid cross origin request issues. Otherwise, Access-Control-Allow-Origin or X-Requested-With request header is needed
        //ajax call to API
        $.ajax({
                url: url,
                method: "GET",
            }).done(function (response) {
                console.log(response);
                callback(response);
            })
            .fail(function (error) {
                console.log("error", error);
            })
            .always(function () {
                console.log("request complete");
            });
    }

    //creates and displays a dropdown menu of bus routes
    function routesDropdown(routesArray, optionalCallback = null) {
        $(idOfPanelTitleDiv).html("<h5>Bus Preferences</h5><h3>Select A Route</h3>");
        $(idOfDropdownDiv).fadeOut(1).empty()
        var dropdown = $("<select required id='route-select'>")
        dropdown.append($("<option>")
            .attr("value", null)
            .text("-  bus route  -"))
            .change(function () { //event listener to call directionsDropdown once route is selected
                $(idOfDropdownDiv).fadeOut(1);
                var route = $(this).val();
                var fullRouteName = $(this).text();
                currentRequest.routeNumber = route;
                directionsDropdown(route, optionalCallback);
            });
        routesArray.forEach(function (route) {
            var optionText = route.rt + "–" + route.rtnm;
            var option = $("<option>").attr("value", route.rt).text(optionText);
            $(dropdown).append(option);
        });
        $(idOfDropdownDiv).append(dropdown).fadeIn(800);
    }

    //creates and displays a dropdown menu of allowed route directions
    function directionsDropdown(routeNumber, optionalCallback = null) {
        $(idOfPanelTitleDiv).html("<h5>Bus Preferences</h5><h3>Select Direction of Travel</h3>");
        $(idOfDropdownDiv).fadeOut(1);
        queryCTA("getdirections", ("rt=" + routeNumber), (function (response) {
            var directions = response["bustime-response"].directions;
            var dropdown = $("<select required id='direction-select'>");
            dropdown.append($("<option>")
                .attr("value", null)
                .text("-  direction  -"))
                .change(function () { //event listener to call stopsDropdown once direction is selected
                    var direction = $(this).val();
                    currentRequest.direction = direction;
                    if (direction !== null) {
                        $(idOfPanelTitleDiv).html("Select your stop");
                        stopsDropdown(routeNumber, direction, optionalCallback);
                    }
                });
            directions.forEach(function (direction) {
                var option = $("<option>").attr("value", direction.dir).text(direction.dir);
                $(dropdown).append(option);
            });
            $("#direction-select").remove();
            $(idOfDropdownDiv).after(dropdown.hide());
            dropdown.fadeIn();
        }))
    }

    //creates and displays a dropdown menu of bus stops on selected route
    function stopsDropdown(routeNumber, direction, optionalCallback = null) {
        $(idOfPanelTitleDiv).html("<h5>Bus Preferences</h5><h3>Select Stop</h3>");
        $(idOfDropdownDiv).empty();
        // console.log("optionalCallback passed to stopsDropdown", optionalCallback);
        queryCTA("getstops", ("rt=" + routeNumber + "&dir=" + direction), (function (response) {
            var stops = response["bustime-response"].stops;
            var firstOption = $("<option>").attr("value", null).text("-  bus stop  -");
            var dropdown = $("<select required id='stop-select'>")
            dropdown.append(firstOption)
                .change(function () { //event listener to call getPredictions once stop is selected
                    var value = $(this).val().split(" ");
                    var stopId = value[0];
                    var stpnm = value.slice(1).join(" ");
                    currentRequest.stopId = stopId;
                    currentRequest.stpnm = stpnm;
                    //if prefRequest, set preferences
                    if (prefRequest === true && optionalCallback) {
                        prefRequest = false;
                        // console.log('prefRequest === true');
                        // console.log("optionalCallback was passed currentRequest", optionalCallback);
                        return optionalCallback(currentRequest);
                    }else{//else is 
                    // console.log('currentRequest', currentRequest);
                    module.getPredictions(routeNumber, stopId, optionalCallback);
                    // console.log('optionalCallback', optionalCallback)
                    }
                });
            stops.forEach(function (stop) {
                var option = $("<option>").attr("value", stop.stpid + " " + stop.stpnm).text(stop.stpnm);
                $(dropdown).append(option);
            });
            $("#direction-select").insertBefore(idOfDropdownDiv);
            $(idOfDropdownDiv).append(dropdown.hide());
            dropdown.slideDown(400);
            let submitBtn = $("<btn>")
            submitBtn.addClass("btn btn-success btn-block")
                .attr("id", "submitBtn")
                .text("Submit")
            $("#submitBtn").remove();
            $(idOfDropdownDiv).after(submitBtn)

        }))
    }

    //returns an array of objects, each of which represents one of the bus routes
    function ctaRoutes() {
        // console.log("ctaRoutes() called.");
        queryCTA("getroutes", "", (function (response) {
            var routes = response["bustime-response"].routes;
            // console.log("routes", routes);
            return routes;
        }));
    }

    //-----------------------//Public Methods//--------------------------//

    //returns an array of predicted objects containing bus arrival times and other info
    module.getPredictions = function (routeNumber, stopId, optionalCallback = null) {
        queryCTA("getpredictions", ("rt=" + routeNumber + "&stpid=" + stopId + "&top=4"), function (response) {
            var predictionsResponse = response["bustime-response"];
            if (predictionsResponse.hasOwnProperty("prd")) {
                var predictions = predictionsResponse.prd;
                if (optionalCallback !== null) {
                    return optionalCallback(predictions);
                } else {
                    return predictions;
                }
            } else {
                var error = predictionsResponse.error;
                // console.log('error', error);

                    return optionalCallback(["error", error, currentRequest]);

            }
        });
    }

    //returns the currentRequest object containing the selected route, direction and stop info
    module.getPrefs = function (callback) {
        prefRequest = true;
        // console.log('arrayOfRoutes', arrayOfRoutes);
        return routesDropdown(arrayOfRoutes, callback);
    }


    module.runQuery = function () {
        prefRequest = false;
        return routesDropdown(arrayOfRoutes);
    }

    //returned object makes the modules public methods available
    return module;

}()); //self-invocation 
//end of BusTrackerModule
