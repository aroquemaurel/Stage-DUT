<?php
class DataBase {
	public function __construct($xsDbName, $xsDbHost, $xsDbUser, $xsDbPassword) {
		$this->connect($xsDbName, $xsDbHost, $xsDbUser, $xsDbPassword);
	}
	
	public function connect($xsDbName, $xsDbHost, $xsDbUser, $xsDbPassword) {
		$this->db = new PDO('mysql:host='.$xsDbHost.';dbname='.$xsDbName.'',
									 $xsDbUser, $xsDbPassword);	
		$this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
	}
}