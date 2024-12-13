class Formatter {
    constructor(format) {
        this.format = format;
    }

    date(date) {
        const lets = { Y: "year", A: "month", N: "day", H: "hours", M: "minutes", S: "seconds", I: "miliseconds" };
        const dt = { year: date.getFullYear(), month: date.getMonth()+1, day: date.getDay(), hours: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds(), miliseconds: date.getMilliseconds() };
        var response = this.format;
        Object.keys(lets).forEach(function(letter) {
            if(letter != "I") {
                response = response.replaceAll(letter+letter, dt[lets[letter]] < 10 ? "0"+dt[lets[letter]] : dt[lets[letter]]);
                response = response.replaceAll(letter, dt[lets[letter]]);
            } else {
                response = response.replaceAll(letter+letter, dt[lets[letter]] < 100 ? (dt[lets[letter]] < 10 ? "0"+dt[lets[letter]] : "00"+dt[lets[letter]]) : dt[lets[letter]]);
                response = response.replaceAll(letter, dt[lets[letter]]);
            }
        });
        return response;
    }
}

export default Formatter
