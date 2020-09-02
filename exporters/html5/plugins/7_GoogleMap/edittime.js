//functionGetPluginSettingsA
function GetPluginSettings()
{
	return {
		"name":			/*@*@*/"Google Map"/*@*@*/,		// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			/*@*@*/"googleMap"/*@*@*/,		// this is used to identify this plugin and is saved to the project; never change it
		"version":		/*@*@*/"1.04"/*@*@*/,		// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	/*@*@*/"Add a google map into your project."/*@*@*/,
		"author":		/*@*@*/"Gregory Georges"/*@*@*/,
		"help url":		/*@*@*/"http://dl.dropbox.com/u/27157668/construct2/help/googleMap.html"/*@*@*/,
		"category":		/*@*@*/"Platform specific"/*@*@*/,		// Prefer to re-use existing categories, but you can set anything here
		"type":			/*@*@*/"world"/*@*@*/,		// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	/*@*@*/false/*@*@*/,		// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		/*@*@*/pf_size_aces,/*@*@*/			// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
		"dependency":	"_googleapi.js"
	}; 
};
//functionGetPluginSettingsB    

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
//AddConditionA
//1
/*	
AddNumberParam("Number", "Enter a number to test if positive.");
AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");
AddCondition(1, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition2");
*/
//AddConditionB


////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

//AddActionA
//0	
//AddStringParam("Message", "Enter a string to alert.");
//AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");
	AddAnyTypeParam("Xcoord", "Valeur Xcoord", "");
AddAction(0, 0, "Set latitude", "Position", "Set latitude to: {0}", "Set latitude", "setXgoogleMap");
	AddAnyTypeParam("Ycoord", "Valeur Ycoord", "");
AddAction(1, 0, "Set longitude", "Position", "Set longitude to: {0}", "Set longitude", "setYgoogleMap");
	AddAnyTypeParam("Caption:", "Caption displayed on marker.", "\"\"");
AddAction(2, 0, "Add marker at actual center", "Interface", "Add marker at actual center", "Add marker at actual center", "addLocationMarker");
	AddAnyTypeParam("Latitude:", "Latitude (format. x.xxxxx).", "");
	AddAnyTypeParam("Longitude:", "Latitude (format. y.yyyyy).", "");
	AddAnyTypeParam("Caption:", "Caption displayed on marker.", "\"\"");
AddAction(3, 0, "Add marker at a precise position", "Interface", "Add marker at {0},{1}", "Add marker at a precise position (latitude & longitude)", "addPreciseMarker");
AddAction(4, 0, "Locate", "Position", "Detect user location", "Detect user location", "startLocation");
AddAction(5, 0, "Refresh", "Tools", "Refresh the map", "Refresh the map displaying in case of graphical issues", "refreshMap" );

//AddActionB

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

//AddExpressionA
//0	
//AddExpression(0, ef_return_number, "Leet expression", "My category", "MyExpression", "Return the number 1337.");
AddExpression(0, ef_return_number, "Get latitude", "Position", "actualLatitude", "Get the actual latitude");
AddExpression(1, ef_return_number, "Get longitude", "Position", "actualLongitude", "Get the actual longitude");

//AddExpressionB

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
//1 new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
//2 new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
//3 new cr.Property(ept_text,		name,	initial_value,	description)		// a string
//4 new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
//5 new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
//6 new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
//7 new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
new cr.Property(ept_section, "Map", "",	"Global properties of the map."),
    new cr.Property(ept_float, "Latitude", "45.767", "Latitude to reach on the map. (x.xxxxx, y.yyyyy)"),//0
    new cr.Property(ept_float, "Longitude", "4.833", "Longitude to reach on the map. (x.xxxxx, y.yyyyy)"),//1
	new cr.Property(ept_integer, "Zoom", "10", "Value of zoom used on the map."),//2
	new cr.Property(ept_combo, "Type", "ROADMAP", "Type of the map to display.","ROADMAP|SATELLITE|HYBRID|TERRAIN"),//3
	new cr.Property(ept_combo, "Scale Unit", "No", "Display scale unit over the map.","Yes|No"),//4
	new cr.Property(ept_combo, "StreetView", "Yes", "Display StreetView control over the map.","Yes|No"),//5
	new cr.Property(ept_combo, "Scale Control", "Yes", "Display scale controls","Yes|No"),//6
	new cr.Property(ept_combo, "Zoom Control", "Yes", "Display zoom controls","Yes|No"),//7
	new cr.Property(ept_combo, "Mini-Map", "No", "Display mini-map (Overview Map Control)","Yes|No"),//8
	new cr.Property(ept_combo, "Nav Controls Type", "Default", "Type of navigation controls","Default|Small|Smartphone"),
new cr.Property(ept_section, "Marker", "",	"Global properties of the marker."),//9
	new cr.Property(ept_text, "Caption", "You are here", "Text to dispaly as marker's caption.")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called by the IDE after all initialization on this instance has been completed
// Dessine l'objet dans le layout
IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(350, 300));
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	renderer.Fill(this.instance.GetBoundingQuad(), this.properties["Enabled"] === "Yes" ? cr.RGB(255, 255, 255) : cr.RGB(224, 224, 224));
	renderer.Outline(this.instance.GetBoundingQuad(),cr.RGB(0, 0, 0));
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}