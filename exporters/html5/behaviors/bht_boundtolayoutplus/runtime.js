// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.boundtolayout_plus = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.boundtolayout_plus.prototype;
		
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
		this.mode = 0;
		
		this.insetTop = 0;
		this.insetLeft = 0;
		this.insetBottom = 0;
		this.insetRight = 0;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		this.mode = this.properties[0];	// 0 = origin, 1 = edge
		this.insetTop = this.properties[1];	// InsetTop
		this.insetLeft = this.properties[2];	// InsetLeft
		this.insetBottom = this.properties[3];	// InsetBottom
		this.insetRight = this.properties[4];	// InsetRight
		
		console.log("bht_bound:" + this.insetTop + "," + this.insetLeft + "," + this.insetBottom + "," + this.insetRight);
	};
	
	behinstProto.tick = function ()
	{
	};

	behinstProto.tick2 = function ()
	{
		this.inst.update_bbox();
		var bbox = this.inst.bbox;
		var layout = this.inst.layer.layout;
		var changed = false;
		
		if (this.mode === 0)	// origin
		{
			if (this.inst.x < 0 + this.insetLeft)
			{
				this.inst.x = 0 + this.insetLeft;
				changed = true;
			}
			if (this.inst.y < 0 + this.insetTop)
			{
				this.inst.y = 0 + this.insetTop;
				changed = true;
			}
			if (this.inst.x > layout.width - this.insetRight)
			{
				this.inst.x = layout.width - this.insetRight;
				changed = true;
			}
			if (this.inst.y > layout.height - this.insetBottom)
			{
				this.inst.y = layout.height - this.insetBottom;
				changed = true;
			}
		}
		// Bound by edge (bounding box) mode
		else
		{
			if (bbox.left < 0 + this.insetLeft)
			{
				this.inst.x -= bbox.left - this.insetLeft;
				changed = true;
			}
			if (bbox.top < 0 + this.insetTop)
			{
				this.inst.y -= bbox.top - this.insetTop;
				changed = true;
			}
			if (bbox.right > layout.width - this.insetRight)
			{
				this.inst.x -= (bbox.right - (layout.width - this.insetRight));
				changed = true;
			}
			if (bbox.bottom > layout.height - this.insetBottom)
			{
				this.inst.y -= (bbox.bottom - (layout.height - this.insetBottom));
				changed = true;
			}
		}
		
		if (changed)
			this.inst.set_bbox_changed();
	};
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.SetInsetTop = function (inset)
	{
		this.insetTop = inset;
	};
	Acts.prototype.SetInsetLeft = function (inset)
	{
		this.insetLeft = inset;
	};
	Acts.prototype.SetInsetBottom = function (inset)
	{
		this.insetBottom = inset;
	};
	Acts.prototype.SetInsetRight = function (inset)
	{
		this.insetRight = inset;
	};
	
	behaviorProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.InsetTop = function (ret)
	{
		ret.set_int(this.insetTop);
	};
	Exps.prototype.InsetLeft = function (ret)
	{
		ret.set_int(this.insetLeft);
	};
	Exps.prototype.InsetBottom = function (ret)
	{
		ret.set_int(this.insetBottom);
	};
	Exps.prototype.InsetRight = function (ret)
	{
		ret.set_int(this.insetRight);
	};
	
	behaviorProto.exps = new Exps();

}());