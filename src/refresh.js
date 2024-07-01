const { invoke } = window.__TAURI__.tauri;
let chartdata = [
	{ seconds: 0, voltage: 0 },
];

let voltchart = new Chart(
	document.getElementById('acquisitions'),
	{
		type: 'line',
		data: {
		labels: chartdata.map(row => row.seconds),
		datasets: [
			{
			label: 'Voltage/V',
			data: chartdata.map(row => row.voltage)
			}
		]
		}
	}
);

let initialSeconds = Date.now() / 1000;

window.addEventListener("DOMContentLoaded", () => {
	document.querySelector("#clear").addEventListener("click", (e) => {
		e.preventDefault();
		clearData();
	});
	document.querySelector("#download_data").addEventListener("click", async (e) => {
		e.preventDefault();
		download();
	});
});

async function download() {
	await invoke("download", { fileloc: 'battery.json', contents: JSON.stringify(chartdata), homedir: 'sherlock' });
  }
  

function clearData() {
	chartdata = [
		{ seconds: 0, voltage: 0 },
	];
	initialSeconds = Date.now() / 1000;
	if (voltchart instanceof Chart) {
		voltchart.data.labels = chartdata.map(row => row.seconds);
		voltchart.data.datasets[0].data = chartdata.map(row => row.voltage);
		voltchart.update();
		console.log("Data cleared");
	}
}

function refresh() {
	if (start_status == true) {
		axios.get('http://localhost:8081')
		.then(function (response) {
			console.log(response);
			let data = response.data;
			let currentSeconds = Date.now() / 1000;
			let elapsedSeconds = currentSeconds - initialSeconds;
			console.log(elapsedSeconds);
			chartdata.push({ seconds: elapsedSeconds, voltage: Number(data)});
			document.getElementById("battvoltagetext").innerText = "Battery Voltage: " + data + " V";
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
		});
		if (voltchart instanceof Chart) {
			voltchart.data.labels = chartdata.map(row => row.seconds);
			voltchart.data.datasets[0].data = chartdata.map(row => row.voltage);
			voltchart.update();
		}
	}
}


setInterval(refresh, 1000);

