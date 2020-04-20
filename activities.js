function secondsToTime(secs, include_hour, zero)
{
    secs = Math.abs(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    seconds = (seconds < 10 ? '0' : '') + seconds

    if (zero == Boolean(true)) {
		hours = (hours < 10 ? '0' : '') + hours
		minutes = (minutes < 10 ? '0' : '') + minutes
	}

    var obj = {
        "h": hours,
        "m": minutes,     
        "s": seconds,
    };

    if (obj.h != 0 || include_hour == true) {
    	return obj.h + ":" + obj.m + ":" + obj.s;
    } else {
    	return obj.m + ":" + obj.s;
    }
}


function get_elevation(slope)
{
	var elevation = $("div.spans5:contains('Elevation')").next().text();
	if (!slope){
		if (elevation.includes("m")) {
			var elev_in_meters = elevation.replace("m", "").replace(",", "");
			var meters_to_feet = 3.28084
			var elev_in_feet = Math.round(elev_in_meters * meters_to_feet);
			return elev_in_feet + "ft";
		} else if (elevation.includes("ft")) {
			var elev_in_feet = elevation.replace("ft", "").replace(",", "");
			var feet_to_meters = 0.3048
			var elev_in_meters = Math.round(elev_in_feet * feet_to_meters);
			return elev_in_meters + "m";
		} else {
			return false;
		}
	} else {
		if (elevation.includes("m")) {
			var elev_in_meters = elevation.replace("m", "").replace(",", "");
			var meters_to_feet = 3.28084
			var elevation = Math.round(elev_in_meters * meters_to_feet);
			return elevation;
		} else {
			return elevation.replace("ft", "").replace(",", "");
		}
	}

}

function get_distance(slope)
{
	var dist = $("div.label:contains('Distance')").prev().text();
	if (!slope) {
		if (dist.includes("km")) {
			var dist_in_km = dist.replace("km", "");
			var km_to_mi = 0.6213712;
			var dist = dist_in_km * km_to_mi;
			return dist.toFixed(2);
		} else if (dist.includes("mi")){
			var dist_in_mi = dist.replace("mi", "");
			var km_to_km = 1.609344;
			var dist_in_km = dist_in_mi * km_to_km;
			return dist_in_km.toFixed(2);
		}		
	} else {
		if (dist.includes("km")) {
			var dist_in_km = dist.replace("km", "");
			var km_to_mi = 0.6213712;
			var dist = dist_in_km * km_to_mi;
			return dist.toFixed(2);
		} else {
			return dist.replace("mi", "");
		}	
	}
}

function get_slope()
{
	var elev_slope = Math.round(get_elevation(true) / get_distance(true));

	if(isNaN(elev_slope)) { return 0 }

	return elev_slope;
}


function get_rest_time()
{
	var moving_time = $("div.label:contains('Moving Time')").prev().text();
	var elapsed_time = $("span:contains('Elapsed Time')").parent().next().text();

	var moving_split = moving_time.split(':');
	if (moving_split.length == 3) {
		var moving_seconds = (+moving_split[0]) * 60 * 60 + (+moving_split[1]) * 60 + (+moving_split[2]);
	} else {
		var moving_seconds = (+moving_split[0]) * 60 + (+moving_split[1]);
	}


	var elapsed_split = elapsed_time.split(':');
	if (elapsed_split.length == 3){
		var elapsed_seconds = (+elapsed_split[0]) * 60 * 60 + (+elapsed_split[1]) * 60 + (+elapsed_split[2]);
	} else {
		var elapsed_seconds = (+elapsed_split[0]) * 60 + (+elapsed_split[1]);
	}
	var rest_seconds = elapsed_seconds - moving_seconds;
	var rest_time = secondsToTime(rest_seconds, true, Boolean(true));
	
	return rest_time;
}

function get_pace()
{
	if ($("span.title:contains('Run')")) {
		var pace = $("span.run-version:contains('Pace')").parent().prev().text();
		if (pace.includes("/km")) {
			var pace_in_km = pace.replace("/km", "").split(":");
			var seconds_in_km = parseInt(pace_in_km[0]) * 60 + parseInt(pace_in_km[1]);
			var seconds_in_mi = seconds_in_km * 1.609344
			var pace_in_mi = secondsToTime(seconds_in_mi, false, Boolean(false));	
			return pace_in_mi;
		} else if (pace.includes("/mi")) {
			var pace_in_mi = pace.replace("/mi", "").split(":");
			var seconds_in_mi = parseInt(pace_in_mi[0]) * 60 + parseInt(pace_in_mi[1]);
			var seconds_in_km = seconds_in_mi * 0.621371
			var pace_in_km = secondsToTime(seconds_in_km, false, Boolean(false));	
			return pace_in_km;
		}
	} else {
		return false;
	}
	
}

if (get_slope() < 75) {
	var elevation_type = "Flat";
} else if (75 <= get_slope() && get_slope() < 100) {
	var elevation_type = "Rolling";
} else if (100 <= get_slope() && get_slope() < 250) {
	var elevation_type = "Hilly";
} else if (250 <= get_slope()) {
	var elevation_type = "Mountain";
}



$(".more-stats div:first-child div:first-child").parent().after("<div class='row'><div class='spans5'> \
	Elevation in Feet</div><div class='spans3'><b>" + get_elevation().toLocaleString("en") + "</b></div><div class='spans5'> \
Slope</div><div class='spans3'><b>" + get_slope(false) + " ft/mi</b></div></div>");

if (get_pace()) {
	if ($("span.run-version:contains('Pace')").parent().prev().text().includes("/km")) {
		$(".activity-stats ul:first-child li:nth-child(3)").after('<li><strong>' + get_pace() + '<abbr class="unit" title="minutes per mile">/mi</abbr></strong><div class="label"><span class="glossary-link run-version" data-glossary-term="definition-moving-time">Freedom Pace</span></div></li>');
	} else {
		$(".activity-stats ul:first-child li:nth-child(3)").after('<li><strong>' + get_pace() + '<abbr class="unit" title="minutes per kilometer">/km</abbr></strong><div class="label"><span class="glossary-link run-version" data-glossary-term="definition-moving-time">World Pace</span></div></li>');
	}
}

if($(".more-stats div.row:nth-child(1) div:nth-child(3)").text() == "Calories") {
	$(".more-stats div.row:nth-child(3) div.spans3").after("<div class='spans5'>Rest Time </div><div class='spans3'><b>" +  get_rest_time() + "</b></div>");
} else {
	$(".more-stats div.row:nth-child(1) div.spans3").after("<div class='spans5'>Rest Time </div><div class='spans3'><b>" +  get_rest_time() + "</b></div>");
}

if ($("div.label:contains('Distance')").prev().text().includes("mi")) {
	$(".activity-stats ul:first-child li:nth-child(1)").after('<li><strong>' + get_distance(false) + '<abbr class="unit" title="kilometers">km</abbr></strong><div class="label"><span class="glossary-link run-version">World Units</span></div></li>');
} else {
	$(".activity-stats ul:first-child li:nth-child(1)").after('<li><strong>' + get_distance(false) + '<abbr class="unit" title="miles">mi</abbr></strong><div class="label"><span class="glossary-link run-version">Freedom Units</span></div></li>');
}

$(".more-stats").after("<div class='section'><div class='row'><div class='spans3' style='text-align: right;'><b>Flat:</b> </div><div class='spans5'> > 75 feet per mile</div><div class='spans3' style='text-align: right;'><b>Rolling:</b></div><div class='spans5'> 75 - 100 feet per mile</div></div><div class='row'><div class='spans3' style='text-align: right;'><b>Hilly:</b></div><div class='spans5'> ~250 feet per mile</div><div class='spans3' style='text-align: right;'><b>Mountain:</b></div><div class='spans5'> 300+ feet per mile</div></div></div>");
$(".more-stats").after("<div class='section'><div class='row'><div class='spans8' style='text-align: right;'><font style='font-size: 20px; font-weight: 700; line-height: 28px; text-align: right;'>Elevation Type:</font></div><div class='spans4'><h3>" +  elevation_type + "</h3></div></div></div>");

var dist_km = $("div.label:contains('Distance')").prev().text();
var pace_km = $("span.run-version:contains('Pace')").parent().prev().text();

var dist_mi = $("div.label:contains('Freedom Units')").prev().text();
var pace_mi = $("span.run-version:contains('Freedom Pace')").parent().prev().text();

var elevation = $("div.spans5:contains('Elevation in Feet')").next().text();
var moving_time = $("div.label:contains('Moving Time')").prev().text();

$(".activity-summary").append(`
<textarea style='width: 75%; height: 80px'>
Distance: ` + dist_km + ` or ` + dist_mi + `
Pace: ` + pace_km + ` or ` + pace_mi + `
Elevation: ` + elevation + `
Time: ` + moving_time + `
</textarea>`);
