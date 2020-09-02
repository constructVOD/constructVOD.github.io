function GetBehaviorSettings()
{
	return {
		"name":			"Custom Movement",
		"id":			"custom",
		"version":		"1.0",
		"description":	"Make your own movement using low-level movement functions.",
		"author":		"Scirra",
		"help url":		"http://www.scirra.com/manual/92/custom-movement",
		"category":		"Movements",
		"flags":		0
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(0, 0, "Is moving", "", "{my} is moving", "True when the object is moving.", "IsMoving");

AddComboParamOption("Overall");
AddComboParamOption("Horizontal");
AddComboParamOption("Vertical");
AddComboParam("Which", "Choose the speed to compare.");
AddCmpParam("Comparison", "Choose the way to compare the speed.");
AddNumberParam("Speed", "The speed, in pixels per second, to compare to.");
AddCondition(1, 0, "Compare speed", "", "{my} {0} speed {1} {2}", "Compare the current speed of the object.", "CompareSpeed");

AddCondition(2, cf_trigger, "On step", "", "On {my} step", "Triggered when stepping the object for motion.", "OnCMStep");
AddCondition(3, cf_trigger, "On horizontal step", "", "On {my} horizontal step", "Triggered when stepping the object horizontally for motion.", "OnCMHorizStep");
AddCondition(4, cf_trigger, "On vertical step", "", "On {my} vertical step", "Triggered when stepping the object vertically for motion.", "OnCMVertStep");

//////////////////////////////////////////////////////////////
// Actions
AddAction(0, 0, "Stop", "Velocity", "Stop {my}", "Set the speed to zero.", "Stop");

AddComboParamOption("Both");
AddComboParamOption("Horizontally");
AddComboParamOption("Vertically");
AddComboParam("Axes", "Choose which axes to reverse on.");
AddAction(1, 0, "Reverse", "Velocity", "Reverse {my} ({0})", "Invert the direction of motion.", "Reverse");

AddComboParamOption("Overall");
AddComboParamOption("Horizontal");
AddComboParamOption("Vertical");
AddComboParam("Which", "Choose the speed to set.");
AddNumberParam("Speed", "The new speed of the object to set, in pixels per second.");
AddAction(2, 0, "Set speed", "Velocity", "Set {my} {0} speed to <i>{1}</i>", "Set the object's current speed.", "SetSpeed");

AddComboParamOption("Forwards");
AddComboParamOption("Horizontally");
AddComboParamOption("Vertically");
AddComboParam("Which", "Choose which way to accelerate.");
AddNumberParam("Acceleration", "The acceleration, in pixels per second per second.");
AddAction(3, 0, "Accelerate", "Velocity", "Accelerate {my} {0} <i>{1}</i>", "Accelerate the object forwards or on an axis.", "Accelerate");

AddNumberParam("Acceleration", "The acceleration, in pixels per second per second.");
AddNumberParam("Angle", "The angle, in degrees, to accelerate toward.");
AddAction(4, 0, "Accelerate toward angle", "Velocity", "Accelerate {my} <i>{0}</i> at angle <i>{1}</i>", "Accelerate the object at an angle.", "AccelerateAngle");

AddNumberParam("Acceleration", "The acceleration, in pixels per second per second.");
AddNumberParam("X", "The X co-ordinate in the layout to accelerate toward.");
AddNumberParam("Y", "The Y co-ordinate in the layout to accelerate toward.");
AddAction(5, 0, "Accelerate toward position", "Velocity", "Accelerate {my} <i>{0}</i> toward (<i>{1}</i>, <i>{2}</i>)", "Accelerate the object toward a position.", "AcceleratePos");

AddNumberParam("Angle", "The new angle of motion, in degrees.");
AddAction(6, 0, "Set angle of motion", "Angle of motion", "Set {my} angle of motion to <i>{0}</i>", "Set the angle the object is currently moving at.", "SetAngleOfMotion");

AddNumberParam("Angle", "Amount to rotate clockwise, in degrees.");
AddAction(7, 0, "Rotate clockwise", "Angle of motion", "Rotate {my} angle of motion clockwise <i>{0}</i> degrees", "Rotate the angle of motion in a clockwise direction.", "RotateAngleOfMotionClockwise");

AddNumberParam("Angle", "Amount to rotate counter-clockwise, in degrees.");
AddAction(8, 0, "Rotate counter-clockwise", "Angle of motion", "Rotate {my} angle of motion counter-clockwise <i>{0}</i> degrees", "Rotate the angle of motion in a counter-clockwise direction.", "RotateAngleOfMotionCounterClockwise");

AddComboParamOption("Go back a step");
AddComboParamOption("Stay at current position");
AddComboParam("Position", "Choose the resulting object position.");
AddAction(9, 0, "Stop stepping", "Velocity", "Stop {my} stepping ({0})", "Stop the current stepping, preventing any more step triggers firing this tick.", "StopStepping");

AddComboParamOption("Opposite angle");
AddComboParamOption("Nearest");
AddComboParamOption("Up");
AddComboParamOption("Down");
AddComboParamOption("Left");
AddComboParamOption("Right");
AddComboParam("Direction", "Choose the method of push out.");
AddAction(10, 0, "Push out solid", "Velocity", "Push {my} out of solid ({0})", "Push the object to a space if it is overlapping a solid.", "PushOutSolid");

AddNumberParam("Angle", "Angle, in degrees, to push the object out at.");
AddAction(11, 0, "Push out solid at angle", "Velocity", "Push {my} out of solid at angle {0}", "Push the object to a space at an angle if it is overlapping a solid.", "PushOutSolidAngle");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Set whether to enable or disable the behavior.");
AddAction(12, 0, "Set enabled", "", "Set {my} <b>{0}</b>", "Set whether this behavior is enabled.", "SetEnabled");

//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_number, "Get speed", "", "Speed", "The current object speed, in pixels per second.");
AddExpression(1, ef_return_number, "Get angle of motion", "", "MovingAngle", "The current angle of motion, in degrees.");
AddExpression(2, ef_return_number, "Get vector X", "", "dx", "The current X component of motion, in pixels per second.");
AddExpression(3, ef_return_number, "Get vector Y", "", "dy", "The current Y component of motion, in pixels per second.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo, "Stepping mode", "None", "Move in increments while firing the step triggers.", "None|Linear|Horizontal then vertical|Vertical then horizontal"),
	new cr.Property(ept_integer, "Pixels per step",	5, "When stepping enabled, the number of pixels to move each step."),
	new cr.Property(ept_combo, "Initial state", "Enabled", "Whether to initially have the behavior enabled or disabled.", "Disabled|Enabled")
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
	if (this.properties["Pixels per step"] < 1)
		this.properties["Pixels per step"] = 1;
}
