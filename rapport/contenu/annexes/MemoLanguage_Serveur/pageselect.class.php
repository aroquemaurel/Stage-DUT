<?php

class PageSelect extends Page {
	private $sKeyword;
	private $sTypeSearch;
	private $aLangResult;
	private $aLangSearch;
	private $bValide;
	private $sTable;
	private $bSearchStrictId;
	private $dbSchemaTable;
	
	public function __construct() {
		parent::__construct();
		$this->dbSchemaTable = new DatabaseSchemaTable();
		$this->db = new DatabaseSearch();
		
		$this->sKeyword = addslashes(Util::testGet('k'));
		$this->sTypeSearch = addslashes(Util::testGet('type'));
		$this->aLangResult = explode('|', addslashes(Util::testGet('langResult')));
		$this->aLangSearch = addslashes(Util::testGet('langSearch'));
		$this->bValide = addslashes(Util::testGet('valide'));
		$this->sTable = addslashes(Util::testGet('table'));
		$this->bSearchStrictId = addslashes(Util::testGet('searchStrictId'));
		if($this->bSearchStrictId == '') {
			$this->bSearchStrictId = 0;
		} 
		if($this->sTable == '' && !($this->sTypeSearch == "structTableMaxLength")) {
			$this->sTable = DBTABLENAMENOUVELLE;
		}
			
		if($this->sKeyword == ''&& !($this->sTypeSearch == "structTableMaxLength"))
			exit();

		$this->initText();
	}
	
	protected function initText() {
		switch($this->sTypeSearch) {
			case 'id':
				$this->setTextSearchId();
				break;
			case 'text':
				$this->setTextSearchText();	
				break;
			case 'remainingTranslation':
				$this->setTextRemainingTranslation();
				break;
			case 'structTableMaxLength' :
				$this->setTextMaxLength();
				break;
		}
	}
	
	private function setTextSearchText() {
		$aKeywords = explode('-', $this->sKeyword);
		$aTranslate = $this->db->getTranslateSearchText($aKeywords, $this->aLangResult, $this->aLangSearch, 
					$this->bValide, $this->sTable);
		$this->textDisplaySearch($aTranslate);
	}
	
	private function setTextSearchId() {
 	 	$aTranslate = $this->db->getTranslateSearchId($this->sKeyword, $this->aLangResult, 
 						$this->aLangSearch,$this->bValide, $this->sTable, $this->bSearchStrictId);
 		$this->textDisplaySearch($aTranslate);
	}
	
	private function textDisplaySearch($xaTranslate) {
		foreach($xaTranslate as $aTranslate) {
			$this->sText .= $aTranslate['ID_RES'];
			$aLangueTranslate = $this->db->getTraduceEffectue($aTranslate['ID_RES'], $this->sTable);
			$this->sText .= SEPARATEURCOLONNE;
			$this->sText .= $aTranslate['Language'];
			
			$this->sText .= SEPARATEURLANGUE;
			foreach($aLangueTranslate as $langue) {
				$this->sText .= $langue['Language'];
				$this->sText .= " ";
			}
			$this->sText .= SEPARATEURLANGUE;
			$this->sText .= SEPARATEURCOLONNE;
			$this->sText .= $aTranslate['Valide'];
			$this->sText .= SEPARATEURCOLONNE;
			
			/* Si c'est la nouvelle table, c'est que le champ Type_RES existe */
			if($this->sTable == DBTABLENAMENOUVELLE) {
				$this->sText .= $aTranslate['Type_RES'];
			}
			$this->sText .= SEPARATEURCOLONNE;
			
			$this->sText .= utf8_encode(Util::parserConstantes($aTranslate['TranslatedText'], 
															$aTranslate['Language'], $this->db));
						
			if($this->sTable == DBTABLENAMENOUVELLE) {
				$this->sText .= SEPARATEURCOLONNE;
				$this->sText .= $aTranslate['TranslatedText_short'];
				$this->sText .= SEPARATEURCOLONNE;
				$this->sText .= $aTranslate['TranslatedText_long'];
			} 
			$this->sText .= SEPARATEURLIGNE;
		}
		if($xaTranslate == array()) {
			$this->sText = "NO_FOUND";
		}
	}
	
	private function setTextRemainingTranslation() {
		$aTranslate = $this->db->getRemainingTranslation($this->sKeyword, $this->sTable);
		foreach($aTranslate as $aTranslate) {
			$this->sText .= $aTranslate;
			$this->sText .= SEPARATEURLIGNE;
		}
	}
	
	private function setTextMaxLength() {
		$aMaxLength = $this->dbSchemaTable->getMaxLength();
		
		foreach($aMaxLength as $maxlength) {
			if($maxlength['COLUMN_NAME'] == 'TranslatedText_short' ||
				$maxlength['COLUMN_NAME'] == 'TranslatedText' ||
				$maxlength['COLUMN_NAME'] == 'TranslatedText_long') {
					$this->sText .= $maxlength['CHARACTER_MAXIMUM_LENGTH'];
					$this->sText .= ' ';
			}
		}
	}
}