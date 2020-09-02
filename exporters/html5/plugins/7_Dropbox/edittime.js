function GetPluginSettings()
{
	return {
		"name":			"Dropbox",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Dropbox",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.02",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Control your Dropbox account (Files & Folders modifications, etc.)",
		/*******************************************************************************************************/
		"author":		"Gregory Georges - Dropbox.JS from Dropbox (c) 2012 Dropbox Inc.",/**				  **/
		/** The Dropbox.JS library is Copyright (c) 2012 Dropbox Inc., and distributed under the MIT License. **/
		/*******************************************************************************************************/
		"help url":		"http://goo.gl/lf7yB",
		"category":		"Web",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		//"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		pf_singleglobal,						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
		"dependency":	"dropbox.js" /** Charge la librairie Dropbox **/
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

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// isAuthenticated				
AddCondition(0, cf_trigger, "is Connected", "Dropbox", "Check if the user is connected to his account", "Return true when the user is connected to his account, false otherwise", "isAuthenticated");
// isSignedOff
AddCondition(1, cf_trigger, "is Signed off", "Dropbox", "Check if the account is signed off", "Return true if the user is signed off, false otherwise", "isSignedOff");
/** isResultFile - Special action à combiner avec expressions et/ou conditions */
	AddStringParam("Name / Path", "The path of the file to be verified, relative to the user's Dropbox or to the application's folder", "\"\"");
AddCondition(2, cf_none, "is File exist", "Dropbox - File & Folder", "Check if the <b>{0}</b> exists", "Return true if the file checked by the 'Access to a file' action already exists, false otherwise", "isResultFile");
/** onResult - Special action à combiner avec expressions et/ou conditions */
	AddStringParam("Name / Path", "The path of the file to be verified, relative to the user's Dropbox or to the application's folder", "\"\"");
AddCondition(3, cf_trigger, "is Result done", "Dropbox", "on result done for <b>{0}</b>", "Return true when the action has done. ('Access to a file' & 'Generate a public link')", "onResult");

/** isFile - Special action à combiner avec expressions et/ou conditions */
	AddStringParam("Name / Path", "The path of the file to be verified, relative to the user's Dropbox or to the application's folder", "\"\"");
AddCondition(4, cf_none, "is this a File", "Dropbox - File & Folder", "Check if <b>{0}</b> is a file", "Return true if the verified element is really a file, false otherwise", "isFile");
/** isFolder - Special action à combiner avec expressions et/ou conditions */
	AddStringParam("Name / Path", "The path of the folder to be verified, relative to the user's Dropbox or to the application's folder", "\"\"");
AddCondition(5, cf_none, "is this a Folder", "Dropbox - File & Folder", "Check if <b>{0}</b> is a folder", "Return true if the verified element is really a folder, false otherwise", "isFolder");
/** isInAppFolder - Special action à combiner avec expressions et/ou conditions */
	AddStringParam("Name / Path", "The path of the folder to be verified, relative to the user's Dropbox or to the application's folder", "\"\"");
AddCondition(6, cf_none, "is this in the Application folder", "Dropbox - File & Folder", "Check if <b>{0}</b> is in the Application folder", "Return true if the verified element is placed into the Application folder, false otherwise", "isInAppFolder");


////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// createFile
		AddComboParamOption("Yes");
		AddComboParamOption("No");
	AddComboParam("Overwrite", "Choose if the file will be overwritten if it already exists (else. 'notes (1).txt' instead of 'notes.txt')");	
	AddStringParam("Name / Path", "The path of the file to be created, relative to the user's Dropbox or to the application's folder", "\"\"");
	AddStringParam("Content", "The contents written to the file", "\"\"");
AddAction(0, af_none, "Create a file", "Dropbox", "Create file <b>{1}</b> in the dropbox", "Create a file into a user's Dropbox.", "createFile");

// createFolder
	AddStringParam("Name / Path", "The path of the folder to be created, relative to the user's Dropbox or to the application's folder", "\"\"");
AddAction(1, af_none, "Create a folder", "Dropbox", "Create folder <b>{0}</b> in the dropbox", "Create a folder into a user's Dropbox.", "createFolder");

// moveElement
	AddStringParam("Origin Path", "The path of the file or folder that will be moved, relative to the user's Dropbox or to the application's folder", "\"\"");
	AddStringParam("Destination Path", "The destination path that the file or folder will be moved to; relative to the user's Dropbox or to the application's folder", "\"\"");
AddAction(2, af_none, "Move a file / folder", "Dropbox", "Move <b>{0}</b> to <b>{1}</b>", "Move a file or folder in a user's Dropbox.", "moveElement");

// copyElement
	AddStringParam("Origin Path", "The path of the file or folder that will be duplicated, relative to the user's Dropbox or to the application's folder","\"\"");
	AddStringParam("Destination Path", "The destination path that the file or folder will be duplicated; relative to the user's Dropbox or to the application's folder", "\"\"");
AddAction(3, af_none, "Duplicate a file / folder", "Dropbox", "Duplicate <b>{0}</b> to <b>{1}</b>", "Duplicate a file or folder in the user's Dropbox.", "copyElement");

// removeElement
	AddStringParam("Name / Path", "The path of the folder to be removed, relative to the user's Dropbox or to the application's folder", "\"\"");
AddAction(5, af_none, "Remove a file / folder", "Dropbox", "Remove <b>{0}</b>", "Remove a file or diretory from a user's Dropbox.", "removeElement");

// logIn
AddAction(6, af_none, "Log in", "Dropbox", "Log in to the Dropbox account", "Invite the user to log in into his Dropbox account.", "logIn");

// signOut
		AddComboParamOption("Yes");
		AddComboParamOption("No");
	AddComboParam("Refresh", "Choose if the browser will be refreshed after signing out");	
AddAction(4, af_none, "Sign out", "Dropbox", "Sign out - Refresh: <b>{0}</b>", "Revoke the user's Dropbox credentials.", "signOut");

/*DEPRECATED*/
/** accessFile */
		AddComboParamOption("File");
		AddComboParamOption("Folder");
	AddComboParam("Target element", "Choose the type of element you want to access.");	
	AddStringParam("Separator", "Set a separator string which will separate each file and folder in the getListFolder's return string. (Leave empty for a default comma)", "\",\"");
	AddStringParam("Name / Path", "The path of the file or the folder to access, relative to the user's Dropbox or to the application's folder", "\"\"");
AddAction(7, af_deprecated, "Access to a file or a folder", "Dropbox", "Access to the {0} <b>{2}</b>", "Access to a file or a folder in the user's Dropbox in order to use some specific expression and condition.", "accessFile");
/*DEPRECATED*/

/** accessFile */
	AddStringParam("Separator", "Set a separator string which will separate each file and folder in the getListFolder's return string. (Leave empty for a default comma)", "\",\"");
	AddStringParam("Name / Path", "The path of the file or the folder to access, relative to the user's Dropbox or to the application's folder", "\"\"");
AddAction(10, af_none, "Access to a file or a folder", "Dropbox", "Access to <b>{1}</b>", "Access to a file or a folder in the user's Dropbox in order to use some specific expression and condition.", "accessFile1");

/*DEPRECATED*/
/** accessFileInfo */
	AddStringParam("Name / Path", "The path of the file or the folder to access, relative to the user's Dropbox or to the application's folder", "\"\"");
AddAction(9, af_deprecated, "Access to informations of a file or a folder", "Dropbox - File & Folder infos", "Access to <b>{0}</b> informations", "Access to informations of a file or a folder in the user's Dropbox in order to use some specific expression and condition.", "accessFileInfo");
/*DEPRECATED*/

/** createPublicLink */
		AddComboParamOption("Classic (permanent)");
		AddComboParamOption("Direct Download (4hrs./no folders)");
	AddComboParam("Type of link", "Choose the type of link to generate for a public distribution of your file/folder");	
	AddStringParam("Name / Path", "The path of the file/folder which'll be linked, relative to the user's Dropbox or to the application's folder", "\"\"");
AddAction(8, af_none, "Generate a public link", "Dropbox", "Generate a <b>{0} link</b> for <b>{1}</b>", "Let you generate a public link for a public distribution of your file or folder.", "createPublicLink");


////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// getFileContent
	AddStringParam("\"pathname\"", "The path to the file whose contents will be retrieved, relative to the user's Dropbox or to the application's folder", "\"pathname\"");
AddExpression(0, ef_return_string, "Get file's content", "Dropbox", "getFileContent", "Return the content of a file in a user's Dropbox.");
// getPublicLink
	AddStringParam("\"pathname\"", "The path of the file/folder which'll be linked, relative to the user's Dropbox or to the application's folder", "\"pathname\"");
AddExpression(1, ef_return_any, "Get a generated public link", "Dropbox", "getPublicLink", "Get a publicly readable link to a file or folder in the user's Dropbox, generate by 'Generate a public link' action.");
// getListFolder
	AddStringParam("\"pathname\"", "The path to the folder whose contents will be retrieved, relative to the user's Dropbox or to the application's folder");
AddExpression(2, ef_return_any, "List a folder", "Dropbox", "getListFolder", "List the files and folders inside a folder in a user's Dropbox.");
// getAuthentificationState
AddExpression(3, ef_return_number, "Return Authentification status", "Dropbox", "getAuthentificationState", "Return the value of the actual status of Dropbox's authentification (0 - 5)");

// get_file_name
	AddStringParam("\"pathname\"", "The path to the file whose information will be retrieved, relative to the user's Dropbox or to the application's folder", "\"pathname\"");
AddExpression(4, ef_return_string, "Get file/folder name", "Dropbox - File & Folder infos", "get_file_name", "Return the name of a file or folder in a user's Dropbox.");
// get_file_versionTag
	AddStringParam("\"pathname\"", "The path to the file whose information will be retrieved, relative to the user's Dropbox or to the application's folder", "\"pathname\"");
AddExpression(5, ef_return_string, "Get file/folder version tag", "Dropbox - File & Folder infos", "get_file_versionTag", "Return the version tag of a file or folder in a user's Dropbox.");
// get_file_size
	AddStringParam("\"pathname\"", "The path to the file whose information will be retrieved, relative to the user's Dropbox or to the application's folder", "\"pathname\"");
	AddNumberParam("0", "Choose the unit to use for returning the file/folder size - 0 is Octet / 1 is Mega Octet", "0")	
AddExpression(6, ef_return_string, "Get file/folder size", "Dropbox - File & Folder infos", "get_file_size", "Return the size of a file or folder in a user's Dropbox.");
// get_file_lastmodified
	AddStringParam("\"pathname\"", "The path to the file whose information will be retrieved, relative to the user's Dropbox or to the application's folder", "\"pathname\"");
AddExpression(7, ef_return_string, "Get file/folder last modified date", "Dropbox - File & Folder infos", "get_file_lastmodified", "Return the last modified date of a file or folder in a user's Dropbox.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	new cr.Property(ept_section, "Dropbox", "",	"Properties of the Dropbox's account authentification."),
		new cr.Property(ept_text, 	"Encoded API Key",		"",		"Encode your basic API key and pass the encoded key string here."),
	//	new cr.Property(ept_link,	"",	"Get an api key",		"Get an api key", "firstonly"),
		new cr.Property(ept_text, 	"Basic API Key",		"",		"Register your application to obtain an API key and pass it here."),
		new cr.Property(ept_text, 	"Secret",		"",		"Register your application to obtain the secret and pass it here."),
		new cr.Property(ept_combo,  "Remember user",	"Yes", "'Yes' make the user doesn't have to authorize the application on every request", "Yes|No"),
		new cr.Property(ept_combo,  "Limit access",	"Application folder", "If your application requires full Dropbox access, choose the last option. (BETA - It works only if you choose the correct mode in Dropbox MyApps registration)", "Application folder|Full Dropbox"),
		new cr.Property(ept_combo,  "Connect mode",	"Auto", "Connect to the Dropbox's account directly at start, or manually via the event sheet.", "Auto|Manual"),
		new cr.Property(ept_combo,  "Alert dialogs",	"Yes", "If errors occur, an alert box will be displayed.", "Yes|No")
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
	return new IDEInstance(instance);
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
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	/*if (property_name == "getApiKey")
	{
		BalloonTipLastProperty(1,'If you want to encode your API key\n, go to https://dl-web.dropbox.com/spa/pjlfdak1tmznswp/api_keys.js/public/index.html');
	};*/

}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}