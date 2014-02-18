// (c) Andreas Kreisl
// You are not permitted to use this in any way!

include("mod_mydrive_class_helper.js");


// ------------------------------------------------------------------------------------
// Static Const's

var Drive_Border = 64; // Make 256 total width


// ------------------------------------------------------------------------------------
// Global Variables

var Drive_onMoveX;
var Drive_onMoveW;
var Drive_onMoveY;
var Drive_onMoveH;
var Drive_onMoveD;

var Drive_currentActive;


// ------------------------------------------------------------------------------------
// Lets rock ...

function Drive(id,DriveLetter) {
	//ID to identify this in the Array.
	this.id = id;

	//Drive to display
	if(!(DriveLetter)) this.DriveLetter = mod_wmi_hdd_DefaultDriveLetter;
	else this.DriveLetter = DriveLetter;

	// Help Variable
	this.mouseAction = 0;
	this.mouseTime = 0;
	this.PerfMonLastRead = 0;
	this.PerfMonLastWrite = 0;

	//Me, to ref in function calls
	var obj = this;

	//Main Window
	this.window = new Window();
	this.window.title = "MyDrive";
	this.window.name = "w" + id;
	this.window.id = "w" + id;
	this.window.width = 128 + 2 * Drive_Border;
	this.window.height = 128 + Drive_Border;
	this.window.contextMenuItems = main_menu;

	this.window.onLoseFocus  = function ( ) { Drive_onLoseFocus.call(obj); }
	this.window.onMouseExit  = function ( ) { Drive_onMouseExit.call(obj); }

	//this.window.onGainFocus  = function ( ) {  }
	this.window.onMouseEnter = function ( ) { 
			Drive_currentActive = obj.id;
			switch (preferences.ActionMouseOver.value) {
				case "1":
					Drive_onMouseEnter.call(obj);
					break;
				case "2":
					Drive_onMouseEnterFast.call(obj);
					break;
				case "3":
					Drive_onMultiClick.call(obj);
					break;
				case "4":
					Drive_onMultiClickShowDropTarget.call(obj);
					break;
				default:
					break;
			}
		}

	this.window.onMouseUp  = function ( ) {
			switch (preferences.ActionMouseClick.value) {
				case "1":
					Drive_onMouseEnter.call(obj);
					break;
				case "2":
					Drive_onMouseEnterFast.call(obj);
					break;
				case "3":
					Drive_onMultiClick.call(obj);
					break;
				case "4":
					Drive_onMultiClickShowDropTarget.call(obj);
					break;
				default:
					break;
			}
		}
	this.window.onMultiClick = function ( ) {
			switch (preferences.ActionMouseMulti.value) {
				case "1":
					Drive_onMouseEnter.call(obj);
					break;
				case "2":
					Drive_onMouseEnterFast.call(obj);
					break;
				case "3":
					Drive_onMultiClick.call(obj);
					break;
				case "4":
					Drive_onMultiClickShowDropTarget.call(obj);
					break;
				default:
					break;
			}
		}

	this.visible = 0;


	//Main Icon
	this.icon = new Image();
	this.icon.window = this.window;
	this.icon.onDragEnter = function ( ) { Drive_onDragEnter.call(obj); }
	this.icon.onDragExit  = function ( ) { Drive_onDragExit.call(obj); }
	this.icon.onDragDrop  = function ( ) { Drive_onDragDrop.call(obj); }

	//Text Line 1 + 2
	this.title = new class_text(this.window,64 + Drive_Border,128 + 18,18,"- - -",256);
	this.space = new class_text(this.window,64 + Drive_Border,128 + 36,15,"- - -",256);

	// The Buttons
	this.opt_bg = new Image();
	this.opt_bg.window = this.window;
	this.opt_bg.src = "Resources/q.png";
	this.opt_bg.vOffset = 39;
	this.opt_bg.hOffset = 135;

	this.opt_remove = new Image();
	this.opt_remove.window = this.window;
	this.opt_remove.src = "Resources/options/remove.png";
	this.opt_remove.vOffset = 128 - 32 -3 -54;
	this.opt_remove.hOffset = 128 + 64 -3;
	this.opt_remove.onClick = function ( ) { Drive_doRemove.call(obj); }
	this.opt_remove.onMouseEnter = function ( ) { this.src = "Resources/options/remove_.png"; }
	this.opt_remove.onMouseExit = function ( ) { this.src = "Resources/options/remove.png"; }
	this.opt_remove.tooltip = widget.getLocalizedString("Drive_Opt_remove");

	this.opt_add = new Image();
	this.opt_add.window = this.window;
	this.opt_add.src = "Resources/options/add.png";
	this.opt_add.vOffset = 128 - 32 -3 -27;
	this.opt_add.hOffset = 128 + 64 -3;
	this.opt_add.onClick = function ( ) { Drive_doAdd.call(obj); }
	this.opt_add.onMouseEnter = function ( ) { this.src = "Resources/options/add_.png"; }
	this.opt_add.onMouseExit = function ( ) { this.src = "Resources/options/add.png"; }
	this.opt_add.tooltip = widget.getLocalizedString("Drive_Opt_add");

	this.opt_move = new Image();
	this.opt_move.window = this.window;
	this.opt_move.src = "Resources/options/move.png";
	this.opt_move.vOffset = 128 - 32 -3;
	this.opt_move.hOffset = 128 + 64 -3 + 27;
	this.opt_move.onMouseDown  = function ( ) { Drive_doMoveDown.call(obj); }
	this.opt_move.onMouseDrag  = function ( ) { Drive_doMoveDrag.call(obj); }
	this.opt_move.onMouseUp    = function ( ) { Drive_doMoveUp.call(obj); }
	this.opt_move.onClick = function ( ) { Drive_doMoveClick.call(obj); }
	//this.opt_move.onMultiClick = function ( ) { Drive_doMoveClick.call(obj); }
	this.opt_move.onMouseEnter = function ( ) { this.src = "Resources/options/move_.png"; }
	this.opt_move.onMouseExit = function ( ) { this.src = "Resources/options/move.png"; }
	this.opt_move.tooltip = widget.getLocalizedString("Drive_Opt_move");

	this.opt_edit = new Image();
	this.opt_edit.window = this.window;
	this.opt_edit.src = "Resources/options/edit.png";
	this.opt_edit.vOffset = 128 - 32 -3;
	this.opt_edit.hOffset = 128 + 64 -3 - 27;
	this.opt_edit.onClick = function ( ) { Drive_doEditClick.call(obj); }
	this.opt_edit.onMouseEnter = function ( ) { this.src = "Resources/options/edit_.png"; }
	this.opt_edit.onMouseExit = function ( ) { this.src = "Resources/options/edit.png"; }
	this.opt_edit.tooltip = widget.getLocalizedString("Drive_Opt_edit");

	this.opt_font = new Image();
	this.opt_font.window = this.window;
	this.opt_font.src = "Resources/options/font.png";
	this.opt_font.vOffset = 128 - 32 -3;
	this.opt_font.hOffset = 128 + 64 -3 - 54;
	this.opt_font.onClick = function ( ) { Drive_doFontClick.call(obj); }
	this.opt_font.onMouseEnter = function ( ) { this.src = "Resources/options/font_.png"; }
	this.opt_font.onMouseExit = function ( ) { this.src = "Resources/options/font.png"; }
	this.opt_font.tooltip = widget.getLocalizedString("Drive_Opt_font");

	this.opt_frm = new Frame();
	this.opt_frm.window = this.window;
	this.opt_frm.opacity = 0;
	this.opt_frm.appendChild(this.opt_bg);
	this.opt_frm.appendChild(this.opt_move);
	this.opt_frm.appendChild(this.opt_remove);
	this.opt_frm.appendChild(this.opt_edit);
	this.opt_frm.appendChild(this.opt_add);
	this.opt_frm.appendChild(this.opt_font);


	if(mod_wmi_hdd_PerfMon[this.DriveLetter[0]]) {
		this.PerfMonLED = new Image()
		this.PerfMonLED.window = this.window;
		this.PerfMonLED.src = "Resources/p.png";
		this.PerfMonLED.vOffset = 128 - 32 -3;
		this.PerfMonLED.hOffset = 128 + 64 -3;
		this.PerfMonLED.orderBelow(this.opt_frm);

		this.PerfMonLEDbg = new Image()
		this.PerfMonLEDbg.window = this.window;
		this.PerfMonLEDbg.src = "Resources/p0.png";
		this.PerfMonLEDbg.vOffset = 128 - 32 -3;
		this.PerfMonLEDbg.hOffset = 128 + 64 -3;

		this.PerfMonLEDRead = new Image()
		this.PerfMonLEDRead.window = this.window;
		this.PerfMonLEDRead.src = "Resources/p1.png";
		this.PerfMonLEDRead.vOffset = 128 - 32;
		this.PerfMonLEDRead.hOffset = 128 + 64;
		this.PerfMonLEDRead.opacity = 255;

		this.PerfMonLEDWrite = new Image()
		this.PerfMonLEDWrite.window = this.window;
		this.PerfMonLEDWrite.src = "Resources/p2.png";
		this.PerfMonLEDWrite.vOffset = 128 - 32;
		this.PerfMonLEDWrite.hOffset = 128 + 64;
		this.PerfMonLEDWrite.opacity = 255;
	}


	// User Settings or Default
	if(mod_mydrive_Settings[id]) {
		//User Settings ...
		this.window.hOffset = mod_mydrive_Settings[this.id].window_hOffset;
		this.window.vOffset = mod_mydrive_Settings[this.id].window_vOffset;
		this.icon.src = mod_mydrive_Settings[this.id].icon_src;
		if(mod_wmi_hdd_PerfMon[this.DriveLetter[0]]) {
			this.PerfMonLED.visible = mod_mydrive_Settings[this.id].PerfMon;
			this.PerfMonLEDbg.visible = mod_mydrive_Settings[this.id].PerfMon;
			this.PerfMonLEDRead.visible = mod_mydrive_Settings[this.id].PerfMon;
			this.PerfMonLEDWrite.visible = mod_mydrive_Settings[this.id].PerfMon;
		}
		if(!mod_mydrive_Settings[this.id].size>0) mod_mydrive_Settings[this.id].size = 256;
		if(!mod_mydrive_Settings[this.id].shadow) mod_mydrive_Settings[this.id].shadow = 1;
	} else {
		//Create new with default Settings
		mod_mydrive_Settings[this.id] = new Object();
		mod_mydrive_Settings[this.id].size = 256;
		mod_mydrive_Settings[this.id].shadow = 1;
		mod_mydrive_Settings[this.id].FreeSpaceAlert = 10;
		mod_mydrive_Settings[this.id].DropTaget = this.DriveLetter + "\\";
		if(mod_wmi_hdd_PerfMon[this.DriveLetter[0]]) mod_mydrive_Settings[this.id].PerfMon = 1;
		else mod_mydrive_Settings[this.id].PerfMon = 0;

		this.window.hOffset = screen.availLeft + (screen.availWidth  - this.window.width)  / 2;
		this.window.vOffset = screen.availTop  + (screen.availHeight - this.window.height) / 2;

		switch (mod_wmi_hdd_GetDriveType(DriveLetter)) {
			case 0:
				mod_mydrive_Settings[this.id].icon_src = "Resources/icons/Drive External.png";
				break;
			case 1:
				mod_mydrive_Settings[this.id].icon_src = "Resources/icons/Network iDisk.png";
				break;
			case 2:
				mod_mydrive_Settings[this.id].icon_src = "Resources/icons/Drive Removable.png";
				break;
			case 3:
				mod_mydrive_Settings[this.id].icon_src = "Resources/icons/Drive Internal.png";
				break;
			case 4:
				mod_mydrive_Settings[this.id].icon_src = "Resources/icons/Network File Server.png";
				break;
			case 5:
				mod_mydrive_Settings[this.id].icon_src = "Resources/icons/cd.png";
				mod_mydrive_Settings[this.id].FreeSpaceAlert = 0;
				break;
			case 6:
				mod_mydrive_Settings[this.id].icon_src = "Resources/icons/Drive Firewire.png";
				break;
			default : mod_mydrive_Settings[this.id].icon_src = "Resources/icons/Drive External.png";
		} 

		this.icon.src = mod_mydrive_Settings[this.id].icon_src;

		mod_mydrive_Settings[this.id].window_hOffset = this.window.hOffset;
		mod_mydrive_Settings[this.id].window_vOffset = this.window.vOffset;
	}
	mod_mydrive_Settings[this.id].DriveLetter = this.DriveLetter;

	if(!mod_mydrive_Settings[this.id].text1) mod_mydrive_Settings[this.id].text1 = "%NAME% (%DRIVE%)";
	if(!mod_mydrive_Settings[this.id].text2) mod_mydrive_Settings[this.id].text2 = widget.getLocalizedString("Drive_Default_Text2");
	if(!mod_mydrive_Settings[this.id].Font) mod_mydrive_Settings[this.id].Font = "Verdana";
	if(!mod_mydrive_Settings[this.id].FontSize1) mod_mydrive_Settings[this.id].FontSize1 = 18;
	if(!mod_mydrive_Settings[this.id].FontSize2) mod_mydrive_Settings[this.id].FontSize2 = 15;
	if(!mod_mydrive_Settings[this.id].FontColor) mod_mydrive_Settings[this.id].FontColor = "white";

	this.title.font(mod_mydrive_Settings[this.id].Font);
	this.space.font(mod_mydrive_Settings[this.id].Font);
	this.title.size(mod_mydrive_Settings[this.id].FontSize1);
	this.space.size(mod_mydrive_Settings[this.id].FontSize2);
	this.title.color(mod_mydrive_Settings[this.id].FontColor);
	this.space.color(mod_mydrive_Settings[this.id].FontColor);
	this.title.shadow(mod_mydrive_Settings[this.id].shadow);
	this.space.shadow(mod_mydrive_Settings[this.id].shadow);

	this.title.vOffset(128 + parseInt(mod_mydrive_Settings[this.id].FontSize1));
	this.space.vOffset(128 + parseInt(mod_mydrive_Settings[this.id].FontSize1) * 4/3 + parseInt(mod_mydrive_Settings[this.id].FontSize2));

	Drive_ReSizeImage(this.icon,mod_mydrive_Settings[this.id].size);

	//Define Functions
	this.SetPos  = Drive_doSetPos;
	this.ReFresh = Drive_doReFresh;
	this.PerfMon = Drive_doPerfMon;

	this.ReFresh();
	return true;
}


// ------------------------------------------------------------------------------------
// The END
