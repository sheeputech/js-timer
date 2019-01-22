
function getSModifier(e) {
    var g;
    return g = 0 == e ? "" : 1 == e ? " " : "s ";
    }
    
    function padTimeText(e) {
    return 10 > e ? "0" + e : "" + e;
    }
    
    function getTimeText(e, g) {
    var t = "";
    return e > 0 && (t = e + " " + g + getSModifier(e)),
        t;
    }
    
    function windowResize() {
    Pitch.staticArea.width($(window).width() - 20),
        Pitch.staticArea.height($(window).height() - 20),
        Pitch.updateText();
    }
    
    var Pitch = {
    name: "PitchTimer",
    defaultText: "",
    expiredMessage: "",
    progress: 0,
    startTime: 0,
    endTime: 0,
    totalTime: 0,
    parseError: "",
    progressText: null,
    staticArea: null,
    beep: null,
    currDate: null,
    endDate: null,
    ticker: null,
    startButton: null,
    volume: 1,
    sequence: [],
    canAlert: !0,
    start: function() {
        if ("" !== Pitch.parseError && "none" !== Pitch.parseError) {
        return Pitch.progressText.html(Pitch.defaultText),
            void Pitch.updateText(Pitch.defaultText);
        }
        if (0 === Pitch.sequence.length) {
        Pitch.initializeTimer(Pitch.startTime, Pitch.endTime);
        } else {
        var e = Pitch.sequence.shift();
        Pitch.initializeTimer(0, 1e3 * e.duration);
        }
    },
    initializeTimer: function(e, g) {
        Pitch.endTime = g,
        Pitch.startTime = e,
        Pitch.totalTime = Pitch.endTime - Pitch.startTime,
        Pitch.endDate = new Date((new Date).getTime() + Pitch.totalTime),
        Pitch.currDate = new Date,
        Pitch.expiredMessage = Pitch.expiredMessage || "Time Expired!",
        Pitch.update(),
        Pitch.ticker || (Pitch.ticker = setInterval(Pitch.update, 250));
    },
    update: function() {
        Time.calcTime(Pitch.currDate.getTime(), Pitch.endDate.getTime()),
        Pitch.updateParts(Time);
    },
    updateParts: function(e) {
        if (e.totalSeconds < 0){ return void Pitch.onTimeComplete(); }
    
        var g, t, i, a, r, n, s = [];
    
        g = t = i = a = r = n = "",
        e.remainingYears > 0 && (s.push(padTimeText(e.remainingYears) + "y"),
        g = getTimeText(e.remainingYears, "year")),
        e.remainingMonths > 0 && (s.push(padTimeText(e.remainingMonths) + "m"),
        t = getTimeText(e.remainingMonths, "month")),
        e.remainingDays > 0 && (s.push(padTimeText(e.remainingDays) + "d"),
        i = getTimeText(e.remainingDays, "day")),
        e.remainingHours > 0 && (s.push(padTimeText(e.remainingHours) + "h"),
        a = getTimeText(e.remainingHours, "hour")),
        e.remainingMinutes > 0 ? (s.push(padTimeText(e.remainingMinutes)),
        r = getTimeText(e.remainingMinutes, "minute")) : s.push(padTimeText(0)),
        e.remainingSeconds > 0 ? (s.push(padTimeText(e.remainingSeconds)),
        n = getTimeText(e.remainingSeconds, "second")) : s.push(padTimeText(0));
    
        var o = g + t + i + a + r + n;
    
        Pitch.updateTitle(s.join(":")),
        Pitch.updateText(o),
        Pitch.progress = (Pitch.totalTime - e.totalMilliseconds) / Pitch.totalTime,
        Pitch.currDate = new Date;
    },
    updateTitle: function(e) {
        document.title = e + " - Pitchtimer";
    },
    updateText: function(e) {
        e && Pitch.progressText.html(e);
    },
    onTimeComplete: function() {
        if (Pitch.progress = 1,
            Pitch.beep && Pitch.beep.play && (Pitch.beep.volume = Pitch.volume,
            Pitch.beep.play()),
            0 === Pitch.sequence.length){
        clearInterval(Pitch.ticker),
            Pitch.showAlert();
        } else {
        var e = Pitch.sequence.shift();
        Pitch.initializeTimer(0, 1e3 * e.duration);
        }
    },
    showAlert: function() {
        Pitch.canAlert;
    }
    };
    
    $(function() {
    Pitch.staticArea = $("#static"),
        Pitch.staticArea.width($(window).width() - 20),
        Pitch.staticArea.height($(window).height() - 20),
        Pitch.progressText = $("#progressText"),
        Pitch.startButton = $("#progressText"),
        Pitch.updateText(""),
        Pitch.beep = document.getElementById("alarm"),
        $(window).bind("resize", windowResize),
        windowResize(),
        navigator.userAgent.match(/iphone/i) || navigator.userAgent.match(/ipad/i) ? (Pitch.updateText("Tap to Start"),
        Pitch.startButton.click(function() {
        Pitch.beep && Pitch.beep.load && Pitch.beep.load(),
            Pitch.start(),
            Pitch.startButton.unbind("click");
        }),
        Pitch.startButton.show()) : (Pitch.beep && Pitch.beep.load && Pitch.beep.load(),
        Pitch.start());
    });
    