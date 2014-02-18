// (c) Andreas Kreisl
// You are not permitted to use this in any way!


// ------------------------------------------------------------------------------------
// Main Window Events

function Drive_onMouseEnter() {
	if(Timer_Mouse.ticking!=1) Timer_Mouse.ticking = 1;
	if((this.opt_frm.opacity == 0 && this.visible != 1) || (this.mouseAction != 0)) {
		this.mouseAction = 1;
		this.mouseTime = 2;
	}
	return true;
}

function Drive_onMouseEnterFast() {
	if(Timer_Mouse.ticking!=1) Timer_Mouse.ticking = 1;
	if((this.opt_frm.opacity == 0 && this.visible != 1) || (this.mouseAction != 0)) {
		this.mouseAction = 11;
		this.mouseTime = 0;
		this.visible = 1;
	}
	return true;
}

function Drive_onMouseExit() {
	if(Timer_Mouse.ticking!=1) Timer_Mouse.ticking = 1;
	try {
		this.mouseAction = 2;
		this.mouseTime = 2;
		this.visible = 0;
	} catch (e) { }
	return true;
}

function Drive_onLoseFocus() {
	if(Timer_Mouse.ticking!=1) Timer_Mouse.ticking = 1;
	try {
		this.mouseAction = 2;
		this.mouseTime = 2;
		this.visible = 0;
	} catch (e) { }
	return true;
}

function Drive_onMultiClick(){
	//filesystem.reveal(mod_mydrive_Drives[ID].DriveLetter);
	filesystem.open(this.DriveLetter);
	return true;
}


function Drive_onMultiClickShowDropTarget(){
	//filesystem.reveal(mod_mydrive_Drives[ID].DriveLetter);
	filesystem.open(mod_mydrive_Settings[this.id].DropTaget);
	return true;
}

// ------------------------------------------------------------------------------------
// Main Window Actions


// ------------------------------------------------------------------------------------
// Main Window Helper

function Drive_doSetPos(x,y) {
	this.window.hOffset = x;
	this.window.vOffset = y;
	mod_mydrive_Settings[this.id].window_hOffset = this.window.hOffset;
	mod_mydrive_Settings[this.id].window_vOffset = this.window.vOffset;
	return true;
}

function Drive_doReFresh() {
	if(mod_wmi_hdd_GetSize(this.DriveLetter)==null) {
		if(this.window.opacity != 50 && this.visible != 1) {
			var a = new FadeAnimation( this.window, 50, 350, animator.kEaseIn);
			animator.start( a );
			this.title.data("(" + this.DriveLetter + ")")
			this.space.data("");
		}
	} else {
		tmp_free = mod_wmi_hdd_GetFreeSpace(this.DriveLetter);
		tmp_size = mod_wmi_hdd_GetSize(this.DriveLetter);
		tmp_used = tmp_size - tmp_free;
		if(this.window.opacity != 255) {
			var a = new FadeAnimation( this.window, 255, 350, animator.kEaseOut);
			animator.start( a );
		} else {
			if(mod_mydrive_Settings[this.id].FreeSpaceAlert > (100*tmp_free/tmp_size)) this.icon.colorize = "#FF0000";
			else this.icon.colorize = "";
		}

		this.title.data( mod_mydrive_Settings[this.id].text1.replace(/%NAME%/g,mod_wmi_hdd_GetVolumeName(this.DriveLetter)).replace(/%DRIVE%/g,this.DriveLetter).replace(/%SERIAL%/g,mod_wmi_hdd_GetVolumeSerialNumber(this.DriveLetter))     );
		this.space.data( mod_mydrive_Settings[this.id].text2.replace(/%FREE%/g,bytesToUIString(tmp_free)).replace(/%SIZE%/g,bytesToUIString(tmp_size)).replace(/%USED%/g,bytesToUIString(tmp_used))    );
	}
	return true;
}

function Drive_doPerfMon() {
	var tmpI = mod_wmi_hdd_GetDeviceIN(this.DriveLetter);
	var tmpO = mod_wmi_hdd_GetDeviceOUT(this.DriveLetter);
	if(this.PerfMonLastRead==0) this.PerfMonLastRead = tmpI;
	if(this.PerfMonLastWrite==0) this.PerfMonLastWrite = tmpO;

	if((tmpI-this.PerfMonLastRead)>1048576) this.PerfMonLEDRead.opacity = 255;
	else if((tmpI-this.PerfMonLastRead)>30) this.PerfMonLEDRead.opacity = 75+ (tmpI-this.PerfMonLastRead)*180/1048546;
	else this.PerfMonLEDRead.opacity = 0;

	if((tmpO-this.PerfMonLastWrite)>1048576) this.PerfMonLEDWrite.opacity = 255;
	else if((tmpO-this.PerfMonLastWrite)>30) this.PerfMonLEDWrite.opacity = 75+ (tmpO-this.PerfMonLastWrite)*180/1048546;
	else this.PerfMonLEDWrite.opacity = 0;

	this.PerfMonLastRead = tmpI;
	this.PerfMonLastWrite = tmpO;
	return true;
}

function Drive_ReSizeImage(img,size) {
	size_x = size;
	size_y = size / 2;

	img.height=img.srcHeight;
	img.width=img.srcWidth;

	if(img.srcHeight>size_y) {
		if(size_y/img.srcHeight*img.srcWidth>size_x) {
			img.width=size_x;
			img.height=size_x/img.srcWidth*img.srcHeight;
		} else {
			img.height=size_y;
			img.width=size_y/img.srcHeight*img.srcWidth;
		}
	}
	if(img.srcWidth>size_x) {
		if(size_x/img.srcWidth*img.srcHeight>128) {
			img.height=size_x;
			img.width=size_x/img.srcWidth*img.srcHeight;
		} else {
			img.width=size_x;
			img.height=size_x/img.srcWidth*img.srcHeight;
		}
	}
	img.vOffset = 128 - img.height;
	img.hOffset = (2*Drive_Border+128)/2 -  img.width/2;
	return true;
}


// ------------------------------------------------------------------------------------
// Icon Events

function Drive_onDragEnter() {
	this.icon_old_colorize = this.icon.colorize;
	if(filesystem.isDirectory(mod_mydrive_Settings[this.id].DropTaget)){
		this.icon.colorize = "#00FF00";
		return true;
	} else {
		this.icon.colorize = "#FF0000";
		if(this.window.opacity != 255) {
			var a = new FadeAnimation( this.window, 255, 350, animator.kEaseOut);
			animator.start( a );
		}
		return false;
	}
}

function Drive_onDragExit(ID) {
	this.icon.colorize = this.icon_old_colorize;
	this.ReFresh();
	return true;
}

function Drive_onDragDrop(ID) {
	this.icon.colorize = this.icon_old_colorize;
	if(filesystem.isDirectory(mod_mydrive_Settings[this.id].DropTaget)){
		if(system.event.data[0]=="filenames") {
			for(i in system.event.data)
				if(i>0) {
					filesystem.move(system.event.data[i],mod_mydrive_Settings[this.id].DropTaget);
				}
		}
		return true;
	} else {
		alert("Drop Taget [" + mod_mydrive_Settings[this.id].DropTaget + "] doesn't exists!");
		return false;
	}
	this.ReFresh();
}


// ------------------------------------------------------------------------------------
// Actions

function Drive_doRemove() {
	delete mod_mydrive_Drives[this.id];
	delete mod_mydrive_Settings[this.id];
	return true;
}

function Drive_doAdd() {
	mod_wmi_hdd_GenerateDeviceList();
	var x_menu = new Array();
	for(var i in mod_wmi_hdd_DeviceList) {
		x_menu[x_menu.length] = new MenuItem();
		x_menu[x_menu.length-1].title = mod_wmi_hdd_DeviceList[i];
		x_menu[x_menu.length-1].originalDrive = this.id;
		x_menu[x_menu.length-1].newDriveLetter = mod_wmi_hdd_DeviceList[i];
		x_menu[x_menu.length-1].onSelect = Drive_doAddNow;
		if(mod_wmi_hdd_PerfMon[mod_wmi_hdd_DeviceList[i][0]]) x_menu[x_menu.length-1].checked = true;
	}
	popupMenu( x_menu, system.event.hOffset, system.event.vOffset );
	return true;
}

function Drive_doAddNow() {
	mod_mydrive_Drives[++mod_mydrive_NextID] = new Drive(mod_mydrive_NextID,this.newDriveLetter);
	mod_mydrive_Drives[mod_mydrive_NextID].window.visible = true;
	//mod_mydrive_Drives[mod_mydrive_NextID].SetPos(mod_mydrive_Drives[this.originalDrive].window.hOffset - 128,mod_mydrive_Drives[this.originalDrive].window.vOffset - 64);
	return true;
}

function Drive_doMoveDown() {
	this.mouseAction = 3;
	this.mouseTime = 9999999;
	Drive_onMoveX = system.event.screenX;
	Drive_onMoveW = this.window.hOffset;
	Drive_onMoveY = system.event.screenY;
	Drive_onMoveH = this.window.vOffset;
	Drive_onMoveD = false;
}

function Drive_doMoveUp() {
	// Maybe later we can do something after moving
	return true;
}

function Drive_doMoveDrag() {
	if(Math.abs(system.event.screenX - Drive_onMoveX) > 8 || Math.abs(system.event.screenY - Drive_onMoveY) > 8) Drive_onMoveD = true;
	if(Drive_onMoveD) {
		this.window.hOffset = Drive_onMoveW + (system.event.screenX - Drive_onMoveX);
		this.window.vOffset = Drive_onMoveH + (system.event.screenY - Drive_onMoveY);
	}
}

function Drive_doMoveClick(){
	var a;
	var x;
	var y;
	a = new Array();

	for(var i in mod_mydrive_Drives) {
		if(i!=this.id) {
			x = new MenuItem();
			x.title = mod_mydrive_Drives[i].DriveLetter + " ("+i+")";
				y = new MenuItem();
				y.title = widget.getLocalizedString("Drive_Pos_right");
				y.id = this.id;
				y.to = i;
				y.pos = 'r';
				y.onSelect = Drive_doMoveClickTo;
			x.appendChild( y );
				y = new MenuItem();
				y.title = widget.getLocalizedString("Drive_Pos_left");
				y.id = this.id;
				y.to = i;
				y.pos = 'l';
				y.onSelect = Drive_doMoveClickTo;
			x.appendChild( y );
				y = new MenuItem();
				y.title = widget.getLocalizedString("Drive_Pos_top");
				y.id = this.id;
				y.to = i;
				y.pos = 't';
				y.onSelect = Drive_doMoveClickTo;
			x.appendChild( y );
				y = new MenuItem();
				y.title = widget.getLocalizedString("Drive_Pos_bottom");
				y.id = this.id;
				y.to = i;
				y.pos = 'b';
				y.onSelect = Drive_doMoveClickTo;
			x.appendChild( y );

			a.push( x );
		}
	}

	popupMenu( a, system.event.hOffset, system.event.vOffset );

	return true;
}

function Drive_doMoveClickTo() {
	if(this.pos=="t") {
		mod_mydrive_Drives[this.id].window.hOffset = mod_mydrive_Drives[this.to].window.hOffset;
		mod_mydrive_Drives[this.id].window.vOffset = mod_mydrive_Drives[this.to].window.vOffset - mod_mydrive_Drives[this.id].window.height;
	}
	if(this.pos=="b") {
		mod_mydrive_Drives[this.id].window.hOffset = mod_mydrive_Drives[this.to].window.hOffset;
		mod_mydrive_Drives[this.id].window.vOffset = mod_mydrive_Drives[this.to].window.vOffset + mod_mydrive_Drives[this.to].window.height;
	}
	if(this.pos=="l") {
		mod_mydrive_Drives[this.id].window.hOffset = mod_mydrive_Drives[this.to].window.hOffset - mod_mydrive_Drives[this.id].window.width;
		mod_mydrive_Drives[this.id].window.vOffset = mod_mydrive_Drives[this.to].window.vOffset;
	}
	if(this.pos=="r") {
		mod_mydrive_Drives[this.id].window.hOffset = mod_mydrive_Drives[this.to].window.hOffset + mod_mydrive_Drives[this.to].window.width;
		mod_mydrive_Drives[this.id].window.vOffset = mod_mydrive_Drives[this.to].window.vOffset;
	}
	return true;
}

function Drive_doEditClick() {
	var Drive_Edit_DialogFields = Array();
	var FieldID = -1;

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'selector';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_Icon");
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].icon_src;

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'popup';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_IconReset");
	Drive_Edit_DialogFields[FieldID].option = new Array("---","CD","HDD","Ext. HDD","Firewire","USB","Removable","Network","iDrive");
	Drive_Edit_DialogFields[FieldID].optionValue = new Array("---","Resources/icons/cd.png","Resources/icons/Drive Internal.png","Resources/icons/Drive External.png","Resources/icons/Drive Firewire.png","Resources/icons/Drive USB.png","Resources/icons/Drive Removable.png","Resources/icons/Network File Server.png","Resources/icons/Network iDisk.png");

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'slider';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_IconSize");
	Drive_Edit_DialogFields[FieldID].ticks = 8;
	Drive_Edit_DialogFields[FieldID].minLength = 32;
	Drive_Edit_DialogFields[FieldID].maxLength = 256;
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].size;
	Drive_Edit_DialogFields[FieldID].tickLabel = new Array("16","64 / 80","128");

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'selector';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_DropTarget");
	Drive_Edit_DialogFields[FieldID].kind = "folders";
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].DropTaget;

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'slider';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_FreeSpaceAlert");
	Drive_Edit_DialogFields[FieldID].ticks = 21;
	Drive_Edit_DialogFields[FieldID].minLength = 0;
	Drive_Edit_DialogFields[FieldID].maxLength = 100;
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].FreeSpaceAlert;
	Drive_Edit_DialogFields[FieldID].tickLabel = new Array("0%","50%","100%");

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_PerfMon");
	Drive_Edit_DialogFields[FieldID].type = 'checkbox';
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].PerfMon;
	if(!mod_wmi_hdd_PerfMon[this.DriveLetter[0]])
		Drive_Edit_DialogFields[FieldID].hidden = 1;

	var Drive_Edit_DialogResults = form(Drive_Edit_DialogFields, 'MyDrive Preferences for ' + mod_mydrive_Drives[this.id].DriveLetter);
	if (Drive_Edit_DialogResults != null) {
		mod_mydrive_Settings[this.id].DropTaget = Drive_Edit_DialogResults[3];
		mod_mydrive_Settings[this.id].FreeSpaceAlert = Drive_Edit_DialogResults[4];
		mod_mydrive_Settings[this.id].size = Drive_Edit_DialogResults[2];

		if(Drive_Edit_DialogResults[1]!="---")
			Drive_Edit_DialogResults[0] = Drive_Edit_DialogResults[1];

		if(mod_mydrive_Settings[this.id].icon_src != Drive_Edit_DialogResults[0].substr(-mod_mydrive_Settings[this.id].icon_src.length)){
			mod_mydrive_Settings[this.id].icon_src = Drive_Edit_DialogResults[0];
			this.icon.height=null;
			this.icon.width=null;
			this.icon.src = mod_mydrive_Settings[this.id].icon_src;
		}

		if(mod_mydrive_Settings[this.id].PerfMon != Drive_Edit_DialogResults[5]) {
			mod_mydrive_Settings[this.id].PerfMon = Drive_Edit_DialogResults[5];
			this.PerfMonLED.visible = mod_mydrive_Settings[this.id].PerfMon;
			this.PerfMonLEDbg.visible = mod_mydrive_Settings[this.id].PerfMon;
			this.PerfMonLEDRead.visible = mod_mydrive_Settings[this.id].PerfMon;
			this.PerfMonLEDWrite.visible = mod_mydrive_Settings[this.id].PerfMon;
		}

		Drive_ReSizeImage(this.icon,mod_mydrive_Settings[this.id].size);

		mod_mydrive_SavePref();
	} else {
		//print("form was cancelled");
	}

	delete Drive_Edit_DialogFields;
	this.ReFresh();
	return true;
}


function Drive_doFontClick() {
	var Drive_Edit_DialogFields = Array();
	var FieldID = -1;

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'text';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_TextL1");
	Drive_Edit_DialogFields[FieldID].description = widget.getLocalizedString("Drive_Pref_TextL1desc");
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].text1;

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'text';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_TextL2");
	Drive_Edit_DialogFields[FieldID].description = widget.getLocalizedString("Drive_Pref_TextL2desc");
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].text2;

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'text';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_FontFamily");
	Drive_Edit_DialogFields[FieldID].description = widget.getLocalizedString("Drive_Pref_FontFamilydesc");
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].Font;

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'slider';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_FontS1");
	Drive_Edit_DialogFields[FieldID].ticks = 21;
	Drive_Edit_DialogFields[FieldID].minLength = 8;
	Drive_Edit_DialogFields[FieldID].maxLength = 28;
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].FontSize1;
	Drive_Edit_DialogFields[FieldID].tickLabel = new Array("8","15","20","28");
	Drive_Edit_DialogFields[FieldID].description = widget.getLocalizedString("Drive_Pref_FontS1desc");

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'slider';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_FontS2");
	Drive_Edit_DialogFields[FieldID].ticks = 21;
	Drive_Edit_DialogFields[FieldID].minLength = 8;
	Drive_Edit_DialogFields[FieldID].maxLength = 28;
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].FontSize2;
	Drive_Edit_DialogFields[FieldID].tickLabel = new Array("8","15","20","28");
	Drive_Edit_DialogFields[FieldID].description = widget.getLocalizedString("Drive_Pref_FontS2desc");

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].type = 'color';
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("Drive_Pref_FontColor");
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].FontColor;

	Drive_Edit_DialogFields[++FieldID] = new FormField();
	Drive_Edit_DialogFields[FieldID].title = widget.getLocalizedString("pref_gen_textshadow");
	Drive_Edit_DialogFields[FieldID].type = 'checkbox';
	Drive_Edit_DialogFields[FieldID].defaultValue = mod_mydrive_Settings[this.id].shadow;

	var Drive_Edit_DialogResults = form(Drive_Edit_DialogFields, 'MyDrive Text/Font for ' + mod_mydrive_Drives[this.id].DriveLetter);


	if (Drive_Edit_DialogResults != null) {
		mod_mydrive_Settings[this.id].text1 = Drive_Edit_DialogResults[0];
		mod_mydrive_Settings[this.id].text2 = Drive_Edit_DialogResults[1];

		mod_mydrive_Settings[this.id].Font = Drive_Edit_DialogResults[2];
		mod_mydrive_Settings[this.id].FontSize1 = Drive_Edit_DialogResults[3];
		mod_mydrive_Settings[this.id].FontSize2 = Drive_Edit_DialogResults[4];
		mod_mydrive_Settings[this.id].FontColor = Drive_Edit_DialogResults[5];
		mod_mydrive_Settings[this.id].shadow = Drive_Edit_DialogResults[6];

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

		mod_mydrive_SavePref();
	} else {
		//print("form was cancelled");
	}

	delete Drive_Edit_DialogFields;
	this.ReFresh();
	return true;
}


// ------------------------------------------------------------------------------------
// The END
