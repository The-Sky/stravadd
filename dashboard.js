
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

$("<style>.list-stats li { width: 29%; }</style>").appendTo("head");

    var weekly_distance = $("#run > div:nth-child(2)").children('span.actual').text().replace("km", "");
    var weekly_distance_mi = weekly_distance * 0.621371;
    $("div.primary-stats").after('<div class="primary-stats"><span class="actual">' + weekly_distance_mi.toFixed(1) + " mi</span></div>");


function addFreedomUnits() {
	$("div.stat:contains('Distance')").each(function(index) {
		if($(this).parent().parent().is(':last-child') == true && $(this).parent().parent().hasClass('secondary') == false) {
			var distance_km = $(this).children('b').text().replace('km', '');
		    var distance_mi = distance_km * 0.621371;
		    var time = $(this).parent().next().next().children('div').children('b').text();
			if($(this).parent().next().children('div').children('div').text() == "Elev Gain") {
				var elev_ft = $(this).parent().next().children('div').children('b').text().replace('m','');
		        var elev_m =  elev_ft * 3.28084;
				$(this).parent().parent().parent().append('<ul class="list-stats secondary" style="padding-top: 10px; border-top: 1px solid #f0f0f5;"><li><div class="stat"><div class="stat-subtext">Distance</div><b class="stat-text">' + distance_mi.toFixed(2) + ' mi</b></div></li><li><div class="stat"><div class="stat-subtext">Gain</div><b class="stat-text">' + elev_m.toFixed(0) + ' ft</b></div></li><li><div class="stat"><div class="stat-subtext">Time</div><b class="stat-text">' + time + '</b></div></li></ul>');
			}
			if($(this).parent().next().children('div').children('div').text() == "Pace") {
				var pace_in_km = $(this).parent().next().children('div').children('b').text().replace("/km", "").split(":");
				var seconds_in_km = parseInt(pace_in_km[0]) * 60 + parseInt(pace_in_km[1]);
				var seconds_in_mi = seconds_in_km * 1.609344
				var pace_in_mi = secondsToTime(seconds_in_mi, false, Boolean(false));
				$(this).parent().parent().parent().append('<ul class="list-stats secondary" style="padding-top: 10px; border-top: 1px solid #f0f0f5;"><li><div class="stat"><div class="stat-subtext">Distance</div><b class="stat-text">' + distance_mi.toFixed(2) + ' mi</b></div></li><li><div class="stat"><div class="stat-subtext">Pace</div><b class="stat-text">' + pace_in_mi + ' /mi</b></div></li><li><div class="stat"><div class="stat-subtext">Time</div><b class="stat-text">' + time + '</b></div></li></ul>');
			}
		}
	})
	setTimeout(addFreedomUnits, 2000);
}

addFreedomUnits()