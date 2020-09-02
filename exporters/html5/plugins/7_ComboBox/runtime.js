// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.ComboBox = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.ComboBox.prototype;
		
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
		this.elem = document.createElement("select");
		if (this.properties[0] === 1)
		{
			if (this.properties[1] === 0) { this.elem.size = "3"; }
			else if (this.properties[1] === 1) { this.elem.multiple = "multiple"; };
		};
		this.elem.id = "comboBox"+this.uid;
		this.elem.title = this.properties[2]; 
		this.elem.style.position = "absolute";
		this.elem.disabled = (this.properties[3] === 0);
		this.elem.style.color = this.properties[4];
		this.elem.style.background = this.properties[5]; 
		this.elem.style.border = ["0","1px dotted","1px solid"][this.properties[6]];
		this.elem.style.borderColor = this.properties[7];
		this.elem.style.zIndex = this.properties[10];
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		this.i = 0;	

		this.elem.oncontextmenu = new Function("return false");

		this.truncate = [true,false][this.properties[11]];
		
		this.elem.onscroll = (function (self) {
		return function() {
			self.runtime.trigger(cr.plugins_.ComboBox.prototype.cnds.isScrolling, self);
		};
		})(this);
		this.elem.onmousewheel = (function (self) {
		return function() {
			self.runtime.trigger(cr.plugins_.ComboBox.prototype.cnds.isScrolling, self);
		};
		})(this);

				
		// prevent BUG Offset-UpdatePosition with Webkit
		this.elem.focused = false;
		
		this.elem.onblur = (function (self) {
		return function() {
			self.runtime.trigger(cr.plugins_.ComboBox.prototype.cnds.isBlur, self);
			self.elem.focused = false; //prevent BUG Offset-UpdatePosition (flickering) with Webkit
		};
		})(this);
		this.elem.onfocus = (function (self) {
		return function() {
			self.runtime.trigger(cr.plugins_.ComboBox.prototype.cnds.isFocused, self);
			self.elem.focused = true; //prevent BUG Offset-UpdatePosition (flickering) with Webkit
		};
		})(this);		
		
		//prevent BUG Offset-UpdatePosition (flickering) with Webkit
		window.onresize = (function (self) {
		return function() {
			self.elem.focused = false; 
		};
		})(this);	

		this.elem.onclick = function (e) { this.focused = true; e.stopPropagation();};
		this.elem.ondblclick = function (e) { this.focused = true; e.stopPropagation();}; 
		this.elem.onmousedown = function (e) { this.focused = true; e.stopPropagation();};
		this.elem.onmouseup = function (e) { this.focused = false; e.stopPropagation();};
		
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

		this.updatePosition();
		this.runtime.tickMe(this);
			
	};
	
	instanceProto.draw = function ()
	{
	};	
	
	instanceProto.drawGL = function(glw)
	{
	};
			
	instanceProto.onDestroy = function ()
	{
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		//prevent BUG Offset-UpdatePosition (flickering) with Webkit
		if (this.elem.focused == false) { this.updatePosition(); } else { };
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
		jQuery(this.elem).width(right - left);
		jQuery(this.elem).height(bottom - top); 
		
	};
	

	//////////////////////////////////////
	//Actions/////////////////////////////
	pluginProto.acts = {};
	var acts = pluginProto.acts;
		
	
	//ACTION AddItem
	acts.AddItem = function (Text)
	{
		++this.i; 
		var new_option = document.createElement("option");
		this.elem.options.add(new_option);
		new_option.text = Text.toString();
		new_option.setAttribute("ID", "combo"+this.uid+"_"+this.i);
		
		new_option.style.borderBottom = ["0","1px dotted","1px solid"][this.properties[8]];
		new_option.style.borderBottomColor = this.properties[9];
		
	};
	
	//ACTION AddItemAfter
	acts.AddItemAfter = function (Text,id)
	{
		function insertAfter(nodeParent, nodeToInsert, nodeAfter)
		{
		if(nodeAfter.nextSibling)
			{ nodeParent.insertBefore(nodeToInsert, nodeAfter.nextSibling);	}
		else
			{ nodeParent.appendChild(nodeToInsert);	}
		};
		
		++this.i; 
		var new_option = new Option(Text.toString())
		insertAfter(this.elem, new_option, document.getElementById("combo"+this.uid+"_"+id));
		new_option.setAttribute("ID", "combo"+this.uid+"_"+this.i);

		new_option.style.borderBottom = ["0","1px dotted","1px solid"][this.properties[8]];
		new_option.style.borderBottomColor = this.properties[9];
	};
	
	//ACTION DeleteItem
	acts.DeleteItem = function (Text)
	{
		var idToRemove = Text.toString().toLowerCase();
		
		if (this.elem.length != 0)
		{
		while(this.elem.length == 0)
		{ this.i = 0; };
		};
		
		if (idToRemove == "all") 
		{
		this.elem.length = 0;
		this.i = 0;
		}
		else
		{
		var optToRemove = document.getElementById("combo"+this.uid+"_"+idToRemove);
		jQuery(optToRemove).remove();
		--this.i;
		};
	};
	
	//ACTION SelectItem
	acts.SelectItem = function (id)
	{
		var IdToSelect = document.getElementById("combo"+this.uid+"_"+id);	
		IdToSelect.selected = true;
	};
	
	//ACTION ChangeItem
	acts.ChangeItem = function (Text, id)
	{
		var IdToSelect = document.getElementById("combo"+this.uid+"_"+id);	
		IdToSelect.text = Text;
	};
	

	//ACTION SetEnabled
	acts.SetEnabled = function (en)
	{
		this.elem.disabled = (en === 0);
	};
		
	//ACTION SetTooltip
	acts.SetTooltip = function (Text)
	{
		this.elem.title = Text.toString(); 		
	};
	
	//ACTION SyncScrolling
	acts.SyncScrolling = function (id)
	{
		var twin_id = "#comboBox"+id;
		jQuery(this.elem).scroll(
			function(id){
				var length = jQuery(this).scrollTop();
				jQuery(twin_id).scrollTop(length);
				});
	};

	//ACTION Focus
	acts.Focus = function ()
	{
		this.elem.focus();		
	};
	
	//ACTION Blurred
	acts.Blurred = function ()
	{
		this.elem.blur();		
	};	

	//test function reattribute ID
	acts.reAttribute = function ()
	{
		this.i = 0;
		var listbox_length = this.elem.options.length;
		for (var i = 0; i < listbox_length; i++)
		{
			++this.i;
			this.elem.options[i].setAttribute("ID", "combo"+this.uid+"_"+this.i);
		};
	};	
	
	
	
	
	//////////////////////////////////////
	//Conditions/////////////////////////
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	//CONDITION isLineSelected
	cnds.isLineSelected = function (id)
	{
		var i = "combo"+this.uid+"_"+id;
		var test = document.getElementById(i);
		if (test && this.elem.options[i].selected == true)
		{
			return true;
		};
	};
	
	//CONDITION isEnabled
	cnds.isEnabled = function ()
	{
		if (this.elem.disabled == false)
		{
			return true;
		} else {
			return false;
		};
	};
	
	//CONDITION isScrolling
	cnds.isScrolling = function ()
	{
		return true;
	};
	
	//CONDITION isFocused
	cnds.isFocused = function ()
	{
		return true;
	};
	
	//CONDITION isBlur
	cnds.isBlur = function ()
	{
		return true;
	};	
	
	
	
		
	
	//////////////////////////////////////
	//Expressions/////////////////////////
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	//EXPRESSION getValueSelected
	exps.getValueSelected = function (ret)
	{
		if(this.elem.options.length!=0){
		if (this.properties[0] === 0) // combobox
		{
			var optionID = this.elem.options[this.elem.selectedIndex].id;
			var id = optionID.replace("combo"+this.uid+"_", "");
			var i = parseInt(id); //enlever combo1_
			ret.set_int(i);
		}
			else //listbox
		{
			var listbox_length = this.elem.options.length;
			for (var i = 0; i < listbox_length; i++)
			{
				if (this.elem.options[i].selected)
				{ 
				var optionID = this.elem.options[i].id;
				var id = optionID.replace("combo"+this.uid+"_", "");
				var i = parseInt(id); 
				ret.set_int(i);
				};
			};
		};};
	};	
	
	
	//EXPRESSION getTotalLines
	exps.getTotalLines = function (ret)
	{
		if(this.elem.options.length!=0){
			var total_lines = this.elem.options.length;
			ret.set_int(total_lines); 
		};
	};
	
	//EXPRESSION getTextSelected
	exps.getTextSelected = function (ret)
	{
	if(this.elem.options.length!=0){
		if (this.properties[0] === 0) // combobox
		{	
			if (this.elem.selectedIndex >= 0) {
			var text_selected = this.elem.options[this.elem.selectedIndex].innerHTML;
			ret.set_any(text_selected); } else { return false; };
		}
		else //listbox
		{
			var listbox_length = this.elem.options.length;
			for (var i = 0; i < listbox_length; i++)
			{
				if (this.elem.options[i].selected)
				{ 
				ret.set_any(this.elem.options[i].text);
				};
			};
		};
	};
	};
	
	//EXPRESSION getTextById
	exps.getTextById = function (ret,id)
	{
		if(this.elem.options.length!=0){
			var IdToSelect = document.getElementById("combo"+this.uid+"_"+id);
			if(IdToSelect) 
			{ 
				var text_toRet = IdToSelect.innerHTML;
				ret.set_any(text_toRet); 

			}; 
		};

	};
	

	

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}());