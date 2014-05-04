function loadSizes() {
	sizes = readFile("sizeMax.local").split(" ");
	sizeMaxValueShort = sizes[0];
	sizeMaxValueNormal = sizes[1];
	sizeMaxValueLong = sizes[2];
	document.getElementById('sizeShort').innerHTML = sizes[0];
	document.getElementById('sizeNormal').innerHTML = sizes[1];
	document.getElementById('sizeLong').innerHTML = sizes[2];
}

function setMaxLength(response) {
	var data;
	if (response.length) {
		data = response.split(' ');
		sizeMaxValueShort = data[0];
		sizeMaxValueNormal = data[1];
		sizeMaxValueLong = data[2];
		writeFile(sizeMaxValueShort + ' ' + sizeMaxValueNormal + ' ' + sizeMaxValueLong, "sizeMax.local");
	}
}

function getResultsMaxLength() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', adresseServeur+'?p=select&type=structTableMaxLength');

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			setMaxLength(xhr.responseText);
		}
	};

	xhr.send(null);

	return xhr;
}

getResultsMaxLength(); 


