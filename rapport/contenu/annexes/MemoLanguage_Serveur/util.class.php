<?php
class Util {
	public static function testGet($xsNomGet) {
		return ((isset($_GET[$xsNomGet])) ? ($_GET[$xsNomGet]) : '' );
	}
	
	public static function CreateDefine() {
		define('DBNAME', 'ALL_WWW_V71');
        	define('DBTABLENAMENOUVELLE', 'RES_dicoLanguage');
		define('DBTABLENAMEANCIENNE', 'RES_Translations');
		define('DBHOST', '...');
		define('DBUSER', '...');
		define('DBPASS', '...');
		
		define('SEPARATEURLIGNE', '+++');
		define('SEPARATEURCOLONNE', ' --- ');
		define('SEPARATEURLANGUE', '###');
	}
	
	public static function parserConstantes($xstring, $xasLanguage, $xDb) {
		$sRetour = $xstring;
		preg_match_all('#\[(.+)\]#isU', $xstring, $aConstantesBuff);

		$aConstants = $aConstantesBuff[1];
		$aValueConstants = $xDb->getValueConstantsFr($aConstants, $xasLanguage);
		for($i=0; $i < count($aConstants)  ; ++$i) {
			// On donne la valeur aux constantes
			if($aValueConstants[$i]['Type_RES'] == 'ITEM') {
				$sRetour = preg_replace('#\[(.+)\]#iSU', $aValueConstants[$i]['TranslatedText'], $sRetour, 1);
			}
		}
		
		return $sRetour;
	}
	
}
