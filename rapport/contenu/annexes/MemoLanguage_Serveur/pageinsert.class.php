<?php

class PageInsert extends Page {
	private $sId;
	private $sTypeRes;
	private $sLanguage;
	private $sTranslatedText;
	private $bValide;
	
	public function __construct() {
		parent::__construct();
		$this->db = new DatabaseChanges();
		$this->sId = Util::testGet('id');
		$this->sTypeRes = Util::testGet('type');
		$this->sLanguage = Util::testGet('language');
		$this->sTranslatedText['normal'] = Util::testGet('value');
		$this->sTranslatedText['short'] = Util::testGet('valueshort');
		$this->sTranslatedText['long'] = Util::testGet('valuelong');
		
		$this->bValide = Util::testGet('valide');
		
				
		$this->db->insertionTranslation($this->sId, $this->sLanguage, $this->sTranslatedText, 
			$this->sTypeRes, $this->bValide);
		
		$this->initText();
	}
	
	protected function initText() {
		$this->sText = 'GOOD_INSERT';
	}

}