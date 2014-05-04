<?php
class DataBaseSchemaTable extends DataBase {
	public function __construct($xsDbName="information_schema", $xsDbHost=DBHOST, $xsDbUser=DBUSER, 
								$xsDbPassword=DBPASS) {
		parent::__construct($xsDbName, $xsDbHost, $xsDbUser, $xsDbPassword);
	}
	
	public function getMaxLength() {
		$i = 0;
		
		$txtQuery = "SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH FROM COLUMNS 
		WHERE TABLE_NAME = 'RES_dicoLanguage'"; 
		$query = $this->db->prepare($txtQuery); 

		$query->execute();
	    
		while($data = $query->fetch()) {
	    	$aRetour[$i] = $data;
	    	++$i;
	    }	    
	    $query->closeCursor();

	    return $aRetour;
	}
}
