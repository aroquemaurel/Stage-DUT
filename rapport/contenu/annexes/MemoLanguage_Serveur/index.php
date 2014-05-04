<?php
require_once('class/util.class.php');
Util::CreateDefine();

require_once('class/database.class.php');
require_once('class/databaseSchemaTable.class.php');
require_once('class/databaseChanges.class.php');
require_once('class/databaseSearch.class.php');

require_once('class/page.class.php');
require_once('class/pageselect.class.php');
require_once('class/pageinsert.class.php');
require_once('class/pageupdate.class.php');
require_once('class/pagedelete.class.php');

$titrePage = Util::testGet('p');
switch($titrePage) {
	case 'select':
		$page = new PageSelect();
		break;
	case 'insert':
		$page = new Pageinsert();
		break;
	case 'delete':
		$page = new PageDelete();
		break;
	case 'update':
		$page = new PageUpdate();
		break;
	default:
		exit();
}

$page->display();
