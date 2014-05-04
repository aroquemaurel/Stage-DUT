document.onkeyup=function(e) {
    if(e.which == 17) 
    	isCtrl=false;
    document.onkeydown=function(e){
        if(e.which == 17) isCtrl=true;
        if(e.which == 9 && isCtrl == true) {
        	nextTab();
             return false;
        }
    }
}
function nextTab() {
	numOnglet = arrayTabs.indexOf(onglet);
	if(arrayTabs[numOnglet+1]) {
		/^(Ancienne|Nouvelle)([0-9+])$/.exec(arrayTabs[numOnglet+1]);
	} else {
		/^(Ancienne|Nouvelle)([0-9+])$/.exec(arrayTabs[0]);
	}
	changeTab(RegExp.$1,RegExp.$2);
	
}
function changeTab(type, number) {
	var keyword = document.getElementById('keywordTab'+type+number);
	if(!searchInProgress) {
		document.getElementById('onglet_'+onglet).className = 'onglet_0 onglet';
		document.getElementById('onglet_'+type+number).className = 'onglet_1 onglet';
		document.getElementById('contenu_onglet_'+onglet).style.display = 'none';
		document.getElementById('onglet_'+onglet).style.cursor = 'pointer';
		document.getElementById('contenu_onglet_'+type+number).style.display = 'block';
		document.getElementById('onglet_'+type+number).style.cursor = 'default';

		if(type == "Nouvelle") {
			tableDb = "RES_dicoLanguage";
		} else if(type == "Ancienne") {
			tableDb = "RES_Translations";
		}
		
		onglet = type+number;
		
	}
}
function addTab(xsType) {
	var nbTab = 0; 
	var tabs = document.getElementById('displayOnglets');
	var element;
	
	if(xsType == "Nouvelle" || xsType == "Ancienne") {
		if(xsType == "Nouvelle") {
			nbTab = ++nbTabNew;
		} else {
			nbTab = ++nbTabOld;
		}
		element = document.createElement("div");
		tabs.appendChild(element);
		document.getElementById('onglet').innerHTML += 
		'<span class="onglet_0 onglet" id="onglet_'+xsType+nbTab+ 
		'" onclick="changeTab(\''+xsType+'\','+nbTab+')">'+xsType+' table<br /><span class="searchTab"'+ 
			'id="searchTab'+xsType+nbTab+'">&nbsp;</span>'+ 
		'<a href="#" onclick="closeTab(\''+xsType+'\','+nbTab+', '+element+')" id="killTab'+xsType+nbTab+'" class="killTab">'+
		'X</a></span>\n\n';
		
		element.innerHTML = '<div class="contenu_onglet" id="contenu_onglet_'+xsType+nbTab+'">'+
		'<div id="info'+xsType+nbTab+'"> </div>'+
		'<div id="results'+xsType+nbTab+'">'+
		'	<div id="infoResults'+xsType+nbTab+'">'+
		'		<div id="infoTable'+xsType+nbTab+'"></div>'+
		'	</div>'+
		'	<div id="nomTable'+xsType+nbTab+'"></div>'+
		'	<table id="tableResults'+xsType+nbTab+'"></table>'+
		'</div> ';
		
		document.getElementById('onglet_'+xsType+nbTab).onclick = function(xsType, xiNum){ 
			return function() {
				changeTab(xsType, xiNum);
			};
		}(xsType, nbTab);
		arrayTabs.push(xsType+nbTab);
	}
	putEventTabs();
	
}	
function putEventTabs() {
	for(var j = 0 ; j < 2 ; ++j) {
		if(j == 0) {
			typeBuff = 'Nouvelle';
			nbTab = nbTabNew;
		} else if(j == 1) {
			typeBuff = 'Ancienne';
			nbTab = nbTabOld;
		}
		for (var i = 1; i <= nbTab; ++i) {
			document.getElementById('onglet_'+typeBuff+i).onclick = function(xsType, xiNum){ 
				return function() {
					changeTab(xsType, xiNum);
				};
			}(typeBuff, i);
			document.getElementById('killTab'+typeBuff+i).onclick = function(xsType, xiNum){ 
				return function() {
					closeTab(xsType, xiNum);
				};
			}(typeBuff, i);
		}
	}
}
function closeTab(xsType, xiNumber) {
	nextTab();
	document.getElementById('onglet_'+xsType+xiNumber).style.display = "none";
	document.getElementById('onglet_'+xsType+xiNumber).className = 'onglet_0 onglet';
	document.getElementById('contenu_onglet_'+xsType+xiNumber).style.display = 'none';
	arrayTabs.splice(arrayTabs.indexOf(onglet), 1);
}
function clicTabForbidden() {
	searchInProgress = true;
	for(var j = 0 ; j < 2 ; ++j) {
		if(j == 0) {
			typeBuff = 'Nouvelle';
			nbTab = nbTabNew;
		} else if(j == 1) {
			typeBuff = 'Ancienne';
			nbTab = nbTabOld;
		}
		for (var i = 1; i <= nbTab; ++i) {
			document.getElementById('onglet_'+typeBuff+i).style.cursor = "default"; 
		}
	}
}

function clicTabAllow() {
	searchInProgress = false;
	
	for(var j = 0 ; j < 2 ; ++j) {
		if(j == 0) {
			typeBuff = 'Nouvelle';
			nbTab = nbTabNew;
		} else if(j == 1) {
			typeBuff = 'Ancienne';
			nbTab = nbTabOld;
		}
		for (var i = 1; i <= nbTab; ++i) {
			document.getElementById('onglet_'+typeBuff+i).style.cursor = "cursor"; 
		}
	}

}

