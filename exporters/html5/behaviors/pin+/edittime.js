function GetBehaviorSettings()
{
	return {
		"name":			"Pin+",					// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"PinPlus",					// this is used to identify this behavior and is saved to the project; never change it
		"version":		"1.0",
		"description":	"Similar to the Pin behavior but allowing more properties to be pinned.",
		"author":		"Scirra, Alex Hanson-White",
		"help url":		"http://www.scirra.com/manual/99/pin",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"flags":		0						// uncomment lines to enable flags...
						| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

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
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>, and {my} for the current behavior icon & name
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
AddCondition(0, cf_none, "Is pinned", "", "{my} is pinned", "Object is currently pinned to another object.", "IsPinned");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddObjectParam("Pin to", "Choose the object to pin to.");
AddComboParamOption("Position & angle");
AddComboParamOption("Position only");
AddComboParamOption("Angle only");
AddComboParamOption("Rope style");
AddComboParamOption("Bar style");
AddComboParam("Mode", "Choose which properties of the object to update.");
AddAction(0, af_none, "Pin to object", "", "{my} Pin to {0} ({1})", "Pin the object to another object.", "Pin");

AddAction(1, af_none, "Unpin", "", "{my} Unpin", "Unpin the object.", "Unpin");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParamOption("Enabled 2 (disregard distance when pinned)");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(2, af_none, "pinX", "", "Pin X", "Pin the X", "pinX");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParamOption("Enabled 2 (disregard distance when pinned)");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(3, af_none, "pinY", "", "Pin Y", "Pin the Y", "pinY");
AddComboParamOption("Disabled");
AddComboParamOption("in front");
AddComboParamOption("behind");
AddComboParam("State", "Choose if Disabled or infront or behind.");
AddAction(4, af_none, "pinZindex", "", "Pin Zindex", "Pin the z index/layer", "pinZindex");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParamOption("Enabled 2 (disregard angle offset when pinned)");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(5, af_none, "pinAngle", "", "Pin Angle", "Pin the Angle", "pinAngle");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParamOption("Enabled 2 (Width relative)");
AddComboParamOption("Enabled 3 (Scale)");
AddComboParamOption("Enabled 4 (Scale relative)");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(6, af_none, "pinWidth", "", "Pin Width", "Pin the Width", "pinWidth");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParamOption("Enabled 2 (Height relative)");
AddComboParamOption("Enabled 3 (Scale)");
AddComboParamOption("Enabled 4 (Scale relative)");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(7, af_none, "pinHeight", "", "Pin Height", "Pin the Height", "pinHeight");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(8, af_none, "pinOpacity", "", "Pin Opacity", "Pin the Opacity", "pinOpacity");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(9, af_none, "pinVisibility", "", "Pin Visibility", "Pin the Visibility", "pinVisibility");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(10, af_none, "pinCollisionEnabled", "", "Pin CollisionEnabled", "Pin the CollisionEnabled", "pinCollisionEnabled");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(11, af_none, "pinTimescale", "", "Pin Timescale", "Pin the Timescale", "pinTimescale");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(12, af_none, "pinHotspotX", "", "Pin HotspotX", "Pin the HotspotX", "pinHotspotX");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(13, af_none, "pinHotspotY", "", "Pin HotspotY", "Pin the HotspotY", "pinHotspotY");

AddNumberParam("Imagepoint", "The imagepoint to pin to.");
AddAction(14, af_none, "pinImagepoint", "", "Pin Imagepoint", "The imagepoint to pin to", "pinImagepoint");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled (set to current frame)");
AddComboParamOption("Enabled 2 (set to beginning of animation)");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(15, af_none, "pinAnimation", "", "Pin Animation", "Pin the Animation", "pinAnimation");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(16, af_none, "pinFrame", "", "Pin Frame", "Pin the Frame", "pinFrame");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParamOption("Enabled 2 (mirror relative)");
AddComboParamOption("Enabled 3 (mirror image & position)");
AddComboParamOption("Enabled 4 (mirror relative image & position)");
AddComboParamOption("Enabled 5 (mirror position only)");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(17, af_none, "pinMirror", "", "Pin Mirror", "Pin the Mirror", "pinMirror");
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParamOption("Enabled 2 (flip relative)");
AddComboParamOption("Enabled 3 (flip image & position)");
AddComboParamOption("Enabled 4 (flip relative image & position)");
AddComboParamOption("Enabled 5 (flip position only)");
AddComboParam("State", "Choose if Disabled or Enabled.");
AddAction(18, af_none, "pinFlip", "", "Pin Flip", "Pin the Flip", "pinFlip");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_number, "", "", "PinnedUID", "Get the UID of the object pinned to, or -1 if not pinned.");
AddExpression(1, ef_return_number, "", "", "isPinnedX", "returns 0, 1, or 2 (disabled or enabled)");
AddExpression(2, ef_return_number, "", "", "isPinnedY", "returns 0, 1, or 2 (disabled or enabled)");
AddExpression(3, ef_return_number, "", "", "isPinnedZindex", "returns 0, 1, or 2 (disabled,in front, behind)");
AddExpression(4, ef_return_number, "", "", "isPinnedAngle", "returns 0, 1, or 2 (disabled or enabled)");
AddExpression(5, ef_return_number, "", "", "isPinnedWidth", "returns 0 or 1,2,3,4 (disabled or enabled)");
AddExpression(6, ef_return_number, "", "", "isPinnedHeight", "returns 0 or 1,2,3,4 (disabled or enabled)");
AddExpression(7, ef_return_number, "", "", "isPinnedOpacity", "returns 0 or 1 (disabled or enabled)");
AddExpression(8, ef_return_number, "", "", "isPinnedVisibility", "returns 0 or 1 (disabled or enabled)");
AddExpression(9, ef_return_number, "", "", "isPinnedCollisionEnabled", "returns 0 or 1 (disabled or enabled)");
AddExpression(10, ef_return_number, "", "", "isPinnedTimescale", "returns 0 or 1 (disabled or enabled)");
AddExpression(11, ef_return_number, "", "", "isPinnedHotspotX", "returns 0 or 1 (disabled or enabled)");
AddExpression(12, ef_return_number, "", "", "isPinnedHotspotY", "returns 0 or 1 (disabled or enabled)");
AddExpression(13, ef_return_number, "", "", "PinnedImagepoint", "returns the imagepoint pinned to");
AddExpression(14, ef_return_number, "", "", "isPinnedAnimation", "returns 0 or 1,2 (disabled or enabled)");
AddExpression(15, ef_return_number, "", "", "isPinnedFrame", "returns 0 or 1 (disabled or enabled)");
AddExpression(16, ef_return_number, "", "", "isPinnedMirror", "returns 0 or 1,2,3,4,5 (disabled or enabled)");
AddExpression(17, ef_return_number, "", "", "isPinnedFlip", "returns 0 or 1,2,3,4,5 (disabled or enabled)");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
		new cr.Property(ept_combo,		"X",	"Disabled",		"Copy x position of pinned object.", "Disabled|Enabled|Enabled 2 (disregard distance when pinned)"),
		new cr.Property(ept_combo,		"Y",	"Disabled",		"Copy y position of pinned object.", "Disabled|Enabled|Enabled 2 (disregard distance when pinned)"),
		new cr.Property(ept_combo,		"Zindex",	"Disabled",		"Copy zIndex of pinned object.", "Disabled|in front|behind"),
		new cr.Property(ept_combo,		"Angle",	"Disabled",		"Copy angle of pinned object.", "Disabled|Enabled|Enabled 2 (disregard angle offset when pinned)"),
		new cr.Property(ept_combo,		"Width",	"Disabled",		"Copy width of pinned object", "Disabled|Enabled|Enabled 2 (Width relative)|Enabled 3 (Scale)|Enabled 4 (Scale relative)"),
		new cr.Property(ept_combo,		"Height",	"Disabled",		"Copy height of pinned object.", "Disabled|Enabled|Enabled 2 (Height relative)|Enabled 3 (Scale)|Enabled 4 (Scale relative)"),
		new cr.Property(ept_combo,		"Opacity",	"Disabled",		"Copy opacity of pinned object.", "Disabled|Enabled"),
		new cr.Property(ept_combo,		"Visibility",	"Disabled",		"Copy visibility of pinned object.", "Disabled|Enabled"),
		new cr.Property(ept_combo,		"Collisions Enabled",	"Disabled",		"Copy collisions enabled of pinned object.", "Disabled|Enabled"),
		new cr.Property(ept_combo,		"Timescale",	"Disabled",		"Copy timescale of pinned object.", "Disabled|Enabled"),
		new cr.Property(ept_combo,		"Hotspot X",	"Disabled",		"Copy hotspot X of pinned object.", "Disabled|Enabled"),
		new cr.Property(ept_combo,		"Hotspot Y",	"Disabled",		"Copy hotspot Y of pinned object.", "Disabled|Enabled"),
		new cr.Property(ept_integer,		"Imagepoint",	0,		"The imagepoint to pin to."),
		new cr.Property(ept_combo,		"Animation",	"Disabled",		"Copy animation of pinned object.", "Disabled|Enabled (set to current frame)|Enabled 2 (set to beginning of animation)"),
		new cr.Property(ept_combo,		"Frame",	"Disabled",		"Copy frame of pinned object.", "Disabled|Enabled"),
		new cr.Property(ept_combo,		"Mirror",	"Disabled",		"Copy mirrored of pinned object.", "Disabled|Enabled|Enabled 2 (mirror relative)|Enabled 3 (mirror image & position)|Enabled 4 (mirror relative image & position)|Enabled 5 (mirror position only)"),
		new cr.Property(ept_combo,		"Flip",	"Disabled",		"Copy flipped of pinned object.", "Disabled|Enabled|Enabled 2 (flip relative)|Enabled 3 (flip image & position)|Enabled 4 (flip relative image & position)|Enabled 5 (flip position only)")
	];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of the behavior in the IDE
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
		
	// any other properties here, e.g...
	// this.myValue = 0;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
