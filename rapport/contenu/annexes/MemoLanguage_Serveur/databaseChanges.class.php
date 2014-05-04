<?php
class DatabaseChanges extends Database {
	public function __construct() {
		parent::__construct(DBNAME, DBHOST, DBUSER, DBPASS);
	}
	public function insertionTranslation($xsId, $xsLanguage, $xsTranslatedText, $xsTypeRes, $xbValide) {
		if($xsId == '' || $xsLanguage == '' || $xsTranslatedText == '' || $xsTypeRes == '') {
			exit();
		}
		$txtQuery = "INSERT INTO ".DBTABLENAMENOUVELLE." (ID_RES, Language, TranslatedText_short, TranslatedText,
																TranslatedText_long, Type_RES, Valide)
		    						VALUES (:id, :language, :translatedTextshort,:translatedText,:translatedTextlong,
		    						 :typeRes, :valide)";
	    $query = $this->db->prepare($txtQuery);
	    $query->execute(array(	'id' => $xsId,
							    'language' => $xsLanguage,
    						    'translatedTextshort' => utf8_decode($xsTranslatedText['short']),
							    'translatedText' => utf8_decode($xsTranslatedText['normal']),
								'translatedTextlong' => utf8_decode($xsTranslatedText['long']),	
							    'typeRes' => $xsTypeRes,
	    						'valide' => $xbValide
	    						));
	}
	
	public function deleteConstant($xsId, $xsLanguage='') {
		if($xsLanguage != '') {
			
			$query = $this->db->prepare("DELETE FROM ".DBTABLENAMENOUVELLE." WHERE ID_RES=:id AND Language=:lang");
			$query->execute(array('id' => $xsId,
						  'lang' => $xsLanguage));
		}
	}	
	public function getTranslateDeleteConstant($xsId) {
		$query = $this->db->prepare("DELETE FROM ".DBTABLENAMENOUVELLE." WHERE ID_RES=:id");
		$query->execute(array('id' => $xsId));
	}
}
