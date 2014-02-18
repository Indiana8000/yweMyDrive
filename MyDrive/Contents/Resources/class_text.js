
function class_text(window,hOffset,vOffset,size,data,width) {
	var i;
	this.text = new Array();

	for(i=0;i<4;i++) {
		this.text[i] = new Text();
		this.text[i].window = window;
		this.text[i].width = width;
		this.text[i].vOffset = vOffset;
		this.text[i].hOffset = hOffset;
		this.text[i].data = data;
		this.text[i].color = "#FFFFFF";
		this.text[i].font = "Verdana";
		this.text[i].style.fontWeight = "bold";
		this.text[i].size = size;
		this.text[i].alignment = "center";
	}
	for(i=1;i<4;i++) this.text[0].orderAbove(this.text[i]);
	this.text[0].style.KonShadow = "2px 2px rgba(0,0,0,0.75)";
	this.text[3].style.KonShadow = "3px 3px rgba(0,0,0,0.4)";

	this.text[1].color = "#000000";
	this.text[1].vOffset = vOffset - 1;
	this.text[1].hOffset = hOffset - 1;
	this.text[1].style.KonShadow = "0px 2px #000000";

	this.text[2].color = "#000000";
	this.text[2].vOffset = vOffset - 1;
	this.text[2].hOffset = hOffset + 1;
	this.text[2].style.KonShadow = "0px 2px #000000";

	this.data = class_text_data;
	this.color = class_text_color;
	this.visible = class_text_visible;
	this.size = class_text_size;
	this.font = class_text_font;
	this.vOffset = class_text_vOffset;
	this.hOffset = class_text_hOffset;
	this.shadow = class_text_shadow;
	return true;

	function class_text_data(data)      { for(var i=0;i<4;i++) this.text[i].data = data; }
	function class_text_color(color)    { this.text[0].color = color; }
	function class_text_visible(option) { for(var i=0;i<4;i++) this.text[i].visible = option; }
	function class_text_size(option)    { for(var i=0;i<4;i++) this.text[i].size = parseInt(option); }
	function class_text_font(option)    { for(var i=0;i<4;i++) this.text[i].font = option; }
	function class_text_vOffset(option) { for(var i=0;i<4;i++) this.text[i].vOffset = parseInt(option); }
	function class_text_hOffset(option) { for(var i=0;i<4;i++) this.text[i].hOffset = parseInt(option); }
	function class_text_shadow(option)  { for(var i=1;i<4;i++) this.text[i].visible = parseInt(option); if(option==1) this.text[0].style.KonShadow = "2px 2px rgba(0,0,0,0.75)"; else this.text[0].style.KonShadow = "0px 0px rgba(0,0,0,0)"; }
}
