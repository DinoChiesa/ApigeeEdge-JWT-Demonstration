var monthNum = {
      "Jan" : "01",
      "Feb" : "02",
      "Mar" : "03",
      "Apr" : "04",
      "May" : "05",
      "Jun" : "06",
      "Jul" : "07",
      "Aug" : "08",
      "Sep" : "09",
      "Oct" : "10",
      "Nov" :  "11",
      "Dec" : "12"
    };
function nowString() {
  var time = (new Date()).toString(),
      tstr = time.substr(11, 4) + '-' +
    monthNum[time.substr(4, 3)] + '-' + time.substr(8, 2) + 'T' +
    time.substr(16, 8) + '+0000';
  return tstr;
}

context.setVariable('outbound.now', nowString());
