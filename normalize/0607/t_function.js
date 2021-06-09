const u = require('./u_functions');

const check = (inp, exp, res) => {
    const ex = new RegExp(exp, 'i');
    if (inp.value.match(ex)) {
        if (inp.sd.indexOf(res) < 0)
            inp.sd.push(res);
        inp.value = inp.value.replace(ex, '');
        // return inp;
    }
}

const nodata = [];
for (let i = 0; i < u.length; i++) {
    const v = u[i].replace(/ and /g, ',').replace(/at (.*) position|^two: |^two- |^two - |^tree - |^three: |^three- |^three - |^thee - |^one: |^one- |^one - /ig, '');
    // console.log(`   ${v}`)
    let result = { sd: [], value: v };
    v.split('|')[0].split(',').forEach(val => {
        check(result, "retr?ograde Days? of( the)? week", "retrograde Day of Week")
        check(result, "retr?ograde Days?", "retrograde Day")
        check(result, "retr?ograde weeks", "retrograde Week")
        check(result, "retr?ograde Months?", "retrograde Month")
        check(result, "retr?ograde Hours?", "retrograde Hour")
        check(result, "smartphone notifications?", "Smartphone Notifications");
        check(result, "calendar notifications?", "Calendar Notifications");
        check(result, "texts? notifications?", "Text Notifications");
        check(result, "open[ -]heart", "Open Heart");
        check(result, "day counter", "Day Counter");
        check(result, "Hourly time signal", "Hourly Time Signal");
        check(result, "Chrono(graph)?( mechanism| functions?)?", "Chronograph");
        check(result, "texts?", "Text");
        check(result, "app alerts?", "App Alerts");
        check(result, "sweep seconds?", "Sweep Seconds")
        check(result, "solar( power(ed)?)?", "Solar Powered")
        check(result, "Leap Year", "Leap Year")
        check(result, "stop functions?", "Stop Function");
        check(result, "stop[ -]?watch", "Stopwatch");
        check(result, "worl?d ?time", "World Time");
        check(result, "12[ -]?hours?", "12 Hour");
        check(result, "24[ -]?hours?", "24 Hour");
        check(result, "60[ -]?seconds?", "60 Second");
        check(result, "60[ -]?minutes?", "60 Minute");
        check(result, "45[ -]?minutes?", "45 Minute");
        check(result, "30[ -]?minutes?", "30 Minute");
        check(result, "moon[ -]?phase", "Moon Phase");
        check(result, "two[ -]?time|two[ -]?zone|dual[ -]?time|dual[ -]?zone", "Dual Time Zone");
        check(result, "three[ -]?time|three[ -]?zone|three[ -]?time|three[ -]?zone", "Three Time Zone");
        check(result, "\(GMT\)|GMT", "GMT");
        check(result, "t[ae]chy[mn]eter", "Tachymeter");
        check(result, "1\/10(th)?( of)?( the)?( seconds?)", "1/10th of a Second");
        check(result, "1\/20(th)?( of)?( the)?( seconds?)", "1/20th of a Second");
        check(result, "1\/100(th)?( of)?( the)?( seconds?)", "1/100th of a Second");
        check(result, "seconds?", "Seconds");
        check(result, "Power Reserve( Indicator)?", "Power Reserve Indicator");
        check(result, "AM ?\/ ?PM( Indicator)?", "AM/PM Indicator");
        check(result, "Day ?\/ ?Night( Indicator)?|Night ?\/ ?Day( Indicator)?", "Day / Night Indicator");
        check(result, "date", "Date");
        check(result, "Tourbilli?on", "Tourbillon");
        check(result, "Days? of( the)? Week", "Day of Week");
        check(result, "Sun ?(and|\/) ?Moon( indicator)?|Moon ?(and|\/) ?Sun( indicator)?", "Sun / Moon Indicator");
        check(result, "day", "Day");
        check(result, "Month", "Month");
        check(result, "full([ -]auto)? calendar", "Full Auto Calendar");
        check(result, "perpetual calendar", "Perpetual Calendar");
        check(result, "calendar", "Calendar");
        check(result, "digital", "Digital");
        check(result, "\d{0,1} ?snooze alarm", "Snooze Alarm");
        check(result, "\d{0,1} ?daily alarm", "Daily Alarm");
        check(result, "alarm", "Alarm");
        check(result, "countdown timer", "Countdown Timer");
        check(result, "timer", "Timer");
        check(result, "(altimeter|barometer)", "Altimeter");
        check(result, "(thermo|thermometer)", "Thermometer");
        check(result, "digital compass", "Digital Compass");
        check(result, "compass", "Compass");
        check(result, "timer", "Timer");
        check(result, "notifications?", "Notifications");
        check(result, "stop[ -]watch", "Stop-watch");
        check(result, "Sun (and|\/) Moon( indicator)?", "Sun / Moon Indicator");
        check(result, "Sun (and|\/) Moon( indicator)?", "Sun / Moon Indicator");
        check(result, "(full auto el|el)? ?back[ -]?light", "Backlight");
        check(result, "after[ -]?glow", "Afterglow");
        check(result, "(double )?led light", "LED Light");
        check(result, "time zone( mechanism?)", "Time Zone");
        check(result, "(2 hands?|two[ -]hands?) ?movement", "Two-hand Movement");
        check(result, "(3 hands?|(three|thee|tree|thre)[ -]hands?) ?movement", "Three-hand Movement");
        check(result, "elapsed? time", "Elapsed Time");
        check(result, "split time", "Split Time");
        check(result, "lap time", "Lap Time");
        check(result, "low battery( (alerts?|signals?|notifications?|indicators?))?", "Low Batter Alert");
        check(result, "Magnetic ?(resistan(t|ce))?", "Magnetic Resistant");
        check(result, "Shock ?(resistan(t|ce))?", "Shock Resistant");
        // check(result, "", "");
        // check(result, "", "");
        // check(result, "", "");
        // check(result, "", "");
        // check(result, "", "");
        // check(result, "", "");
        // check(result, "", "");
        // check(result, "", "");
        // check(result, "", "");
        // check(result, "", "");
        // console.log(result)
    })
    if (result.sd.length > 0) {
        result.sd.forEach(d => {
            console.log(u[i].split('|')[0] + '|' + d + '|function');
        })
    }
    else nodata.push(u[i]);
}
console.log();
console.log('NO MAPPING................................');
nodata.forEach(d => {
    console.log(d);
})
console.log()
console.log('done')
