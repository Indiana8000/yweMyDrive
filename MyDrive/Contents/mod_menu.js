var main_menu = new Array();
var main_menu_i = -1;

//main_menu[++main_menu_i] = new MenuItem();
//main_menu[main_menu_i].title = "-";

main_menu[++main_menu_i] = new MenuItem();
main_menu[main_menu_i].title = widget.getLocalizedString("class_license_title");
main_menu[main_menu_i].onSelect = function ( ) {
	class_license_draw();
	return true;
}

main_menu[++main_menu_i] = new MenuItem();
main_menu[main_menu_i].title = widget.getLocalizedString("class_menu_donate");
main_menu[main_menu_i].onSelect = function ( ) {
	var tmp = "Y!WE - MyDrive 2.0";
	openURL("https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=andreas%40kreisl%2ecom&item_name=" + escape(tmp) + "&no_shipping=0&no_note=1&tax=0&currency_code=EUR&bn=PP%2dDonationsBF&charset=UTF%2d8");
	return true;
}

main_menu[++main_menu_i] = new MenuItem();
main_menu[main_menu_i].title = widget.getLocalizedString("class_menu_amazone");
main_menu[main_menu_i].onSelect = function ( ) {
	openURL("http://www.amazon.de/gp/registry/X6JKQ1TZRSJH");
}

main_menu[++main_menu_i] = new MenuItem();
main_menu[main_menu_i].title = "-";

main_menu[++main_menu_i] = new MenuItem();
main_menu[main_menu_i].title = "Screenshot!";
main_menu[main_menu_i].onSelect = function ( ) {
	var tmp = mod_mydrive_Drives[Drive_currentActive].opt_frm.visible;
	if(tmp) mod_mydrive_Drives[Drive_currentActive].opt_frm.visible = false;
	mod_mydrive_Drives[Drive_currentActive].window.root.saveImageToFile( system.userDesktopFolder + "/"+widget.name+"."+Drive_currentActive+".png", "png" );
	if(tmp) mod_mydrive_Drives[Drive_currentActive].opt_frm.visible = true;
}
