function GetPluginSettings()
{
	return {
		"name":			"Multiline box",
		"id":			"Multiline",
		"version":		"1.14",
		"description":	"A multiline text field for the user to enter text in to.",
		"author":		"Gregory Georges", // from the textbox plugin of Scirra.
		"help url":		"http://dl.dropbox.com/u/27157668/construct2/help/Multilinebox.html",
		"category":		"Form controls",
		"type":			"world",			// appears in layout
		"rotatable":	false,
		"flags":		pf_position_aces | pf_size_aces
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
				
AddStringParam("Text", "The text to compare the text box's text to.");
AddComboParamOption("case insensitive");
AddComboParamOption("case sensitive");
AddComboParam("Case", "Choose whether the comparison is case sensitive (FOO different to Foo) or case insensitive (FOO same as Foo).");
AddCondition(0, cf_none, "Compare text", "Text box", "Text is {0} (<i>{1}</i>)", "Compare the text currently entered in to the text box.", "CompareText");

AddCondition(1, cf_trigger, "On text changed", "Text box", "On text changed", "Triggered when the text in the text box changes.", "OnTextChanged");
AddCondition(2, cf_trigger, "On clicked", "Text box", "On clicked", "Triggered when the text box is clicked.", "OnClicked");
AddCondition(3, cf_trigger, "On double-clicked", "Text box", "On double-clicked", "Triggered when the text box is double-clicked.", "OnDoubleClicked");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("Text", "The text to set in the text box.");
AddAction(0, af_none, "Set text", "Text box", "Set text to {0}", "Set the text box's text.", "SetText");

AddStringParam("Placeholder", "The new text box placeholder.");
AddAction(1, af_none, "Set placeholder", "Text box", "Set placeholder to {0}", "Set the text box's placeholder.", "SetPlaceholder");

AddStringParam("Tooltip", "The tooltip to set on the text box.");
AddAction(2, af_none, "Set tooltip", "Text box", "Set tooltip to {0}", "Set the text box's tooltip.", "SetTooltip");

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the text box.");
AddAction(3, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the text box.", "SetVisible");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("Mode", "Choose whether to enable or disable the text box.");
AddAction(4, af_none, "Set enabled", "Text box", "Set <b>{0}</b>", "Disable or enable the text box.", "SetEnabled");

AddComboParamOption("Read-only");
AddComboParamOption("Not read-only");
AddComboParam("Mode", "Choose whether to enable or disable read-only mode.");
AddAction(5, af_none, "Set read-only", "Text box", "Set <b>{0}</b>", "Turn read-only on or off.", "SetReadOnly");

AddAction(6, af_none, "Set focused", "Text box", "Set focused", "Set the input focus to the text box.", "SetFocus");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "Get text", "Text box", "Text", "Get the text box's text.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,	"Text",					"",			"The initial text for the multiline box."),
	new cr.Property(ept_text,	"Placeholder",			"",			"A tip to display when the multiline box is empty."),
	new cr.Property(ept_text,	"Tooltip",				"",			"Display this text when hovering the mouse over the control."),
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the multiline box is visible on startup.", "Invisible|Visible"),
	new cr.Property(ept_combo,	"Enabled",				"Yes",		"Choose whether the multiline box is enabled or disabled on startup.", "No|Yes"),
	new cr.Property(ept_combo,	"Read-only",			"No",		"Choose whether the multiline box is read-only on startup.", "No|Yes"),
	new cr.Property(ept_combo,	"Spell check",			"No",		"Allow the browser to spell-check the multiline box, if supported.", "No|Yes"),
//	new cr.Property(ept_combo,	"Resizable",			"No",		"Allow the user to resize the multiline box", "No|Vertical|Horizontal|Both"), //7
	new cr.Property(ept_integer,"Rows",					"50",		"The number of characters displayed on each line."), //7
	new cr.Property(ept_integer,"Columns",				"5",		"The number of lines displayed in the multiline box."), //8
	new cr.Property(ept_combo,	"Line break",			"Auto",		"Choose whether the multiline box is breaking the line.", "Auto|Manual"),	//9
new cr.Property(ept_section, "Style", "",	"Style properties of the multiline object."),	
	new cr.Property(ept_text,	"Background color",		"none", 	"The background color for the multiline box (#000000, rgba(0,0,0,alpha) or 'black' format)."),//11
	new cr.Property(ept_text,	"Font",					"Helvetica","The font family for the multiline box."), //10
	new cr.Property(ept_text,	"Webfont",				"",	"Set the webfont URL for the multiline box."), //10
	new cr.Property(ept_text,	"Webfont name",			"",			"The webfont name for the multiline box."), //10
	new cr.Property(ept_text,	"Font color",			"black", 	"The font color for the multiline box (#000000, rgb(0,0,0) or 'black' format)."),//11
	new cr.Property(ept_integer,"Font size",			"12",		"The font size (pixel) for the multiline box."),//12
	new cr.Property(ept_combo,	"Font weight",			"Normal",	"The font weight for the multiline box.", "Normal|Bold"),
	new cr.Property(ept_combo,	"Borders",				"Yes",		"Choose whether the multiline box has borders.", "Yes|No"),//17
	new cr.Property(ept_combo,	"onFocus Borders",		"No",		"Choose whether the multiline box has borders displayed when is onfocused.", "Yes|No"),//18
	new cr.Property(ept_text,	"ID (optional)",		"",			"An ID for the control allowing it to be styled with CSS from the page HTML."),//19
new cr.Property(ept_section, "Other", "",	"Special properties of the multiline object."),	
	new cr.Property(ept_combo, 	"Truncate", 			 "Yes", 	"Choose whether you want to truncate the multiline box against borders", "Yes|No") //18> 20
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
	this.just_inserted = false;
	this.font = null;
}

IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(150, 150));
}

IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);
		
	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	renderer.Fill(quad, this.properties["Enabled"] === "Yes" ? cr.RGB(255, 255, 255) : cr.RGB(224, 224, 224));
	renderer.Outline(quad, cr.RGB(0, 0, 0));
	
	cr.quad.prototype.offset.call(quad, 4, 2);
	
	if (this.properties["Text"].length)
	{
		this.font.DrawText(this.properties["Text"],
							quad,
							cr.RGB(0, 0, 0),
							ha_left);
	}
	else
	{
		this.font.DrawText(this.properties["Placeholder"],
							quad,
							cr.RGB(128, 128, 128),
							ha_left);
	}
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}