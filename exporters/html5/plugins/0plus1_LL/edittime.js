function GetPluginSettings()
{
	return {
		"name":			"Local Leaderboards",
		"id":			"LL",
		"version":		"1.0",
		"description":	"Offline leaderboards using Local Storage",
		"author":		"0plus1",
		"help url":		"http://games.0plus1.com/",
		"category":		"General",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddStringParam("id", "Leaderboard ID.", "\"\"");
AddCondition(0,	cf_looping, "Loop Leaderboard", "General", "Loop leaderboard {0}", "Loop leaderboard scores.", "loopLeaderboard");

//////////////////////////////////////////////////////////////
// Actions
AddStringParam("id", "Leaderboard ID.", "\"\"");
AddNumberParam("score", "Score", "");
AddAction(0, af_none, "Report Score", "General", "Report Score {1} to leaderboard {0}", "Report Score to Leaderboard.", "reportScore");

////////////////////////////////////////
// Expressions 
AddExpression(0, ef_return_string, "Score string", "Data", "currentScore", "Get the current score inside the leaderboard loop.");

AddExpression(1, ef_return_string, "Poisition string", "Data", "currentPosition", "Get the current position of the score inside the leaderboard loop.");
////////////////////////////////////////

ACESDone();

// Property grid properties for this plugin
var property_list = [];
	
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
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
