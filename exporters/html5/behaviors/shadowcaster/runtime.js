// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.shadowcaster = function(runtime)
{
	this.runtime = runtime;
	this.myTypes = [];
};

(function ()
{
	var behaviorProto = cr.behaviors.shadowcaster.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
		
		if (this.behavior.myTypes.indexOf(objtype) === -1)
			this.behavior.myTypes.push(objtype);
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
		this.inst.extra["shadowcasterEnabled"] = (this.properties[0] !== 0);
		this.inst.extra["shadowcasterHeight"] = this.properties[1];
		this.inst.extra["shadowcasterTag"] = this.properties[2];
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
				{"name": "Enabled", "value": this.inst.extra["shadowcasterEnabled"]},
				{"name": "Height", "value": this.inst.extra["shadowcasterHeight"]},
				{"name": "Tag", "value": this.inst.extra["shadowcasterTag"]}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		if (name === "Enabled")
			this.inst.extra["shadowcasterEnabled"] = value;
		else if (name === "Height")
			this.inst.extra["shadowcasterHeight"] = value;
		else if (name === "Tag")
			this.inst.extra["shadowcasterTag"] = value;
	};
	/**END-PREVIEWONLY**/
	
	//////////////////////////////////////////
	function Cnds() {};
	
	Cnds.prototype.IsEnabled = function ()
	{
		return this.inst.extra["shadowcasterEnabled"];
	};
	
	Cnds.prototype.CompareHeight = function (cmp, x)
	{
		var h = this.inst.extra["shadowcasterHeight"];
		return cr.do_cmp(h, cmp, x);
	};
	
	behaviorProto.cnds = new Cnds();
	
	//////////////////////////////////////////
	function Acts() {};
	
	Acts.prototype.SetEnabled = function (e)
	{
		this.inst.extra["shadowcasterEnabled"] = !!e;
	};
	
	Acts.prototype.SetHeight = function (h)
	{
		if (this.inst.extra["shadowcasterHeight"] !== h)
		{
			this.inst.extra["shadowcasterHeight"] = h;
			this.runtime.redraw = true;
		}
	};
	
	Acts.prototype.SetTag = function (tag)
	{
		if (this.inst.extra["shadowcasterTag"] !== tag)
		{
			this.inst.extra["shadowcasterTag"] = tag;
			this.runtime.redraw = true;
		}
	};
	
	behaviorProto.acts = new Acts();
	
	//////////////////////////////////////////
	function Exps() {};
	
	Exps.prototype.Height = function (ret)
	{
		ret.set_float(this.inst.extra["shadowcasterHeight"]);
	};
	
	Exps.prototype.Tag = function (ret)
	{
		ret.set_string(this.inst.extra["shadowcasterTag"]);
	};
	
	behaviorProto.exps = new Exps();
	
}());