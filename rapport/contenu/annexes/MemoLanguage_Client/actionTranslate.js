function actionAnnulerTraduction(numberLine, xinbreLineTotal) {
	tableau = document.getElementById("tableResults"+onglet);
	tableau.deleteRow(numberLine+2);
	enCoursDeTraduction = false;

	affichageLiensTraduction(xinbreLineTotal, true);
}

function actionValiderTraduction(numberLine, xsConstante, xinbreLineTotal) {
	tableau = document.getElementById("tableResults"+onglet);
	insertionNouvelleTraduction(xsConstante, 
	document.getElementById('language').options[document.getElementById('language').selectedIndex].value,
	document.getElementById('valueTraduce').value, 'PHRA', 
	(document.getElementById('valideTraduce').checked) ? 1 : 0, 
	document.getElementById('shortvalueTraduce').value, document.getElementById('longvalueTraduce').value); 
 
	tableau.deleteRow(numberLine+2);
	enCoursDeTraduction = false;
	
	affichageLiensTraduction(xinbreLineTotal, true);

	rafraichir();
}

function actionVerifSizeString(xsType, element) { 
	if(!valueNotToLong(xsType, element.value)) {
		document.getElementById('champ'+xsType+'TooLong').style.display = 'inline-block';
	} else {
		document.getElementById('champ'+xsType+'TooLong').style.display = 'none';
	}
}
