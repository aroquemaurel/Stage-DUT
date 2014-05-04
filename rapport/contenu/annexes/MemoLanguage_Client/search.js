var previousRequest;
var previousValue;
var tableau = document.getElementById("tableResults"+onglet);
var iterateurLanguages = 0, nbLangAffichage = 0;

var dataTraduceLang, dataCurrentLang, dataValide, dataType, dataValue;

var elementInfoTable = document.getElementById('infoTable'+onglet);
var elementinfos = document.getElementById('info'+onglet);

/**
 * Effectue une requete et recupere les resultats
 */ 
function getResults(keyword, xSearchInOldTable) {
	clicTabForbidden();
	 elementInfos = document.getElementById('info'+onglet);
	 tableau = document.getElementById("tableResults"+onglet);
	xTable = tableDb;
	elementInfoTable = document.getElementById('infoTable'+onglet);
	elementInfoTable.innerHTML = '';
	tableau.innerHTML = '';
	chargerConf();
	nbResults = 0;
	var xhr = new XMLHttpRequest();
	keyword = keyword.replace(new RegExp(' ', 'g'), '-');
	xhr.open('GET', adresseServeur+'?p=select&type='+typeSearch+'&k='+ convertAccentsForGet(keyword)+
			'&whole='+wholeWord+'&regex='+regex+'&langSearch='+
				langSearch+'&langResult='+langResults+'&valide='+valide+'&table='+xTable);

	if(xTable == 'RES_dicoLanguage') {
		elementInfoTable.innerHTML = '<p><img src="img/loading.gif" alt=""/> '+
			'Recherche en cours dans la nouvelle table</p>';
	} else {
		elementInfoTable.innerHTML = '<p><img src="img/loading.gif" alt=""/> '+
			'Recherche en cours dans l\'ancienne table</p>';
	}
	
	if(keyword == '') {
		elementInfoTable.innerHTML = '';
		elementInfos.innerHTML = '';
		clicTabAllow();
		return ;
	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			displayResultsSearch(xhr.responseText, keyword, xTable,xSearchInOldTable);
		}
	};

	xhr.send(null);
	
	return xhr;
}
/**
 * Informe l'utilisateur que des constantes ont ete trouves
 */
function displayInfoCstNotFound(xkeyword) {
	var textInfo = '';
	textInfo = getInfoSearch(xkeyword);
	
	if(tableDb == 'RES_dicoLanguage') {
		tableau.innerHTML = '<div id="ajoutcstNonTrouve">Aucune constante n\'a &eacute;t&eacute; trouv&eacute;e ni '+
			'dans la nouvelle table, ni dans l\'ancienne table<br />';
	} else {
		textInfo += '<div id="ajoutcstNonTrouve">Aucune constante n\'a &eacute;t&eacute; trouv&eacute;e dans l\'ancienne table<br />';
	}
	
	textInfo += '<center><a href="#" id="addCstAfterSearch">'+
		'Ajouter une constante dans la nouvelle table</a></center></div>';
	
	elementInfoTable.innerHTML = textInfo;

}

/**
 * Informe l'utilisateur qu'aucune constante n'a ete trouvee dans les deux tables
 * @param xTable 
 */
function displayInfoCstFound(xTable, xkeyword) {
	var textInfo = '';
	if(xTable != tableDb) {
		textInfo = 'Aucune constante n\'a &eacute;t&eacute; trouv&eacute; dans la nouvelle table. <br/>';
	}
	
	textInfo = getInfoSearch(xkeyword);
	if(nbResults > 1) {
		textInfo += '<strong>'+(nbResults)+'</strong> constantes trouv&eacute;es dans '+
			'<strong>'+nomTableToNewOrOld(xTable)+'</strong> table';
	} else {
		textInfo += '<strong>'+(nbResults)+'</strong> constante trouv&eacute;e dans '+
			'<strong>'+nomTableToNewOrOld(xTable)+'</strong> table';
	}
	
	elementInfos.innerHTML = textInfo;
}

function getInfoSearch(xkeyword) {
	var textInfo = '';
	xkeyword = xkeyword.replace(new RegExp('-', 'g'), ' ');
	textInfo += '<strong>Recherche</strong>: <span id="keywordTab'+onglet+'">'+xkeyword+'</span><br />';
	textInfo += '<strong>Type de recherche</strong>: '+charTypeToString(typeSearch)+'<br />';
	textInfo += '<strong>Mots entiers</strong>: '+boolWholeToString(wholeWord)+'<br /><hr/>';
	document.getElementById('searchTab'+onglet).innerHTML = '<em>'+cutString(xkeyword.toLowerCase(),0,10)+'</em>'; 
	return textInfo
}
/**
 * Informe l'utilisateur qu'aucune constante n'a ete trouvee pour la nouvelle table
 */
function displayInfoStartSearchOldTable(xkeyword) {
	var textInfo = '';
	textInfo = getInfoSearch(xkeyword);
	textInfo += '<div id="cstNonTrouveNouvelle"><p>Aucune constante trouv&eacute;e dans la nouvelle table</p></div>';
	elementInfoTable.innerHTML = textInfo;
}

/**
 *  Affiche les resultats d'une recherche
 */ 	
function displayResultsSearch(response, keyword, xTable, xsearchInOldTab) {
	var titreCol,ligne;
	var dataSearch = new Object();
	
	tableau.innerHTML = "";
	elementInfos.innerHTML = '';
	if(keyword == '' ) {
		elementInfos.innerHTML = '';
	}
	if (response.length) { // On ne modifie les resultats que si on en a obtenu
		if(response == "NO_FOUND") { // aucune constante trouvee
			if(xTable == 'RES_dicoLanguage'){
				displayInfoStartSearchOldTable(keyword);
				if(xsearchInOldTab) {
					clicTabAllow();
					addTab('Ancienne');
					changeTab('Ancienne', nbTabOld);
					getResults(keyword, false); //on lance la recherche dans l'ancienne table
				}
			} else { 
				displayInfoCstNotFound(keyword);
				document.getElementById('addCstAfterSearch').onclick = function(){menuActionAddCst(null, keyword)};
			}
		} else { 
			elementInfoTable.innerHTML = '';
			
			//zou, on remplit le tableau de toutes les constantes trouvees!
			response = response.split('+++'); //chaque ligne 	
			var responseLen = response.length;		
			var elementBouton;
			ligne = tableau.insertRow(-1);
			
			titreCol = ligne.insertCell(-1);
			titreCol.innerHTML += "ID";
			titreCol.className = "titreColonne";
			
			titreCol = ligne.insertCell(-1);
			titreCol.innerHTML += "";
			titreCol.className = "titreColonne";
		
			titreCol = ligne.insertCell(-1);
			titreCol.innerHTML += "Valeur";
			titreCol.className = "titreColonne";
			
			titreCol = ligne.insertCell(-1);
			titreCol.innerHTML += "";
			titreCol.className = "titreColonne";
	
			for (var i = 0 ; i < responseLen -1 ; ++i) {
				dataSearch = getDataSearch(i, response); //on recupere toutes les donnees
				
				nbLangAffichage = getNbLangToDisplay(dataSearch['TraduceLang']);
				++iterateurLanguages;
				
				ligne = tableau.insertRow(-1);//on ajoute une ligne
				
				/* on remplit le tableau avec toutes les cellules */
				addCellsConstanteAndTraduce(i, ligne, responseLen, dataSearch, xTable) ;
				addCellsValide(i, ligne, dataSearch, xTable);
				addCellsTraduceValue(ligne, dataSearch, i, keyword);
				addCellsBtn(i, ligne, dataSearch, xTable);
				
				if(iterateurLanguages >= nbLangAffichage) { 
					iterateurLanguages = 0; 
				}	
			}
			displayInfoCstFound(xTable, keyword);
		}
	} 

	clicTabAllow(); 
}

/**
 * Retourne le nombre de langues qui devront etre affiche
 * @param Les langues dans lesquels la constante est traduite
 * @returns Le nombre de langue
 */
function getNbLangToDisplay(xsLangTraduce, xiNbLangDemande) {
	if(!xiNbLangDemande){
		xiNbLangDemande = nbLangDemande;
	}
	
	return ((xsLangTraduce.length > xiNbLangDemande) ? xiNbLangDemande : xsLangTraduce.length);
}

/**
 * Retourne toutes les donnees d'une recherche dans un tableau associatif
 * @param xiNumberLine Le numero de la ligne
 * @param xresponse La requete
 * @returns {Object} Les donnees 
 */
function getDataSearch(xiNumberLine, xresponse) {
	var data = new Object();
	var values = new Object();
	
	var allDatas = xresponse[xiNumberLine].split('---'); //chaque colonnes
	data['Id'] = trim(allDatas[0]);
	dataLang = allDatas[1];
	
	/* on s'occupe des langues: Langues d'affichage et langue traduite existante dans la base */
	data['TraduceLang'] = allDatas[1].split('###'); 
	data['CurrentLang'] = trim((data['TraduceLang'])[0]);
	data['TraduceLang'].shift();
	data['TraduceLang'] = data['TraduceLang'][0].split(' '); 
	data['TraduceLang'].pop();
	
	/* Les autres champs */
	data['Valide'] = trim(allDatas[2]);
	data['Type'] = trim(allDatas[3]);
	
	values['short'] = (allDatas[5]);
	values['normal'] = (allDatas[4]);
	values['long'] = (allDatas[6]);
	data['value'] = values;
	
	return data;
}

/**
 * Colorie les mots trouves dans le texte
 * @param xsKeyword Mot a chercher
 * @param xsSentence Phrase dans laquelle on doit chercher
 * @returns La chaîne coloree
 */
function colorWordFound(xsKeyword, xsSentence) {
	var sReturn = xsSentence;
	var aKeyword = xsKeyword.split('-');
	var regexHighlighting;
	
	for(var i = 0 ; i < aKeyword.length ; ++i) {
		if(aKeyword[i].length > 2 && typeSearch == 'text') {
			regexHighlighting = new RegExp('('+aKeyword[i]+')', "gi");
			regexHighlighting.exec(sReturn);
			sReturn = sReturn.replace(RegExp.$1, "<span class=\"keyword\">"+RegExp.$1+"</span>");
		}
	}

	return sReturn;
}

	
