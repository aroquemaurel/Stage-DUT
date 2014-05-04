/**
 * Ajoute une cellule correspondant aux bouton permettant de copier le prototype
 * @param xinumLigne Num√©ro de la ligne
 * @param xoligne Objet ligne
 * @param xscst Nom de la constante
 * @param xsValue Valeur de la constante
 */
function addCellsBtn(xinumLigne, xoligne, xaData, xTable) {
	var buttons = xoligne.insertCell(-1);
	if(xTable == 'RES_dicoLanguage') {
		if(iterateurLanguages == 1) { 
			buttons.innerHTML += '<input  type="button" style="width:140px" value="Copier prototype" id="copyProto'+onglet+xinumLigne+'"/><br />';
			buttons.innerHTML += '<input  type="button" style="width:140px" value="Copier ID" id="copyId'+onglet+xinumLigne+'"/><br />';
			
			buttons.innerHTML += '<input  type="button" value="Supprimer" style="width:140px" id="delete'+onglet+xinumLigne+'" />';
			elementBoutonCopyProto = document.getElementById('copyProto'+onglet+xinumLigne); 	
			elementBoutonCopyId = document.getElementById('copyId'+onglet+xinumLigne);
			
			elementBoutonDelete = document.getElementById('delete'+onglet+xinumLigne); 		
	
			elementBoutonCopyProto.onclick = function(xsConstante, xValueTraduce){ 
				return function() {
					actionCopierProto(xsConstante, xValueTraduce);
				};
			}(xaData['Id'], xaData['value']['normal']);
	
			elementBoutonCopyId.onclick = function(xsConstante){ 
				return function() {
					copy2ClipBoard(xsConstante);
				};
			}(xaData['Id']);		
		
			elementBoutonDelete.onclick = function(xsConstante){ 
				return function() {
					actionSupprimer(xsConstante);
					
				};
			}(xaData['Id']);
			
			buttons.classname = "buttonCst";
			buttons.style.borderBottom = 'none';
			elementBoutonCopyProto.style.width  = 
				elementBoutonCopyId.style.width = elementBoutonDelete.style.width = '140px';
			
		} else {
			buttons.style.borderTop = 'none';
			buttons.style.borderBottom = 'none';
		}
	} else {
		if(iterateurLanguages == 1) { 
			buttons.innerHTML += '<input  type="button" '+
						'value="Copier vers\nnouvelle table" style="width:140px" id="copyToNewTable'+onglet+xinumLigne+'"/><br />';
			buttons.innerHTML += '<input  type="button" '+
			'value="Chercher cette\nvaleur" style="width:140px;display:none" id="searchToNewTable'+onglet+xinumLigne+'"/><br />';
			elementBoutonSearchNewTable = document.getElementById('searchToNewTable'+onglet+xinumLigne);
			elementBoutonCopyNewTable = document.getElementById('copyToNewTable'+onglet+xinumLigne);
			elementBoutonCopyNewTable.onclick = function(xsOldConstant){
				return function() {
					actionCopierVersNouvelleTable(xsOldConstant);
				};
			}(xaData['Id']);
			elementBoutonSearchNewTable.onclick = function(xsValue){ 
				return function() {
					actionChercherIdDansNouvelleTable(xsValue);
				};
			}(xaData['value']['normal']);
			if(typeSearch == 'id') {
				elementBoutonSearchNewTable.style.display = "inline-block";
			} 
			buttons.classname = "buttonCst";
			buttons.style.borderBottom = 'none';
		} else {
			buttons.style.borderTop = 'none';
			buttons.style.borderBottom = 'none';
		}
	}
}

/**
 * Ajoute une cellule correspondant a la langue, si valide ou non et le bouton d'√©dition
 * @param xinumLigne Num√©ro de la ligne
 * @param xoligne Objet ligne
 * @param xbValide Valide ou non
 * @param xslang Langue
 */
function addCellsValide(xinumLigne, xoligne, xaData, xTable) {
	var elementEdit;
	var valide = xoligne.insertCell(-1);
	valide.innerHTML += '<center>'+valideCharToImg(xaData['Valide']) + langCharToImg(xaData['CurrentLang']);
	
	/* on ne peut Èditer que si on est sur la nouvelle table */
	if(xTable == 'RES_dicoLanguage') {≤
		valide.innerHTML += typeToString(xaData['Type'])+'<input type="button" value="Editer" id="edit'+onglet+xinumLigne+'"/>';
		
	} 
	valide.innerHTML += '</center>';
	valide.className = 'valideAndLang';
	
	if(xTable == 'RES_dicoLanguage') {
		document.getElementById('edit'+onglet+xinumLigne).onclick = function(xinumLigne, xaData){
			return function() {
				actionEditer(xinumLigne, xaData);
			};
		}(xinumLigne, xaData);
	}
}

/**
 * Ajoute une cellule correspondant aux constantes et liens de traduction
 * @param xinumLigne Ligne de la cellule
 * @param xoligne Objet de la ligne
 * @param xiNbTotalLine Nombre total de ligne
 * @param xscst Nom de la constante
 */	
function addCellsConstanteAndTraduce(xinumLigne, xoligne, xiNbTotalLine, xaData, xTable) {
	var constants = xoligne.insertCell(-1);//on a une ajoutÈ une cellule
	elementLangue = document.getElementById('langueAjout');
	constants.id = "cste"+xinumLigne;
	
	if(iterateurLanguages == 1) { 
		++nbResults;
		constants.innerHTML += cutString(xaData['Id'], 0, 16) + '<br/>';
	
		constants.innerHTML += "Traduit en: ";
		for(var j=0; j < xaData['TraduceLang'].length; ++j) {
			constants.innerHTML += langCharToImg(xaData['TraduceLang'][j]);
		}

		if(xTable == 'RES_dicoLanguage') { 
			constants.innerHTML += ((xaData['TraduceLang']).length < 3) ?
				'<br /> <a id="traduction'+xinumLigne+'" class="traduction">Traduire</a>' :
				'<br /> <span id="traduction'+xinumLigne+'"</span>';
		
		document.getElementById('traduction'+xinumLigne).onclick = 
			function(xsConstante, numberLine, xaDataTraduceLang){
				return function () {
					traduction(xsConstante, numberLine, xiNbTotalLine, xaDataTraduceLang);
				} ;
			} (xaData['Id'], xinumLigne, xaData['TraduceLang']);
		}
		constants.style.borderBottom = 'none';
	} else {
		constants.style.borderTop = 'none';
		constants.style.borderBottom = 'none';
	}
	
	constants.className =  "idCst";
}

/**
 * Ajoute une cellule correspondant a la traduction d'une constante
 * @param xoligne Objet de la ligne
 * @param xsSentence Valeur de la constante √† afficher
 */
function addCellsTraduceValue(xoligne, xaData, xinumLigne, xkeyword) {
	var values = xoligne.insertCell(-1);
	if(xaData['value']['short'] && trim(xaData['value']['short']) != '') 
		values.innerHTML += "<strong>Court:</strong> " + colorWordFound(xkeyword,xaData['value']['short'].replace(/###.+###/, '').replace(/___.+___/, ''))+'<br />' ;

	if(tableDb != "RES_Translations") {
		values.innerHTML += "<strong>Normal:</strong> ";
	}
	values.innerHTML += colorWordFound(xkeyword, xaData['value']['normal'].replace(/###.+###/, '').replace(/___.+___/, ''))+'<br />' ;	
	
	if(xaData['value']['long'] && trim(xaData['value']['long']) != '') 
	values.innerHTML += "<strong>Long:</strong> " + colorWordFound(xkeyword, xaData['value']['long'].replace(/###.+###/, '').replace(/___.+___/, ''))+'<br />' ;

	
	values.className =  "valueCst";
	
}


