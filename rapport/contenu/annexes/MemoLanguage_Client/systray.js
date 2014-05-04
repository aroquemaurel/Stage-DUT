var iconLoad = new air.Loader(); 
var iconMenu = new air.NativeMenu(); 
var exitCommand = iconMenu.addItem(new air.NativeMenuItem("Exit"));
var openCommand = iconMenu.addItem(new air.NativeMenuItem("Ouvrir"));
var iconLoadComplete = function(event) { 
    air.NativeApplication.nativeApplication.icon.bitmaps = [event.target.content.bitmapData]; 
} 

if (air.NativeApplication.supportsSystemTrayIcon) { 
    air.NativeApplication.nativeApplication.autoExit = false; 
    iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete);
    air.NativeApplication.nativeApplication.icon.tooltip = "MemoLanguage";
    air.NativeApplication.nativeApplication.icon.menu = iconMenu;
}

window.nativeWindow.addEventListener(air.Event.CLOSING, onClosingEvent);

exitCommand.addEventListener(air.Event.SELECT,function(event){
    air.NativeApplication.nativeApplication.exit(); 
}); 

openCommand.addEventListener(air.Event.SELECT,function(event){
	undock();
});

air.NativeApplication.nativeApplication.icon.addEventListener(air.MouseEvent.CLICK, function(event) {
	undock();
});

function dock(event) {
	event.preventDefault();
	window.nativeWindow.visible = false;
	iconLoad.load(new air.URLRequest("img/logos/logo16.png"));
}

function undock() {
	window.nativeWindow.activate();
	window.nativeWindow.visible = true;
	window.nativeWindow.orderToFront();
	air.NativeApplication.nativeApplication.icon.bitmaps = [];
}

function onClosingEvent(event) {
	dock(event);
}
    