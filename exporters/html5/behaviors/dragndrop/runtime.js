// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.DragnDrop = function(runtime)
{
	this.runtime = runtime;
	var self = this;
	
	if (!this.runtime.isDomFree)
	{
		jQuery(document).mousemove(
			function(info) {
				self.onMouseMove(info);
			}
		);
			
		jQuery(document).mousedown(
			function(info) {
				self.onMouseDown(info);
			}
		);
		
		jQuery(document).mouseup(
			function(info) {
				self.onMouseUp(info);
			}
		);
	}
	
	// Use document touch input for fullscreen mode
	var elem = (this.runtime.fullscreen_mode > 0) ? document : this.runtime.canvas;
	
	if (this.runtime.isDirectCanvas)
		elem = window["Canvas"];
	else if (this.runtime.isCocoonJs)
		elem = window;
	
	if (typeof PointerEvent !== "undefined")
	{
		elem.addEventListener("pointerdown",
			function(info) {
				self.onPointerStart(info);
			},
			false
		);
		
		elem.addEventListener("pointermove",
			function(info) {
				self.onPointerMove(info);
			},
			false
		);
		
		elem.addEventListener("pointerup",
			function(info) {
				self.onPointerEnd(info);
			},
			false
		);
		
		// Treat pointer cancellation the same as a touch end
		elem.addEventListener("pointercancel",
			function(info) {
				self.onPointerEnd(info);
			},
			false
		);
	}
	else if (window.navigator["msPointerEnabled"])
	{
		elem.addEventListener("MSPointerDown",
			function(info) {
				self.onPointerStart(info);
			},
			false
		);
		
		elem.addEventListener("MSPointerMove",
			function(info) {
				self.onPointerMove(info);
			},
			false
		);
		
		elem.addEventListener("MSPointerUp",
			function(info) {
				self.onPointerEnd(info);
			},
			false
		);
		
		// Treat pointer cancellation the same as a touch end
		elem.addEventListener("MSPointerCancel",
			function(info) {
				self.onPointerEnd(info);
			},
			false
		);
	}
	else
	{
		elem.addEventListener("touchstart",
			function(info) {
				self.onTouchStart(info);
			},
			false
		);
		
		elem.addEventListener("touchmove",
			function(info) {
				self.onTouchMove(info);
			},
			false
		);
		
		elem.addEventListener("touchend",
			function(info) {
				self.onTouchEnd(info);
			},
			false
		);
		
		elem.addEventListener("touchcancel",
			function(info) {
				self.onTouchEnd(info);
			},
			false
		);
	}
};

(function ()
{
	var behaviorProto = cr.behaviors.DragnDrop.prototype;
	
	var dummyoffset = {left: 0, top: 0};
	
	function GetDragDropBehavior(inst)
	{
		var i, len;
		for (i = 0, len = inst.behavior_insts.length; i < len; i++)
		{
			if (inst.behavior_insts[i] instanceof behaviorProto.Instance)
				return inst.behavior_insts[i];
		}
		
		return null;
	};
	
	behaviorProto.onMouseDown = function (info)
	{
		if (info.which !== 1)
			return;		// not left mouse button
			
		this.onInputDown("leftmouse", info.pageX, info.pageY);
	};
	
	behaviorProto.onMouseMove = function (info)
	{
		if (info.which !== 1)
			return;		// not left mouse button
			
		this.onInputMove("leftmouse", info.pageX, info.pageY);
	};
	
	behaviorProto.onMouseUp = function (info)
	{
		if (info.which !== 1)
			return;		// not left mouse button
			
		this.onInputUp("leftmouse");
	};
	
	behaviorProto.onTouchStart = function (info)
	{
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		
		var i, len, t, id;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			
			// directCanvas does not send an identifier
			id = t.identifier;
			this.onInputDown(id ? id.toString() : "<none>", t.pageX, t.pageY);
		}
	};
	
	behaviorProto.onTouchMove = function (info)
	{
		if (info.preventDefault)
			info.preventDefault();
		
		var i, len, t, id;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			id = t.identifier;
			this.onInputMove(id ? id.toString() : "<none>", t.pageX, t.pageY);
		}
	};
	
	behaviorProto.onTouchEnd = function (info)
	{
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		
		var i, len, t, id;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			id = t.identifier;
			this.onInputUp(id ? id.toString() : "<none>");
		}
	};
	
	behaviorProto.onPointerStart = function (info)
	{
		// Ignore mouse events
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
			
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		
		this.onInputDown(info["pointerId"].toString(), info.pageX, info.pageY);
	};
	
	behaviorProto.onPointerMove = function (info)
	{
		// Ignore mouse events
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
			
		if (info.preventDefault)
			info.preventDefault();
		
		this.onInputMove(info["pointerId"].toString(), info.pageX, info.pageY);
	};
	
	behaviorProto.onPointerEnd = function (info)
	{
		// Ignore mouse events
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
			
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		
		this.onInputUp(info["pointerId"].toString());
	};
	
	behaviorProto.onInputDown = function (src, pageX, pageY)
	{
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		var x = pageX - offset.left;
		var y = pageY - offset.top;
		var lx, ly, topx, topy;
		
		var arr = this.my_instances.valuesRef();
		
		var i, len, b, inst, topmost = null;
		for (i = 0, len = arr.length; i < len; i++)
		{
			inst = arr[i];
			b = GetDragDropBehavior(inst);
			
			if (!b.enabled || b.dragging)
				continue;		// don't consider disabled or already-dragging instances
				
			lx = inst.layer.canvasToLayer(x, y, true);
			ly = inst.layer.canvasToLayer(x, y, false);
			inst.update_bbox();
			if (!inst.contains_pt(lx, ly))
				continue;		// don't consider instances not over this point
				
			// First instance found
			if (!topmost)
			{
				topmost = inst;
				topx = lx;
				topy = ly;
				continue;
			}
			
			// Otherwise prefer the topmost instance of all overlapping the point
			if (inst.layer.index > topmost.layer.index)
			{
				topmost = inst;
				topx = lx;
				topy = ly;
				continue;
			}
			
			if (inst.layer.index === topmost.layer.index && inst.get_zindex() > topmost.get_zindex())
			{
				topmost = inst;
				topx = lx;
				topy = ly;
				continue;
			}
		}
		
		if (topmost)
			GetDragDropBehavior(topmost).onDown(src, topx, topy);
	};
	
	behaviorProto.onInputMove = function (src, pageX, pageY)
	{
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		var x = pageX - offset.left;
		var y = pageY - offset.top;
		var lx, ly;
		
		var arr = this.my_instances.valuesRef();
		
		var i, len, b, inst;
		for (i = 0, len = arr.length; i < len; i++)
		{
			inst = arr[i];
			b = GetDragDropBehavior(inst);
			
			if (!b.enabled || !b.dragging || (b.dragging && b.dragsource !== src))
				continue;		// don't consider disabled, not-dragging, or dragging by other sources
				
			lx = inst.layer.canvasToLayer(x, y, true);
			ly = inst.layer.canvasToLayer(x, y, false);
			b.onMove(lx, ly);
		}
	};
	
	behaviorProto.onInputUp = function (src)
	{
		var arr = this.my_instances.valuesRef();
		
		var i, len, b, inst;
		for (i = 0, len = arr.length; i < len; i++)
		{
			inst = arr[i];
			b = GetDragDropBehavior(inst);
			
			if (b.dragging && b.dragsource === src)
				b.onUp();
		}
	};
		
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
		this.dragging = false;
		this.dx = 0;
		this.dy = 0;
		this.dragsource = "<none>";
		
		// 0 = both, 1 = horizontal, 2 = vertical
		this.axes = this.properties[0];
		this.enabled = (this.properties[1] !== 0);
	};
	
	behinstProto.saveToJSON = function ()
	{
		return { "enabled": this.enabled };
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.enabled = o["enabled"];
		this.dragging = false;
	};
	
	behinstProto.onDown = function(src, x, y)
	{
		this.dx = x - this.inst.x;
		this.dy = y - this.inst.y;
		this.dragging = true;
		this.dragsource = src;
		
		// Trigger 'On drag start'
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.behaviors.DragnDrop.prototype.cnds.OnDragStart, this.inst);
		this.runtime.isInUserInputEvent = false;
	};
	
	behinstProto.onMove = function(x, y)
	{
		var newx = x - this.dx;
		var newy = y - this.dy;
		
		if (this.axes === 0)		// both
		{
			if (this.inst.x !== newx || this.inst.y !== newy)
			{
				this.inst.x = newx;
				this.inst.y = newy;
				this.inst.set_bbox_changed();
			}
		}
		else if (this.axes === 1)	// horizontal
		{
			if (this.inst.x !== newx)
			{
				this.inst.x = newx;
				this.inst.set_bbox_changed();
			}
		}
		else if (this.axes === 2)	// vertical
		{
			if (this.inst.y !== newy)
			{
				this.inst.y = newy;
				this.inst.set_bbox_changed();
			}
		}
	};
	
	behinstProto.onUp = function()
	{
		this.dragging = false;
			
		// Trigger 'On drop'
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.behaviors.DragnDrop.prototype.cnds.OnDrop, this.inst);
		this.runtime.isInUserInputEvent = false;
	};

	behinstProto.tick = function ()
	{
		//var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};
	
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": this.type.name,
			"properties": [
				{"name": "Is dragging", "value": this.dragging, "readonly": true},
				{"name": "Enabled", "value": !!this.enabled}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		if (name === "Enabled")
			this.enabled = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.IsDragging = function ()
	{
		return this.dragging;
	};
	
	Cnds.prototype.OnDragStart = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnDrop = function ()
	{
		return true;
	};
	
	Cnds.prototype.IsEnabled = function ()
	{
		return !!this.enabled;
	};
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetEnabled = function (s)
	{
		this.enabled = (s !== 0);
		
		// Got disabled: cancel any drag
		if (!this.enabled)
			this.dragging = false;
	};
	
	Acts.prototype.Drop = function ()
	{
		if (this.dragging)
			this.onUp();
	};
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	behaviorProto.exps = new Exps();
	
}());