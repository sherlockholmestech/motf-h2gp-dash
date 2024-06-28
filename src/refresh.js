(async function() {
	axios.get('localhost:8081/refresh')
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	})
	.finally(function () {
	});
  })();