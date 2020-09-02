// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.scrollto_plus = function(runtime)
{
	this.runtime = runtime;
	
	this.shakeMag = 0;
	this.shakeStart = 0;
	this.shakeEnd = 0;
	this.shakeMode = 0;
};

(function ()
{
	var behaviorProto = cr.behaviors.scrollto_plus.prototype;
		
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
		
		this.insetTop = 0;
		this.insetLeft = 0;
		this.insetBottom = 0;
		this.insetRight = 0;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		this.insetTop = this.properties[0];	// InsetTop
		this.insetLeft = this.properties[1];	// InsetLeft
		this.insetBottom = this.properties[2];	// InsetBottom
		this.insetRight = this.properties[3];	// InsetRight
		console.log("bht_scroll:" + this.insetTop + "," + this.insetLeft + "," + this.insetBottom + "," + this.insetRight);
		this.enabled = (this.properties[0] !== 0);
	};

	behinstProto.saveToJSON = function ()
	{
		return {
			"smg": this.behavior.shakeMag,
			"ss": this.behavior.shakeStart,
			"se": this.behavior.shakeEnd,
			"smd": this.behavior.shakeMode
		};
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.behavior.shakeMag = o["smg"];
		this.behavior.shakeStart = o["ss"];
		this.behavior.shakeEnd = o["se"];
		this.behavior.shakeMode = o["smd"];
	};
	
	behinstProto.tick = function ()
	{
		// Do work in tick2 instead, to eliminate one-frame lag if object position changes in events
	};
	
	function getScrollToBehavior(inst)
	{
		var i, len, binst;
		for (i = 0, len = inst.behavior_insts.length; i < len; ++i)
		{
			binst = inst.behavior_insts[i];
			
			if (binst.behavior instanceof cr.behaviors.scrollto_plus)
				return binst;
		}
		
		return null;
	};
	
	behinstProto.tick2 = function ()
	{
		if (!this.enabled)
			return;
		
		// Get all instances with this behavior
		var all = this.behavior.my_instances.valuesRef();
		var sumx = 0, sumy = 0;
		var i, len, binst, count = 0;
		
		for (i = 0, len = all.length; i < len; i++)
		{
			binst = getScrollToBehavior(all[i]);
			
			if (!binst || !binst.enabled)
				continue;
			sumx += all[i].x;
			sumy += all[i].y;
			++count;
		}
		
		var layout = this.inst.layer.layout;
		
		// Is in a shake?
		var now = this.runtime.kahanTime.sum;
		var offx = 0, offy = 0;
		
		var insetLeft = this.insetLeft;
		var insetTop = this.insetTop;
		var insetRight = this.insetRight;
		var insetBottom = this.insetBottom;
		
		if (now >= this.behavior.shakeStart && now < this.behavior.shakeEnd)
		{
			var mag = this.behavior.shakeMag * Math.min(this.runtime.timescale, 1);
			
			// Mode 0 - reducing magnitude - lerp to zero
			if (this.behavior.shakeMode === 0)
				mag *= 1 - (now - this.behavior.shakeStart) / (this.behavior.shakeEnd - this.behavior.shakeStart);
				
			var a = Math.random() * Math.PI * 2;
			var d = Math.random() * mag;
			offx = Math.cos(a) * d;
			offy = Math.sin(a) * d;
			
			insetLeft = Math.max(0,insetLeft-offx);
			insetTop = Math.max(0,insetTop-offy);
			insetRight = Math.max(0,insetRight-offx);
			insetBottom = Math.max(0,insetBottom-offy);
		}
		
		var offsetX = sumx / count + offx;
		var offsetY = sumy / count + offy;
		
		var layer = this.inst.layer;		
		var viewMidWidth = (layer.viewRight-layer.viewLeft)/2;
		var viewMidHeight = (layer.viewBottom-layer.viewTop)/2;
		
		if(offsetX - insetLeft < viewMidWidth)
		{
			offsetX = insetLeft + viewMidWidth;
		}
		if(offsetX + insetRight > layout.width - viewMidWidth)
		{
			offsetX = layout.width - (viewMidWidth + insetRight);
		}
		
		if(offsetY - insetTop < viewMidHeight)
		{
			offsetY = insetTop + viewMidHeight;
		}
		if(offsetY + insetBottom > layout.height - viewMidHeight)
		{
			offsetY = layout.height - (viewMidHeight + insetBottom);
		}
			
		layout.scrollToX(offsetX);
		layout.scrollToY(offsetY);
	};
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.Enabled = function ()
	{
		return this.enabled;
	};
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Shake = function (mag, dur, mode)
	{
		this.behavior.shakeMag = mag;
		this.behavior.shakeStart = this.runtime.kahanTime.sum;
		this.behavior.shakeEnd = this.behavior.shakeStart + dur;
		this.behavior.shakeMode = mode;
	};
	
	Acts.prototype.SetEnabled = function (e)
	{
		this.enabled = (e !== 0);
	};
	
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

	Exps.prototype.Enabled = function (ret)
	{
		ret.set_int(this.enabled?1:0);
	};

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