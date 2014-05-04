function actionCopierVersNouvelleTable(xsOldCst) {
	var options = new air.NativeWindowInitOptions(); 
	options.minimizable = false;
	options.maximizable = false;
	options.resizable = false;
	
	var windowBounds = new air.Rectangle(window.nativeWindow.x+50,window.nativeWindow.y+50,550,300);
	
	newHTMLLoader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds); 
	newHTMLLoader.load(new air.URLRequest("copyToNewTable.html?id="+xsOldCst));

}
function actionValiderCopyToNewTable() {
	var nbLang = document.getElementById('nbLangAffichage').value;
	var data = new Object();
	data['Id'] = document.getElementById('cst').value;
	data['Type'] = (document.getElementById('typeItem').checked) ? 'ITEM' : 'PHRA';
	
	for(var i = 0 ; i < nbLang ; ++i) {
		data['Valide'] = document.getElementById('dataValid'+i).value;
		data['CurrentLang'] = document.getElementById('dataLang'+i).value;
		data['Value'] = document.getElementById('dataValue'+i).value;
		insertionNouvelleTraduction(data['Id'], data['CurrentLang'], data['Value'], data['Type'], data['Valide'],'',''); 
	}
	closeWindow(window.nativeWindow);
}

function actionAnnulerCopyToNewTable() {
	closeWindow(window.nativeWindow);
}

/**
 * Copie dans le presse papier la prototype de xsConstante 
 * @param xsiD L'id 
 * @param xsValue La valeur
 */
function actionCopierProto(xsiD, xsValue){ 
	var sToCopy = '';
	sToCopy += '$language->getTranslation(\''+xsiD+'\'';
	xsValue = xsValue.replace(/###.+###/, '').replace(/___.+___/, '');
	var args = xsValue.match(/<.+>/); //on récupère les variables
	
	if(args != null) { // Si il y a des arguments
		var aArgs = xsValue.split(' ');
		sToCopy += ',';
			
		for(var j=0 ; j < aArgs.length ; ++j) {
			if(aArgs[j].match(/<.+>/) != null) {
				sToCopy += ' ';
				sToCopy += aArgs[j];
			
				if(j >= aArgs.length) //Tant que ce n'est pas le dernier �l�ment
					sToCopy += ',';
			}
		}
	}
	sToCopy += ')';
	copy2ClipBoard(sToCopy);
  }

