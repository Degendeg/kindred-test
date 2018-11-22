$(document).ready(function() {

	$('.live-matches-bet-btn').hide();
    let i = 0;
	if (!localStorage.hasOwnProperty("feed")) {
		getMatches();
	}

	// If the date from the event and todays date are the same, display another message as to if the date was different
    function checkDate(eventStart) {
        let todaysDate = new Date(Date.now()).toLocaleString();
        if (eventStart.substr(0, 10) === todaysDate.substr(0, 10)) {
            return "Today, " + eventStart.substring(eventStart.lastIndexOf("T") + 1, eventStart.lastIndexOf("Z"));
        }
        return eventStart.substr(0, 10);
    }

	// Get necessary stuff
    function getMatches() {
        const url = "http://api.unicdn.net/v1/feeds/sportsbook/event/live.jsonp?app_id=ca7871d7&app_key=5371c125b8d99c8f6b5ff9a12de8b85a";
        $.ajax({
            url: url,
            cache: true,
            success: function(response) {
				localStorage.setItem("feed", response);
            }
        });
    }
	
	// Show necessary stuff
	function showMatches(response) {
		let res = JSON.parse(response);
		// Start over if i exceeds liveEvents
		if (i > res.liveEvents.length) {
			i = 0;
		}
		// Check if liveData exists
		if (!res.liveEvents[i].liveData !== undefined) {
			// If matchClock is not running, go to next match
			if (!res.liveEvents[i].liveData.matchClock.disabled) {
				$('.live-matches-score').text(res.liveEvents[i].liveData.score.home + " - " + res.liveEvents[i].liveData.score.away);
				// res.group.groups contains FOOTBALL, TENNIS, BASKETBALL, CRICKET, HANDBALL, VOLLEYBALL & GOLF
				if (res.liveEvents[i].event.sport == "TENNIS") {
					$('.live-matches-sport').html('<img src="./images/icons/tennis.png" alt="" />');
				} else if (res.liveEvents[i].event.sport == "FOOTBALL") {
					$('.live-matches-sport').html('<img src="./images/icons/football.png" alt="" />');
				} else if (res.liveEvents[i].event.sport == "BASKETBALL") {
					$('.live-matches-sport').html('<img src="./images/icons/basketball.png" alt="" />');
				} else {
					$('.live-matches-sport').html('<img src="./images/icons/default.png" alt="" />');
				}
				$('.live-matches-opponents').text(res.liveEvents[i].event.name);
				$('.live-matches-date').text(checkDate(res.liveEvents[i].event.start));
				$('.live-matches-bet-btn-href').attr("href", "https://www.unibet.com/betting#/event/live/" + res.liveEvents[i].event.id);
				$('.live-matches-bet-btn').show();
				$('.loader').hide();
			}
		}
	}

	// Keep the ball rolling..
	setInterval(function() {
		i = i + 1;
		showMatches(localStorage.getItem("feed"));
	}, 3000);
	
	// I know that if the user refreshes the page, the timer of 2 minutes starts over.. Let's keep this test client-sided shall we? ;p
	setInterval(function() {
		getMatches();
	}, 120000);
	
});