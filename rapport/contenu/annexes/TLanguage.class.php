<?php
class TLanguage {
	private static $instance;
	private $dico = array();
	private $sTranslate = '';
	
	public static function singleton() {
		if (!isset (self :: $instance)) {
			$c = __CLASS__;
			self :: $instance = new $c ();
			return (self :: $instance);
		}
		return (self :: $instance);
	}
	
	public static function TraducExist($xsLangue) {
		return (($xsLangue == 'fr') || ($xsLangue == 'en') || ($xsLangue == 'es'));
	}
	
	//Necessaire pour l'API gOwlReport
	public function getLang($xsValue,$xbDebugMode=false){
		$bEtatDebugMode = DEBUG_MODE;
		if($xbDebugMode)
			$this->_xbDebugMode = TRUE;
		$sTraduction = $this->getTranslation($xsValue);
		$this->_xbDebugMode = $bEtatDebugMode;
		return $sTraduction;
	}
	
	private function pushInDico($idRes, $xaValue) {
		if(isset($xaValue['Language'])) {
			$this->dico[$idRes] = $xaValue['Language'];
			$this->dico[$idRes]['TYPE_RES'] = $xaValue['Type_RES'];
		}
	}
	
	/**
	 * Retourne la langue de traduction
	 */
	public function getCurrentLanguage() {
		$sLangReturn = '';
		$access_manager = TDataAccessManager :: singleton();
		
		if ($access_manager->sessionLoaded()) { // on recupere la langue de la session
			$sLangReturn = $access_manager->getContextManager(CONTEXT_LANGUE, ALL_MODULE);
			if(!$sLangReturn) {
				try {
					$G_Langue = $access_manager->getWebObject('G_Langue');
					$sLangReturn = $G_Langue->getText();
				} catch (exception $e) {
					$sLangReturn = null;
				}				
				
			}
		} else { // on repere la langue du navigateur
			$sLangReturn = ($this->returnLanguage());
			if (!self::TraducExist($sLangReturn))
				$sLangReturn = LANG_DEFAULT;
		}
		
		return ($sLangReturn);
	}
	/**
	 * Retourne un array traduit contenant toutes les traductions
	 * @param $xaId Array contenant des constantes de traduction.
	 * @param $aMapping
	 * @return L'array contenant toutes les traductions
	 */
	public function getArrayTranslate($xaId, $aMapping = NULL){
		$aResult = array();
		if(is_array($xaId)){
			if(TArray::isArraySetAndSupTo0($xaId)){
				foreach($xaId as $ind => $keyVal){
					$keyVal = (($aMapping != NULL) && array_key_exists($keyVal,$aMapping))? $aMapping[$keyVal] : $keyVal;
					$aResult[$ind] = $this->getTranslation($keyVal);
				}
			}
		}else{
			$keyVal = (($aMapping != NULL) && array_key_exists($xaId,$aMapping))? $aMapping[$xaId] : $xaId;
			$aResult = $this->getTranslation($keyVal);
		}
		return $aResult;
	}
	
	
	/**
	 * Retourne une chaine traduite, on peut faire passer les variables a integrer dans la traduction
	 * 	soit en paramee de methode getTranslation('TRANS_MONID', var1, var2, varn) ;
	 *  soit integres dans l'ID getTranslation('TRANS_MONID{{var1, var2, varn}}');
	 * @param $xIdToTranslate
	 * @return Chaine traduite
	 */
	public function getTranslation($xIdToTranslate) {
		$sRetour = '';
		$i = 1;
		$typeWordToTranslate = '';
		$variables = func_get_args();
		// Si on a fait passe les variables dans un tableau
		if(isset($variables[1]) && is_array($variables[1])) {
			$aVarBuff = $variables[1];
			foreach($aVarBuff as $var) {
				$variables[$i] = $var;
				++$i; 				
			}
		}
		
		// on repere le type de mot a afficher (court long ou normal)
		$typeWordToTranslate = $this->getTypeWord($xIdToTranslate);
		
		//Si les variables sont passe en ID grace a  {var1, var2, var3}}
		if(strpos($xIdToTranslate, '{{')!==false){
			$aVariables = array();
			$aVariablesBuff = array();
			preg_match_all('#{{(.+)}}#isU', $xIdToTranslate, $aVariablesBuff);
			$xIdToTranslate = preg_replace('#{{(.+)}}#isU', '', $xIdToTranslate);
			
			$sVariablesToSplit = $aVariablesBuff[1][0];
			if(strpos($sVariablesToSplit, ',')!==false){
				$aVariables = explode(',', $sVariablesToSplit);
			} else {
				$aVariables = $sVariablesToSplit;
			}

			return ($this->getTranslation($xIdToTranslate, $aVariables));
		}		
		
		// si on concatene plusieurs constante avec CONST1++ ++CONST2
		if(strpos($xIdToTranslate, '++')!==false){
			$aId_res = explode('++',$xIdToTranslate );
			$forbidden='"\'\?()*:/@|<>-';
			foreach($aId_res as $id_res_temp){
				$sRetour .= (strcspn(trim($id_res_temp),$forbidden)!==0)? $this->getTranslation($id_res_temp) : $id_res_temp;
			}
			return $sRetour;
		}

		//Si la cle existe en Constante elle est utilisee en priorite
		if (defined($xIdToTranslate)) {
			if (defined($xIdToTranslate.'_'.$this->getCurrentLanguage()))
				$xIdToTranslate = $xIdToTranslate.'_'.$this->getCurrentLanguage();
			return constant($xIdToTranslate);
		}
		
		// si la clef n'est pas dans le dico, on la cherche et on l'ajoute au dico
		if(!isset($this->dico[$xIdToTranslate])) {
			$access_manager = TDataAccessManager :: singleton();
			$datalink = $access_manager->getDataLink();
			$value = $datalink->RES_getDicoTranslation($xIdToTranslate, $this->getCurrentLanguage());
			$this->pushInDico($xIdToTranslate, $value);
		}
		
		// si la clef est trouve dans le dico, on peut l'afficher
		if(isset($this->dico[$xIdToTranslate][$this->getCurrentLanguage()])) {
			$sRetour = $this->getValueKeyExist($xIdToTranslate, $typeWordToTranslate);
		} else {
			$sRetour = $this->getValueKeyNotExistInCurrentLang($xIdToTranslate, $typeWordToTranslate);
		}	
		
		// on parse toutes les variables et constantes
		$sRetour = $this->parserVariables($sRetour, $variables);
		$constants = $this->getConstants($sRetour);
		if(isset($this->dico[$xIdToTranslate][$this->getCurrentLanguage()]))
			$sRetour = $this->parserConstantes($sRetour, $constants);
		else		
			$sRetour = $this->parserConstantes($sRetour, $constants, 'fr');
		
		return $sRetour;
	}
	/**
	 * Retourne la valeur d'une clef existante dans le dico en fonction du type (long short ou normal)
	 * @param String $xIdToTranslate La clef
	 * @param String $xsTypeWordToTranslate Le type
	 */
	private function getValueKeyExist($xIdToTranslate, $xsTypeWordToTranslate, $xsLang='') {
		if($xsLang == '') {
			$xsLang = $this->getCurrentLanguage();
		}
		
		$sRetour = '';			
		if($xsTypeWordToTranslate == '#SHORT#' &&
			$this->dico[$xIdToTranslate]['short'][$xsLang] != '') {
			$sRetour = $this->dico[$xIdToTranslate]['short'][$xsLang];
		} else if($xsTypeWordToTranslate == '#LONG#' &&
			$this->dico[$xIdToTranslate]['long'][$this->getCurrentLanguage()] != '') {
			$sRetour = $this->dico[$xIdToTranslate]['long'][$xsLang];
		} else {
			$sRetour = $this->dico[$xIdToTranslate][$xsLang];
		}

		return $sRetour;
	}
	/**
	 * Retourne l'affichage d'une clef qui n'existe pas dans la langue courante
	 * @param String $xIdToTranslate La clef
	 * @param String $xsTypeWordToTranslate Le type
	 */
	private function getValueKeyNotExistInCurrentLang($xIdToTranslate, $xsTypeWordToTranslate) {
		$sRetour = '';
		// la clef n'existe pas pour la langue courante, on cherche si elle existe en francais
		if(isset($this->dico[$xIdToTranslate]['fr'])) {
			if(DEBUG_MODE)
				$sRetour = '{'.$this->getValueKeyExist($xIdToTranslate, $xsTypeWordToTranslate, 'fr').'}';
			 else
				$sRetour = $this->getValueKeyExist($xIdToTranslate, $xsTypeWordToTranslate, 'fr');
 		//la clef est inexistante.
		} else {
			TUtil::DebugToFile('Constante '.$xIdToTranslate. ' non trouve', '', DEBUG_PATH.'DebugTranslation.txt', true);
			if(DEBUG_MODE)
				$sRetour = '='.$xIdToTranslate.'=';
			else
				$sRetour = $xIdToTranslate;
		}
							
		return $sRetour;
	}
	/**
	 * Retourne le type de mot d'un ID (SHORT, LONG ou NORMAL)
	 * @param String $xIdToTranslate L'id
	 */
	private function getTypeWord($xIdToTranslate) {
		$sRetour = 'NORMAL';
		if(strpos($xIdToTranslate, '#')!==false){
			$aTypeWordBuff = array();
			if(preg_match_all('#\#(.+)\##isU', $xIdToTranslate, $aTypeWordBuff) == 1) {
				$sRetour = $aTypeWordBuff[0][0];
			}
		}
		
		return $sRetour;
	}
	
	/**
	 * Parse une chaine de caractere en remplacant les constantes par leurs valeurs
	 * @param String $xstring Chaine a  parser
	 * @param Array $xaconstants Constantes
	 */
	private function parserConstantes($xstring, $xaconstants, $xslanguage='') {
		if($xslanguage == '') {
			$xslanguage = $this->getCurrentLanguage();
		}
		$sRetour = $xstring;
		$access_manager = TDataAccessManager :: singleton();
		$datalink = $access_manager->getDataLink();
		
		for($i=0; $i < count($xaconstants) ; ++$i) {
			if(!isset($this->dico[$xaconstants[$i]])) {
				$value = $datalink->RES_getDicoTranslation($xaconstants[$i], $xslanguage);
				$this->pushInDico($xaconstants[$i], $value);
			}

			// On donne la valeur aux constantes
			if(isset($xaconstants[$i])) {
				if(isset($this->dico[$xaconstants[$i]][$xslanguage]) &&
				$this->dico[$xaconstants[$i]]['TYPE_RES'] == 'ITEM') {
					$sRetour = preg_replace('#\[(.+)\]#iSU',
						$this->dico[$xaconstants[$i]][$xslanguage], $sRetour, 1);
				} else if(isset($this->dico[$xaconstants[$i]]['fr'])) {
					$sRetour = preg_replace('#\[(.+)\]#iSU',
						$this->dico[$xaconstants[$i]]['fr'], $sRetour, 1);
				} else {
					$sRetour = preg_replace('#\[(.+)\]#iSU', '$1', $sRetour, 1);
				}
			}
		}
			
		return $sRetour;
	}

	/**
	 * Parse une chaine de caractere en remplacant les variables par leurs valeurs
	 * @param String $xstring Chaine a  parser
	 * @param Array $xavariables Variables
	 */
	private function parserVariables($xstring, $xavariables) {
		$sRetour = $this->parserPlurialOrSingular($xstring, $xavariables);
		for($i=1; $i < count($xavariables)  ; ++$i) {
			// On donne la valeur aux variables
			if(isset($xavariables[$i])) {
				$sRetour = preg_replace('#<(.+)>#iSU', $xavariables[$i], $sRetour, 1);
			}
		}	
		
		return $sRetour;
	}
		
	/**
	 * Met au pluriel ou au singulier une chaine en fonction des variables qu'elle contient.
	 * @param String $xstring Chaine a  accorder contenant des <variable> et {singulier|pluriel}
	 * @param Array $xaVariables Tableau de variables
	 * @return La chaine accordee
	 */
	private function parserPlurialOrSingular($xstring, $xaVariables) {
		$aStringSplitVariables = preg_split('#\<[a-z]{1,}\>#i', $xstring);
		// Met au pluriel ou au singulier
		for($i=1; $i < count($xaVariables) ; ++$i) {
			if(isset($aStringSplitVariables[$i])) {
				if($xaVariables[$i] > 1) { // Pluriel
					$aStringSplitVariables[$i] = preg_replace('#\((.+)\|(.+)\)#isU', '$2',
																$aStringSplitVariables[$i]);
				} else {
					$aStringSplitVariables[$i] = preg_replace('#\((.+)\|(.+)\)#isU', '$1',
																$aStringSplitVariables[$i]);
				}
			}
	   }
	
		//On Reconcatene la string en remettant les <value> servants de separateurs precedemment
		$sRetour = '';
		$i=0;
		foreach ($aStringSplitVariables as $astring) {
			$sRetour .= $astring;
			if($i < count($aStringSplitVariables)-1 ){
				$sRetour .= '<value>';
			}
			++$i;
		}
		return $sRetour;
	}

	/**
	 * Obtient un tableau de constantes a  partir d'une chaine de caractere contenant des [constante]
	 * @param string $xsValueToParse Chaine a  parser
	 */
	private function getConstants($xsValueToParse) {
		$aConstants = array();
		$aConstantesBuff = array();
		preg_match_all('#\[(.+)\]#isU', $xsValueToParse, $aConstantesBuff);
		$aConstants = $aConstantesBuff[1];
		
		return $aConstants;
	}

	/**
	 * Retourne la langue du navigateur
	 */
	private function returnLanguage() {
		$retRL = LANG_DEFAULT; // Langue par defaut
		if (isset ($_SERVER)) {
			if (isset ($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
				$retRL = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
				$retRL = substr($retRL[0], 0, 2);
			}
		}
		if (!$this->traducExist($retRL))
			$retRL = LANG_DEFAULT;
			
		return strtolower($retRL);
	}
}
?>
