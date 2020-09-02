// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.custom = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.custom.prototype;
		
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
		this.inst = inst;
		this.runtime = type.runtime;
		
		this.dx = 0;
		this.dy = 0;
		
		this.cancelStep = 0;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		this.stepMode = this.properties[0];	// 0=None, 1=Linear, 2=Horizontal then vertical, 3=Vertical then horizontal
		this.pxPerStep = this.properties[1];
		this.enabled = (this.properties[2] !== 0);
	};
	
	behinstProto.saveToJSON = function ()
	{
		return {
			"dx": this.dx,
			"dy": this.dy,
			"cancelStep": this.cancelStep,
			"enabled": this.enabled,
			"stepMode": this.stepMode,
			"pxPerStep": this.pxPerStep
		};
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.dx = o["dx"];
		this.dy = o["dy"];
		this.cancelStep = o["cancelStep"];
		this.enabled = o["enabled"];
		this.stepMode = o["stepMode"];
		this.pxPerStep = o["pxPerStep"];
	};
	
	behinstProto.getSpeed = function ()
	{
		return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
	};
	
	behinstProto.getAngle = function ()
	{
		return Math.atan2(this.dy, this.dx);
	};
	
	function sign(x)
	{
		if (x === 0)
			return 0;
		else if (x < 0)
			return -1;
		else
			return 1;
	};
	
	behinstProto.step = function (x, y, trigmethod)
	{
		if (x === 0 && y === 0)
			return;
		
		var startx = this.inst.x;
		var starty = this.inst.y;
		var sx, sy, prog;
		
		var steps = Math.round(Math.sqrt(x * x + y * y) / this.pxPerStep);
		if (steps === 0)
			steps = 1;
			
		var i;
		for (i = 1; i <= steps; i++)
		{
			prog = i / steps;
			this.inst.x = startx + x * prog;
			this.inst.y = starty + y * prog;
			this.inst.set_bbox_changed();
			
			this.runtime.trigger(trigmethod, this.inst);
			
			if (this.cancelStep === 1)
			{
				// Go back a step and stop
				i--;
				prog = i / steps;
				this.inst.x = startx + x * prog;
				this.inst.y = starty + y * prog;
				this.inst.set_bbox_changed();
				return;
			}
			else if (this.cancelStep === 2)
			{
				// Stop and do nothing
				return;
			}
		}
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		var mx = this.dx * dt;
		var my = this.dy * dt;
		var i, steps;
		
		// Disabled or not moving, nothing to do
		if ((this.dx === 0 && this.dy === 0) || !this.enabled)
			return;
			
		this.cancelStep = 0;
			
		if (this.stepMode === 0)		// none
		{
			this.inst.x += mx;
			this.inst.y += my;
		}
		else if (this.stepMode === 1)	// linear
		{
			this.step(mx, my, cr.behaviors.custom.prototype.cnds.OnCMStep);
		}
		else if (this.stepMode === 2)	// horizontal then vertical
		{
			this.step(mx, 0, cr.behaviors.custom.prototype.cnds.OnCMHorizStep);
			this.cancelStep = 0;
			this.step(0, my, cr.behaviors.custom.prototype.cnds.OnCMVertStep);
		}
		else if (this.stepMode === 3)	// vertical then horizontal
		{
			this.step(0, my, cr.behaviors.custom.prototype.cnds.OnCMVertStep);
			this.cancelStep = 0;
			this.step(mx, 0, cr.behaviors.custom.prototype.cnds.OnCMHorizStep);
		}
		
		this.inst.set_bbox_changed();
	};
	
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": this.type.name,
			"properties": [
				{"name": "Vector X", "value": this.dx},
				{"name": "Vector Y", "value": this.dy},
				{"name": "Pixels per step", "value": this.pxPerStep},
				{"name": "Enabled", "value": this.enabled}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		switch (name) {
		case "Vector X":			this.dx = value;			break;
		case "Vector Y":			this.dy = value;			break;
		case "Pixels per step":		this.pxPerStep = value;		break;
		case "Enabled":				this.enabled = value;		break;
		}
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.IsMoving = function ()
	{
		return this.dx != 0 || this.dy != 0;
	};
	
	Cnds.prototype.CompareSpeed = function (axis, cmp, s)
	{
		var speed;
		
		switch (axis) {
		case 0:		speed = this.getSpeed();	break;
		case 1:		speed = this.dx;			break;
		case 2:		speed = this.dy;			break;
		}
		
		return cr.do_cmp(speed, cmp, s);
	};
	
	Cnds.prototype.OnCMStep = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnCMHorizStep = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnCMVertStep = function ()
	{
		return true;
	};
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Stop = function ()
	{
		this.dx = 0;
		this.dy = 0;
	};
	
	Acts.prototype.Reverse = function (axis)
	{
		switch (axis) {
		case 0:
			this.dx *= -1;
			this.dy *= -1;
			break;
		case 1:
			this.dx *= -1;
			break;
		case 2:
			this.dy *= -1;
			break;
		}
	};
	
	Acts.prototype.SetSpeed = function (axis, s)
	{
		var a;
		
		switch (axis) {
		case 0:
			a = this.getAngle();
			this.dx = Math.cos(a) * s;
			this.dy = Math.sin(a) * s;
			break;
		case 1:
			this.dx = s;
			break;
		case 2:
			this.dy = s;
			break;
		}
	};
	
	Acts.prototype.Accelerate = function (axis, acc)
	{
		var dt = this.runtime.getDt(this.inst);
		var ds = acc * dt;
		var a;
		
		switch (axis) {
		case 0:
			a = this.getAngle();
			this.dx += Math.cos(a) * ds;
			this.dy += Math.sin(a) * ds;
			break;
		case 1:
			this.dx += ds;
			break;
		case 2:
			this.dy += ds;
			break;
		}
	};
	
	Acts.prototype.AccelerateAngle = function (acc, a_)
	{
		var dt = this.runtime.getDt(this.inst);
		var ds = acc * dt;
		var a = cr.to_radians(a_);
		
		this.dx += Math.cos(a) * ds;
		this.dy += Math.sin(a) * ds;
	};
	
	Acts.prototype.AcceleratePos = function (acc, x, y)
	{
		var dt = this.runtime.getDt(this.inst);
		var ds = acc * dt;
		var a = Math.atan2(y - this.inst.y, x - this.inst.x);
		
		this.dx += Math.cos(a) * ds;
		this.dy += Math.sin(a) * ds;
	};
	
	Acts.prototype.SetAngleOfMotion = function (a_)
	{
		var a = cr.to_radians(a_);
		var s = this.getSpeed();
		
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	
	Acts.prototype.RotateAngleOfMotionClockwise = function (a_)
	{
		var a = this.getAngle() + cr.to_radians(a_);
		var s = this.getSpeed();
		
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	
	Acts.prototype.RotateAngleOfMotionCounterClockwise = function (a_)
	{
		var a = this.getAngle() - cr.to_radians(a_);
		var s = this.getSpeed();
		
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	
	Acts.prototype.StopStepping = function (mode)
	{
		// set to 1 = go back a step, 2 = stay at current position
		this.cancelStep = mode + 1;
	};
	
	Acts.prototype.PushOutSolid = function (mode)
	{
		var a, ux, uy;
		switch (mode) {
		// Opposite angle
		case 0:
			// Make unit motion of vector, invert it and push that way
			a = this.getAngle();
			ux = Math.cos(a);
			uy = Math.sin(a);
			this.runtime.pushOutSolid(this.inst, -ux, -uy, Math.max(this.getSpeed() * 3, 100));
			break;
		// Nearest
		case 1:
			this.runtime.pushOutSolidNearest(this.inst);
			break;
		// Up
		case 2:
			this.runtime.pushOutSolid(this.inst, 0, -1, Math.max(Math.abs(this.dy) * 3, 100));
			break;
		// Down
		case 3:
			this.runtime.pushOutSolid(this.inst, 0, 1, Math.max(Math.abs(this.dy) * 3, 100));
			break;
		// Left
		case 4:
			this.runtime.pushOutSolid(this.inst, -1, 0, Math.max(Math.abs(this.dx) * 3, 100));
			break;
		// Right
		case 5:
			this.runtime.pushOutSolid(this.inst, 1, 0, Math.max(Math.abs(this.dx) * 3, 100));
			break;
		}
	};
	
	Acts.prototype.PushOutSolidAngle = function (a)
	{
		a = cr.to_radians(a);
		var ux = Math.cos(a);
		var uy = Math.sin(a);
		this.runtime.pushOutSolid(this.inst, ux, uy, Math.max(this.getSpeed() * 3, 100));
	};
	
	Acts.prototype.SetEnabled = function (en)
	{
		this.enabled = (en === 1);
	};
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(this.getSpeed());
	};
	
	Exps.prototype.MovingAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.getAngle()));
	};
	
	Exps.prototype.dx = function (ret)
	{
		ret.set_float(this.dx);
	};
	
	Exps.prototype.dy = function (ret)
	{
		ret.set_float(this.dy);
	};
	
	behaviorProto.exps = new Exps();
	
}());