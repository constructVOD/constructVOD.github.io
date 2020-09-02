// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.solid = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.solid.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};

	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		this.inst.extra["solidEnabled"] = (this.properties[0] !== 0);
	};

	behinstProto.tick = function ()
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": this.type.name,
			"properties": [
				{"name": "Enabled", "value": this.inst.extra["solidEnabled"]}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		if (name === "Enabled")
			this.inst.extra["solidEnabled"] = value;
	};
	/**END-PREVIEWONLY**/
	
	function Cnds() {};
	
	Cnds.prototype.IsEnabled = function ()
	{
		return this.inst.extra["solidEnabled"];
	};
	
	behaviorProto.cnds = new Cnds();
	
	function Acts() {};
	
	Acts.prototype.SetEnabled = function (e)
	{
		this.inst.extra["solidEnabled"] = !!e;
	};
	
	behaviorProto.acts = new Acts();
	
}());