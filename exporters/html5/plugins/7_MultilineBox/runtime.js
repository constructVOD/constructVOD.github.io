// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Multiline = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.Multiline.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.truncate = [true,false][this.properties[20]];
		
		this.elem = document.createElement("textarea");
		this.elem.id = this.properties[19];
		this.elem.style.width = this.width;
		this.elem.style.height = this.height;
		this.elem.autocomplete = "off";
		this.elem.style.resize = "none";
	//	this.elem.style.resize = ["none","vertical","horizontal","both"][this.properties[7]];
		this.elem.rows = this.properties[7]; 
		this.elem.cols = this.properties[8]; 
		this.elem.wrap = ["hard","off"][this.properties[9]];
		this.elem.readOnly = (this.properties[5] === 1);
		this.elem.disabled = (this.properties[4] === 0);
		this.elem.value = this.properties[0];
		this.elem.placeholder = this.properties[1];
		this.elem.title = this.properties[2];
		this.elem.spellcheck = (this.properties[6] === 1);
		this.elem.style.backgroundColor = this.properties[10];
		this.elem.style.border = ["1","0"][this.properties[17]];
		this.bordersOnfocus= [true, false][this.properties[18]];
	
	//1.14 added - on Focus borders
		var self_elem = this.elem;
		if (!this.bordersOnfocus) {
			this.elem.onfocus = function() { self_elem.style.outline = "none"; }};

	// webfonts
		if (this.properties[12] != "") 
		{
			var webfont = document.createElement("link");
				webfont.href = this.properties[12];
				webfont.rel = "stylesheet";
				webfont.type = "text/css";
			document.getElementsByTagName('head')[0].appendChild(webfont);	
				this.elem.style.fontFamily = this.properties[13];
		} else { this.elem.style.fontFamily = this.properties[11]; };		
				
		
		this.elem.style.color = this.properties[14];
		this.elem.style.fontSize = this.properties[15]+"px";
		this.elem.style.fontWeight = ["normal","bold"][this.properties[16]];
				
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		
		if (this.properties[3] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
		}
			
		var onchangetrigger = (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.Multiline.prototype.cnds.OnTextChanged, self);
			};
		})(this);
		
		this.elem.oninput = onchangetrigger;
		
		// IE doesn't trigger oninput for 'cut'
		if (navigator.userAgent.indexOf("MSIE") !== -1)
			this.elem.oncut = onchangetrigger;
		
		this.elem.onclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.trigger(cr.plugins_.Multiline.prototype.cnds.OnClicked, self);
			};
		})(this);
		
		this.elem.ondblclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.trigger(cr.plugins_.Multiline.prototype.cnds.OnDoubleClicked, self);
			};
		})(this);
		
		// Prevent touches reaching the canvas
		this.elem.addEventListener("touchstart", function (e) {
			e.stopPropagation();
		}, false);
		
		this.elem.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		}, false);
		
		this.elem.addEventListener("touchend", function (e) {
			e.stopPropagation();
		}, false);
		
		// Prevent clicks being blocked
		jQuery(this.elem).mousedown(function (e) {
			e.stopPropagation();
		});
		
		jQuery(this.elem).mouseup(function (e) {
			e.stopPropagation();
		});
		
		// Prevent key presses being blocked by the Keyboard object
		jQuery(this.elem).keydown(function (e) {
			e.stopPropagation();
		});
		
		jQuery(this.elem).keyup(function (e) {
			e.stopPropagation();
		});
	
	// corrige bug touch plugin
		this.elem.addEventListener('touchstart', function(e) {
				e.stopPropagation();
				}, false);
				
		this.updatePosition();
		this.runtime.tickMe(this);
	};
	
	instanceProto.onDestroy = function ()
	{
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	instanceProto.updatePosition = function ()
	{
		if (this.runtime.isDomFree)
			return;
	
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			jQuery(this.elem).hide();
			return;
		}
		
		if (this.truncate == true) // ability to disable
		{
			//Truncate to canvas size
			if (left < 1)
				left = 1;
			if (top < 1)
				top = 1;
			if (right >= this.runtime.width)
				right = this.runtime.width - 1;
			if (bottom >= this.runtime.height)
				bottom = this.runtime.height - 1; 
		} else {};
			
		jQuery(this.elem).show();
		
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
	};
	
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function(glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	cnds.CompareText = function (text, case_)
	{
		if (case_ === 0)	// insensitive
			return this.elem.value.toLowerCase() === text.toLowerCase();
		else
			return this.elem.value === text;
	};
	
	cnds.OnTextChanged = function ()
	{
		return true;
	};
	
	cnds.OnClicked = function ()
	{
		return true;
	};
	
	cnds.OnDoubleClicked = function ()
	{
		return true;
	};
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.SetText = function (text)
	{
		this.elem.value = text;
	};
	
	acts.SetPlaceholder = function (text)
	{
		this.elem.placeholder = text;
	};
	
	acts.SetTooltip = function (text)
	{
		this.elem.title = text;
	};
	
	acts.SetVisible = function (vis)
	{
		this.visible = (vis !== 0);
	};
	
	acts.SetEnabled = function (en)
	{
		this.elem.disabled = (en === 0);
	};
	
	acts.SetReadOnly = function (ro)
	{
		this.elem.readOnly = (ro === 0);
	};
	
	acts.SetFocus = function ()
	{
		this.elem.focus();
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	exps.Text = function (ret)
	{
		ret.set_string(this.elem.value);
	};

}());