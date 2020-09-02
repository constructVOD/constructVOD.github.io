// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.Sin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.Sin.prototype;
		
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
		
		this.i = 0;		// period offset (radians)
	};
	
	var behinstProto = behaviorProto.Instance.prototype;
	
	var _2pi = 2 * Math.PI;
	var _pi_2 = Math.PI / 2;
	var _3pi_2 = (3 * Math.PI) / 2;

	behinstProto.onCreate = function()
	{
		// Load properties
		this.active = (this.properties[0] === 1);
		this.movement = this.properties[1]; // 0=Horizontal|1=Vertical|2=Size|3=Width|4=Height|5=Angle|6=Opacity|7=Value only
		this.wave = this.properties[2];		// 0=Sine|1=Triangle|2=Sawtooth|3=Reverse sawtooth|4=Square
		this.period = this.properties[3];
		this.period += Math.random() * this.properties[4];								// period random
		
		if (this.period === 0)
			this.i = 0;
		else
		{
			this.i = (this.properties[5] / this.period) * _2pi;								// period offset
			this.i += ((Math.random() * this.properties[6]) / this.period) * _2pi;			// period offset random
		}
		
		this.mag = this.properties[7];													// magnitude
		this.mag += Math.random() * this.properties[8];									// magnitude random
		
		this.initialValue = 0;
		this.initialValue2 = 0;
		this.ratio = 0;
		
		// Convert magnitude from degrees to radians. Don't do this in init() otherwise it is repeated
		// by the 'Update initial state' action.
		if (this.movement === 5)			// angle
			this.mag = cr.to_radians(this.mag);
		
		this.init();
	};
	
	behinstProto.saveToJSON = function ()
	{
		return {
			"i": this.i,
			"a": this.active,
			"mv": this.movement,
			"w": this.wave,
			"p": this.period,
			"mag": this.mag,
			"iv": this.initialValue,
			"iv2": this.initialValue2,
			"r": this.ratio,
			"lkv": this.lastKnownValue,
			"lkv2": this.lastKnownValue2
		};
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.i = o["i"];
		this.active = o["a"];
		this.movement = o["mv"];
		this.wave = o["w"];
		this.period = o["p"];
		this.mag = o["mag"];
		this.initialValue = o["iv"];
		this.initialValue2 = o["iv2"] || 0;
		this.ratio = o["r"];
		this.lastKnownValue = o["lkv"];
		this.lastKnownValue2 = o["lkv2"] || 0;
	};
	
	behinstProto.init = function ()
	{
		switch (this.movement) {
		case 0:		// horizontal
			this.initialValue = this.inst.x;
			break;
		case 1:		// vertical
			this.initialValue = this.inst.y;
			break;
		case 2:		// size
			this.initialValue = this.inst.width;
			this.ratio = this.inst.height / this.inst.width;
			break;
		case 3:		// width
			this.initialValue = this.inst.width;
			break;
		case 4:		// height
			this.initialValue = this.inst.height;
			break;
		case 5:		// angle
			this.initialValue = this.inst.angle;
			break;
		case 6:		// opacity
			this.initialValue = this.inst.opacity;
			break;
		case 7:
			//value only, leave at 0
			this.initialValue = 0;
			break;
		case 8:		// forwards/backwards
			this.initialValue = this.inst.x;
			this.initialValue2 = this.inst.y;
			break;
		default:
			assert2(false, "Invalid sin movement type");
		}
		
		this.lastKnownValue = this.initialValue;
		this.lastKnownValue2 = this.initialValue2;
	};
	
	behinstProto.waveFunc = function (x)
	{
		x = x % _2pi;
		
		switch (this.wave) {
		case 0:		// sine
			return Math.sin(x);
		case 1:		// triangle
			if (x <= _pi_2)
				return x / _pi_2;
			else if (x <= _3pi_2)
				return 1 - (2 * (x - _pi_2) / Math.PI);
			else
				return (x - _3pi_2) / _pi_2 - 1;
		case 2:		// sawtooth
			return 2 * x / _2pi - 1;
		case 3:		// reverse sawtooth
			return -2 * x / _2pi + 1;
		case 4:		// square
			return x < Math.PI ? -1 : 1;
		};
		
		// should not reach here
		return 0;
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		if (!this.active || dt === 0)
			return;
		
		if (this.period === 0)
			this.i = 0;
		else
		{
			this.i += (dt / this.period) * _2pi;
			this.i = this.i % _2pi;
		}
		
		this.updateFromPhase();
	};
	
	behinstProto.updateFromPhase = function ()
	{
		switch (this.movement) {
		case 0:		// horizontal
			if (this.inst.x !== this.lastKnownValue)
				this.initialValue += this.inst.x - this.lastKnownValue;
				
			this.inst.x = this.initialValue + this.waveFunc(this.i) * this.mag;
			this.lastKnownValue = this.inst.x;
			break;
		case 1:		// vertical
			if (this.inst.y !== this.lastKnownValue)
				this.initialValue += this.inst.y - this.lastKnownValue;
				
			this.inst.y = this.initialValue + this.waveFunc(this.i) * this.mag;
			this.lastKnownValue = this.inst.y;
			break;
		case 2:		// size
			this.inst.width = this.initialValue + this.waveFunc(this.i) * this.mag;
			this.inst.height = this.inst.width * this.ratio;
			break;
		case 3:		// width
			this.inst.width = this.initialValue + this.waveFunc(this.i) * this.mag;
			break;
		case 4:		// height
			this.inst.height = this.initialValue + this.waveFunc(this.i) * this.mag;
			break;
		case 5:		// angle
			if (this.inst.angle !== this.lastKnownValue)
				this.initialValue = cr.clamp_angle(this.initialValue + (this.inst.angle - this.lastKnownValue));
				
			this.inst.angle = cr.clamp_angle(this.initialValue + this.waveFunc(this.i) * this.mag);
			this.lastKnownValue = this.inst.angle;
			break;
		case 6:		// opacity
			this.inst.opacity = this.initialValue + (this.waveFunc(this.i) * this.mag) / 100;
			
			if (this.inst.opacity < 0)
				this.inst.opacity = 0;
			else if (this.inst.opacity > 1)
				this.inst.opacity = 1;
				
			break;
		case 8:		// forwards/backwards
			if (this.inst.x !== this.lastKnownValue)
				this.initialValue += this.inst.x - this.lastKnownValue;
			if (this.inst.y !== this.lastKnownValue2)
				this.initialValue2 += this.inst.y - this.lastKnownValue2;
				
			this.inst.x = this.initialValue + Math.cos(this.inst.angle) * this.waveFunc(this.i) * this.mag;
			this.inst.y = this.initialValue2 + Math.sin(this.inst.angle) * this.waveFunc(this.i) * this.mag;
			this.lastKnownValue = this.inst.x;
			this.lastKnownValue2 = this.inst.y;
			break;
		}

		this.inst.set_bbox_changed();
	};
	
	behinstProto.onSpriteFrameChanged = function (prev_frame, next_frame)
	{
		// Handle size change when in width, height or size mode
		switch (this.movement) {
		case 2:	// size
			this.initialValue *= (next_frame.width / prev_frame.width);
			this.ratio = next_frame.height / next_frame.width;
			break;
		case 3:	// width
			this.initialValue *= (next_frame.width / prev_frame.width);
			break;
		case 4:	// height
			this.initialValue *= (next_frame.height / prev_frame.height);
			break;
		}
	};
	
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": this.type.name,
			"properties": [
				{"name": "Active", "value": this.active},
				{"name": "Period", "value": this.period},
				{"name": "Magnitude", "value": this.mag},
				{"name": "Value", "value": this.waveFunc(this.i) * this.mag, "readonly": true}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		switch (name) {
		case "Active":			this.active = value;			break;
		case "Period":			this.period = value;			break;
		case "Magnitude":		this.mag = value;				break;
		}
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.IsActive = function ()
	{
		return this.active;
	};
	
	Cnds.prototype.CompareMovement = function (m)
	{
		return this.movement === m;
	};
	
	Cnds.prototype.ComparePeriod = function (cmp, v)
	{
		return cr.do_cmp(this.period, cmp, v);
	};
	
	Cnds.prototype.CompareMagnitude = function (cmp, v)
	{
		if (this.movement === 5)
			return cr.do_cmp(this.mag, cmp, cr.to_radians(v));
		else
			return cr.do_cmp(this.mag, cmp, v);
	};
	
	Cnds.prototype.CompareWave = function (w)
	{
		return this.wave === w;
	};
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.SetActive = function (a)
	{
		this.active = (a === 1);
	};
	
	Acts.prototype.SetPeriod = function (x)
	{
		this.period = x;
	};
	
	Acts.prototype.SetMagnitude = function (x)
	{
		this.mag = x;
		
		if (this.movement === 5)	// angle
			this.mag = cr.to_radians(this.mag);
	};
	
	Acts.prototype.SetMovement = function (m)
	{
		// Undo radians conversion if switching away from angle mode
		if (this.movement === 5 && m !== 5)
			this.mag = cr.to_degrees(this.mag);
			
		this.movement = m;
		this.init();
	};
	
	Acts.prototype.SetWave = function (w)
	{
		this.wave = w;
	};
	
	Acts.prototype.SetPhase = function (x)
	{
		this.i = (x * _2pi) % _2pi;
		this.updateFromPhase();
	};
	
	Acts.prototype.UpdateInitialState = function ()
	{
		this.init();
	};
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.CyclePosition = function (ret)
	{
		ret.set_float(this.i / _2pi);
	};
	
	Exps.prototype.Period = function (ret)
	{
		ret.set_float(this.period);
	};
	
	Exps.prototype.Magnitude = function (ret)
	{
		if (this.movement === 5)	// angle
			ret.set_float(cr.to_degrees(this.mag));
		else
			ret.set_float(this.mag);
	};
	
	Exps.prototype.Value = function (ret)
	{
		ret.set_float(this.waveFunc(this.i) * this.mag);
	};
	
	behaviorProto.exps = new Exps();
	
}());