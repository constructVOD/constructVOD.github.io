function GetPluginSettings()
{
	return {
		"name":			"ComboBox & ListBox",
		"id":			"ComboBox",
		"version":    	"2.43",
		"description":	"Add a ComboBox or a ListBox into your project.",
		"author":		"Gregory Georges",
		"help url":		"http://dl.dropbox.com/u/27157668/construct2/help/ComboBox.html",
		"category":		"Form controls",
		"type":			"world",			// in layout
		"rotatable":	false,
		"flags":		pf_size_aces | pf_appearance_aces
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

//////////////////////////////////////////////////////////////
// Actions////////////////////////////////////////////////////

//AddItem
AddAnyTypeParam("Text of the line:", "Add a new line", "\"\"");
AddAction (0, 0, "Add a line", "Line", "Add: {0}", "Add a new line", "AddItem");
//AddItemAfter 
AddAnyTypeParam("Text of the line:", "Text of the line to insert", "\"\"");
AddNumberParam("ID of the line:", "ID number of the line to insert after", "");
AddAction (4, 0, "Insert a line", "Line", "Insert: {0}, after line: {1}", "Insert a new line", "AddItemAfter");
//DeleteItem
AddAnyTypeParam("ID of the line:", "Delete a line (set \"all\" to remove all lines)", "");
AddAction (1, 0, "Delete a line", "Line", "Delete the line: {0}", "Delete a line", "DeleteItem");
//SelectItem
AddNumberParam("ID of the line:", "Select a line", "");
AddAction (2, 0, "Select a line", "Line", "Select the line: {0}", "Select a line", "SelectItem");
//ChangeItem
AddAnyTypeParam("Text of the line:", "Text of the line to change", "\"\"");
AddNumberParam("ID of the line:", "ID number of the line to change", "");
AddAction (5, 0, "Change a line", "Line", "set text to: {0} of the line: {1}", "Change text of a line", "ChangeItem");
//SetEnabled
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("Mode", "Choose whether to enable or disable the combo box.");
AddAction(6, 0, "Set enabled", "Combo", "Set <b>{0}</b>", "Disable or enable the combo box.", "SetEnabled");
//SetTooltip 
AddAnyTypeParam("Tooltip:", "Text to display in the tooltip", "\"\"");
AddAction (3, 0, "Change tooltip", "Combo", "Set tooltip text to: {0}", "Set or change the text of the tooltip", "SetTooltip");

//SyncScrolling 
AddAnyTypeParam("Listbox ID:", "ID of the twin listbox.", "\"\"");
AddAction (7, 0, "Sync Scrolling", "Listbox", "Sync the scrolling with Listbox: {0}", "Sync the scrolling between two listbox object.", "SyncScrolling");

//Focus
AddAction (8, 0, "Get Focus", "Combo", "Get the focus", "Get the focus", "Focus");
//Blurred
AddAction (9, 0, "Loose Focus", "Combo", "Loose the focus", "Loose the focus", "Blurred");

//reAttributeID
AddAction (10, 0, "Reattribute IDs", "Combo", "Reattribute all IDs", "Reattribute all IDs from 0 to y", "reAttribute");

//////////////////////////////////////////////////////////////
// Conditions ////////////////////////////////////////////////

//isLineSelected
AddNumberParam("ID of the line:", "ID number of the line to test", "");
AddCondition(0, 0, "is a line selected ?", "General", "is the line {0} selected ?", "Check if a line is selected into the comboBox", "isLineSelected"); 
//isEnabled
AddCondition(1, 0, "is Enabled ?", "General", "is the comboBox enabled?", "Check if the comboBox is enabled", "isEnabled"); 
//isScrolling
AddCondition(2, cf_trigger, "is Scrolling ?", "General", "Is the comboBox scrolling?", "Check if the object is scrolling", "isScrolling"); 
//isFocused
AddCondition(3, cf_trigger, "Has Focused ?", "General", "Is the comboBox focused?", "Check if the object is focused", "isFocused");
//isBlur
AddCondition(4, cf_trigger, "Lost Focus ?", "General", "Does the comboBox loose the focus ?", "Check if the object looses the focus", "isBlur");


//////////////////////////////////////////////////////////////
// Expressions////////////////////////////////////////////////

//getValueSelected
AddExpression(0, ef_return_number, "Get ID of current line ", "General", "getValueSelected", "Return the ID of the selected line (the first line ID is 1, not 0)");
//getTotalLines
AddExpression(1, ef_return_number, "Get number of lines", "General", "getTotalLines", "Return the total number of lines");
//getTextSelected
AddExpression(2, ef_return_any, "Get text of current line", "General", "getTextSelected", "Return the text of the selected line");
//getTextById
AddNumberParam(">ID of the line<", "ID of the line to get text", "");
AddExpression(3, ef_return_any, "Get text by ID", "General", "getTextById", "Return the text by the ID of the line");

ACESDone();


//////////////////////////////////////////////////////////////
//PROPERTIES//////////////////////////////////////////////////
var property_list = [
	new cr.Property(ept_combo,	"Type", "Combo Box", "Choose the type of the object between a combobox or a listbox.", "Combo Box|List Box"), //0
new cr.Property(ept_section, "Listbox Properties", "",	"Specific properties for the Listbox object."),
	new cr.Property(ept_combo,	"Selection Mode", "Single", "Set the selection mode of the object.", "Single|Multiple"), //1
//	new cr.Property(ept_integer,	"Line Display", "3", "Set the height (number of displayed lines) of the listbox"), //
new cr.Property(ept_section, "Both Properties", "",	"Global properties for both Listbox and Combobox objects."),	
	new cr.Property(ept_text, "Tooltip", "", "Leave blank for no tooltip"), //2
	new cr.Property(ept_combo,	"Enabled", "Yes", "Choose whether the combo box is enabled or disabled on startup", "No|Yes"), //3
	new cr.Property(ept_color, "Font color", cr.RGB(0,0,0), "Choose the color of the font, black as default"), //4
	new cr.Property(ept_color, "Background color", cr.RGB(255,255,255), "Choose the color of the background, white as default"), //5
	new cr.Property(ept_combo,	"Borders", "Solid line", "Choose whether the combo box has got borders", "None|Dotted line|Solid line"), //6
	new cr.Property(ept_color, "Borders color", cr.RGB(0,0,0), "Choose the color of the border, black as default"),//7
	new cr.Property(ept_combo, "Separation line", "None", "Choose whether each line is separated by a line", "None|Dotted line|Solid line"), //8
	new cr.Property(ept_color, "Separation color", cr.RGB(192,192,192), "Choose the color of the separation line, grey as default"),//9
	new cr.Property(ept_integer, "z-Index", "1", "Set the z-Index of the combo box"), //10
new cr.Property(ept_section, "Other", "",	"Other properties of the project."),
	new cr.Property(ept_combo, 	 "Truncate", 			"Yes", 			"Choose whether you want to truncate the object frame against borders", "Yes|No")

];


	
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
	
	for (var i = 0; i < property_list.length; i++) //This loop just goes through the property list you defined above and sets the new instance of the object to default values.
		this.properties[property_list[i].name] = property_list[i].initial_value;

		
	this.font = null;
	
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(200, 25));
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
  
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{

}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
    
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 12, false, false); 
	
	if (this.properties["Type"] === "Combo Box") 
			{ 
			// box drawing
			renderer.SetTexture(null);
			var q = this.instance.GetBoundingQuad();
			renderer.Fill(q, cr.RGB(240, 240, 240));
			renderer.Outline(q,cr.RGB(0, 0, 0));
			
			// separating line drawing
			/*var a = q.trx - 25;
			var b = q.try_ ;
			var c = q.brx - 25;
			var d = q.bry ;
			var origin = new cr.vector2( a, b ); 
			var end = new cr.vector2( c, d );
			renderer.Line(origin, end, cr.RGB(0, 0, 0)); */
			
			// separated box drawing
			var q2 		= new cr.quad();
				q2.tlx 	= q.trx - 25;
				q2.tly  = q.try_;
				q2.trx  = q.trx;
				q2.try_ = q.try_;
				q2.blx  = q.brx - 25;
				q2.bly  = q.bry;
				q2.brx  = q.brx;
				q2.bry  = q.bry;
			renderer.Fill(q2, cr.RGB(210, 210, 210));
			renderer.Outline(q2,cr.RGB(0, 0, 0));
			
			cr.quad.prototype.offset.call(q2, -1, 5);
			this.font.DrawText("▼", 
								q2,
								cr.RGB(0, 0, 0),
								ha_center); 
								
			// text drawing
			cr.quad.prototype.offset.call(q, 0, 4);
			this.font.DrawText("ComboBox", 
								q,
								cr.RGB(0, 0, 0),
								ha_center); 
			} else {
			// box drawing
			renderer.SetTexture(null);
			var q = this.instance.GetBoundingQuad();
			renderer.Fill(q, cr.RGB(240, 240, 240));
			renderer.Outline(q,cr.RGB(0, 0, 0));
			
			// separating line drawing
			/*var a = q.trx - 25;
			var b = q.try_ ;
			var c = q.brx - 25;
			var d = q.bry ;
			var origin = new cr.vector2( a, b ); 
			var end = new cr.vector2( c, d );
			renderer.Line(origin, end, cr.RGB(0, 0, 0)); */
			
			// text drawing
			cr.quad.prototype.offset.call(q, 0, 4);
			this.font.DrawText("ListBox", 
								q,
								cr.RGB(0, 0, 0),
								ha_center); 
			};
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}



