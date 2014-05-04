function actionDisplayTypeTab() {
	document.getElementById('typeTab').style.display = "inline-block";
	document.getElementById('btnPlus').style.display = "none";
	document.getElementById('btnValideAddTab').style.display = "inline-block";
}
function actionAddTab() {
	var elementTypeTab = document.getElementById('typeTab');
	addTab(elementTypeTab.options[elementTypeTab.selectedIndex].value);
	document.getElementById('typeTab').style.display = "none";
	document.getElementById('btnPlus').style.display = "inline-block";
	document.getElementById('btnValideAddTab').style.display = "none";
}