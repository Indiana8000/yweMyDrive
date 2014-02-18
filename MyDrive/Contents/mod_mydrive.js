/*
* (c) by Andreas Kreisl
*
* MyDrive
* Version: 0.1
*
* License: creative commons BY-NC-SA
*
* Version 2.2
* - Fixed Screenshot without Option-Buttons
* - Removed online version check.
*
*/

var mod_mydrive_debug = false | global_debug;

include("mod_mydrive_class.js");


var mod_mydrive_saveFileName = system.widgetDataFolder + "/MyDrive.conf";

var mod_mydrive_Settings = new Object();
var mod_mydrive_Drives = new Array();
var mod_mydrive_NextID = 0;

var Timer_ReFresh = new Timer();
var Timer_PerfMon = new Timer();
var Timer_Mouse   = new Timer();

var doc = XMLDOM.parse( filesystem.readFile( "dock.xml" ) );
var mod_mydrive_dock;
var mod_mydrive_showdock=parseInt(-1);


mod_mydrive_PrefLanguage();

function mod_mydrive_init() {
	mod_wmi_hdd_GenerateDeviceList();

	//Load Settings ..
	if(filesystem.itemExists(mod_mydrive_saveFileName)) {
		mod_mydrive_Settings = JSON.parse( filesystem.readFile( mod_mydrive_saveFileName ) );
		//Get the highes ID
		for(var i in mod_mydrive_Settings)
			if(i>mod_mydrive_NextID)mod_mydrive_NextID=i;
		mod_mydrive_NextID++;
	}

	//If we have a nextID we have a configruation.
	if(mod_mydrive_NextID>0) {
		for(var i in mod_mydrive_Settings) {
			mod_mydrive_Drives[i] = new Drive(i,mod_mydrive_Settings[i].DriveLetter);
		}
	} else {
		var tmp_hOffset = screen.availLeft;
		var tmp_vOffset = screen.availTop + 32;
		for(var i in mod_wmi_hdd_DeviceList) {
			mod_mydrive_Drives[++mod_mydrive_NextID] = new Drive(mod_mydrive_NextID,mod_wmi_hdd_DeviceList[i]);
			mod_mydrive_Drives[mod_mydrive_NextID].SetPos(tmp_hOffset,tmp_vOffset);

			tmp_hOffset += mod_mydrive_Drives[mod_mydrive_NextID].window.width;
			if((tmp_hOffset + mod_mydrive_Drives[mod_mydrive_NextID].window.width) > screen.availWidth) {tmp_hOffset = screen.availLeft; tmp_vOffset += mod_mydrive_Drives[mod_mydrive_NextID].window.height;}
		}
	}


	Timer_ReFresh.interval = parseInt(preferences.UpdateSpeed.value);
	Timer_ReFresh.ticking = 1;
	Timer_ReFresh.onTimerFired = "mod_mydrive_Timer_ReFresh()";

	Timer_PerfMon.interval = parseInt(preferences.PerfMonSpeed.value);
	Timer_PerfMon.ticking = 1;
	Timer_PerfMon.onTimerFired = "mod_mydrive_Timer_PerfMon()";

	Timer_Mouse.interval = 0.5;
	Timer_Mouse.ticking = 0;
	Timer_Mouse.onTimerFired = "mod_mydrive_Timer_Mouse()";

	mod_mydrive_dock               = new Timer();
	mod_mydrive_dock.interval      = parseInt(preferences.DockSpeed.value);
	mod_mydrive_dock.ticking       = widget.dockOpen;
	mod_mydrive_dock.onTimerFired  = mod_mydrive_updatedock;
	mod_mydrive_updatedock();

	return true;
}

function mod_mydrive_PrefLanguage() {
	preferences.UpdateSpeed.tickLabel[1] = widget.getLocalizedString("pref_gen_seconds");
	preferences.PerfMonSpeed.tickLabel[1] = widget.getLocalizedString("pref_gen_seconds");
	preferences.DockSpeed.tickLabel[1] = widget.getLocalizedString("pref_gen_seconds");

	for(var i = 0 ; i < preferences.ActionMouseOver.option.length ; i ++ )
		preferences.ActionMouseOver.option[i] = widget.getLocalizedString(preferences.ActionMouseOver.option[i]);
	for(var i = 0 ; i < preferences.ActionMouseClick.option.length ; i ++ )
		preferences.ActionMouseClick.option[i] = widget.getLocalizedString(preferences.ActionMouseClick.option[i]);
	for(var i = 0 ; i < preferences.ActionMouseMulti.option.length ; i ++ )
		preferences.ActionMouseMulti.option[i] = widget.getLocalizedString(preferences.ActionMouseMulti.option[i]);

	return true;
}

function mod_mydrive_PrefChange() {
	//mod_wmi_hdd_GenerateDeviceList();
	if(preferences.mod_mydrive_resetconfig.value==true) reloadWidget();
	Timer_ReFresh.interval = parseInt(preferences.UpdateSpeed.value);
	Timer_PerfMon.interval = parseInt(preferences.PerfMonSpeed.value);
	mod_mydrive_dock.interval = parseInt(preferences.DockSpeed.value);
	return true;
}

function mod_mydrive_SavePref() {
	if(preferences.mod_mydrive_resetconfig.value==true) {
		preferences.mod_mydrive_resetconfig.value=0;
		savePreferences();
		filesystem.remove( mod_mydrive_saveFileName );
	} else {
		for(var i in mod_mydrive_Settings) {
			mod_mydrive_Settings[i].window_hOffset = mod_mydrive_Drives[i].window.hOffset;
			mod_mydrive_Settings[i].window_vOffset = mod_mydrive_Drives[i].window.vOffset;
		}
		filesystem.writeFile( mod_mydrive_saveFileName, JSON.stringify( mod_mydrive_Settings ) );
	}

	return true;
}

function mod_mydrive_Timer_ReFresh() {
	for(var i in mod_mydrive_Drives)
		mod_mydrive_Drives[i].ReFresh();
	return true;
}

function mod_mydrive_Timer_PerfMon() {
	for(var i in mod_mydrive_Drives) {
		if(mod_mydrive_Settings[i].PerfMon==1)
			if(mod_wmi_hdd_PerfMon[mod_mydrive_Drives[i].DriveLetter[0]])
				mod_mydrive_Drives[i].PerfMon();
			else
				mod_mydrive_Settings[i].PerfMon==0;
	}
	return true;
}

function mod_mydrive_Timer_Mouse(){
	var m = false;
	for(var i in mod_mydrive_Drives) {
		if(mod_mydrive_Drives[i].mouseAction>0) {
			m = true;
			mod_mydrive_Drives[i].mouseTime--;
			if(mod_mydrive_Drives[i].mouseTime<=0) {

				// Fade in
				if(mod_mydrive_Drives[i].mouseAction==1) {
					var a = new FadeAnimation( mod_mydrive_Drives[i].opt_frm, 255, 350, animator.kEaseIn);
					animator.start( a );
					if(mod_mydrive_Drives[i].window.opacity != 255) {
						var a = new FadeAnimation( mod_mydrive_Drives[i].window, 255, 350, animator.kEaseOut);
						animator.start( a );
					}
				}

				// Fade in ... fast
				if(mod_mydrive_Drives[i].mouseAction==11) {
					var a = new FadeAnimation( mod_mydrive_Drives[i].opt_frm, 255, 100, animator.kEaseIn);
					animator.start( a );
					if(mod_mydrive_Drives[i].window.opacity != 255) {
						var a = new FadeAnimation( mod_mydrive_Drives[i].window, 255, 100, animator.kEaseOut);
						animator.start( a );
					}
				}

				// Fade out
				if(mod_mydrive_Drives[i].mouseAction==2) {
					var a = new FadeAnimation( mod_mydrive_Drives[i].opt_frm, 0, 350, animator.kEaseOut);
					animator.start( a );
					mod_mydrive_Drives[i].ReFresh();
				}

				mod_mydrive_Drives[i].mouseAction = 0;
			}
		}
	}
	if(m === false) Timer_Mouse.ticking = 0;

	return true;
}

function mod_mydrive_updatedock(){
	while ( ! mod_mydrive_Drives[++mod_mydrive_showdock] ){
		if(mod_mydrive_showdock>mod_mydrive_NextID) mod_mydrive_showdock = -1;
	}

	if(mod_wmi_hdd_GetSize(mod_mydrive_Drives[mod_mydrive_showdock].DriveLetter)>0) {
		var text1 = mod_wmi_hdd_GetFreeSpace(mod_mydrive_Drives[mod_mydrive_showdock].DriveLetter);
		var text2 = mod_wmi_hdd_GetSize(mod_mydrive_Drives[mod_mydrive_showdock].DriveLetter);
		var text3 = mod_mydrive_Drives[mod_mydrive_showdock].DriveLetter + " " + mod_wmi_hdd_GetVolumeName(mod_mydrive_Drives[mod_mydrive_showdock].DriveLetter);

		doc.getElementById( "text1" ).setAttribute( "data", bytesToUIString(text1) );
		doc.getElementById( "text2" ).setAttribute( "data", bytesToUIString(text2) );
		doc.getElementById( "text3" ).setAttribute( "data", text3 );

		doc.getElementById( "text1a" ).setAttribute( "data", bytesToUIString(text1) );
		doc.getElementById( "text2a" ).setAttribute( "data", bytesToUIString(text2) );
		doc.getElementById( "text3a" ).setAttribute( "data", text3 );

		doc.getElementById( "text1b" ).setAttribute( "data", bytesToUIString(text1) );
		doc.getElementById( "text2b" ).setAttribute( "data", bytesToUIString(text2) );
		doc.getElementById( "text3b" ).setAttribute( "data", text3 );

		if(mod_mydrive_Settings[mod_mydrive_Drives[mod_mydrive_showdock].id].FreeSpaceAlert > (100*text1/text2))
			doc.getElementById( "img2" ).setAttribute( "colorize",  "#FF0000" );
		else
			doc.getElementById( "img2" ).removeAttribute( "colorize" );
	} else {
		var text3 = mod_mydrive_Drives[mod_mydrive_showdock].DriveLetter;

		doc.getElementById( "text1" ).setAttribute( "data", "- GB" );
		doc.getElementById( "text2" ).setAttribute( "data", "- GB" );
		doc.getElementById( "text3" ).setAttribute( "data", text3 );

		doc.getElementById( "text1a" ).setAttribute( "data", "- GB" );
		doc.getElementById( "text2a" ).setAttribute( "data", "- GB" );
		doc.getElementById( "text3a" ).setAttribute( "data", text3 );

		doc.getElementById( "text1b" ).setAttribute( "data", "" );
		doc.getElementById( "text2b" ).setAttribute( "data", "" );
		doc.getElementById( "text3b" ).setAttribute( "data", text3 );

		doc.getElementById( "img2" ).removeAttribute( "colorize" );
	}
	doc.getElementById( "text1" ).setAttribute( "style", "font-family: 'Verdana'; font-size: 12px; font-weight: bold; color: " + mod_mydrive_Settings[mod_mydrive_showdock].FontColor + ";" );
	doc.getElementById( "text2" ).setAttribute( "style", "font-family: 'Verdana'; font-size: 12px; font-weight: bold; color: " + mod_mydrive_Settings[mod_mydrive_showdock].FontColor + ";" );
	doc.getElementById( "text3" ).setAttribute( "style", "font-family: 'Verdana'; font-size: 16px; font-weight: bold; color: " + mod_mydrive_Settings[mod_mydrive_showdock].FontColor + ";" );

	doc.getElementById( "img2" ).setAttribute( "src",  mod_mydrive_Drives[mod_mydrive_showdock].icon.src );
	var img_xy = mod_mydrive_Drives[mod_mydrive_showdock].icon.srcWidth / mod_mydrive_Drives[mod_mydrive_showdock].icon.srcHeight;
	if(img_xy>1) {
		doc.getElementById( "img2" ).setAttribute( "width",  64 );
		doc.getElementById( "img2" ).setAttribute( "height",  (64/img_xy) );
		doc.getElementById( "img2" ).setAttribute( "hOffset",  -20 );
		doc.getElementById( "img2" ).setAttribute( "vOffset",  -20 +         (64-(64/img_xy))/2         );
	} else {
		doc.getElementById( "img2" ).setAttribute( "width",  (64*img_xy) );
		doc.getElementById( "img2" ).setAttribute( "height",  64 );
		doc.getElementById( "img2" ).setAttribute( "hOffset",  -20 +          (64-(64*img_xy))/2    );
		doc.getElementById( "img2" ).setAttribute( "vOffset",  -20 );
	}

	widget.setDockItem( doc , "fade" );
	return true;
}




