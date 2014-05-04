function getRemainingTranslation(id, numberLine) { 
	var xhr = new XMLHttpRequest();
	xhr.open('GET', adresseServeur+'?p=select&type=remainingTranslation&k='+ convertAccentsForGet(id));
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			displayListLanguage(xhr.responseText, id, numberLine);
		}
	};
	xhr.send(null);
	return xhr;
}

function insertionNouvelleTraduction(id, language, traduction, typeRes, valide, shortValue, longValue) {
	var xhr = new XMLHttpRequest();
		xhr.open('GET', adresseServeur+'?p=insert&id='
				+id+'&type='+typeRes+'&language='+language+'&value='+(traduction)+'&valide='+valide+
				'&valueshort='+shortValue+'&valuelong='+longValue);
	xhr.send(null);
}
function editionTraduction(id, language, traduction, typeRes, valide, shortValue, longValue) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', adresseServeur+'?p=update&id='
			+id+'&type='+typeRes+'&language='+language+'&value='+(traduction)+
			'&valide='+valide+'&shortValue='+shortValue+'&longValue='+longValue);
	xhr.send(null);
}
function suppresionTraduction(id) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', adresseServeur+'?p=delete&id='+id);

	xhr.send(null);
	rafraichir();
}

function displayListLanguage(response, id, numberLine) {
	var selectionLangue = '<select name="language" id="language">';
	aLanguage = response.split('+++');
	for(var i=0 ; i < aLanguage.length-1  ; ++i) { 
		selectionLangue += '<option value='+aLanguage[i]+'>'+aLanguage[i]+'</option>';
	}
	selectionLangue += '</select>';
	tableau.rows[numberLine+1].cells[1].innerHTML += selectionLangue;
}

function traduction(xsConstante, numberLine, xinbreLineTotal, xcstLanguage) {
	tableau = document.getElementById("tableResults"+onglet);
	if(enCoursDeTraduction == false) {	
		enCoursDeTraduction = true;
		affichageLiensTraduction(xinbreLineTotal, false);

		ligne = tableau.insertRow(numberLine+2);
		ligne.insertCell(0);
		ligne.insertCell(1).innerHTML = '<label for="valideTraduce">Valide</label>'+
	          '<input type="checkbox" name="valideTraduce" id="valideTraduce"/>';
		textareaTraduce = '<span id="champSHORTTooLong" class="warningFields">Le champ court est trop long'+ 
		'	(max: <span id="sizeShort"></span> caract&egrave;res)<br /></span>'+
		'<span id="champNORMALTooLong" class="warningFields">Le champ normal est trop long '+
		'	(max: <span id="sizeNormal"></span> caract&egrave;res)<br /></span>'+
		'<span id="champLONGTooLong" class="warningFields">Le champ long est trop long'+ 
		'	(max: <span id="sizeLong"></span> caract&egrave;res)<br /></span> '+
		' 	<span id="champNormalIsNul" class="warningFields">Le champ normal ne peut être vide<br /><br /></span>';

		textareaTraduce += 'Valeur courte: <textarea onkeydown="actionVerifSizeString(\'SHORT\')" cols="40" id="shortvalueTraduce">'+
			'</textarea><br />';
		textareaTraduce += 'Valeur normale: <textarea onkeydown="actionVerifSizeString(\'NORMAL\')" cols="40" id="valueTraduce">'+
			'</textarea><br />';
		textareaTraduce += 'Valeur longue: <textarea onkeydown="actionVerifSizeString(\'LONG\')" cols="40" id="longvalueTraduce">'+
			'</textarea>';
		ligne.insertCell(2).innerHTML += textareaTraduce;
		document.getElementById('shortvalueTraduce').onkeydown = function() { actionVerifSizeString('SHORT',this)};
		document.getElementById('valueTraduce').onkeydown = function() { actionVerifSizeString('NORMAL', this)};
		document.getElementById('longvalueTraduce').onkeydown = function() { actionVerifSizeString('LONG', this)};

		ligne.insertCell(3).innerHTML = '<a id="validerTraduction" class="traduction">Valider</a> &mdash; '+ 
										'<a id="annulerTraduction" class="traduction">Annuler</a>';
		document.getElementById('annulerTraduction').onclick = function() {
			actionAnnulerTraduction(numberLine, xinbreLineTotal);
		};
	
		document.getElementById('validerTraduction').onclick = function(id) {
			actionValiderTraduction(numberLine, xsConstante, xinbreLineTotal);
		};
	
		
		getRemainingTranslation(xsConstante, numberLine+1);
	}
}

