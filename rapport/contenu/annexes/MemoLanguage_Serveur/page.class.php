<?php

abstract class Page {
	protected $sText;
	protected $db;
	private $dbSchemaTable;
	
	public function __construct() {
	}
	
	public function display() {
		echo $this->sText;
	}

	abstract protected function initText() ;
	
}