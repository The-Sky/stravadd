function addMiles(){
	$("text.week-total-primary").each(function(index) {
		var dist = $(this).text();
		var dist_in_km = dist.replace("km", "");
		var km_to_mi = 0.6213712;
		var converted_distance = dist_in_km * km_to_mi;
		$(this).before('<text class="week-total-secondary" transform="translate(29, 90)">' + converted_distance.toFixed(2) + ' mi</text>');
		// $(this).closest('div.month-block').html($(this).closest('div.month-block').html());
	});


	$("div.month-block").each(function(index) {
		$(this).html($(this).html());
	});
	setTimeout(addMiles, 1000);
}

addMiles()