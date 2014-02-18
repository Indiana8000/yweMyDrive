// (c) Andreas Kreisl
// You are not permitted to use this in any way!

var class_license_debug = false | global_debug;

// if(class_license_check()==true) StartRealWidget();
// <preference name="class_license_agreed" type="checkbox" title="Agreed" defaultValue="0" hidden="true" />

var class_license_alreadyrunning = false;

function class_license_check() {
	if(class_license_debug) print("class_license_check");
	if(preferences.class_license_agreed.value!=true) {
		class_license_draw();
	} else {
		class_license_alreadyrunning=true;
		return true;
	}
	return false;
}

function class_license_agree() {
	if(class_license_debug) print("class_license_agree");
	preferences.class_license_agreed.value=1;
	savePreferences();
	class_license_window.visible = false;
	delete class_license_window;

	if(!class_license_alreadyrunning) {
		class_license_alreadyrunning=true;
		StartRealWidget();
	}
	return true;
}

function class_license_disagree() {
	if(class_license_debug) print("class_license_disagree");
	preferences.class_license_agreed.value=0;
	savePreferences();
	closeWidget();
	return false;
}

function class_license_draw() {
	if(class_license_debug) print("class_license_draw - Start drawing");
	class_license_window         = new Window();
	class_license_window.width   = 250;
	class_license_window.height  = 200;
	class_license_window.visible = true;
	class_license_window.hOffset = (screen.availWidth  - class_license_window.width ) / 2;
	class_license_window.vOffset = (screen.availHeight - class_license_window.height) / 2;

	var c     = new Canvas();
	c.hOffset = 0;
	c.vOffset = 0;
	c.width   = 250;
	c.height  = 200;
	c.window  = class_license_window;
	var ctx        = c.getContext( "2d" );
	ctx.lineCap    = "round";
	ctx.lineJoin   = "round";
	ctx.lineWidth  = 2.0;
	ctx.miterLimit = 2.0;
	var grad = ctx.createLinearGradient( 20, 20, 230, 180 );
	grad.addColorStop( 0,   "rgba( 255, 255, 255, 0.95 )" );
	grad.addColorStop( 0.7, "rgba( 128, 128, 128, 0.7 )" );
	grad.addColorStop( 1,   "rgba( 0, 0, 0, 0.2)" );
	ctx.fillStyle = grad;
	ctx.beginPath();
	ctx.moveTo(230,10);
	ctx.quadraticCurveTo( 240, 10, 240, 20 );
	ctx.lineTo(240,180);
	ctx.quadraticCurveTo( 240, 190, 230, 190 );
	ctx.lineTo(20,190);
	ctx.quadraticCurveTo( 10, 190, 10, 180 );
	ctx.lineTo(10,20);
	ctx.quadraticCurveTo( 10, 10, 20, 10 );
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(15,30);
	ctx.lineTo(235,30);
	ctx.moveTo(15,170);
	ctx.lineTo(235,170);
	ctx.stroke();

	var tt = new Text();
	tt.window = class_license_window;
	tt.hOffset = 250/2;
	tt.vOffset = 25;
	tt.width = 230;
	tt.size = 14;
	tt.hAlign = "center";
	tt.data = widget.getLocalizedString("class_license_title");
	tt.visible = true;

	var b1 = new Frame()
	b1.window = class_license_window;
	b1.hOffset = 20;
	b1.vOffset = 170;
	b1.width = 100;
	b1.height = 20;
		var t1 = new Text();
		t1.window = class_license_window;
		t1.hOffset = 50;
		t1.vOffset = 15;
		t1.width = 100;
		t1.size = 14;
		t1.hAlign = "center";
		t1.data = widget.getLocalizedString("class_license_yes");
		t1.visible = true;
	b1.appendChild(t1);
	b1.visible = true;
	b1.onClick = class_license_agree;

	var b2 = new Frame()
	b2.window = class_license_window;
	b2.hOffset = 130;
	b2.vOffset = 170;
	b2.width = 100;
	b2.height = 20;
		var t2 = new Text();
		t2.window = class_license_window;
		t2.hOffset = 50;
		t2.vOffset = 15;
		t2.width = 100;
		t2.size = 14;
		t2.hAlign = "center";
		t2.data = widget.getLocalizedString("class_license_no");
		t2.visible = true;
	b2.appendChild(t2);
	b2.visible = true;
	b2.onClick = class_license_disagree;

	var i1 = new Image();
	i1.window = class_license_window;
	i1.src = "Resources/License.png";
	i1.hOffset = (250 - i1.width) / 2;
	i1.vOffset = 35;
	i1.visible = true;
	i1.onClick = function ( ) {
		var tmp = widget.getLocalizedString("class_license_link");
		openURL(tmp);
		return true;
	}

	var ta = new TextArea();
	ta.window = class_license_window;
	ta.hOffset = 250/2;
	ta.vOffset = 35 + 5 + i1.height;
	ta.width = 250 - 30;
	ta.height = 200 - ta.vOffset - 35;
	ta.hAlign = "center";
	ta.data = widget.getLocalizedString("class_license_text");
	ta.visible = true;
	ta.scrollbar = false;

	return true;
}
