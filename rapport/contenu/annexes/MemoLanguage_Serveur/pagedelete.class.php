<?php

class PageDelete extends Page {
	private $sId;
	
	public function __construct() {
		parent::__construct();
		$this->db = new DatabaseChanges();
		$this->sId = Util::testGet('id');
		$this->typeTranslatedText = Util::testGet('typeTrans');
		
		if($this->sId == '') 
			exit();

	$this->db->getTranslateDeleteConstant($this->sId);
		$this->initText();			
	}
	
	protected function initText() {
		$this->sText = 'GOOD_DELETE';	
	}
}