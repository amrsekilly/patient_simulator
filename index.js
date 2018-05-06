var csv = require("fast-csv"),
  fs = require("fs"),
  path = require("path"),
  delay = require("delay");

// the time it takes to bundle and transmit 5 readings from Arduino to the bluetooth module 
const burstTransmissionTime = 9;
// the number of readings in a burst 
const readingsPerBurst = 5;

var stream = fs.createReadStream("../abonormal_data/106.csv");
var ecgReadings = [];

var csvStream = csv()
// apply this to each reading
.on("data", function (data) {
    let ecgVal = Number(data[0]);
    // console.log(ecgVal);
    // push the current reading to the ecg readings array
    ecgReadings.push(ecgVal);
  })
  // after it's done reading the file
  .on("end", function () {
    // console.log(ecgReadings.length);
    // start the execution of the simulator
    console.log("done parsing");
    // loop over every burst data in the array
    var burst = 0;
    while (burst < ecgReadings.length) {
      // Simulate the Arduino to BLE part
      delay(200)
        .then(() => {
          console.log("Inside promise");
          console.log(ecgReadings.splice(Math.max(ecgReadings.length - 5, 1)));
          burst += readingsPerBurst;
        });
    }
  });
  

stream.pipe(csvStream);

