<?php
class PageUpdate extends Page {
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
		$this->sTranslatedText['short'] = Util::testGet('shortValue');
		$this->sTranslatedText['normal'] = Util::testGet('value');
		$this->sTranslatedText['long'] = Util::testGet('longValue');
		
		$this->bValide = Util::testGet('valide');
		$this->typeTranslatedText = Util::testGet('typeTrans');
		
		if($this->typeTranslatedText == '') {
			$this->typeTranslatedText = 'normal';
		}
		
		$this->db->deleteConstant($this->sId, $this->sLanguage);
		$this->db->insertionTranslation($this->sId, $this->sLanguage, $this->sTranslatedText, 
			$this->sTypeRes, $this->bValide);

		$this->initText();
	}
	
	protected function initText() {
		$this->sText = 'GOOD_UPDATE';
	}

}