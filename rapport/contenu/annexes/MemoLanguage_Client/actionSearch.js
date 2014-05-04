function actionChangeTypeSearch(xsType) {
	typeSearch = xsType;
	var elementText = document.getElementById('optionsText');
	
	if(typeSearch == 'id') {
		elementText.style.display = 'none';
	} else if (typeSearch == 'text') {
		elementText.style.display = 'inline-block';
	}
	
	rafraichir();
}
function actionValideSearch() {
	var elementValide = document.getElementById('estValide');
	var elementNotValide = document.getElementById('estNonValide');
	
	if(elementValide.checked && elementNotValide.checked) {
		valide = 2;
	} else if(elementValide.checked) {
		valide = 1;
	} else if(elementNotValide.checked) {
		valide = 0;
	} else {
		valide=1;
	}
	rafraichir();
}

function actionChangeWholeWord() {
	elementWhole = document.getElementById('wholeWord');
	wholeWord = (elementWhole.checked) ? 1 : 0;
	document.getElementById('regex').checked = false;
	regex = 0;
	
	rafraichir();
}

function actionChangeRegex() {
	elementRegex = document.getElementById('regex');
	regex = (elementRegex.checked) ? 1 : 0;

	document.getElementById('wholeWord').checked = false;
	whole = 0;
	
	rafraichir();
}
function actionSearch(xSearchInOldTable, xForceSearch) {
	var searchElement = document.getElementById('search');

	if(((new Date().getTime() - timer) > 1000) || xForceSearch) {
		enCoursDeTraduction = false;
	
		if (searchElement.value != previousValue || xForceSearch) { 
			previousValue = searchElement.value;
	
			if (previousRequest && previousRequest.readyState < 4) {
				previousRequest.abort(); 
			}
	
			previousRequest = getResults(previousValue, xSearchInOldTable); // On stocke la nouvelle requète
	
			selectedResult = -1; 
		}
		timer = new Date().getTime();
	}
	setTimeout(function(){actionSearch(xSearchInOldTable, false)}, 1000);
}

function actionChangeLanguageSearch (xsLangue) {
	document.getElementById('langSearch').innerHTML = charLangueToString(xsLangue);

	document.getElementById('chkSearch'+charLangueToInt(xsLangue)).checked = true;

	langSearch = xsLangue;

	actionChangeLanguagesResults();
	rafraichir();
}

function actionChangeLanguagesResults() {
	var sRet = '';
	nbLangDemande = 0;
	for(i=1 ; i < 4 ; ++i) {
		if(document.getElementById('chkSearch'+i).checked) {
			nbLangDemande++;
			if(i != 0)
				sRet += '|';
			
			sRet += LangIntToChar(i);
		}
	}
	langResults = sRet;
	rafraichir();
}


function actionChercherIdDansNouvelleTable(xsValue) {
	addTab('Nouvelle');
	changeTab('Nouvelle', nbTabNew);
	actionChangeTypeSearch('text', false);
	tableDb = 'RES_dicoLanguage';
	
	document.getElementById('id').checked = false;
	document.getElementById('text').checked = true;
	
	var searchElement = document.getElementById('search');
	searchElement.value = trim(xsValue);
	
	actionSearch(false, true);
}