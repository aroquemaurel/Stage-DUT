function createRootMenu(){
    var menu = new air.NativeMenu();
    menu.addSubmenu(createFileMenu(),"Fichier");
    menu.addSubmenu(createEditMenu(),"Editer");
    menu.addItem(new air.NativeMenuItem("A propos"));
    
    menu.items[2].addEventListener(air.Event.SELECT,menuActionAbout);
    return menu;
}
function createFileMenu(menuType){
    var temp;
    var menu = new air.NativeMenu();
    temp = menu.addItem(new air.NativeMenuItem("Ajouter une constante de traduction"));
    temp.keyEquivalent = 'n';
    
    menu.addItem(new air.NativeMenuItem("",true));//separator*/
    temp = menu.addItem(new air.NativeMenuItem("Mettre en systray"));
    temp.keyEquivalent = 'y';

    temp.data = menuType;
    temp = menu.addItem(new air.NativeMenuItem("Quitter"));
        temp.keyEquivalent = 'q';
        temp.data = menuType;

    menu.items[0].addEventListener(air.Event.SELECT, menuActionAddCst);
    menu.items[2].addEventListener(air.Event.SELECT, menuActionSystray);
    menu.items[3].addEventListener(air.Event.SELECT, menuActionQuitter);

    return menu;
}
function menuActionAddCst(event, xsValue) {
	if(!xsValue) {
		xsValue = '';
	}
	var options = new air.NativeWindowInitOptions(); 
	options.minimizable = false;
	options.maximizable = false;
	options.resizable = false;
	
	var windowBounds = new air.Rectangle(window.nativeWindow.x+50,window.nativeWindow.y+50,550,300);
	
	newHTMLLoader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds); 
	newHTMLLoader.load(new air.URLRequest("addCst.html?value="+xsValue));
}
function menuActionQuitter(event) {
	air.NativeApplication.nativeApplication.exit(); 
}
function menuActionSystray(event) {
	dock(event);
}
function menuActionChangConfig(event) {
	var options = new air.NativeWindowInitOptions(); 
	options.minimizable = false;
	options.maximizable = false;
	options.resizable = false;
	
	var windowBounds = new air.Rectangle(window.nativeWindow.x+50,window.nativeWindow.y+50,500,200);
	
	newHTMLLoader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds); 
	newHTMLLoader.load(new air.URLRequest("changeConfig.html"));
}

function menuActionChangSearch(event) {
	switch(event.target.label) {
		case "Francais":
			actionChangeLanguageSearch('fr');
			break;
		case "Anglais":
			actionChangeLanguageSearch('en');
			break;
		case "Espagnol":
			actionChangeLanguageSearch('es');
			break;
	}
}
function menuActionAbout() {
	var options = new air.NativeWindowInitOptions(); 
	options.minimizable = false;
	options.maximizable = false;
	options.resizable = false;
	
	var windowBounds = new air.Rectangle(window.nativeWindow.x+50,window.nativeWindow.y+50,270,200);
	
	newHTMLLoader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds); 
	newHTMLLoader.load(new air.URLRequest("about.html"));
}
function createEditMenu(menuType){
    var temp;
    var menu = new air.NativeMenu();
    temp = menu.addItem(new air.NativeMenuItem("Changer l'adresse du serveur"));
    menu.addSubmenu(createLangMenu(), "Changer la langue de recherche");     
    menu.items[0].addEventListener(air.Event.SELECT, menuActionChangConfig);

    return menu;
}
function createLangMenu(menuType) {
    var temp;
    var menu = new air.NativeMenu();
    temp = menu.addItem(new air.NativeMenuItem("Francais"));
    temp = menu.addItem(new air.NativeMenuItem("Anglais"));
    temp = menu.addItem(new air.NativeMenuItem("Espagnol"));

    for (var item = 0; item < menu.items.length; item++){
        menu.items[item].addEventListener(air.Event.SELECT,menuActionChangSearch);
    } 
    return menu;
}
if(air.NativeApplication.supportsMenu){
    air.NativeApplication.nativeApplication.menu = createRootMenu();
}

var iconLoadComplete = function(event){
    air.NativeApplication.nativeApplication.icon.bitmaps = new runtime.Array(event.target.content.bitmapData);
}
if(air.NativeWindow.supportsMenu){
    window.nativeWindow.menu = createRootMenu();
}

function popUpMenu(event){
    popUp.display(window.nativeWindow.stage, event.clientX, event.clientY);
}
function showContextMenu(event){
    event.preventDefault();
    window.htmlLoader.contextMenu.display(window.nativeWindow.stage, event.clientX, event.clientY);
}

