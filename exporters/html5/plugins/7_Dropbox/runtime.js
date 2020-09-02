// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Dropbox = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Dropbox.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	
	var client = null; /** main dropbox client **/
	var errorAlerts = null;
	var lAccess = null; /* variable pour la sandbox/dropbox - Ne fonctionne que la generatePublicLink.... */
	var rUser = null;
	var encodedKey;
	var basicKey;
	var secretKey;
	var authOptions;
	var cMode = null;
	var tglCheck = false; // permet de checker si l'action isFileExist est executée.
	var onResultCheck = false; // permet de checker si la conditions onResult est executée.
	
	
	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		this.fileExistAnswer = []; /* enregistre la réponse de isFileExist selon le fichier à checker (path) */
		this.triggeringFile = ''; /* enregistre le fichier dont il est question */
		this.error_ret = 0;
		
		this.fileContent = '';
		this.filePublicLink = '';
		this.stat_name = ''; 
		this.stat_inAppFolder = null;
		this.stat_isFolder = null;
		this.stat_isFile = null;
		this.stat_versionTag = '';
		this.stat_size = '';
		this.stat_modifiedAt = '';		
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		/** Variables initiales Dropbox*/
		errorAlerts = [true,false][this.properties[6]]; /* active/desactive les alertes en cas d'erreur */
		lAccess = [true,false][this.properties[4]]; /* true = Application folder | false = full Access */
		rUser = [true,false][this.properties[3]]; /* true = remember user | false = not remember user */
		cMode = [true,false][this.properties[5]]; /* at start/by event connect mode */
		
		/* API KEY */
		encodedKey = this.properties[0]; /** https://dl-web.dropbox.com/spa/pjlfdak1tmznswp/api_keys.js/public/index.html **/
		basicKey = this.properties[1]; /* Non utilisée si encodedKey n'est pas null */
		secretKey = this.properties[2]; /* Non utilisée si encodedKey n'est pas null */
				
		if (encodedKey == "" && basicKey == "" && secretKey == "") { if (errorAlerts) { console.error("Please set an API key."); }; return false; } 
		else  if (basicKey != "" && secretKey == "") { if (errorAlerts) { console.error("Please set a secret if you want to use the Basic API key."); }; return false; } 
		else  if (basicKey == "" && secretKey != "") { if (errorAlerts) { console.error("Please set a basic API key."); }; return false; } else {
		if (encodedKey == "" || encodedKey == null) {var dropboxKey = { "key": basicKey, "secret": secretKey, "sandbox": lAccess }; } else { var dropboxKey = { "key": encodedKey, "sandbox": lAccess }; }; /* donne la priorité à l'encoded key */
		};
		
		authOptions = { "rememberUser" : rUser };
		
		/** lance l'authentification vers Dropbox, si l'option Auto est choisie dans les properties **/
		if (cMode) { this.DropboxLogIn(dropboxKey, authOptions); };
	};
	
	/*
	instanceProto.Debug = function(from,path)
	{
		console.debug("");
		console.debug("[DEBUG] - *** "+from);
		console.debug("[DEBUG] - this.fileExistAnswer = " + this.fileExistAnswer[path]);
		console.debug("[DEBUG] - this.triggeringFile = " + this.triggeringFile);
		console.debug("[DEBUG] - this.folderContent = " + this.folderContent);
		console.debug("[DEBUG] - this.fileContent = " + this.fileContent);
		console.debug("[DEBUG] - this.filePublicLink = " + this.filePublicLink);
		console.debug("[DEBUG] - this.error_ret = " + this.error_ret);
		console.debug("[DEBUG] - errorAlerts = " + errorAlerts);
		console.debug("[DEBUG] - lAccess = " + lAccess);
		console.debug("[DEBUG] - rUser = " + rUser);
		console.debug("[DEBUG] - encodedKey = " + encodedKey);
		console.debug("[DEBUG] - basicKey = " + basicKey);
		console.debug("[DEBUG] - secretKey = " + secretKey);
		console.debug("[DEBUG] - authOptions = " + authOptions);
		console.debug("[DEBUG] - cMode = " + cMode);
		console.debug("[DEBUG] - tglCheck = " + tglCheck);
		console.debug("[DEBUG] - onResultCheck = " + onResultCheck);
	};
	*/
	
	instanceProto.DropboxLogIn = function(dropboxKey, authOptions)
	{
		var self = this;
		/** Authentification dropbox code **/
		client = new Dropbox["Client"](dropboxKey);
		client["authDriver"]( new Dropbox["Drivers"]["Redirect"](authOptions) ); /** Demande l'autorisation à l'utilisateur **/
		client["authenticate"]( function(error, data) {
									if (error) { return instanceProto.showError(error); } /* Si une erreur, ouvre un dialog de debug - sinon execute */
									});

		/** trigger isAuthenticated & isSignedOff **/
		client["onAuthStateChange"]["dispatch"] = (function (self) {
			return function() {
				if (client["authState"] == 4) { self.runtime.trigger(cr.plugins_.Dropbox.prototype.cnds.isAuthenticated, self); }
				else if (client["authState"] == 5) { self.runtime.trigger(cr.plugins_.Dropbox.prototype.cnds.isSignedOff, self); };
			};
		})(this);	
	};
	
	instanceProto.showError = function(error) 
	/** Gestion des differentes erreurs **/
	{		
		if (errorAlerts) {
		switch ( error["status"] ) {
			case 401:
				alert("Error 401\nThe user token expired");
			break;

			case 404:
				alert("Error 404\nThe file or folder you tried to access is not in the user's Dropbox");
			break;

			case 507:
				alert("Error 507\nYour Dropbox is full. You are over your allowed quota");
			break;

			case 503:
				alert("Error 503\nToo many API requests. Try again later");
			break;

			case 400:  alert("Error 400\nBad input parameter");
			case 403:  alert("Error 403\nBad OAuth request");
			case 405:  alert("Error 405\nRequest method not expected");
			
			default:
				alert("An undefined bug is occured. Please refresh the page.\nIf it persists, please contact iosconstruct.devs@gmail.com");
		};};	
	};

	/** ///////////////////////////////////////////////////////////// *** ACE *** /////////////////////////////////////////////////////////////// **/
	
	/**-------------**/
	/** CONDITIONS **/
	function Cnds() {};

	/* isAuthenticated */
	Cnds.prototype.isAuthenticated = function ()
	{
		return true;
	};
	
	/* isSignedOff */
	Cnds.prototype.isSignedOff = function ()
	{
		return true;
	};
	
	/* isResultFile (à combiner avec l'action "Check a file existence" et la condition "is Result done.") */
	Cnds.prototype.isResultFile = function (path)
	{
		if (onResultCheck == true) { 
				if (this.error_ret != 404) { onResultCheck = !onResultCheck; return this.fileExistAnswer[path]; }
				else { /*console.warn ("[Dropbox Plugin] CONDITION * is File exist * - The file or folder may not exist.");*/ return false; } }
			else { /*console.warn ("[Dropbox Plugin] CONDITION * is File exist * - 'is File exist' condition will work only if you use it with the 'is Result done' condition.");*/ return false; };
	};
	
	/* onResult (à combiner avec l'action "Check a file existence" et la condition "is File exist") */
	Cnds.prototype.onResult = function (path)
	{
		if (tglCheck == true) {onResultCheck = true; return this.triggeringFile === path; } 
			else { /*console.warn ("[Dropbox Plugin] CONDITION * is Result done * - 'is Result done' condition will work only if you use it with an 'Access' action.");*/ return false; };
	};
	
	Cnds.prototype.isFolder = function (path)
	{
		if (onResultCheck == true) { 
				if (this.error_ret != 404) { onResultCheck = !onResultCheck; return this.triggeringFile == path && this.stat_isFolder; }
				else { /*console.warn ("[Dropbox Plugin] CONDITION * is this a Folder * - The folder may not exist.");*/ return false; } }
			else { /*console.warn ("[Dropbox Plugin] CONDITION * is this a Folder * - 'is this a Folder' condition will work only if you use it with the 'is Result done' condition.");*/ return false; };
	};
	
	Cnds.prototype.isFile = function (path)
	{
		if (onResultCheck == true) { 
				if (this.error_ret != 404) { onResultCheck = !onResultCheck; return this.triggeringFile == path && this.stat_isFile; }
				else { /*console.warn ("[Dropbox Plugin] CONDITION * is this a File * - The file may not exist.");*/ return false; } }
			else { /*console.warn ("[Dropbox Plugin] CONDITION * is this a File * - 'is this a File' condition will work only if you use it with the 'is Result done' condition.");*/ return false; };
	};	

	Cnds.prototype.isInAppFolder = function (path)
	{
		if (onResultCheck == true) { 
				if (this.error_ret != 404) { onResultCheck = !onResultCheck; return this.triggeringFile == path && this.stat_inAppFolder; }
				else { /*console.warn ("[Dropbox Plugin] CONDITION * is this in the Application root folder * - The file or folder may not exist.");*/ return false; } }
			else { /*console.warn ("[Dropbox Plugin] CONDITION * is this in the Application root folder * - 'is this in the Application folder' condition will work only if you use it with the 'is Result done' condition.");*/ return false; };
	};		
	
	
	pluginProto.cnds = new Cnds();

	/** //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// **/
	
	/**----------**/
	/** ACTIONS **/
	function Acts() {};
	
	/* accessFile */
	Acts.prototype.accessFile1 = function (separator, path)
	{
		var self = this;
		
		if (path != '' && path!= null) 
		{
			client["stat"](path, function(error, stat) 
				{
				
				if (error && error["status"] == 404) { 
					/** if the path doesn't exist */
						self.fileExistAnswer[path] = false;
						self.triggeringFile = path;
						self.error_ret = error["status"];
						tglCheck = true; // permet d'annoncer à OnResult et aux expressions que l'action a été lancée.				
						self.runtime.trigger(cr.plugins_.Dropbox.prototype.cnds.onResult, self);
				} else if (!error && stat["isFile"]) {
					/** if it's a file */
						client["readFile"](path, function(error, content, stat) 
							{
								self.error_ret = 0;
								self.fileExistAnswer[path] = true;
								self.triggeringFile = path;
								self.fileContent = content;
								self.stat_name = stat["name"];
								self.stat_inAppFolder = stat["inAppFolder"];
								self.stat_isFolder = stat["isFolder"];
								self.stat_isFile = stat["isFile"];
								self.stat_versionTag = stat["versionTag"];
								self.stat_size = parseFloat(stat["size"]);
								self.stat_modifiedAt = stat["modifiedAt"];
								tglCheck = true; 
								self.runtime.trigger(cr.plugins_.Dropbox.prototype.cnds.onResult, self);
							});
				
				} else if (!error && stat["isFolder"]) {
					/** if it's a folder */
						client["readdir"](path, function(error, content, stat) 
							{				
								self.error_ret = 0;
								self.fileExistAnswer[path] = true;
								self.triggeringFile = path;
								if (separator != "" && separator != null) { self.fileContent = content.join(separator.toString()); } else { self.fileContent = content.join(","); };
								self.stat_name = stat["name"];
								self.stat_inAppFolder = stat["inAppFolder"];
								self.stat_isFolder = stat["isFolder"];
								self.stat_isFile = stat["isFile"];
								self.stat_versionTag = stat["versionTag"];
								self.stat_size = parseFloat(stat["size"]);
								self.stat_modifiedAt = stat["modifiedAt"];
								tglCheck = true; 
								self.runtime.trigger(cr.plugins_.Dropbox.prototype.cnds.onResult, self);
							});
			
				} else { return self.showError(error); }		
				});
		} else { console.warn ("[Dropbox Plugin] - You have to set a file or a folder name."); return false; };	
	};
	
	/* createPublicLink */
	Acts.prototype.createPublicLink = function (type, path)
	{
		var self = this;
		if (type == 0) { var lnkT = true; } else { var lnkT = false; }; // set le type de link
	
		if (path != '' && path!= null) // evite de prendre en compte une entrée vide (qui peut être considéré comme root)
		{
		client["makeUrl"](path, {"download": lnkT }, function(error, _url) 
			{
			// si il y a des erreurs dont la 404 alors le fichier n'existe pas
			if (error && error["status"] == 404) { 
					self.triggeringFile = path;
					self.error_ret = error["status"]; // enregistre le numéro de l'erreur.
					tglCheck = true; // permet d'annoncer à OnResult et aux expressions que l'action a été lancée.
					self.runtime.trigger(cr.plugins_.Dropbox.prototype.cnds.onResult, self);
			// si il n'y pas d'erreur et que le fichier est bien un fichier.
			} else if (!error) {
					self.triggeringFile = path;
					self.error_ret = 0;
					self.filePublicLink = _url["url"];// enregistre le lien public généré
					tglCheck = true; // permet d'annoncer à OnResult et aux expressions que l'action a été lancée.
					self.runtime.trigger(cr.plugins_.Dropbox.prototype.cnds.onResult, self);					
					}
			// en cas d'autre erreur.		
			else { return instanceProto.showError( error ); }		
			});		
		} else { console.warn ("[Dropbox Plugin] - You have to set a file or a folder name."); };
	};
	
	/* createFile */
	Acts.prototype.createFile = function (overwrite, path, content)
	{
		if (path != '' && path!= null) // evite de prendre en compte une entrée vide (qui peut être considéré comme root)
		{
			if (client) { client["writeFile"]( path, content, {"noOverwrite": overwrite }, function( error, stat ) {
					if ( error ) { return instanceProto.showError( error ); }
					});	} else { console.warn ("[Dropbox Plugin] - You need to be authentified to a Dropbox account."); };
		}
		else { console.warn ("[Dropbox Plugin] - You have to set a file name."); };		
	};
	
	/* createFolder */
	Acts.prototype.createFolder = function (path)
	{
		if (path != '' && path!= null) // evite de prendre en compte une entrée vide (qui peut être considéré comme root)
		{	
			if (client) { client["mkdir"]( path, function( error, stat ) {
				if ( error ) { return instanceProto.showError( error ); }
				}); } else { console.warn ("[Dropbox Plugin] - You need to be authentified to a Dropbox account."); };
		}
		else { console.warn ("[Dropbox Plugin] - You have to set a folder name."); };				
	};
	
	/* moveElement */
	Acts.prototype.moveElement = function (fromPath, toPath)
	{
		if (fromPath != '' && fromPath!= null || toPath != '' && toPath != null) // evite de prendre en compte une entrée vide (qui peut être considéré comme root)
		{		
			if (client) { client["move"]( fromPath, toPath, function( error, stat ) {
				if ( error && error["status"] == 404 ) { /*console.warn ("[Dropbox Plugin] - The file or folder may not exist.");*/ return false; }
				else if ( error ) { return instanceProto.showError( error ); }
				}); } else { console.warn ("[Dropbox Plugin] - You need to be authentified to a Dropbox account."); };
		}
		else { console.warn ("[Dropbox Plugin] - You have to set a file or a folder name."); };			
	};

	/* copyElement */
	Acts.prototype.copyElement = function (fromPath, toPath)
	{
		if (fromPath != '' && fromPath!= null || toPath != '' && toPath != null) // evite de prendre en compte une entrée vide (qui peut être considéré comme root)
		{	
			if (client) { client["copy"]( fromPath, toPath, function( error, stat ) {
				if ( error && error["status"] == 404 ) { /*console.warn ("[Dropbox Plugin] - The file or folder may not exist.");*/ return false; }
				else if ( error ) { return instanceProto.showError( error ); }
				}); } else { console.warn ("[Dropbox Plugin] - You need to be authentified to a Dropbox account."); };
		}
		else { console.warn ("[Dropbox Plugin] - You have to set a file or a folder name."); };			
	};

	/* removeElement */
	Acts.prototype.removeElement = function (path)
	{
		if (path != '' && path!= null) // evite de prendre en compte une entrée vide (qui peut être considéré comme root)
		{	
			if (client) { client["remove"](path, function(error, content) {
				if ( error && error["status"] == 404 ) { /*console.warn ("[Dropbox Plugin] - The file or folder may not exist.");*/ return false; }
				else if (error) { return instanceProto.showError(error); }
				}); } else { console.warn ("[Dropbox Plugin] - You need to be authentified to a Dropbox account."); };
		}
		else { console.warn ("[Dropbox Plugin] - You have to set a file or a folder name."); };			
	};	
	
	/* logIn */ /** think about making this function smaller **/
	Acts.prototype.logIn = function ()
	{
		/** Variables initiales Dropbox*/
		errorAlerts = [true,false][this.properties[6]]; /* active/desactive les alertes en cas d'erreur */
		lAccess = [true,false][this.properties[4]]; /* true = Application folder only | false = Full Dropbox */
		rUser = [true,false][this.properties[3]]; /* true = remember user | false = not remember user */
		cMode = [true,false][this.properties[5]]; /* at start/by event connect mode */
		
		/* API KEY */
		encodedKey = this.properties[0]; /** https://dl-web.dropbox.com/spa/pjlfdak1tmznswp/api_keys.js/public/index.html **/
		basicKey = this.properties[1]; /* Non utilisée si encodedKey n'est pas null */
		secretKey = this.properties[2]; /* Non utilisée si encodedKey n'est pas null */
				
		if (encodedKey == "" && basicKey == "" && secretKey == "") { if (errorAlerts) { console.error("Please set an API key."); }; return false; } 
		else  if (basicKey != "" && secretKey == "") { if (errorAlerts) { console.error("Please set a secret if you want to use the Basic API key."); }; return false; } 
		else  if (basicKey == "" && secretKey != "") { if (errorAlerts) { console.error("Please set a basic API key."); }; return false; } else {
		if (encodedKey == "" || encodedKey == null) { var dropboxKey = { "key": basicKey, "secret": secretKey, "sandbox": lAccess }; } else { var dropboxKey = { "key": encodedKey, "sandbox": lAccess }; }; /* donne la priorité à l'encoded key */
		};
		
		authOptions = { "rememberUser" : rUser };
		
		/** lance l'authentification vers Dropbox, si l'option Auto est choisie dans les properties **/
		if (!cMode) { this.DropboxLogIn(dropboxKey, authOptions); };
	};	
	
	/* signOut */
	Acts.prototype.signOut = function (hRefresh)
	{
		if (client) { client["signOut"]( function( error ) {
			if ( error ) { return instanceProto.showError( error ); }
			else if ( hRefresh == 0 ) { window.location.reload(); } /* Reload le browser selon le choix fait. 0 = Reload | 1 = No reload */
			}); } else { console.warn ("[Dropbox Plugin] - You need to be authentified to a Dropbox account."); };
	};
	
	pluginProto.acts = new Acts();
	
	/** //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// **/
	
	/**--------------**/
	/** EXPRESSIONS **/
	function Exps() {};
	// ret.set_float(0.5);			// for returning floats
	// ret.set_string("Hello");		// for ef_return_string
	// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	
	/* getFileContent */
	Exps.prototype.getFileContent = function (ret, path) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		if (tglCheck == true) { 	
		if (this.triggeringFile != '' && this.triggeringFile == path && this.error_ret != 404) { ret.set_any(this.fileContent.toString()); } 
			else { ret.set_any(); this.error_ret = 0; /*console.warn ("[Dropbox Plugin] EXPRESSION * getFileContent * - The file may not exist.");*/ }; 
		} else { /*console.warn ("[Dropbox Plugin] EXPRESSION * getFileContent * - 'getFileContent' expression will work only if you use it with the 'Access to a file' action.");*/ ret.set_any(); this.error_ret = 0; };
	};
		
	/* getPublicLink */
	Exps.prototype.getPublicLink = function (ret, path)
	{
		if (tglCheck == true) { 	
		if (this.triggeringFile != '' && this.triggeringFile == path && this.error_ret != 404 ) { ret.set_any(this.filePublicLink.toString()); } 
			else { ret.set_any(); this.error_ret = 0; /*console.warn ("[Dropbox Plugin] EXPRESSION * getPublicLink * - The file may not exist.");*/ }; 				
		} else { /*console.warn ("[Dropbox Plugin] EXPRESSION * getPublicLink * - 'getPublicLink' expression will work only if you use it with the 'Generate a public link' action.");*/ ret.set_any(); };
	};

	/* getListFolder */
	Exps.prototype.getListFolder = function (ret, path)
	{
		if (tglCheck == true) { 	
		if (this.triggeringFile != '' && this.triggeringFile == path && this.error_ret != 404) { ret.set_any(this.fileContent.toString()); } 
			else { ret.set_any(); this.error_ret = 0; /*console.warn ("[Dropbox Plugin] EXPRESSION * getListFolder * - The folder may not exist.");*/ }; 
		} else { /*console.warn ("[Dropbox Plugin] - 'getListFolder' expression will work only if you use it with the 'Access to a file' action.");*/ ret.set_any(); this.error_ret = 0; };
	};

	/* getAuthentificationState */
	Exps.prototype.getAuthentificationState = function (ret)
	{
		ret.set_float(client["authState"]);
	};		
	
	/* get_file_name */
	Exps.prototype.get_file_name = function (ret, path)
	{
		if (tglCheck == true) { 	
		if (this.triggeringFile != '' && this.triggeringFile == path && this.error_ret != 404) { ret.set_any(this.stat_name.toString()); } 
			else { ret.set_any(); this.error_ret = 0; /*console.warn ("[Dropbox Plugin] EXPRESSION * get_file_name * - The file may not exist.");*/ }; 
		} else { /*console.warn ("[Dropbox Plugin] EXPRESSION * get_file_name * - 'get_file_name' expression will work only if you use it with the 'Access to informations of a file or a folder' action.");*/ ret.set_any(); this.error_ret = 0; };
	};
	
	/* get_file_versionTag */
	Exps.prototype.get_file_versionTag = function (ret, path)
	{
		if (tglCheck == true) { 	
		if (this.triggeringFile != '' && this.triggeringFile == path && this.error_ret != 404) { ret.set_any(this.stat_versionTag.toString()); } 
			else { ret.set_any(); this.error_ret = 0; /*console.warn ("[Dropbox Plugin] EXPRESSION * get_file_versionTag * - The file may not exist.");*/ }; 
		} else { /*console.warn ("[Dropbox Plugin] EXPRESSION * get_file_versionTag * - 'get_file_versionTag' expression will work only if you use it with the 'Access to informations of a file or a folder' action.");*/ ret.set_any(); this.error_ret = 0; };
	};
	
	/* get_file_size */
	Exps.prototype.get_file_size = function (ret, path, unit)
	{
		/** unit = 0 -> octet / unit = 1 -> mega octet */
		if (tglCheck == true) { 	
		if (this.triggeringFile != '' && this.triggeringFile == path && this.error_ret != 404) { if (unit == 1) { ret.set_any((this.stat_size/1048576).toString()); } else {  ret.set_any(this.stat_size.toString()); }} 
			else { ret.set_any(); this.error_ret = 0; /*console.warn ("[Dropbox Plugin] EXPRESSION * get_file_size * - The file may not exist.");*/ }; 
		} else { /*console.warn ("[Dropbox Plugin] EXPRESSION * get_file_size * - 'get_file_size' expression will work only if you use it with the 'Access to informations of a file or a folder' action.");*/  ret.set_any(); this.error_ret = 0; };
	};
	
	/* get_file_lastmodified */
	Exps.prototype.get_file_lastmodified = function (ret, path)
	{
		if (tglCheck == true) { 	
		if (this.triggeringFile != '' && this.triggeringFile == path && this.error_ret != 404) { ret.set_any(this.stat_modifiedAt.toString()); }
			else { ret.set_any(); this.error_ret = 0; /*console.warn ("[Dropbox Plugin] EXPRESSION * get_file_lastmodified * - The file may not exist.");*/ }; 
		} else { /*console.warn ("[Dropbox Plugin] EXPRESSION * get_file_lastmodified * - 'get_file_lastmodified' expression will work only if you use it with the 'Access to informations of a file or a folder' action.");*/ ret.set_any(); this.error_ret = 0; };
	};
	
	
	
	pluginProto.exps = new Exps();
	
	/** //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// **/

}());