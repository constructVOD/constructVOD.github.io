(function () {
	
	// Work around stupid Firefox exceptions if you change privacy settings
	function localStorage_getItem(key)
	{
		try {
			return localStorage.getItem(key);
		}
		catch (e)
		{
			return null;
		}
	};

	function localStorage_setItem(key, value)
	{
		try {
			localStorage.setItem(key, value);
		}
		catch (e)
		{
			// ignore
		}
	};

	// Use the side pane size from the previous session, or default to 300px
	var side_size = parseInt(localStorage_getItem("__c2_sidesize"), 10) || 300;
	
	function update_size()
	{
		var w = jQuery(window).width();
		var h = jQuery(window).height();
		var topbarheight = jQuery("#topbar").height();
		
		// When the debugger is in a popout window, the iframe is hidden and the side pane
		// takes up the full window.
		if (is_popout)
		{
			side_size = h;
			jQuery("#side").height(side_size);
			jQuery("#leftpane").height(side_size - topbarheight);
			jQuery("#rightpane").height(side_size - topbarheight);
			jQuery("#perfpane").height(side_size - topbarheight);
			jQuery("#watchpane").height(side_size - topbarheight);
		}
		else
		{
			// If this is the main frame, but the debugger has been popped out,
			// hide the side pane in this frame.
			if (popout_window)
			{
				jQuery("#main").height(h);
				jQuery("iframewrap").width(w).height(h);
				jQuery("iframe").width(w).height(h);
			}
			// Otherwise the side pane is showing in the main frame, so split
			// the view between the iframe and side pane.
			else
			{
				if (side_size < topbarheight)
					side_size = topbarheight;
				if (side_size > h - 50)
					side_size = h - 50;
				
				jQuery("#main").height(h - side_size);
				jQuery("iframewrap").width(w).height(h - side_size);
				jQuery("iframe").width(w).height(h - side_size);
				jQuery("#side").height(side_size);
				jQuery("#leftpane").height(side_size - topbarheight);
				jQuery("#rightpane").height(side_size - topbarheight);
				jQuery("#perfpane").height(side_size - topbarheight);
				jQuery("#watchpane").height(side_size - topbarheight);
			}
		}
	};
	
	jQuery(window).resize(update_size);
	
	var objectlist = null;
	var pauseresume = null;
	var stepbutton = null;
	var savebutton = null;
	var loadbutton = null;
	var restartbutton = null;
	var popoutbutton = null;
	var iframe = null;
	var inspectview = null;
	var watchview = null;
	var inspect_tab = null;
	var watch_tab = null;
	var profile_tab = null;
	var watch_pane = null;
	var is_paused = false;
	var is_suspended = false;
	var is_dragging_topbar = false;
	var is_loading = true;
	var topbar_drag_offset = 0;
	var initial_side_size = side_size;
	var first_inspect = false;
	var made_edit = false;
	var perf_table = null;
	var current_tab = "inspect";
	var in_breakpoint = false;
	
	// An element for the currently editing property, e.g. text input
	var edit_input = null;
	var edit_td = null;						// cell being edited
	var edit_lastvalue = 0;
	var edit_property_name = "";			// name of currently editing property
	var edit_header_title = "";				// header title of currently editing property
	
	// For pop-out debugger
	var is_popout = false;
	var popout_window = null;
	
	// Map of object name to its list element and sub-list of instances
	var object_elements = {};
	
	// Map of header names to their tables and cells
	var property_headers = {};
	
	jQuery(document).ready(function()
	{
		is_popout = (window.location.search === "?popout");
		
		update_size();
		
		if (is_popout)
		{
			jQuery("#main").hide();
			jQuery("#topbarhandle").hide();
			
			// Tell the main frame when the popout is closed
			window.onbeforeunload = function () {
				postToFrame({"closing-popout": true});
			};
		}
		else
		{
			// Don't load the iframe until we know we're not the popout window.
			// Make sure we pick the NW.js preview template in NW.js.
			var iframeSrc = (/nwjs/i.test(navigator.userAgent) ? "preview-nwjs.html" : "preview.html");
			document.getElementById("theiframe").src = iframeSrc + "?debug";
			
			// Close any popout window if this main frame is closed.
			window.onbeforeunload = function () {
				if (popout_window)
					popout_window.close();
			};
		}
		
		// Receive messages from the runtime
		window.addEventListener("message", onMessage, false);
		
		// Get references to debugger DOM elements and attach events
		objectlist = document.getElementById("objectlist");
		pauseresume = document.getElementById("pauseresume");
		stepbutton = document.getElementById("step");
		savebutton = document.getElementById("save");
		loadbutton = document.getElementById("load");
		restartbutton = document.getElementById("restart");
		popoutbutton = document.getElementById("popoutdebugger");
		iframe = document.getElementById("theiframe");
		inspectview = document.getElementById("inspectview");
		inspect_tab = document.getElementById("inspect-tab");
		watch_tab = document.getElementById("watch-tab");
		profile_tab = document.getElementById("profile-tab");
		watch_pane = document.getElementById("watchpane");
		watchview = document.getElementById("watchview");
		
		pauseresume.onclick = onPauseResume;
		stepbutton.onclick = onStep;
		savebutton.onclick = onSave;
		loadbutton.onclick = onLoad;
		popoutbutton.onclick = onPopoutDebugger;
		restartbutton.onclick = onRestart;
		inspect_tab.onclick = onInspectTab;
		watch_tab.onclick = onWatchTab;
		profile_tab.onclick = onProfileTab;
		
		var gripper = document.getElementById("gripper");
		gripper.onmousedown = onGripperMousedown;
		
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
		
		document.addEventListener("click", function () {
			endEditValue(true);
		});
		
		jQuery("#rightpane").scroll(positionEditInput);
		
		jQuery(document).keydown(function (e)
		{
			// Escape cancels editing value
			if (e.which === 27)
				endEditValue(false);
			// Enter accepts editing value
			else if (e.which === 13)
				endEditValue(true);
		});
		
		// In NW.js, the window starts hidden and the game tries to show it when starting.
		// This doesn't work when it's in an iframe, so show the window from the debugger.
		if (/nwjs/i.test(navigator.userAgent))
		{
			if (typeof nw !== "undefined")
				nw.Window.get().show();
			else
				require("nw.gui").Window.get().show();
		}
	});
	
	// On message from runtime
	function onMessage(e)
	{
		var i, len, data, type;
		
		// If this is the main frame and a pop-out window exists, forward messages to it
		if (!is_popout && popout_window)
		{
			// Handle special messages from the popout window debugger
			if (e.data["from-debugger"])
			{
				// Popout wants to close itself
				if (e.data["closing-popout"])
					onClosePopout();
				// Otherwise forward on to iframe instead of handling it here
				else if (iframe && iframe.contentWindow)
					iframe.contentWindow.postMessage(e.data, "*");
			}
			// Otherwise just forward to the popout window
			else
				popout_window.postMessage(e.data, "*");
		}
		// The debugger pane is in the main frame, or this is a popout window: handle the message
		// for the debugger.
		else
		{
			data = e.data;
			type = data["type"];
			
			if (type === "inst-inspect")
			{
				onInspectInstanceUpdate(data["sections"], data["is_world"], data["siblings"], false);
			}
			else if (type === "watch-inspect")
			{
				onInspectInstanceUpdate(data["sections"], false, null, true);
			}
			else if (type === "inst-create")
			{
				// Repeat for each given name, which includes families the instance belongs to
				for (i = 0, len = data["names"].length; i < len; ++i)
					instanceCreated(data["names"][i], data["uid"]);
			}
			else if (type === "inst-destroy")
			{
				// Repeat for each given name, which includes families the instance belongs to
				for (i = 0, len = data["names"].length; i < len; ++i)
					instanceDestroyed(data["names"][i], data["uid"], data["was-inspecting"]);
			}
			else if (type === "perfstats")
			{
				onPerfStats(data["fps"], data["cpu"], data["mem"], data["renderer"], data["objectcount"], data["rendercpu"], data["eventscpu"], data["physicscpu"], data["sheets_perf"]);
			}
			else if (type === "loadingprogress")
				jQuery("#status").text("Loading: " + Math.round(data["progress"] * 100) + "%");
			else if (type === "init")
				init(data);
			else if (type === "reset")
				reset();
			else if (type === "suspend")
				onSuspend(data["suspended"], data["hit_breakpoint"], data["hit_event"]);
			else if (type === "fullscreen")
				onFullscreen(data["enabled"]);
			else if (type === "nocando")
			{
				onInspectTab();
				alert("The 'Watch' and 'Profile' tabs of the debugger are not available in the free edition of Construct 2. Purchase a license to take advantage of these features.");
			}
		}
		
	};
	
	// Post a message to the runtime
	function postToFrame(data)
	{
		// In a popout window, the main frame needs to distinguish this from a message from the runtime,
		// so add the "from-debugger" header to indicate the destination is the runtime, not the frame itself.
		if (is_popout)
		{
			data["from-debugger"] = true;
			window.opener.postMessage(data, "*");
		}
		// Otherwise the debugger is in the main frame. Post the message to the game iframe.
		else
		{
			if (!iframe || !iframe.contentWindow)
				return;
			
			iframe.contentWindow.postMessage(data, "*");
		}
	};
	
	// Runtime has been reloaded: reset the debugger to initial loading state
	function reset()
	{
		endEditValue(false);
		onInspectTab();
		jQuery(objectlist).empty();
		is_paused = false;
		is_suspended = false;
		jQuery("#status").show().text("Loading...");
		jQuery(pauseresume).text("Pause");
		jQuery("#controls").hide();
		jQuery("#tabs").hide();
		jQuery("#gamestatus").text("Loading");
		jQuery("#perfstats").text("...");
		jQuery("#step").addClass("disabled");
		jQuery("#step").text("Step");
		jQuery("#leftpane").show();
		jQuery("#rightpane").show();
		jQuery("#perfpane").hide();
		jQuery(watch_pane).hide();
		jQuery(inspectview).empty();
		jQuery(watchview).empty();
		is_loading = true;
		object_elements = {};
		property_headers = {};
	};
	
	// Runtime init message, indicating all object types in the project
	function init(data)
	{
		var i, len, j, t;
		var objs = data["objects"];
		
		jQuery("#status").hide();
		jQuery("#controls").show();
		jQuery("#tabs").show();
		jQuery("#gamestatus").text("Running");
		
		addObjectToList("System", true);
			
		for (i = 0, len = objs.length; i < len; ++i)
		{
			t = objs[i];
			addObjectToList(t["name"], t["singleglobal"]);
			
			// When re-initing due to the debugger being popped out or snapped back to the main frame,
			// make sure we re-add any instance list items.
			if (!t["singleglobal"])
			{
				for (j = 0; j < t["instances"]; ++j)
					instanceCreated(t["name"], -1);
			}
		}
		
		// This could be a re-init, so update to display the current pause state if necessary.
		if (data["paused"])
		{
			jQuery("#gamestatus").text("Paused");
			jQuery(pauseresume).text("Resume");
			is_paused = true;
		}
		// Restarting the game fires a page visibility hidden event when the page unloads, which sends the debugger
		// a suspend message. To ensure the debugger doesn't restart suspended, also restore the suspend state if not paused.
		else
		{
			jQuery(pauseresume).text("Pause");
			jQuery(pauseresume).removeClass("disabled");
			is_paused = false;
			is_suspended = false;
		}
		
		is_loading = false;
		first_inspect = true;
	};
	
	function addObjectToList(typename, singleglobal)
	{	
		// Create a li element with a sub-list in a scrolling div and attach it to the object list
		var li, sublist, a, countspan, div;
		
		li = document.createElement("li");
		
		if (!singleglobal)
			li.className = "obj-collapsed";
		
		a = document.createElement("a");
		a.className = "obj-item";
		a.appendChild(document.createTextNode(typename + " "));
		
		if (!singleglobal)
		{
			countspan = document.createElement("span");
			countspan.textContent = "(0)";
			a.appendChild(countspan);
		}
		
		a.onclick = onClickObjectInList;
		li.appendChild(a);
		
		if (!singleglobal)
		{
			div = document.createElement("div");
			div.className = "wrapbox";
			sublist = document.createElement("ul");
			div.appendChild(sublist);
			li.appendChild(div);
		}
		
		objectlist.appendChild(li);
		
		object_elements[typename] = {
			"instances": 0,
			"li": li,
			"a": a,
			"countspan": countspan,
			"sublist": sublist,
			"singleglobal": singleglobal
		};
	};
	
	function instanceCreated(typename, uid)
	{
		// A new instance has been created: find the sub-list for this object type,
		// and attach a new li element for it.
		var elem = object_elements[typename];
		
		if (!elem)
			return;
		
		var li = document.createElement("li");
		
		var a = document.createElement("a");
		a.textContent = "#" + elem["instances"];
		a.onclick = onClickInstance;
		
		li.appendChild(a);
		
		elem["sublist"].appendChild(li);
		
		elem["instances"]++;
		
		elem["countspan"].textContent = "(" + elem["instances"] + ")";
	};
	
	function instanceDestroyed(typename, uid, was_inspecting)
	{
		// An instance has been destroyed. If the debugger was inspecting it, clear the inspection
		// with a message stating the object was destroyed.
		if (was_inspecting)
		{
			endEditValue(false);
			jQuery(inspectview).empty();
			jQuery("#status").text("The instance being inspected ('" + typename + "' UID " + uid + ") was destroyed.");
			jQuery("#status").show();
			property_headers = {};
		}
		
		// Remove the last element from the sub-list of instance. Since IIDs will re-index, there's
		// no need to change any other list items.
		var elem = object_elements[typename];
		
		if (!elem)
			return;
		
		var sublist = elem["sublist"];
		sublist.removeChild(sublist.lastChild);
		
		elem["instances"]--;
		
		elem["countspan"].textContent = "(" + elem["instances"] + ")";
	};
	
	// An object type name was clicked in the inspector list. Expand/collapse it.
	function onClickObjectInList()
	{
		// Parse off the object type name of the clicked link
		var typename = this.textContent;
		var space = typename.indexOf(" ");
		typename = typename.substr(0, space);
		
		// Inspect the System object separately.
		if (typename === "System")
		{
			endEditValue(false);
			jQuery(inspectview).empty();
			jQuery("#status").hide();
			property_headers = {};
			postToFrame({"type": "inspectinstance", "typename": "System", "iid": -1});
			return;
		}
		
		// If there is just one instance, or it's a single-global (again just one instance, but not listed),
		// immediately inspect that instance.
		if (object_elements[typename] && (object_elements[typename]["instances"] === 1 || object_elements[typename]["singleglobal"]))
		{
			endEditValue(false);
			jQuery(inspectview).empty();
			jQuery("#status").hide();
			property_headers = {};
			first_inspect = true;
			postToFrame({"type": "inspectinstance", "typename": typename, "iid": 0});
		}
		
		// Toggle the list item expanded/collapsed by changing its class.
		var parent = this.parentElement;
		
		if (parent.className === "")
			return;
		
		if (parent.className === "obj-collapsed")
			parent.className = "obj-expanded";
		else
			parent.className = "obj-collapsed";
	};
	
	function sortPerf(a, b)
	{
		return b["profile"] - a["profile"];
	};
	
	function getProfileTableHtml(perf_entries, depth)
	{
		perf_entries.sort(sortPerf);
		
		var i, len, j, lenj, self, p;
		var str = '<table class="perftable">';
			
		for (i = 0, len = perf_entries.length; i < len; ++i)
		{
			p = perf_entries[i];
			str += '<tr><td class="perfitem">' + p["name"] + '</td><td class="perfvalue"><strong>' + (Math.round(p["profile"]) / 10) + '%</strong>';
			
			if (p["sub_entries"])
			{
				if (depth >= 2)
				{
					self = p["profile"];
					
					for (j = 0, lenj = p["sub_entries"].length; j < lenj; ++j)
						self -= p["sub_entries"][j]["profile"];
						
					str += " total; " + (Math.round(self) / 10) + "% self";
				}
				
				str += "<br/>" + getProfileTableHtml(p["sub_entries"], depth + 1);
			}
			
			str += "</td></tr>";
		}
		
		str += '</table>';
		return str;
	};
	
	// New performance stats received from runtime, updated every second. Display in the top bar.
	function onPerfStats(fps, cpu, mem, renderer, objectcount, rendercpu, eventscpu, physicscpu, sheets_perf)
	{
		var i, len;
		var memstring = "unavailable";
		
		if (mem > -1)
		{
			memstring = (Math.round(10 * mem / (1024 * 1024)) / 10).toString() + "mb images";
		}
		
		jQuery("#perfstats").text(objectcount.toString() + " objects - " + fps + " FPS - " + Math.round(cpu / 10) + "% CPU - " + memstring + " - " + renderer);
		
		if (sheets_perf.length)
		{
			var perf_entries = [];
			
			perf_entries.push({"name": "Draw calls", "profile": rendercpu});
			perf_entries.push({"name": "Physics simulation", "profile": physicscpu});
			perf_entries.push({"name": "Engine", "profile": (cpu - rendercpu - eventscpu - physicscpu)});
			perf_entries.push({"name": "Events", "profile": eventscpu, "sub_entries": sheets_perf});
			
			jQuery("#perftablewrap").html(getProfileTableHtml(perf_entries, 0));
		}
	};
	
	// When pausing or resuming, update the inspector indicators and post an instruction
	// to the runtime to pause or resume.
	function onPauseResume()
	{
		if (is_suspended && !in_breakpoint)
			return;
			
		if (in_breakpoint)
		{
			postToFrame({"type": "resumebreakpoint"});
			jQuery("#gamestatus").text("Running");
			jQuery(pauseresume).text("Pause");
			jQuery("#step").addClass("disabled");
			in_breakpoint = false;
		}
		else if (is_paused)
		{
			postToFrame({"type": "resume"});
			jQuery("#gamestatus").text("Running");
			jQuery(pauseresume).text("Pause");
			jQuery("#step").addClass("disabled");
			is_paused = false;
		}
		else
		{
			is_paused = true;
			postToFrame({"type": "pause"});
			jQuery("#gamestatus").text("Paused");
			jQuery(pauseresume).text("Resume");
			jQuery("#step").removeClass("disabled");
		}
	};
	
	function onStep()
	{
		if (is_paused || in_breakpoint)
			postToFrame({"type": "step"});
	};
	
	// Suspending happens when the tab goes in to the background. Display the debugger
	// status as suspended.
	function onSuspend(s, hit_breakpoint, hit_event)
	{
		// Pausing and resuming using the debugger also suspends and resumes the game.
		// Ignore any suspend messages caused by the debugger controls.
		if (s && !is_paused)
		{
			is_suspended = true;
			jQuery("#gamestatus").text(hit_breakpoint ? ("Hit breakpoint: " + hit_event) : "Suspended");
			
			if (hit_breakpoint)
			{
				jQuery(pauseresume).text("Continue");
				jQuery(pauseresume).removeClass("disabled");
				jQuery("#step").removeClass("disabled");
				jQuery("#step").text("Next");
				in_breakpoint = true;
			}
			else
			{
				jQuery(pauseresume).addClass("disabled");
				in_breakpoint = false;
				jQuery("#step").text("Step");
			}
		}
		if (!s)
		{
			is_suspended = false;
			
			if (is_paused)
			{
				jQuery("#gamestatus").text("Paused");
				
				// When coming out of suspend, the engine will resume, but we want it to be
				// paused. So fire off another pause message.
				postToFrame({"type": "pause"});
			}
			else
			{
				jQuery("#gamestatus").text("Running");
				jQuery(pauseresume).removeClass("disabled");
			}
			
			jQuery("#step").text("Step");
		}
	};
	
	function onSave()
	{
		postToFrame({"type": "save"});
	};
	
	function onLoad()
	{
		postToFrame({"type": "load"});
	};
	
	function onRestart()
	{
		reset();
		postToFrame({"type": "restart"});
	};
	
	// An instance was clicked in an object type's sub-list
	function onClickInstance()
	{
		// Parse the IID off the instance name, which is e.g. "#3", and reach up the
		// DOM to parse off the type name as well.
		var iid = parseInt(this.textContent.substr(1), 10);
		var typename = this.parentElement.parentElement.parentElement.previousSibling.textContent;
		
		var space = typename.indexOf(" ");
		typename = typename.substr(0, space);
		
		endEditValue(false);
		jQuery(inspectview).empty();
		jQuery("#status").hide();
		property_headers = {};
		first_inspect = true;
		postToFrame({"type": "inspectinstance", "typename": typename, "iid": iid});
	};
	
	function onInspectInstanceUpdate(propsections, is_world, siblings, is_watch)
	{
		if (is_loading)
			return;
		
		if (is_watch && current_tab !== "watch")
			return;
		if (!is_watch && current_tab !== "inspect")
			return;
		
		var i, len, j, lenj, p, q, section, header, table, tr, td, prop, button, a, just_created;
		var header_title, property_name, property_cells, lastvalue, propcell, wrapdiv, label, img, span;
		
		var inspect_container = is_watch ? watchview : inspectview;
		
		// At first, mark all existing headers and properties as unused. As they are updated,
		// mark them used, and then afterwards any that are no longer used can be removed.
		// This allows the displayed headers and properties to update dynamically based on
		// what the plugin being inspected is returning.
		for (p in property_headers)
		{
			if (property_headers.hasOwnProperty(p))
			{
				property_headers[p]["used"] = false;
				property_cells = property_headers[p]["cells"];
				
				for (q in property_cells)
				{
					if (property_cells.hasOwnProperty(q))
					{
						property_cells[q]["used"] = false;
					}
				}
			}
		}
		
		// For each property section
		for (i = 0, len = propsections.length; i < len; ++i)
		{
			section = propsections[i];
			
			// Check if header for this section already exists
			header_title = section["title"];
			
			if (property_headers.hasOwnProperty(header_title))
			{
				// Header element already exists: re-use it
				table = property_headers[header_title]["table"];
				property_cells = property_headers[header_title]["cells"];
				property_headers[header_title]["used"] = true;
			}
			else
			{
				// Header element does not yet exist: create it
				wrapdiv = document.createElement("div");
				wrapdiv.className = "nobreakinside";
				
				header = document.createElement("h3");
				header.className = "property-section";
				header.textContent = header_title + " ";
				
				img = new Image();
				img.className = "watch-icon-header";
				img.mytitle = header_title;
				
				if (is_watch)
				{
					img.src = "debugger-delete.png";
					img.title = "Remove section from watch";
					img.addEventListener("click", onClickRemoveHeaderFromWatch, true);
				}
				else
				{
					img.src = "debugger-watch.png";
					img.title = "Add section to watch";
					img.addEventListener("click", onClickAddHeaderToWatch, true);
				}
				
				header.appendChild(img);
				
				// Create table for properties
				table = document.createElement("table");
				table.className = "property-table";
				
				property_cells = {};
				
				property_headers[header_title] = {
					"header": header,
					"table": table,
					"cells": property_cells,
					"div": wrapdiv,
					"used": true,
				};
				
				wrapdiv.appendChild(header);
				wrapdiv.appendChild(table);
				inspect_container.appendChild(wrapdiv);
			}
			
			// For each property in this section
			for (j = 0, lenj = section["properties"].length; j < lenj; ++j)
			{
				prop = section["properties"][j];
				
				// Check if a table row has already been created for this property
				property_name = prop["name"];
				just_created = false;
				
				if (property_cells.hasOwnProperty(property_name))
				{
					propcell = property_cells[property_name];
					td = propcell["cell"];
					lastvalue = propcell["lastvalue"];
					propcell["used"] = true;
				}
				else
				{
					tr = document.createElement("tr");
					tr.className = "property-row";
					
					// First cell: property name
					td = document.createElement("td");
					td.className = "property-name";
					
					// Allow HTML in property name if in HTML mode
					if (prop["html"])
						td.innerHTML = property_name;
					else
						td.textContent = property_name;
					
					tr.appendChild(td);
					
					// Second cell: property value
					td = document.createElement("td");
					
					if (prop["readonly"])
					{
						td.className = "property-value property-readonly";
					}
					else
						td.className = "property-value";
					
					span = document.createElement("span");
					td.appendChild(span);
					
					lastvalue = prop["value"];
					
					propcell = {
						"cell": td,				// note this is the second (value) cell
						"valuespan": span,
						"row": tr,
						"lastvalue": lastvalue,
						"originalvalue": lastvalue,
						"used": true,
						"property_name": property_name,
						"header_title": header_title
					};
					
					property_cells[property_name] = propcell;
					td.myinfo = propcell;
					
					img = new Image();
					img.className = "watch-icon";
					
					if (is_watch)
					{
						img.src = "debugger-delete.png";
						img.title = "Remove from watch";
						img.addEventListener("click", onClickRemoveFromWatch, true);
					}
					else
					{
						img.src = "debugger-watch.png";
						img.title = "Add to watch";
						img.addEventListener("click", onClickAddToWatch, true);
					}
					
					img.myinfo = propcell;
					td.appendChild(img);
					
					tr.appendChild(td);
					table.appendChild(tr);
					
					if (!prop["readonly"])
						td.addEventListener("click", onClickEditableValue, false);
					
					just_created = true;
				}
				
				// Update the given property value if changed or first create
				if (lastvalue !== prop["value"] || just_created)
				{
					// If the entry indicates it uses HTML strings, set as HTML content.
					// Otherwise just set the textContent which is probably faster.
					if (prop["html"])
						propcell["valuespan"].innerHTML = prop["value"];
					else
						propcell["valuespan"].textContent = prop["value"];
					
					propcell["lastvalue"] = prop["value"];
					
					if (!made_edit || prop["value"] === propcell["originalvalue"])
						jQuery(propcell["cell"]).removeClass("property-edited");
				}
			}
		}
		
		// Iterate all headers and properties again. Remove any which are no longer used.
		for (p in property_headers)
		{
			if (property_headers.hasOwnProperty(p))
			{
				if (!property_headers[p]["used"])
				{
					inspect_container.removeChild(property_headers[p]["div"]);
					delete property_headers[p];
				}
				else
				{
					table = property_headers[p]["table"];
					property_cells = property_headers[p]["cells"];
					
					for (q in property_cells)
					{
						if (property_cells.hasOwnProperty(q))
						{
							if (!property_cells[q]["used"])
							{
								table.removeChild(property_cells[q]["row"]);
								delete property_cells[q];
							}
						}
					}
				}
			}
		}
		
		// On first update, add destroy and container button options
		if (first_inspect)
		{
			if (is_world)
			{
				wrapdiv = document.createElement("div");
				wrapdiv.className = "nobreakinside";
				
				header = document.createElement("h3");
				header.className = "property-section";
				header.textContent = "Tools";
				wrapdiv.appendChild(header);
				
				button = document.createElement("input");
				button.type = "button";
				button.onclick = onDestroyInspectedInstance;
				button.value = "Destroy";
				wrapdiv.appendChild(button);
				
				label = document.createElement("label");
				button = document.createElement("input");
				button.type = "checkbox";
				button.onclick = onToggleHighlight;
				button.checked = true;
				label.appendChild(button);
				label.appendChild(document.createTextNode("Highlight"));
				wrapdiv.appendChild(label);
				
				inspect_container.appendChild(wrapdiv);
			}
			
			if (siblings && siblings.length)
			{
				wrapdiv = document.createElement("div");
				wrapdiv.className = "nobreakinside";
				
				header = document.createElement("h3");
				header.className = "property-section";
				header.textContent = "Container";
				wrapdiv.appendChild(header);
				
				for (i = 0, len = siblings.length; i < len; ++i)
				{
					a = document.createElement("a");
					a.className = "container-link";
					a.textContent = siblings[i]["typename"] + " UID " + siblings[i]["uid"];
					a.mytypename = siblings[i]["typename"];
					a.myuid = siblings[i]["uid"];
					a.onclick = onContainerLinkClick;
					wrapdiv.appendChild(a);
					wrapdiv.appendChild(document.createElement("br"));
				}
				
				inspect_container.appendChild(wrapdiv);
			}
		}
		
		first_inspect = false;
		made_edit = false;
	};
	
	function onDestroyInspectedInstance()
	{
		postToFrame({"type": "destroy-inspect-inst"});
	};
	
	function onToggleHighlight()
	{
		postToFrame({"type": "highlight", "enabled": this.checked});
	};
	
	function onContainerLinkClick()
	{
		endEditValue(false);
		jQuery(inspectview).empty();
		jQuery("#status").hide();
		property_headers = {};
		first_inspect = true;
		postToFrame({"type": "inspectinstance", "uid": this.myuid});
	};
	
	// Resize the side pane showing the debugger when the top bar is dragged.
	function onGripperMousedown(e)
	{
		if (is_dragging_topbar || is_popout)
			return;
			
		is_dragging_topbar = true;
		topbar_drag_offset = e.screenY;
		initial_side_size = side_size;
		
		// Turn off pointer events on the iframe so we can get mousemove and mouseup events over it
		jQuery("iframe").css("pointer-events", "none");
	};
	
	function onMouseMove(e)
	{
		if (is_dragging_topbar)
		{
			side_size = initial_side_size - (e.screenY - topbar_drag_offset);
			var topbar_height = jQuery("#topbar").height();
			var window_height = jQuery(window).height();
			
			if (side_size < topbar_height)
				side_size = topbar_height;
			if (side_size > window_height - 50)
				side_size = window_height - 50;
			
			localStorage_setItem("__c2_sidesize", side_size);
			update_size();
		}
	};
	
	function onMouseUp(e)
	{
		if (is_dragging_topbar)
		{
			is_dragging_topbar = false;
			jQuery("iframe").css("pointer-events", "auto");
		}
	};
	
	function onPopoutDebugger()
	{
		// This is already a popout window: request self to be closed.
		if (is_popout)
		{
			postToFrame({"closing-popout": true});
		}
		// Otherwise open a popout window, hide the debugger pane in this frame, and request
		// that the debugger be sent a new init message so it can re-create the object type list.
		else
		{
			endEditValue(false);
			popout_window = window.open("debug?popout", "c2debugger", "menubar=no,toolbar=no,location=no,status=no,personalbar=no,width=" + jQuery(window).width() + ",height=" + side_size + ",resizable=yes,dependent=yes,minimizable=yes");
			jQuery("#side").hide();
			update_size();
			postToFrame({"type": "repostinit"});
			onInspectTab();
		}
	};
	
	function onClosePopout()
	{
		popout_window.close();
		popout_window = null;
		jQuery("#side").show();
		update_size();
		reset();
		postToFrame({"type": "repostinit"});
		onInspectTab();
	};
	
	function endEditValue(save_value)
	{
		if (!edit_input)
			return;
		
		if (save_value)
		{
			var cur_value;
			var is_ok = false;
			
			if (typeof edit_lastvalue === "number")
			{
				cur_value = parseFloat(edit_input.value);
				
				if (isFinite(cur_value))
					is_ok = true;
			}
			else if (typeof edit_lastvalue === "string")
			{
				cur_value = edit_input.value;
				is_ok = true;
			}
			else if (typeof edit_lastvalue === "boolean")
			{
				cur_value = (edit_input.selectedIndex !== 0);
				is_ok = true;
			}
			
			if (cur_value !== edit_lastvalue && is_ok)
			{
				postToFrame({
					"type": "editvalue",
					"name": edit_property_name,
					"header": edit_header_title,
					"value": cur_value
				});
				
				jQuery(edit_td).addClass("property-edited");
				made_edit = true;
			}
		}
		
		var inspect_container = (current_tab === "watch" ? watchview : inspectview);
		inspect_container.removeChild(edit_input);
		edit_input = null;
		edit_td = null;
		edit_property_name = "";
		edit_header_title = "";
		edit_lastvalue = 0;
	};
	
	function onClickEditableValue(e)
	{
		e.preventDefault();
		e.stopPropagation();
		
		endEditValue(true);
		var inspect_container = (current_tab === "watch" ? watchview : inspectview);
		
		if (typeof this.myinfo.lastvalue === "boolean")
		{
			edit_input = document.createElement("select");
			edit_input.id = "editvaluebool";
			
			var opt = document.createElement("option");
			opt.text = "false";
			edit_input.add(opt, null);
			
			opt = document.createElement("option");
			opt.text = "true";
			edit_input.add(opt, null);
			
			edit_input.onchange = endEditValue;
			
			edit_lastvalue = this.myinfo.lastvalue;
			
			inspect_container.appendChild(edit_input);
			edit_input.selectedIndex = (edit_lastvalue ? 1 : 0);
			edit_td = this;
			positionEditInput();
			edit_input.focus();
			
			setTimeout(function () {
				var mouseEvent = document.createEvent('MouseEvents');
				mouseEvent.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				edit_input.dispatchEvent(mouseEvent);
			}, 30);
		}
		else
		{
			edit_input = document.createElement("input");
			edit_input.id = "editvalue";
			edit_input.type = "text";
			edit_input.value = this.myinfo.lastvalue;
			edit_lastvalue = this.myinfo.lastvalue;
			
			inspect_container.appendChild(edit_input);
			edit_td = this;
			positionEditInput();
			edit_input.focus();
			edit_input.select();
		}
		
		edit_input.addEventListener("click", function (e) {
			// Stop clicks on the control calling the end edit handler
			e.preventDefault();
			e.stopPropagation();
		});
		
		edit_property_name = this.myinfo.property_name;
		edit_header_title = this.myinfo.header_title;
		
		// Work around a Chrome quirk where it doesn't get the position right at first
		setTimeout(function () {
			positionEditInput();
		}, 1);
	};
	
	function positionEditInput()
	{
		if (!edit_td || !edit_input)
			return;
		
		var tdpos = jQuery(edit_td).offset();
		tdpos.top -= 1;
		var tdw = jQuery(edit_td).outerWidth();
		var tdh = jQuery(edit_td).outerHeight() + 1;
		jQuery(edit_input).offset(tdpos).outerWidth(tdw).outerHeight(tdh);
	};
	
	function onClickAddToWatch(e)
	{
		e.stopPropagation();
		
		var propcell = this.myinfo;
		
		postToFrame({
			"type": "add-watch",
			"header_title": propcell["header_title"],
			"property_name": propcell["property_name"]
		});
	};
	
	function onClickAddHeaderToWatch(e)
	{
		e.stopPropagation();
		
		var header_title = this.mytitle;
		var propnames = [];
		var p;
		
		if (!property_headers.hasOwnProperty(header_title))
			return;
		
		headercells = property_headers[header_title]["cells"];
		
		for (p in headercells)
		{
			if (headercells.hasOwnProperty(p))
			{
				propnames.push(p);
			}
		}
		
		postToFrame({
			"type": "add-watch-header",
			"header_title": header_title,
			"property_names": propnames
		});
	};
	
	function onClickRemoveFromWatch(e)
	{
		e.stopPropagation();
		
		var propcell = this.myinfo;
		
		postToFrame({
			"type": "remove-watch",
			"header_title": propcell["header_title"],
			"property_name": propcell["property_name"]
		});
	};
	
	function onClickRemoveHeaderFromWatch(e)
	{
		e.stopPropagation();
		
		postToFrame({
			"type": "remove-watch-header",
			"header_title": this.mytitle
		});
	};
	
	function onInspectTab()
	{
		if (current_tab === "inspect")
			return;
		
		jQuery("#leftpane").show();
		jQuery("#rightpane").show();
		jQuery("#perfpane").hide();
		jQuery(watch_pane).hide();
		jQuery("#perftablewrap").empty();
		
		jQuery(inspect_tab).removeClass("inactive");
		jQuery(watch_tab).addClass("inactive");
		jQuery(profile_tab).addClass("inactive");
		
		endEditValue(false);
		jQuery(inspectview).empty();
		property_headers = {};
		first_inspect = true;
		
		current_tab = "inspect";
		postToFrame({"type": "switchtab", "mode": "inspect"});
	};
	
	function onWatchTab()
	{
		if (current_tab === "watch")
			return;
		
		jQuery("#leftpane").hide();
		jQuery("#rightpane").hide();
		jQuery("#perfpane").hide();
		jQuery(watch_pane).show();
		jQuery("#perftablewrap").empty();
		jQuery(watchview).empty();
		
		jQuery(inspect_tab).addClass("inactive");
		jQuery(watch_tab).removeClass("inactive");
		jQuery(profile_tab).addClass("inactive");
		
		endEditValue(false);
		jQuery(inspectview).empty();
		property_headers = {};
		first_inspect = true;
		
		current_tab = "watch";
		postToFrame({"type": "switchtab", "mode": "watch"});
	};
	
	function onProfileTab()
	{
		if (current_tab === "profile")
			return;
		
		jQuery("#leftpane").hide();
		jQuery("#rightpane").hide();
		jQuery("#perfpane").show();
		jQuery(watch_pane).hide();
		jQuery("#perftablewrap").empty();
		jQuery(watchview).empty();
		
		jQuery(inspect_tab).addClass("inactive");
		jQuery(watch_tab).addClass("inactive");
		jQuery(profile_tab).removeClass("inactive");
		
		endEditValue(false);
		jQuery(inspectview).empty();
		property_headers = {};
		first_inspect = true;
		
		current_tab = "profile";
		postToFrame({"type": "switchtab", "mode": "profile"});
	};
	
	// Note: only used by NW.js
	var isFullscreen = false;
	var nwgui = null;
	
	function onFullscreen(f)
	{
		try {
			if (!nwgui)
			{
				if (typeof nw !== "undefined")
					nwgui = nw;
				else
					nwgui = require("nw.gui");
			}
			
			if (f)
			{
				if (isFullscreen)
					return;
				
				nwgui["Window"]["get"]()["enterFullscreen"]();
				isFullscreen = true;
			}
			else
			{
				if (!isFullscreen)
					return;
				
				nwgui["Window"]["get"]()["leaveFullscreen"]();
				isFullscreen = false;
			}
		}
		catch (e) {}
	};
	
	// Keyboard shortcuts
	jQuery(document).keydown(function(info) {
		if (info.which === 121)	// F10 to step/next
		{
			onStep();
			info.preventDefault();
		}		
	});
	
})();