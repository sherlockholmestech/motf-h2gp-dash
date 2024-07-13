const { invoke } = window.__TAURI__.tauri;
let batteryvoltdata = [{ seconds: 0, voltage: 0 }];

let batteryampdata = [{ seconds: 0, current: 0 }];

let tempdata = [{ seconds: 0, temperature: 0 }];

let voltchart = new Chart(document.getElementById("voltchart"), {
  type: "line",
  data: {
    labels: batteryvoltdata.map((row) => row.seconds),
    datasets: [
      {
        label: "Voltage/V",
        data: batteryvoltdata.map((row) => row.voltage),
      },
    ],
  },
});

let ampchart = new Chart(document.getElementById("ampchart"), {
  type: "line",
  data: {
    labels: batteryvoltdata.map((row) => row.seconds),
    datasets: [
      {
        label: "Current/A",
        data: batteryvoltdata.map((row) => row.current),
      },
    ],
  },
});

let tempchart = new Chart(document.getElementById("tempchart"), {
  type: "line",
  data: {
    labels: tempdata.map((row) => row.seconds),
    datasets: [
      {
        label: "Temperature/C°",
        data: tempdata.map((row) => row.temperature),
      },
    ],
  },
});

let initialSeconds = Date.now() / 1000;

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#clear").addEventListener("click", (e) => {
    e.preventDefault();
    clearData();
  });
  document
    .querySelector("#download_data")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      download();
    });
});

async function download() {
  await invoke("download", {
    fileloc: "batteryvolt.json",
    contents: JSON.stringify(batteryvoltdata),
    homedir: "sherlock",
  });
  await invoke("download", {
    fileloc: "batteryamp.json",
    contents: JSON.stringify(batteryampdata),
    homedir: "sherlock",
  });
  await invoke("download", {
    fileloc: "batterytemp.json",
    contents: JSON.stringify(tempdata),
    homedir: "sherlock",
  });
}

function clearData() {
  batteryvoltdata = [{ seconds: 0, voltage: 0 }];
  batteryampdata = [{ seconds: 0, current: 0 }];
  tempdata = [{ seconds: 0, temperature: 0 }];
  initialSeconds = Date.now() / 1000;
  if (voltchart instanceof Chart) {
    voltchart.data.labels = batteryvoltdata.map((row) => row.seconds);
    voltchart.data.datasets[0].data = batteryvoltdata.map((row) => row.voltage);
    voltchart.update();
    console.log("Data cleared for volt chart");
  }
  if (ampchart instanceof Chart) {
    ampchart.data.labels = batteryampdata.map((row) => row.seconds);
    ampchart.data.datasets[0].data = batteryampdata.map((row) => row.current);
    ampchart.update();
    console.log("Data cleared for amp chart");
  }
  if (tempchart instanceof Chart) {
    tempchart.data.labels = tempdata.map((row) => row.seconds);
    tempchart.data.datasets[0].data = tempdata.map((row) => row.temperature);
    tempchart.update();
    console.log("Data cleared for temp chart");
  }
}

function refresh() {
  if (start_status == true) {
    axios
      .get("http://localhost:8081/volatge/battery")
      .then(function (response) {
        console.log(response);
        let data = response.data;
        let currentSeconds = Date.now() / 1000;
        let elapsedSeconds = currentSeconds - initialSeconds;
        elapsedSeconds = parseFloat(elapsedSeconds.toFixed(2));
        console.log(elapsedSeconds);
        batteryvoltdata.push({
          seconds: elapsedSeconds,
          voltage: Number(data),
        });
        document.getElementById("battvoltagetext").innerText =
          "Battery Voltage: " + data + " V";
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
    if (voltchart instanceof Chart) {
      voltchart.data.labels = batteryvoltdata.map((row) => row.seconds);
      voltchart.data.datasets[0].data = batteryvoltdata.map(
        (row) => row.voltage,
      );
      voltchart.update();
    }
    axios
      .get("http://localhost:8081/amperage/battery")
      .then(function (response) {
        console.log(response);
        let data = response.data;
        let currentSeconds = Date.now() / 1000;
        let elapsedSeconds = currentSeconds - initialSeconds;
        elapsedSeconds = parseFloat(elapsedSeconds.toFixed(2));
        console.log(elapsedSeconds);
        batteryampdata.push({ seconds: elapsedSeconds, current: Number(data) });
        document.getElementById("battcurrenttext").innerText =
          "Battery Current: " + data + " A";
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
    if (ampchart instanceof Chart) {
      ampchart.data.labels = batteryampdata.map((row) => row.seconds);
      ampchart.data.datasets[0].data = batteryampdata.map((row) => row.current);
      ampchart.update();
    }
    axios
      .get("http://localhost:8081/temperature")
      .then(function (response) {
        console.log(response);
        let data = response.data;
        let currentSeconds = Date.now() / 1000;
        let elapsedSeconds = currentSeconds - initialSeconds;
        elapsedSeconds = parseFloat(elapsedSeconds.toFixed(2));
        console.log(elapsedSeconds);
        tempdata.push({ seconds: elapsedSeconds, temperature: Number(data) });
        document.getElementById("batttemptext").innerText =
          "Battery Temperature: " + data + " C";
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
    if (tempchart instanceof Chart) {
      tempchart.data.labels = tempdata.map((row) => row.seconds);
      tempchart.data.datasets[0].data = tempdata.map((row) => row.temperature);
      tempchart.update();
    }
  }
}

setInterval(refresh, 1000);
