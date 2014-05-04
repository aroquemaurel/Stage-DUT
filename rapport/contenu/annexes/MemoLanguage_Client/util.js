function copy2ClipBoard(stringToCopy) {
	air.Clipboard.generalClipboard.clear();
	air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT, stringToCopy);
}

function trim (string) { 
	return string.replace(/^\s+/g,'').replace(/\s+$/g,'') ;
}
function typeToString(type) {
	return ((type == 'ITEM') ? 'Item' : 'Phrase');
}
function htmlentities(xString) {
	xString=xString.toString();
	xString=xString.replace(/&/g, "&amp;") ;
	xString=xString.replace(/"/g, "&quot;") ;
	xString=xString.replace(/</g, "&lt;") ;
	xString=xString.replace(/>/g, "&gt;") ;
	xString=xString.replace(/'/g, "&#146;") ;
	 return xString;
 }
 
 function typeSearchString2Int($xstype) {
	if(typeSearch == 'text') {
		return 1;
	} else if(typeSearch == 'id') {
		return 0;
	}
 }
 
 function nomTableToNewOrOld(xsNomTable) {
	 return ((xsNomTable == 'RES_dicoLanguage') ? 'la nouvelle' : 'l\'ancienne');
 }
 /**
  * Coupe la string xsToCut Ã  xiNbChar
  */
 function cutString(xsToCut, xiNbCharBegin, xiNbCharEnd) {
	var sReturn = '';
	
	if(xsToCut.length < xiNbCharEnd) {
		sReturn = xsToCut;
	} else if(xsToCut.length - xiNbCharBegin<= xiNbCharEnd){
		sReturn = '<a href="#" class="info">'+xsToCut.substr(xiNbCharBegin,xsToCut.length)+ '<span class="textinfo">'+xsToCut+'</span></a>';
	} else {
		sReturn = '<a href="#" class="info">'+xsToCut.substr(xiNbCharBegin,xiNbCharEnd) + '...<span class="textinfo">'+xsToCut+'</span></a>';
	}
	
	return sReturn;
 }
 
 function convertAccentsForGet(xString) {
		xString = xString.replace(new RegExp(/é/g),"%E9");
		xString = xString.replace(new RegExp(/è/g),"%E8");
		xString = xString.replace(new RegExp(/ê/g),"%EA");
		xString = xString.replace(new RegExp(/ë/g),"%EB");
		xString = xString.replace(new RegExp(/î/g),"%EE");	
		xString = xString.replace(new RegExp(/ù/g),"%F9");	
		xString = xString.replace(new RegExp(/û/g),"%FB");	
		xString = xString.replace(new RegExp(/ç/g),"%E7");	
		xString = xString.replace(new RegExp(/ä/g),"%E4");	
		xString = xString.replace(new RegExp(/à/g),"%E0");	
		xString = xString.replace(new RegExp(/\!/g),"%21");	
		xString = xString.replace(new RegExp(/€/g),"%80");

		return(xString);
 }
 
 function charLangueToString(xsLangue) {
	switch(xsLangue) {
		case 'fr':
			return 'Français';
		case 'en':
			return 'Anglais';
		case 'es':
			return 'Espagnol';
		default :
			return null;
	
	}
}
 function charTypeToString(xsType) {
	 return (xsType == 'text') ? "Texte" : "ID";
 }
 function boolWholeToString(xsWhole) {
	 return (xsWhole) ? "Oui" : "Non";
 }
 function charLangueToInt(xsLangue) {
		switch(xsLangue) {
			case 'fr':
				return 1;
			case 'en':
				return 2;
			case 'es':
				return 3;
			default :
				return null;
		
		}
	}
 function LangIntToChar(xslang) {
		var sret = '';
		switch(xslang) {
			case 1:
				sret = 'fr';
				break;
			case 2:
				sret = 'en';
				break;
			case 3:
				sret = 'es';
				break;
		}
		
		return sret;
	} 
 
 function langCharToImg(xsLang) {
	return ' <img src="img/drapeau-'+xsLang+'.gif" alt="'+xsLang+'"/> ';
 }
 
 function valideCharToImg(xsValide) {
	 return ' <img src="img/valide-'+xsValide+'.png" alt="'+xsValide+'"/> ';
 }
 /**
  * Equivalent de $_GET en php
  * @param name
  * @returns
  */
function getParam(name) {
	var start=location.search.indexOf("?"+name+"=" );
	if (start<0) 
		start=location.search.indexOf("&"+name+"=" );
	
	if (start<0) 
		return '';
	start += name.length+2;
	var end = location.search.indexOf("&",start)-1;
	
	if (end<0) 
		end = location.search.length;
	var result='';
	for(var i=start;i<=end;i++) {
		var c = location.search.charAt(i);
		result = result+(c=='+'?' ':c);
	}
	
	return unescape(result);
}
/**
 * Affiche ou cache tous les liens de traduction
 */
function affichageLiensTraduction(xiNbrLink, visible) {
	var elementLinkTraduce;
	for(var i=0 ; i < xiNbrLink; ++i) {
		elementLinkTraduce = document.getElementById('traduction'+i);
		if(elementLinkTraduce) {
			elementLinkTraduce.style.visibility = (visible) ? "visible" : "hidden";
		}
	}
}

function rafraichir() {
	var keyword;
	tableau = document.getElementById("tableResults"+onglet);
	tableau.innerHTML = '';
	document.getElementById('info'+onglet).innerHTML = '';
	keyword = document.getElementById('keywordTab'+onglet);
	keyword = (!keyword) ? document.getElementById('search').value : keyword.value;
	if(!keyword) {
		keyword = document.getElementById('search').value;
	}
	getResults(keyword, false);
	
	enCoursDeTraduction = false;
}

function closeWindow(xWin) {
	xWin.visible = false;
	setTimeout(function() { xWin.close();}, 1000);
}

/**
 * Retourn faux si la chaine de caractère passée en paramètre est trop longue pour le type
 * @param xsType Le type de valeur
 * @param xiStringSize La chaine de caractère
 * @returns true si la chaine de caractère est correct 
 */
function valueNotToLong(xsType, xsStringSize) {
	var size = 0;
	switch(xsType) {
	case "SHORT":
		size = sizeMaxValueShort;
		break;
	case "NORMAL":
		size = sizeMaxValueNormal;
		break;
	case "LONG":
		size = sizeMaxValueLong;
		break;
	}
	
	return (xsStringSize.length+1 <= size);
}

function writeFile(xstring, xfile) {
	var fileConf = air.File.applicationStorageDirectory.resolvePath(xfile);
	var stream = new air.FileStream();

	stream.open(fileConf, air.FileMode.WRITE );
	stream.writeMultiByte(xstring, air.File.systemCharset );
	stream.close();
}

function readFile(xfile) {
	var fileConf = air.File.applicationStorageDirectory.resolvePath(xfile);
	var stream = new air.FileStream();
	var sReturn;
	stream.open(fileConf, air.FileMode.READ);
	sReturn = stream.readMultiByte(stream.bytesAvailable,air.File.systemCharset);
	stream.close();
	
	return sReturn;
}
