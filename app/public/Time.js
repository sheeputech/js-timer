function int(d) {
	return Math.floor(d);
}

var Time = {
	daysInMonth: [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
	years: 0,
	months: 0,
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
	milliseconds: 0,
	remainingYears: 0,
	remainingMonths: 0,
	remainingDays: 0,
	remainingHours: 0,
	remainingMinutes: 0,
	remainingSeconds: 0,
	remainingMilliseconds: 0,
	calcTime: () => {
		const t = new Date(Pitch.totalTime);

		// 合計残り時間（各単位）
		Time.milliseconds = t.getTime();
		Time.seconds = t / 1e3;
		Time.minutes = t / 6e4;
		Time.hours = t / 36e5;
		Time.days = t / 864e5;
		Time.months = Time.calcMonthsFromDays(Time.days, Pitch.startDate);
		Time.years = Time.months / 12;

		// 単位ごとの残り時間
		Time.remainingYears = int(Time.years);
		Time.remainingMonths = int(Time.months - 12 * Time.remainingYears);
		Time.remainingDays = int(Time.days - Time.calcRemainDaysFromMonths(Pitch.startDate, Time.months));
		Time.remainingHours = int(Time.hours - 24 * int(Time.days));
		Time.remainingMinutes = int(Time.minutes - 60 * int(Time.hours));
		Time.remainingSeconds = int(Time.seconds - 60 * int(Time.minutes));
		Time.remainingMilliseconds = int(Time.milliseconds - 1e3 * int(Time.seconds));

		if (Time.milliseconds < 1000) Pitch.expired = true;
		Pitch.totalTime -= 1e3;
	},
	calcMonthsFromDays: (td, s) => {
		const m = s.getMonth(), y = s.getFullYear();
		let Months = 0;
		while (td > Time.daysInMonth[m]) {
			td -= Time.daysInMonth[m]; // 月に含まれる日数分を引く
			if (m === 2 && Time.isLeapYear(y)) td -= 1, m++; // 閏年の二月である場合は日数を 1 減らす
			if (m === 12) m = 0, y++; // 一二月の場合は月番号を初期化し、年数を 1 増やす
			Months++; // 合計月数を 1 増やす
		}
		return Months + td / Time.daysInMonth[m];
	},
	calcRemainDaysFromMonths: (s, tm) => {
		const m = s.getMonth(), y = s.getFullYear();
		let remainingDays = 0;
		for (let i = 0; i < int(tm); i++) {
			remainingDays += Time.daysInMonth[m];
			if (m === 2 && Time.isLeapYear(y)) remainingDays += 1, m++;
			if (m === 12) m = 0, y++;
		}
		return remainingDays;
	},
	isLeapYear: (y) => {
		return y > 0 && y % 4 === 0 && (y % 100 !== 0 || (y % 100 === 0 && y % 400 === 0));
	}
};
