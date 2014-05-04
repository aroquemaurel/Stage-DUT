chargerConf();

function chargerConf() {
	adresseServeur = readFile("conf.local");
	
	/* Si la config est inexistante, config par défaut */
	if(adresseServeur == '') {
		writeFile('http://to-audidev-mbx/ADTcom/outilsTranslation/index.php', "conf.local");
	}
}

function actionValiderChangeConf() {
	writeFile(document.getElementById('urlServer').value, "conf.local");
	window.nativeWindow.visible = false;
	if(new Date().getTime() - timer > 1000) {
		window.nativeWindow.close();	
	}
}

function actionAnnulerChangeConf() {
	closeWindow(window.nativeWindow);
}
