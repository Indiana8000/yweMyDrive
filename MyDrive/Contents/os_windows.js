
var WBEM = COM.createObject( "WbemScripting.SWbemLocator.1" );
var wmi = WBEM.ConnectServer( ".", "root/cimv2" );

var chrs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

var mod_wmi_hdd_DeviceList = new Array();
var mod_wmi_hdd_PerfMon = new Array();
var mod_wmi_hdd_DefaultDriveLetter;

function mod_wmi_hdd_GenerateDeviceList() {
	for(var i=0;i<26;i++) {
		try {
			delete mod_wmi_hdd_DeviceList[i];
			if ( mod_wmi_hdd_GetDriveType(chrs[i] + ":")) {
				mod_wmi_hdd_DeviceList[i] = chrs[i] + ":";
				try {
					if ( mod_wmi_hdd_GetDeviceIN(chrs[i] + ":") > 0) {
						mod_wmi_hdd_PerfMon[chrs[i]] = true;
						if(!mod_wmi_hdd_DefaultDriveLetter) mod_wmi_hdd_DefaultDriveLetter = chrs[i] + ":";
					}
				} catch (e) { }
			}
		} catch (e) { }
	}
}

function mod_wmi_hdd_GetDeviceIN(path)           { return wmi.Get( 'Win32_PerfRawData_PerfDisk_LogicalDisk="' + path + '"' ).Properties_.Item( "DiskReadBytesPerSec"  ).Value; }
function mod_wmi_hdd_GetDeviceOUT(path)          { return wmi.Get( 'Win32_PerfRawData_PerfDisk_LogicalDisk="' + path + '"' ).Properties_.Item( "DiskWriteBytesPerSec" ).Value; }
function mod_wmi_hdd_GetDriveType(path)          { return wmi.Get( 'Win32_LogicalDisk="' + path + '"' ).Properties_.Item( "DriveType" ).Value; }
function mod_wmi_hdd_GetMediaType(path)          { return wmi.Get( 'Win32_LogicalDisk="' + path + '"' ).Properties_.Item( "MediaType" ).Value; }
function mod_wmi_hdd_GetVolumeName(path)         { return wmi.Get( 'Win32_LogicalDisk="' + path + '"' ).Properties_.Item( "VolumeName" ).Value; }
function mod_wmi_hdd_GetName(path)               { return wmi.Get( 'Win32_LogicalDisk="' + path + '"' ).Properties_.Item( "Name" ).Value; }
function mod_wmi_hdd_GetVolumeSerialNumber(path) { return wmi.Get( 'Win32_LogicalDisk="' + path + '"' ).Properties_.Item( "VolumeSerialNumber" ).Value; }
function mod_wmi_hdd_GetFileSystem(path)         { return wmi.Get( 'Win32_LogicalDisk="' + path + '"' ).Properties_.Item( "FileSystem" ).Value; }
function mod_wmi_hdd_GetCompressed(path)         { return wmi.Get( 'Win32_LogicalDisk="' + path + '"' ).Properties_.Item( "Compressed" ).Value; }
function mod_wmi_hdd_GetSize(path) { 
	try {
	return wmi.Get( 'Win32_LogicalDisk="' + path + '"' ).Properties_.Item( "Size" ).Value;
	} catch (e) { return null }
}
function mod_wmi_hdd_GetFreeSpace(path)          { return wmi.Get( 'Win32_LogicalDisk="' + path + '"' ).Properties_.Item( "FreeSpace" ).Value; }
function mod_wmi_hdd_GetAccess(path)             { return wmi.Get( 'Win32_LogicalDisk="' + path + '"' ).Properties_.Item( "Access" ).Value; }

function mod_wmi_hdd_Access_ToString(Access) {
	var tmp_String;
	switch (Access){
	case 0:
		tmp_String = "Unknown";
		break;
	case 1:
		tmp_String = "Readable";
		break;
	case 2:
		tmp_String = "Writable";
		break;
	case 3:
		tmp_String = "Read/Write Supported";
		break;
	case 4:
		tmp_String = "Write Once";
		break;
	default : tmp_String = "---";;
	}
	return tmp_String;
}

function mod_wmi_hdd_DriveType_ToString(DriveType) {
	var tmp_String;
	switch (DriveType){
	case 0:
		tmp_String = "Unknown";
		break;
	case 1:
		tmp_String = "No Root Directory";
		break;
	case 2:
		tmp_String = "Removable Disk";
		break;
	case 3:
		tmp_String = "Local Disk";
		break;
	case 4:
		tmp_String = "Network Drive";
		break;
	case 5:
		tmp_String = "Compact Disc";
		break;
	case 6:
		tmp_String = "RAM Disk";
		break;
	default : tmp_String = "---";;
	}
	return tmp_String;
}

function mod_wmi_hdd_MediaType_ToString(MediaType) {
	var tmp_String;
	switch (MediaType){
	case 0:
		tmp_String = "Unknown";
		break;
	case 11:
		tmp_String = "Removable media other than floppy";
		break;
	case 12:
		tmp_String = "Fixed hard disk media";
		break;
	case 22:
		tmp_String = "8-Inch Floppy Disk";
		break;
	case 1:
	case 6:
	case 7:
	case 8:
	case 9:
	case 10:
	case 15:
	case 16:
	case 19:
		tmp_String = "5 1/4-Inch Floppy Disk";
		break;
	case 2:
	case 3:
	case 4:
	case 5:
	case 13:
	case 14:
	case 17:
	case 18:
	case 20:
	case 21:
		tmp_String = "3 1/2-Inch Floppy Disk";
		break;
	default : tmp_String = "---";;
	}
	return tmp_String;
}
