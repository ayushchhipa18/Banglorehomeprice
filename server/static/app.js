function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (let i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1; // Invalid Value
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (let i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1; // Invalid Value
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("uiEstimatedPrice");

    var url = "/predict_home_price";

    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    }, function (data, status) {
        console.log("Server response:", data);
        if (data && data.estimated_price !== undefined) {
            estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
        } else {
            estPrice.innerHTML = "<h2>Price could not be estimated</h2>";
            console.error("estimated_price is missing in the response");
        }
        console.log("Status:", status);
    }).fail(function (xhr, status, error) {
        estPrice.innerHTML = "<h2>Error contacting server</h2>";
        console.error("AJAX failed:", status, error);
    });
}

function onPageLoad() {
    console.log("document loaded");
    var url = "/get_location_names";
    $.get(url, function (data, status) {
        console.log("got response for get_location_names request");
        if (data && data.locations) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            $('#uiLocations').append(new Option("Choose a Location", "", true, true));
            locations.forEach(function (location) {
                var opt = new Option(location);
                $('#uiLocations').append(opt);
            });
        } else {
            console.error("Invalid location data:", data);
        }
    }).fail(function (xhr, status, error) {
        console.error("Failed to load location data:", status, error);
    });
}

window.onload = onPageLoad;

