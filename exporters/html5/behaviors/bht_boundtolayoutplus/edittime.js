// v1.0 - initial release.
// v1.1 - added actions to set insets. Added expressions to get insets.

function GetBehaviorSettings()
{
	return {
		"name":			"Bound to layout Plus",
		"id":			"boundtolayout_plus",
		"version":		"1.1",
		"description":	"Stop an object leaving the layout.",
		"author":		"Black Hornet Technologies",
		"help url":		"",
		"category":		"General",
		"flags":		bf_onlyone
	};
};

//////////////////////////////////////////////////////////////
// Actions
AddNumberParam("Top Inset", "Enter the inset value, from the top.");
AddAction(0, 0, "Set Inset Top", "", "{my}: set inset from the top to {0}", "Set the inset from the top.", "SetInsetTop");

AddNumberParam("Left Inset", "Enter the inset value, from the Left.");
AddAction(1, 0, "Set Inset Left", "", "{my}: set inset from the left to {0}", "Set the inset from the left.", "SetInsetLeft");

AddNumberParam("Bottom Inset", "Enter the inset value, from the bottom.");
AddAction(2, 0, "Set Inset Bottom", "", "{my}: set inset from the bottom to {0}", "Set the inset from the bottom.", "SetInsetBottom");

AddNumberParam("Right Inset", "Enter the inset value, from the right.");
AddAction(3, 0, "Set Inset Right", "", "{my}: set inset from the right to {0}", "Set the inset from the right.", "SetInsetRight");


//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number, "Get inset top", "", "InsetTop", "Get the inset top value.");
AddExpression(1, ef_return_number, "Get inset left", "", "InsetLeft", "Get the inset left value.");
AddExpression(2, ef_return_number, "Get inset bottom", "", "InsetBottom", "Get the inset bottom value.");
AddExpression(3, ef_return_number, "Get inset right", "", "InsetRight", "Get the inset right value.");

// No ACES
ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo, "Bound by", "Edge", "Choose whether to stop the object at its origin or at its edge.", "Origin|Edge"),
	new cr.Property(ept_integer, "Inset Top", "0", "Inset from the top to bound to."),
	new cr.Property(ept_integer, "Inset Left", "0", "Inset from the left to bound to."),
	new cr.Property(ept_integer, "Inset Bottom", "0", "Inset from the bottom to bound to."),
	new cr.Property(ept_integer, "Inset Right", "0", "Inset from the right to bound to.")
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
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
