function GetBehaviorSettings()
{
	return {
		"name":			"Physics",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"Physics",			// this is used to identify this behavior and is saved to the project; never change it
		"version":		"1.0",
		"description":	"Simulate realistic object physics, powered by Box2DWeb.",
		"author":		"Scirra",
		"help url":		"http://www.scirra.com/manual/98/physics",
		"category":		"Movements",			// Prefer to re-use existing categories, but you can set anything here
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
AddCondition(0, 0, "Is sleeping", "", "Is {my} sleeping", "True if the physics object has become inactive and is no longer requiring processing.", "IsSleeping");

AddComboParamOption("X velocity");
AddComboParamOption("Y velocity")
AddComboParamOption("Overall velocity");
AddComboParam("Which", "Choose whether to compare the velocity on an axis, or the overall velocity.");
AddCmpParam("Comparison", "Choose how to compare the velocity.");
AddNumberParam("Value", "Choose the number to compare the velocity to.");
AddCondition(1, 0, "Compare velocity", "", "{my} {0} {1} {2}", "Compare the current velocity of the physics object.", "CompareVelocity");

AddCmpParam("Comparison", "Choose how to compare the angular velocity.");
AddNumberParam("Value", "Choose the number to compare the angular velocity to, in degrees per second.");
AddCondition(2, 0, "Compare angular velocity", "", "{my} angular velocity {0} {1}", "Compare the current angular velocity of the physics object.", "CompareAngularVelocity");

AddCmpParam("Comparison", "Choose how to compare the mass.");
AddNumberParam("Value", "Choose the number to compare the mass to.");
AddCondition(3, 0, "Compare mass", "", "{my} mass {0} {1}", "Compare the current mass of the physics object.", "CompareMass");

AddCondition(4, 0, "Is enabled", "", "Is {my} enabled", "Test if the behavior is currently enabled.", "IsEnabled");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddNumberParam("Force X", "The horizontal force to apply.");
AddNumberParam("Force Y", "The vertical force to apply.");
AddAnyTypeParam("Image point", "The name or number of the image point to apply the force at, or 0 for object's origin.");
AddAction(0, af_none, "Apply force", "Forces", "Apply {my} force (<i>{0}</i>, <i>{1}</i>) at image point {2}", "Apply a force on the object.", "ApplyForce");

AddNumberParam("Force", "The force to apply.");
AddNumberParam("X", "The X co-ordinate to apply the force towards.");
AddNumberParam("Y", "The Y co-ordinate to apply the force towards.");
AddAnyTypeParam("Image point", "The name or number of the image point to apply the force at, or 0 for object's origin.");
AddAction(1, af_none, "Apply force towards position", "Forces", "Apply {my} force {0} toward (<i>{1}</i>, <i>{2}</i>) at image point {3}", "Apply a force on the object towards a position in the layout.", "ApplyForceToward");

AddNumberParam("Force", "The force to apply.");
AddNumberParam("Angle", "The angle, in degrees, to apply the force towards.");
AddAnyTypeParam("Image point", "The name or number of the image point to apply the force at, or 0 for object's origin.");
AddAction(2, af_none, "Apply force at angle", "Forces", "Apply {my} force {0} at angle {1} at image point {2}", "Apply a force on the object in a particular direction.", "ApplyForceAtAngle");

AddNumberParam("Impulse X", "The horizontal impulse to apply.");
AddNumberParam("Impulse Y", "The vertical impulse to apply.");
AddAnyTypeParam("Image point", "The name or number of the image point to apply the impulse at, or 0 for object's origin.");
AddAction(3, af_none, "Apply impulse", "Forces", "Apply {my} impulse (<i>{0}</i>, <i>{1}</i>) at image point {2}", "Apply an impulse to the object, as if it were suddenly struck.", "ApplyImpulse");

AddNumberParam("Impulse", "The impulse to apply.");
AddNumberParam("X", "The X co-ordinate to apply the impulse towards.");
AddNumberParam("Y", "The Y co-ordinate to apply the impulse towards.");
AddAnyTypeParam("Image point", "The name or number of the image point to apply the impulse at, or 0 for object's origin.");
AddAction(4, af_none, "Apply impulse towards position", "Forces", "Apply {my} impulse {0} toward (<i>{1}</i>, <i>{2}</i>) at image point {3}", "Apply an impulse on the object as if it were suddenly struck towards a position in the layout.", "ApplyImpulseToward");

AddNumberParam("Impulse", "The impulse to apply.");
AddNumberParam("Angle", "The angle, in degrees, to apply the impulse at.");
AddAnyTypeParam("Image point", "The name or number of the image point to apply the impulse at, or 0 for object's origin.");
AddAction(5, af_none, "Apply impulse at angle", "Forces", "Apply {my} impulse {0} at angle {1} at image point {2}", "Apply an impulse on the object as if it were suddenly struck at an angle.", "ApplyImpulseAtAngle");

AddNumberParam("Torque", "The torque to apply to the object.");
AddAction(6, af_none, "Apply torque", "Torque", "Apply {my} torque {0}", "Apply a torque (i.e. angular acceleration).", "ApplyTorque");

AddNumberParam("Torque", "The magnitude of the torque to apply.");
AddNumberParam("Angle", "The angle, in degrees, to apply torque towards.");
AddAction(7, af_none, "Apply torque towards angle", "Torque", "Apply {my} torque {0} toward angle {1}", "Apply a torque towards an angle.", "ApplyTorqueToAngle");

AddNumberParam("Torque", "The magnitude of the torque to apply.");
AddNumberParam("X", "The X co-ordinate in the layout to apply torque towards.");
AddNumberParam("Y", "The Y co-ordinate in the layout to apply torque towards.");
AddAction(8, af_none, "Apply torque towards position", "Torque", "Apply {my} torque {0} toward (<i>{1}</i>, <i>{2}</i>)", "Apply a torque towards a position in the layout.", "ApplyTorqueToPosition");

AddNumberParam("Angular velocity", "The angular velocity to set, in degrees per second.");
AddAction(9, af_none, "Set angular velocity", "Torque", "Set {my} angular velocity to {0}", "Set the rate the object rotates at.", "SetAngularVelocity");

AddAnyTypeParam("This image point", "Name or number of image point on this object to attach joint to. Use 0 for the center of gravity and -1 for the object origin.");
AddObjectParam("Object", "The object to attach to.");
AddAnyTypeParam("That image point", "Name or number of image point on other object to attach joint to.");
AddNumberParam("Damping ratio", "The joint damping ratio, from 0 (no damping) to 1 (critical damping)");
AddNumberParam("Spring frequency", "The mass-spring-damper frequency, in Hertz.");
AddAction(10, af_none, "Create distance joint", "Joints", "Create {my} distance joint from image point {0} to {1} image point {2}, damping ratio {3}, frequency {4}", "Force this and another object to stay a fixed distance apart, as if connected by a pole.", "CreateDistanceJoint");

AddAnyTypeParam("This image point", "Name or number of image point on this object to hinge object to. Use 0 for the center of gravity and -1 for the object origin.");
AddObjectParam("Object", "The object to attach.");
AddAction(11, af_none, "Create revolute joint", "Joints", "Create {my} revolute joint at image point {0} to {1}", "Hinge another object to a point on this object.", "CreateRevoluteJoint");

AddNumberParam("Gravity", "The new force of gravity to set.", "10");
AddAction(12, af_none, "Set world gravity", "Global settings", "Set {my} world gravity to {0}", "Set the force of gravity on all objects in the world.", "SetWorldGravity");

AddComboParamOption("Fixed");
AddComboParamOption("Framerate independent");
AddComboParam("Mode", "The stepping mode.  'Fixed' guarantees same results every time but is not framerate independent; 'framerate independent' adjusts to the framerate but may give different results each time.");
AddAction(13, af_none, "Set stepping mode", "Global settings", "Set {my} world stepping mode to <b>{0}</b>", "Set the way the physics engine steps the simulation.", "SetSteppingMode");

AddNumberParam("Velocity iterations", "Iterations for the velocity constraint solver.  Lower is fast and inaccurate, higher is slow and accurate.", "8");
AddNumberParam("Position iterations", "Iterations for the position constraint solver.  Lower is fast and inaccurate, higher is slow and accurate.", "3");
AddAction(14, af_none, "Set stepping iterations", "Global settings", "Set {my} world stepping to {0} velocity iterations and {1} position iterations", "Set the performance/accuracy trade-off.", "SetIterations");

AddNumberParam("X component", "The X component of the velocity to set, in pixels per second.");
AddNumberParam("Y component", "The Y component of the velocity to set, in pixels per second.");
AddAction(15, af_none, "Set velocity", "Forces", "Set {my} velocity to (<i>{0}</i>, <i>{1}</i>)", "Set the current motion of the physics object.", "SetVelocity");

AddNumberParam("Density", "The new object density.  Only has effect when 'Immovable' is 'No'.", "1.0");
AddAction(16, af_none, "Set density", "Object settings", "Set {my} density to <b>{0}</b>", "Set the density of the physics object.", "SetDensity");

AddNumberParam("Friction", "The new object friction coefficient, between 0 and 1.", "0.5");
AddAction(17, af_none, "Set friction", "Object settings", "Set {my} friction coefficient to <b>{0}</b>", "Set the friction coefficient.", "SetFriction");

AddNumberParam("Elasticity", "The new object elasticity (restitution or 'bounciness') coefficient, between 0 and 1.", "0.2");
AddAction(18, af_none, "Set elasticity", "Object settings", "Set {my} elasticity to <b>{0}</b>", "Set the elasticity ('bounciness') coefficient.", "SetElasticity");

AddNumberParam("Linear damping", "The new object linear damping, between 0 and 1.", "0");
AddAction(19, af_none, "Set linear damping", "Object settings", "Set {my} linear damping to <b>{0}</b>", "Set the coefficient to slow down motion over time.", "SetLinearDamping");

AddNumberParam("Angular damping", "The new object angular damping, between 0 and 1.", "0.01");
AddAction(20, af_none, "Set angular damping", "Object settings", "Set {my} angular damping to <b>{0}</b>", "Set the coefficient to slow down rotations over time.", "SetAngularDamping");

AddComboParamOption("Movable");
AddComboParamOption("Immovable");
AddComboParam("Setting", "Set whether the object has infinite mass (immovable).");
AddAction(21, af_none, "Set immovable", "Object settings", "Set {my} <b>{0}</b>", "Set whether the object has infinite mass (immovable)", "SetImmovable");

AddAnyTypeParam("This image point", "Name or number of image point on this object to hinge object to. Use 0 for the center of gravity and -1 for the object origin.");
AddObjectParam("Object", "The object to attach.");
AddNumberParam("Lower angle", "The lower angle of rotation allowed, in degrees.");
AddNumberParam("Upper angle", "The upper angle of rotation allowed, in degrees.");
AddAction(22, af_none, "Create limited revolute joint", "Joints", "Create {my} limited revolute joint at image point {0} to {1}, from {2} to {3} degrees", "Hinge another object to a point on this object and limit the range of rotation.", "CreateLimitedRevoluteJoint");

AddObjectParam("Object", "Choose another object type with the Physics behavior to enable or disable collisions for.");
AddComboParamOption("Disable");
AddComboParamOption("Enable");
AddComboParam("State", "Enable or disable collisions with the given object type.");
AddAction(23, af_none, "Enable/disable collisions", "Global settings", "{1} {my} collisions with {0}", "Enable or disable collisions with another object using the Physics behavior.", "EnableCollisions");

AddComboParamOption("Don't prevent rotations");
AddComboParamOption("Prevent rotations");
AddComboParam("Setting", "Set whether to prevent the object rotating when hit.");
AddAction(24, af_none, "Set prevent rotation", "Object settings", "Set {my} <b>{0}</b>", "Set whether to prevent the object rotating when hit.", "SetPreventRotate");

AddComboParamOption("Off");
AddComboParamOption("On");
AddComboParam("Bullet", "Set whether to use bullet mode for enhanced collision detection on fast-moving objects.");
AddAction(25, af_none, "Set bullet", "Object settings", "Set {my} bullet mode <b>{0}</b>", "Set whether to use enhanced collision detection for fast-moving objects.", "SetBullet");

AddAction(26, af_none, "Remove all joints", "Joints", "Remove all {my} joints", "Remove all joints created to or from this object.", "RemoveJoints");

AddComboParamOption("disabled");
AddComboParamOption("enabled");
AddComboParam("Mode", "Choose whether to enable or disable the behavior.");
AddAction(27, af_none, "Set enabled", "Object settings", "Set {my} {0}", "Enable or disable the behavior.", "SetEnabled");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel
AddExpression(0,	ef_return_number,		"Get velocity X",	"",	"VelocityX",	"The X component of the object's current velocity, in pixels per second.");
AddExpression(1,	ef_return_number,		"Get velocity Y",	"",	"VelocityY",	"The Y component of the object's current velocity, in pixels per second.");
AddExpression(2,	ef_return_number,		"Get angular velocity",	"",	"AngularVelocity",	"The object's current angular velocity, in degrees per second.");

AddExpression(3,	ef_return_number,		"Get mass",			"",	"Mass",			"The object's physics mass, which is its collision area multiplied by its density.");
AddExpression(4,	ef_return_number,		"Get center of mass X", "", "CenterOfMassX", "The X co-ordinate of the object's center of mass.");
AddExpression(5,	ef_return_number,		"Get center of mass Y", "", "CenterOfMassY", "The Y co-ordinate of the object's center of mass.");

AddExpression(6,	ef_return_number,		"Get density",			"Object settings",	"Density",			"The current density of the physics object.");
AddExpression(7,	ef_return_number,		"Get friction",			"Object settings",	"Friction",			"The current friction of the physics object.");
AddExpression(8,	ef_return_number,		"Get elasticity",		"Object settings",	"Elasticity",		"The current elasticity ('bounciness') of the physics object.");
AddExpression(9,	ef_return_number,		"Get linear damping",	"Object settings",	"LinearDamping",	"The current linear damping coefficient.");
AddExpression(10,	ef_return_number,		"Get angular damping",	"Object settings",	"AngularDamping",	"The current angular damping coefficient.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
	new cr.Property(ept_combo, 		"Immovable",		"No",						"Enable to make object have infinite mass.  Ideal for scenery.", "No|Yes"),
	new cr.Property(ept_combo,		"Collision mask",	"Use collision polygon",	"How the object collides in the physics simulation.", "Use collision polygon|Bounding box|Circle"),
	new cr.Property(ept_combo,		"Prevent rotation",	"No",						"Prevent the object rotating when hit.", "No|Yes"),
	new cr.Property(ept_float,		"Density",			1,							"The object density, if 'immovable' is 'no'."),
	new cr.Property(ept_float,		"Friction",			0.5,						"The object friction coefficient, between 0 and 1."),
	new cr.Property(ept_float,		"Elasticity",		0.2,						"The object elasticity (restitution or 'bounciness') coefficient, between 0 and 1."),
	new cr.Property(ept_float,		"Linear damping",	0.0,						"Coefficient to slow down motion over time, between 0 and 1."),
	new cr.Property(ept_float,		"Angular damping",	0.01,						"Coefficient to slow down rotations over time, between 0 and 1."),
	new cr.Property(ept_combo, 		"Bullet",			"No",						"Enable enhanced collision detection for fast moving objects.", "No|Yes"),
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
