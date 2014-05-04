function actionSupprimer(xsConstante) {
	if(confirm("Voulez-vous vraiment supprimer cette constante ? \n" +
			"Toutes les traductions associ√©es seront perdues ")) {
		suppresionTraduction(xsConstante);
	}
	rafraichir();
}
function actionValiderEdition(numberLine, xlang) {
	tableau = document.getElementById("tableResults"+onglet);
	editionTraduction(document.getElementById('cstEdit').value, 
						xlang, 
						document.getElementById('valueEdition').value, 
						(document.getElementById('typeItemEdit').value == 'ITEM') ? 'ITEM' : 'PHRA', 
						(document.getElementById('editValide').checked) ? 1 : 0,
						document.getElementById('shortvalueEdition').value,
						document.getElementById('longvalueEdition').value							
	) ;
	
	tableau.deleteRow(numberLine+1);
	rafraichir();
}

function actionEditer(numberLine, xaData) {
	var sTextConstantes;
	var sTextValideAndLang;
	tableau = document.getElementById("tableResults"+onglet);

	if(enCoursDeTraduction == false) {	
		enCoursDeTraduction = true;
		tableau.deleteRow(numberLine+1);
		ligne = tableau.insertRow(numberLine+1);
		sTextConstantes = '<input type="text" id="cstEdit" value="'+xaData['Id']+'" />'+
		'<br />';
		sTextConstantes += '<input type="radio" name="typeEdit" value="ITEM" id="typeItemEdit"';
		sTextConstantes += (xaData['Type'].toUpperCase() =='ITEM')?'checked="checked"':'';
		sTextConstantes += '/> <label for="typeItemEdit">Item</label>';
		sTextConstantes += '<input type="radio" name="typeEdit" value="PHRA" id="typePhraseEdit"';
		sTextConstantes += (xaData['Type'].toUpperCase()=='PHRA')?'checked="checked"':'';
		sTextConstantes += '/> <label for="typePhraseEdit">Phrase</label>';
		ligne.insertCell(0).innerHTML = sTextConstantes;
		
		sTextValideAndLang = (xaData['Valide'] == 1) ? '<input type="checkbox" id="editValide" checked="checked" /> ':
															'<input type="checkbox" id="editValide" />';
		sTextValideAndLang += 'Valide <br />'+langCharToImg(xaData['CurrentLang']);
		ligne.insertCell(1).innerHTML = sTextValideAndLang;
		textareaEdition = '<span id="champSHORTTooLong" class="warningFields">Le champ court est trop long'+ 
		'	(max: <span id="sizeShort"></span> caract&egrave;res)<br /></span>'+
		'<span id="champNORMALTooLong" class="warningFields">Le champ normal est trop long '+
		'	(max: <span id="sizeNormal"></span> caract&egrave;res)<br /></span>'+
		'<span id="champLONGTooLong" class="warningFields">Le champ long est trop long'+ 
		'	(max: <span id="sizeLong"></span> caract&egrave;res)<br /></span> '+
		' 	<span id="champNormalIsNul" class="warningFields">Le champ normal ne peut Ítre vide<br /><br /></span>';
		
		textareaEdition += 'Valeur courte: <textarea onkeydown="actionVerifSizeString(\'SHORT\')" cols="40" id="shortvalueEdition">'
			+trim(xaData['value']['short'].replace(/###.+###/, '').replace(/___.+___/, ''))+'</textarea><br />';
		textareaEdition += 'Valeur normale: <textarea onkeydown="actionVerifSizeString(\'NORMAL\')" cols="40" id="valueEdition">'
			+trim(xaData['value']['normal'].replace(/###.+###/, '').replace(/___.+___/, ''))+'</textarea><br />';
		textareaEdition += 'Valeur longue: <textarea onkeydown="actionVerifSizeString(\'LONG\')" cols="40" id="longvalueEdition">'
			+trim(xaData['value']['long'].replace(/###.+###/, '').replace(/___.+___/, ''))+'</textarea>';
		ligne.insertCell(2).innerHTML += textareaEdition;
		document.getElementById('shortvalueEdition').onkeydown = function() { actionVerifSizeString('SHORT',this)};
		document.getElementById('valueEdition').onkeydown = function() { actionVerifSizeString('NORMAL', this)};
		document.getElementById('longvalueEdition').onkeydown = function() { actionVerifSizeString('LONG', this)};
		loadSizes();
		ligne.insertCell(3).innerHTML = '<a id="validerEdition" class="traduction">Valider</a> &mdash; '+ 
										'<a id="annulerEdition" class="traduction">Annuler</a>';
		document.getElementById('annulerEdition').onclick = function() {
			tableau.deleteRow(numberLine+1);
			rafraichir();
		};
	
		document.getElementById('validerEdition').onclick = function(id) {
			if(document.getElementById('valueEdition').value != '') {
				actionValiderEdition(numberLine, xaData['CurrentLang']);
			} else { 
				document.getElementById('champNormalIsNul').style.display = 'inline-block'
			}
		};
	
	}
}