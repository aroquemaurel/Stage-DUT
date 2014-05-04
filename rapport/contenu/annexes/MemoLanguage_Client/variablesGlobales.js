var appdesc = air.NativeApplication.nativeApplication.applicationDescriptor;   
var nbVersion = (new DOMParser().parseFromString(appdesc,"text/xml").getElementsByTagName("versionNumber")[0]).textContent; 

var sizeMaxValueShort;
var sizeMaxValueNormal;
var sizeMaxValueLong;



var adresseServeur = ""; 
var typeSearch='text';
var wholeWord = 0;
var regex = 0;

var langSearch = 'fr';
var langResults = 'fr';
var nbLang = 2;
var nbLangDemande = 1;
var enCoursDeTraduction = false;
var valide = 1;
var nbResults = 0;
var timer = new Date().getTime();

var tableDb = "RES_dicoLanguage";
var searchInProgress = false;

var nbTabOld = 0;
var nbTabNew = 0;
var onglet = 'Nouvelle1';
var arrayTabs = [];

var isCtrl = false;