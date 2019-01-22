function padTimeText(t) {
	return 10 > t ? '0' + t : '' + t;
}
function getTimeText(t, unit) {
	if (t > 0) return t + ' ' + unit + makePlural(t);
}
function makePlural(t) {
	return t === 1 ? '' : 's';
}

var Pitch = {
	progressText: $('#progressText'),
	restartButton: $('#restartButton'),
	alarm: document.getElementById('alarm'),
	alarmVolume: 1,
	startTime: 0,
	endTime: 0,
	totalTime: 0,
	startDate: null,
	ticker: null,
	expired: false,
	expiredMessage: 'Time Expired!',
	start: () => {
		// Initialize timer
		Pitch.expired = false;
		Pitch.totalTime = Pitch.endTime - Pitch.startTime;
		Pitch.startDate = new Date();

		// Start countdown
		Pitch.update();
		Pitch.ticker = setInterval(Pitch.update, 1e3);
	},
	update: () => {
		Time.calcTime();
		Pitch.updateParts(Time);
	},
	updateParts: (t) => {
		if (Pitch.expired === true) return Pitch.onTimeComplete();

		const short = [];
		const times = [];
		if (t.remainingYears > 0) short.push(padTimeText(t.remainingYears) + 'y'), times.push(getTimeText(t.remainingYears, 'year'));
		if (t.remainingMonths > 0) short.push(padTimeText(t.remainingMonths) + 'm'), times.push(getTimeText(t.remainingMonths, 'month'));
		if (t.remainingDays > 0) short.push(padTimeText(t.remainingDays) + 'd'), times.push(getTimeText(t.remainingDays, 'day'));
		if (t.remainingHours > 0) short.push(padTimeText(t.remainingHours)), times.push(getTimeText(t.remainingHours, 'hour'));
		if (t.remainingMinutes > 0) {
			short.push(padTimeText(t.remainingMinutes));
			times.push(getTimeText(t.remainingMinutes, 'minute'));
		} else {
			short.push(padTimeText(0));
		}
		if (t.remainingSeconds > 0) {
			short.push(padTimeText(t.remainingSeconds));
			times.push(getTimeText(t.remainingSeconds, 'second'));
		} else {
			short.push(padTimeText(0));
		}

		Pitch.updateTitle(short.join(':'));
		Pitch.updateText(times.join(' '));
	},
	updateTitle: (t) => {
		document.title = t + ' - Pitchtimer';
	},
	updateText: (t) => {
		Pitch.progressText.html(t);
	},
	onTimeComplete: () => {
		// Play alarm
		Pitch.alarm.volume = Pitch.alarmVolume;
		Pitch.alarm.play();
		Pitch.showAlert();
		clearInterval(Pitch.ticker);

		// Set restart button
		Pitch.restartButton.on('click', () => {
			Pitch.start();
		});
	},
	showAlert: () => {
		Pitch.updateTitle(`${Pitch.expiredMessage}`);
		Pitch.updateText(`${Pitch.expiredMessage}`);
	}
};

$(() => {
	// Load alarm
	Pitch.alarm.load();

	// Start
	if (navigator.userAgent.match(/iphone/i) || navigator.userAgent.match(/ipad/i)) {
		Pitch.updateText('Tap to Start');
		Pitch.progressText.one('click', () => {
			Pitch.start();
		});
	} else {
		Pitch.start();
	}
});
