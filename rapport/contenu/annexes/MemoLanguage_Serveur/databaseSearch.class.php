<?php
class DatabaseSearch extends Database {
	public function __construct() {
		parent::__construct(DBNAME, DBHOST, DBUSER, DBPASS);
	}
	
	public function getValueConstantsFr($xaConstants, $xsLanguage, $xsTable = DBTABLENAMENOUVELLE) {
		$aRetour = $xaConstants;
		$i = 0;
	
		if(isset($query)) {
		    while($data = $query->fetch()) {
		    	$aRetour[$i] = $data;
		    	++$i;
		    }
		}
		
		return $aRetour;
	}
	
	public function getTranslateSearchText($xaKeyword, $xaLangResult, $xaLangSearch, $xbValide, $xsTable = DBTABLENAMENOUVELLE) {
		$aRetour = array();
		$i = 0;
		$fctWholeWord = util::testGet('whole');
		$fctRegex = util::testGet('regex');
		

	    $txtQuery = "SELECT ID_RES, TranslatedText, Language, Valide ";
    	if($xsTable == DBTABLENAMENOUVELLE)
			$txtQuery .= ", Type_RES, TranslatedText_short, TranslatedText_long ";
	
	
	   	$txtQuery .= "FROM ".$xsTable." WHERE ID_RES IN (SELECT ID_RES FROM ".$xsTable."
	    WHERE " ;


	    foreach($xaKeyword as $k) {
        	$sKBuff = trim($k);
	    	if($fctRegex == 1) {// || $fctWholeWord == 1) {
	    		$txtQuery .= "lower(TranslatedText) REGEXP '$k' ";  	
		    } else if($fctWholeWord == 1){
				$txtQuery .= 'lower(TranslatedText) REGEXP \'^'.$sKBuff.$sCarForbidden.'|'.$sCarForbidden.$sKBuff.
				'$|'.$sCarForbidden.$sKBuff.$sCarForbidden.'|^'.$sKBuff.'$\' ';
		    } else {
		    	$txtQuery .= "lower(TranslatedText) LIKE '%$k%' "; 	
		    }
		    if($i < count($xaKeyword) - 1)
		    	$txtQuery .= ' AND ';
		    	
		    ++$i;
	    }
	    if($xbValide != 2)
	    	$txtQuery .= "AND Valide='$xbValide'";
	    	
    	$txtQuery .= "AND Language='$xaLangSearch')";
    	
		for($i=0 ; $i < count($xaLangResult) ; ++$i) {
			if($i == 0)
				$txtQuery .= " AND (";
			else
				$txtQuery .= " OR ";
					
	    	$txtQuery .= "Language='$xaLangResult[$i]'";
	    	
	    	if($i == count($xaLangResult) - 1)
	    		$txtQuery .= ")";
    	}
    	$txtQuery .= " ORDER BY ID_RES LIMIT 50";

    	$query = $this->db->prepare($txtQuery);

        $query->execute();


	    while($data = $query->fetch()) {
	    	$data['TranslatedText'] = Util::parserConstantes($data['TranslatedText'], $data['Language'], $this);
	    	if($xsTable == DBTABLENAMENOUVELLE) {
	    	$data['TranslatedText_short'] = Util::parserConstantes($data['TranslatedText_short'], $data['Language'], $this);
	    	$data['TranslatedText_long'] = Util::parserConstantes($data['TranslatedText_long'], $data['Language'], $this);
	    	}
			$aRetour[$i] = $data;
	    	++$i;
	    }	
	    $query->closeCursor();
	
	    return $aRetour;
	}
	public function getTraduceEffectue($id, $xsTable = DBTABLENAMENOUVELLE) {
		$i = 0;
		$aRetour = array();
	    $query = $this->db->prepare("SELECT * FROM ".$xsTable."
	    WHERE lower(ID_RES) = :keyword ORDER BY Language LIMIT 50");
	    $query->execute(array('keyword' => $id));
	    while($data = $query->fetch()) {
    		$aRetour[$i] = $data;
    		++$i;
	    }	
	    $query->closeCursor();
	
	    return $aRetour;
	}
	
	public function getTranslateSearchId($xsId, $xaLangResult, $xaLangSearch,
														$xbValide, $xsTable = DBTABLENAMENOUVELLE, $xbStrictID=0) {
		$aRetour = array();
		$i = 0;
				
		$txtQuery = "SELECT ID_RES, TranslatedText, Language, Valide";
		if($xsTable == DBTABLENAMENOUVELLE)
			$txtQuery .= ", Type_RES, TranslatedText_short, TranslatedText_long ";
			
		$txtQuery .= " FROM ".$xsTable."";
		if($xbStrictID == 1) {
			$txtQuery .= " WHERE lower(ID_RES) = :id ";
		} else {
			$txtQuery .= " WHERE lower(ID_RES) LIKE :id ";
			$xsId = '%'.$xsId.'%';
		}
		// si $xbValide = 2 c'est qu'on demande les valides et les non valides
	    if($xbValide != 2) {
	    	$txtQuery .= "AND Valide=:valide";
	    } else {
	    	$txtQuery .= ":valide";
	    	$xbValide = "";
    	}
    	
		for($i=0 ; $i < count($xaLangResult) ; ++$i) {
			if($i == 0)
				$txtQuery .= " AND (";
			else
				$txtQuery .= " OR ";
					
	    	$txtQuery .= "Language='$xaLangResult[$i]'";
	    	
	    	if($i == count($xaLangResult) - 1)
	    		$txtQuery .= ")";
    	}
		$txtQuery .= 'ORDER BY ID_RES LIMIT 50';
    	$query = $this->db->prepare($txtQuery);
	    $query->execute(array('id' => $xsId,
	    					  'valide' => $xbValide));
	
	    while($data = $query->fetch()) {
	    	$aRetour[$i] = $data;
	    	++$i;
	    }
	    $query->closeCursor();
	
	    return $aRetour;
	}	
	
	public function getLanguagesId($xsId, $xsTable = DBTABLENAMENOUVELLE) {
		$aRetour = array();
		$i = 0;
				
	    $query = $this->db->prepare("SELECT ID_RES, TranslatedText, Language FROM ".$xsTable."
	    WHERE ID_RES = :id LIMIT 50");
	    $query->execute(array('id' => $xsId));
		
	    while($data = $query->fetch()) {
	    	$aRetour[$i] = $data;
	    	++$i;
	    }
	    $query->closeCursor();
	
	    return $aRetour;
	}
	public function getRemainingTranslation($xsId, $xsTable = DBTABLENAMENOUVELLE) {
		$aLanguageBool = array('fr' => false, 'en' => false, 'es' =>false);
		$aRetour = array();
		$i = 0;
				
	    $query = $this->db->prepare("SELECT Language FROM $xsTable
	    WHERE ID_RES = :id");
	    $query->execute(array('id' => $xsId));
		
	    while($data = $query->fetch()) {
	    	$aLanguageBool[$data['Language']] = true;
	    }
    	if(!$aLanguageBool['fr']) {
    		$aRetour[$i] = 'fr'; 	    	
    		++$i;
    	}
    	if(!$aLanguageBool['en']) {
    		$aRetour[$i] = 'en';	    	
    		++$i;
    	}
    	if(!$aLanguageBool['es']) {
    		$aRetour[$i] = 'es';	    	
    		++$i;
    	}
    	
	    $query->closeCursor();
	
	    return $aRetour;
	}
	
}
