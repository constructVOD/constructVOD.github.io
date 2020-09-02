// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class

cr.plugins_.googleMap = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.googleMap.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
		//pluginProto.TypeContent
	
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
		//typeProto.onCreateContent
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.elem = document.createElement("div");
		this.elem.id = "map_canvas_"+this.uid;
		this.xCoord = this.properties[0];
		this.elem.style.width = "100%";
		this.elem.style.height = "100%";
		this.yCoord = this.properties[1];
		this.zoomMap = this.properties[2];
		this.scaleDisplay = [true, false][this.properties[4]];
		this.streetVDisplay = [true, false][this.properties[5]];
		this.displayPan = [true, false][this.properties[6]];
		this.displayZoom = [true, false][this.properties[7]];
		this.displayOverView = [true, false][this.properties[8]];
		this.controlType = [google["maps"]["NavigationControlStyle"]["DEFAULT"], google["maps"]["NavigationControlStyle"]["SMALL"], google["maps"]["NavigationControlStyle"]["ANDROID"]][this.properties[9]];
		this.displayType = [google["maps"]["MapTypeId"]["ROADMAP"], google["maps"]["MapTypeId"]["SATELLITE"], google["maps"]["MapTypeId"]["HYBRID"], google["maps"]["MapTypeId"]["TERRAIN"]][this.properties[3]];
		this.uidisable = false;
		
		this.latitude;
		this.longitude;
		this.checkLocation = false;
		
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		
		this.mapdiv = document.getElementById("map_canvas_"+this.uid);
		
	
		this.coordCarte = new google["maps"]["LatLng"](this.xCoord, this.yCoord);
		
		this.optionsCarte =	
			{   //vvvvvvv
			zoom: this.zoomMap, 
			center: this.coordCarte,
			mapTypeId: this.displayType,
			scaleControl: this.scaleDisplay,
			streetViewControl: this.streetVDisplay,
			panControl: this.displayPan,
			zoomControl: this.displayZoom,
			overviewMapControl: this.displayOverView,
			navigationControl: true,
			navigationControlOptions: {style: this.controlType},
			disableDefaultUI: this.uidisable,
			};
		
		this.googleMap= new google["maps"]["Map"](document.getElementById("map_canvas_"+this.uid), this.optionsCarte);
			
		document.getElementById("map_canvas_"+this.uid).style.visibility = "visible";

		
		
		// ajoute un marker au point coordonnées de la carte.
		this.marker = new google["maps"]["Marker"](
			{
			position: this.coordCarte,
			map: this.googleMap,
			title:this.properties[10]
			});

		this.updatePosition();
		this.runtime.tickMe(this);
	};
	
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	instanceProto.updatePosition = function (first) // from built-in offical button runtime code.
	{
		if (this.runtime.isDomFree)
			return;
		
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			if (!this.element_hidden)
				jQuery(this.elem).hide();
			
			this.element_hidden = true;
			return;
		}
		
		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= this.runtime.width)
			right = this.runtime.width - 1;
		if (bottom >= this.runtime.height)
			bottom = this.runtime.height - 1;
		
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
			
		// Avoid redundant updates
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (this.element_hidden)
			{
				jQuery(this.elem).show();
				this.element_hidden = false;
			}
			
			return;
		}
			
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		
		if (this.element_hidden)
		{
			jQuery(this.elem).show();
			this.element_hidden = false;
		}
		
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).css("position", "absolute");
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
		//instanceProto.drawContent
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
		//instanceProto.drawGLContent
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	//ConditionContent
	
	/* the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
	};*/
	

	
	pluginProto.cnds = new Cnds();
	
	
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	//0
	Acts.prototype.setXgoogleMap = function (x)
	{	
		this.xCoord = x;
		this.googleMap["setCenter"](new google["maps"]["LatLng"](this.xCoord, this.yCoord));	
		this.marker["setPosition"](this.googleMap["getCenter"]()); // deplace le marker à la nouvelle position
		google["maps"].event.trigger(this.googleMap, 'resize');
	};
	
	//1
	Acts.prototype.setYgoogleMap = function (y)
	{
		this.yCoord = y;
		this.googleMap["setCenter"](new google["maps"]["LatLng"](this.xCoord, this.yCoord));	
		this.marker["setPosition"](this.googleMap["getCenter"]()); // deplace le marker à la nouvelle position
		google["maps"].event.trigger(this.googleMap, 'resize');
	};
	
	//2
	Acts.prototype.addLocationMarker = function (i)
	{
		var marker = new google["maps"]["Marker"]({"position": this.googleMap["getCenter"](),	"map": this.googleMap, "title": i});
		google["maps"].event.trigger(this.googleMap, 'resize');
	};

	//3
	Acts.prototype.addPreciseMarker = function (x,y,i)
	{
		var myLatlng = new google["maps"]["LatLng"](x,y);
		var marker = new google["maps"]["Marker"](
		{ "position": myLatlng, "map": this.googleMap, "title": i});
		google["maps"].event.trigger(this.googleMap, 'resize');
	};
	
	//4
	Acts.prototype.startLocation = function getLocation() 
	{  
		var self = this;
	
		{ navigator.geolocation.getCurrentPosition(LocationOK, errorCallback);  };

		function LocationOK(position)  
		{  
			if (!navigator.geolocation)
			{
				self.checkLocation = false;
			}
			else
			{
		//		alert(self.latitude);
		//		alert(self.longitude);
				self.checkLocation = true;
				self.xCoord = position.coords.latitude;
				self.yCoord = position.coords.longitude;
				self.googleMap["setCenter"](new google["maps"]["LatLng"](self.xCoord, self.yCoord));	
				self.marker["setPosition"](self.googleMap["getCenter"]()); // deplace le marker à la nouvelle position
				google["maps"].event.trigger(this.googleMap, 'resize');
			};
		};   
		
		function errorCallback(error){
			switch(error.code)
				{
				case error.PERMISSION_DENIED:
					console.error("[Google Map Plugin] - The user didn't give access to his location");
					break;
				case error.POSITION_UNAVAILABLE:
					console.error("[Google Map Plugin] - The user's location wasn't correctly determined");
					break;
				case error.TIMEOUT:
					console.error("[Google Map Plugin] - Timing error, please try later.");
					break;
				};	
		};
	};	

	//5
	Acts.prototype.refreshMap = function ()
	{
		google["maps"].event.trigger(this.googleMap, 'resize');
	}

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.actualLatitude = function (ret)
	{
		if(this.checkLocation == true) { ret.set_float(this.xCoord); };
	};
	
	Exps.prototype.actualLongitude = function (ret)
	{
		if(this.checkLocation == true) { ret.set_float(this.yCoord); };
	};

	pluginProto.exps = new Exps();

}());