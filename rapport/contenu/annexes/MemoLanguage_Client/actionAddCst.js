function actionAddConstant(xsValue) {
	if(!xsValue) {
		xsValue = '';
	}
}

function actionValiderAjoutCst() {
	var type = "";
	var valide = 0;
	var value = document.getElementById('valueCst').value;
	var shortValue = document.getElementById('shortValue').value;
	var longValue = document.getElementById('longValue').value;
	var cst = document.getElementById('cst').value;
	var elementLangueAjout = document.getElementById('langueAjout');
	var bStopSend = false;
	if(document.getElementById("typeItem").checked) {
		type = "item";
	} else if(document.getElementById("typePhrase").checked) {
		type = "phra";
	}
	
	if(document.getElementById('valide').checked)
		valide = 1;
	else
		valide = 0;
	timer = new Date().getTime();
	if(value == '') {
		document.getElementById('champNormalIsNul').style.display = "inline-block";
		bStopSend = true;
	} else {
		document.getElementById('champNormalIsNul').style.display = "none";
	}
	
	if(cst == 'TRANS_') {
		document.getElementById('cstNotStill').style.display = "inline-block";
		bStopSend = true;
	} else {
		document.getElementById('cstNotStill').style.display = "none";
	}

	if(bStopSend) {
		return;
	}
	insertionNouvelleTraduction(cst, 
			elementLangueAjout.options[elementLangueAjout.selectedIndex].value,
			value, type, valide, shortValue, longValue);
	document.getElementById('short').style.display = 'none';
	document.getElementById('long').style.display = 'none';
	
	cst = "";
	value = "";
	shortValue = "";
	longValue = "";
	
	enCoursDeTraduction = false;
	closeWindow(window.nativeWindow);
}


function actionAddValue(xType) {
	document.getElementById(xType).style.display = "inline-block";
	document.getElementById('link'+xType).style.display = "none";
}

function actionAnnulerAjoutCst() {
	closeWindow(window.nativeWindow);
}

function actionCapsLock() {
	var elementCst = document.getElementById("cst");
	elementCst.value = elementCst.value.toUpperCase();
	elementCst.value = elementCst.value.replace(new RegExp(' ', 'g'), '_');
}
