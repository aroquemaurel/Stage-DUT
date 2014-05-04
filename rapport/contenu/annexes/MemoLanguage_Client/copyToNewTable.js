initFields();
function initFields() {
	document.getElementById('ancienID').innerHTML = getParam('id');
	document.getElementById('cst').value = 'TRANS_'+getParam('id').replace('LANG_', '').
						replace('GLOBAL_', '').replace('ALERT_', '').
						replace('CLASS_','').replace('WIZZARD_','').replace('CONFIG_','').replace('REPORT_','').
						replace('BARO_','').replace('CONST_','').replace('CONF_','');
	getValues(getParam('id'));
}

function getValues(xid) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', adresseServeur+'?p=select&type=id&k='+xid+
			'&langSearch=fr&langResult=fr|en|es&valide=2&table=RES_Translations&searchStrictId=1');

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			displayResults(xhr.responseText, xid, 'RES_Translations');
		}
	};

	xhr.send(null);

	return xhr;
}

function displayResults(response, xid) {
	var titreCol,ligne;
	var dataSearch;
	
	if (response.length) { 
		response = response.split('+++');  	
		var responseLen = response.length;		
		var elementBouton;
		dataSearch = getDataSearch(0, response); 
		nbLangAffichage = getNbLangToDisplay(dataSearch['TraduceLang'], 3); //TODO magic number
		document.getElementById('nbLangAffichage').value = nbLangAffichage;
		for(var i = 0 ; i < nbLangAffichage ; ++i) {
			var element = document.getElementById('value'+i);
			dataSearch = getDataSearch(i, response);
	
			document.getElementById('dataLang'+i).value  = dataSearch['CurrentLang'];
			document.getElementById('dataValid'+i).value = dataSearch['Valide'];
			document.getElementById('dataValue'+i).value = dataSearch['value']['normal'];

			element.innerHTML  = langCharToImg(dataSearch['CurrentLang']);
			element.innerHTML += valideCharToImg(dataSearch['Valide']);
			element.innerHTML += dataSearch['value']['normal'];
		}
	}
	
	document.getElementById('loading').style.display = 'none';
	document.getElementById('btnValid').style.display = 'inline-block';
	document.getElementById('btnCancel').style.display = 'inline-block';
}
