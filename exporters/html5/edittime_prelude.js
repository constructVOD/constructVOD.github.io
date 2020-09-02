// ECMAScript 5 strict mode
"use strict";

// Plugin flags
var pf_singleglobal = 1;			// Plugin can only be inserted as a single global instance
var pf_texture = (1 << 1);			// Plugin has single texture that can be edited
var pf_position_aces = (1 << 2);	// Include position (x/y only) related default actions, conditions and expressions
var pf_size_aces = (1 << 3);		// Include size (w/h only) related default actions, conditions and expressions
var pf_angle_aces = (1 << 4);		// Include angle ACEs
var pf_appearance_aces = (1 << 5);	// Set visible etc.
var pf_tiling = (1 << 6);			// Indicates a plugin which tiles its texture - changes image editor functionality accordingly
var pf_animations = (1 << 7);		// Plugin uses the animations system
var pf_zorder_aces = (1 << 8);		// Include layer, send to front etc. actions, conditions and expressions
var pf_nosize = (1 << 9);			// Prevent resizing
var pf_effects = (1 << 10);			// Allow effects to be added to the plugin
var pf_predraw = (1 << 11);			// Must pre-draw when using effects
var pf_deprecated = (1 << 12);		// Hidden by default

// Behavior flags
var bf_onlyone = 1;					// only one behavior of this type allowed per object (e.g. 'solid' attribute can only be added once)

// Property types
var ept_integer = 0;				// integer number
var ept_float = 1;					// floating point number
var ept_text = 2;					// text string
var ept_color = 3;					// color (as COLORREF bbggrr format)
var ept_font = 4;					// font (a string of "facename,size,weight,italic")
var ept_combo = 5;					// dropdown combo box (separate string with | eg. "One|Two|Three")
var ept_link = 6;					// hyperlink button
var ept_section = 7;				// new section

// Condition flags
var cf_none = 0;
var cf_trigger = 1;					// triggered condition
var cf_fake_trigger = (1 << 1);		// fake trigger - impose trigger limitations and show trigger icon but not a real trigger, eg. 'Every X milliseconds'
var cf_static = (1 << 2);			// static condition - routine called with no instance provided, must perform filtering manually
var cf_not_invertible = (1 << 3);	// do not allow invert on this condition
var cf_deprecated = (1 << 4);		// still exists and usable in existing projects using it, but hidden from add condition dialog
var cf_incompatible_with_triggers = (1 << 5);	// cannot be used in the same event as a trigger (eg. system 'Else' condition and 'Trigger once')
var cf_looping = (1 << 6);			// show looping icon on condition
var cf_fast_trigger = (1 << 7);		// avoid using this; intended for Function use

// Action flags
var af_none = 0;
var af_deprecated = 1;			// still exists and usable in existing projects using it, but hidden from add action dialog

// Expression flags
var ef_none = 0;
var ef_deprecated = 1;					// still exists and usable in existing projects using it, but hidden from dialog
var ef_return_number = (1 << 1);		// expression returns integer or float
var ef_return_string = (1 << 2);		// expression returns string
var ef_return_any = (1 << 3);			// expression can return any type
var ef_variadic_parameters = (1 << 4);	// expression accepts any number of any type parameters after those that are defined

// Text horizontal  & vertical alignment
var ha_left = 0;
var ha_center = 1;
var ha_right = 2;
var va_top = 0;
var va_center = 1;
var va_bottom = 2;

// Balloon tip icon types for BalloonTipLastProperty()
var bti_none = 0;			// no icon
var bti_info = 1;			// information icon
var bti_warning = 2;		// warning icon
var bti_error = 3;			// error icon

// A property for the property grid
cr.Property = function(type, name, initial_value, description, param, readonly)
{
	this.type = type;
	this.name = name;
	this.initial_value = initial_value;
	this.description = description;
	this.param = param || "";
	this.readonly = readonly || false;
};

// An ACE parameter
cr.Parameter = function(type, name, description, initial_str, extra, id)
{
	this.type = type;
	this.name = name;
	this.description = description;
	this.initial_str = initial_str;
	this.extra = extra || "";
	this.id = id || -1;
};

// An event condition
cr.Condition = function(id, flags, list_name, category, display_str, description, script_name, params)
{
	this.id = id;
	this.flags = flags;
	this.list_name = list_name;
	this.category = category;
	this.display_str = display_str;
	this.description = description;
	this.script_name = script_name;
	this.params = params;
};

// An event action
cr.Action = function(id, flags, list_name, category, display_str, description, script_name, params)
{
	this.id = id;
	this.flags = flags;
	this.list_name = list_name;
	this.category = category;
	this.display_str = display_str;
	this.description = description;
	this.script_name = script_name;
	this.params = params;
};

// An event expression
cr.Expression = function(id, flags, list_name, category, exp_name, description, params)
{
	this.id = id;
	this.flags = flags;
	this.list_name = list_name;
	this.category = category;
	this.exp_name = exp_name;
	this.description = description;
	this.params = params;
};

cr.FontInfo = function(face_name, face_size, bold, italic)
{
	this.face_name = face_name;
	this.face_size = face_size;
	this.bold = bold;
	this.italic = italic;
};

cr.ParseFontString = function(font_str)
{
	// A font string is in "FaceName,FaceSize,Bold,Italic" format, eg.
	// "Arial,-16,1,0" for Arial Bold.  Parse out these substrings and return a FontInfo.
	var elems = font_str.split(",");
	
	var face_name = "Arial";
	var face_size = 15;
	var bold = false;
	var italic = false;
	
	if (elems.length >= 1)
		face_name = elems[0];
	if (elems.length >= 2)
		face_size = parseInt(elems[1], 10);
	if (elems.length >= 3)
		bold = (parseInt(elems[2], 10) > 400);	// FW_NORMAL = 400
	if (elems.length >= 4)
		italic = (parseInt(elems[3], 10) !== 0);
		
	// Default to 15pt size if zero specified
	if (face_size === 0)
		face_size = 15;
		
	// Make negative point sizes in to positive
	if (face_size < 0)
		face_size = -face_size;

	return new cr.FontInfo(face_name, face_size, bold, italic);
};

function GetHotspot(hotspot)
{
	switch (hotspot) {
	case "Top-left":		return new cr.vector2(0, 0);
	case "Top":				return new cr.vector2(0.5, 0);
	case "Top-right":		return new cr.vector2(1, 0);
	case "Left":			return new cr.vector2(0, 0.5);
	case "Center":			return new cr.vector2(0.5, 0.5);
	case "Right":			return new cr.vector2(1, 0.5);
	case "Bottom-left":		return new cr.vector2(0, 1);
	case "Bottom":			return new cr.vector2(0.5, 1);
	case "Bottom-right":	return new cr.vector2(1, 1);
	}
	
	return new cr.vector2(0, 0);
};
