// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.LL = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.LL.prototype;
		
	function Utils(){
		
		this.local_storage_masterArray = new Object();
		
		this.option_local_storage_pre = "LLS_";
		this.option_leaderboard_size = 10;
				
		this.init = function init(id){
			var tmp_localStorage = this.getStorage(id);
			if (tmp_localStorage === false) {
				this.local_storage_masterArray[id] = [];
				return false;
			} else {
				this.local_storage_masterArray[id] = tmp_localStorage;
				return true;
			}
		}
		//Make the score look nice
		this.addCommas = function(nStr){
			nStr += '';
			var x = nStr.split('.');
			var x1 = x[0];
			var x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		}
		//Truncate array (maybe also clean if string are set?)
		this.cleanArray = function(id){
			var leaderboard = this.local_storage_masterArray[id];
			//Start by checking if we are over the required limit
			if(leaderboard.length>10){
				leaderboard.splice(10,leaderboard.length-10); //Removes x-10 (excess of entries) from position 10 (0 based)
			}
		}
		//Sort from highest to lowest
		this.sortArray = function(id){
			var leaderboard = this.local_storage_masterArray[id];
			function sortNumber(a,b) { return b-a; }
			leaderboard.sort(sortNumber)
		}
		/*
			Local Storage
		*/
		this.getStorage_name = function(id){
			return this.option_local_storage_pre+id;
		}
		//Saves to local storage
		this.saveStorage = function(id){
			var leaderboard = this.local_storage_masterArray[id];
			localStorage.setItem(this.getStorage_name(id), leaderboard.join() );
		}
		//Get local storage
		this.getStorage = function getStorage(id){
			var tmp_localStorage = localStorage.getItem(this.getStorage_name(id));
			if (tmp_localStorage === null) { 
				return false;
			} else {
				return tmp_localStorage.split(",");
			}			
		}
	}
	var utils = new Utils();
	
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
			
	};	
	
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()	{}
		
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	var currentLeaderboard_score = false;
	var currentLeaderboard_position = false;
	
	Cnds.prototype.loopLeaderboard = function (id)
	{
		var current_event = this.runtime.getCurrentEventStack().current_event;
		utils.init(id);
			var leaderboard = utils.local_storage_masterArray[id];
			for (var i = 0; i < utils.option_leaderboard_size; i++) {
				currentLeaderboard_position = i+1;
				console.log(leaderboard[i]);
				if(typeof leaderboard[i]=='undefined'){ currentLeaderboard_score = "0";} else { currentLeaderboard_score = leaderboard[i]; }
				//Copy-Pasta from array plugin
				this.runtime.pushCopySol(current_event.solModifiers);
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		currentLeaderboard_score = false;
		currentLeaderboard_position = false;
		return false;
	};
	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};
	//AUTH
	Acts.prototype.reportScore = function (id,score)
	{
		utils.init(id); //checks and creates object based on the local storage existing
			utils.local_storage_masterArray[id].push(score); //Push score to leaderboard array
			utils.sortArray(id);
			utils.cleanArray(id);
			utils.saveStorage(id);
		
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.currentScore = function (ret)	
	{
		ret.set_string( utils.addCommas(currentLeaderboard_score) );
	};
	
	Exps.prototype.currentPosition = function (ret)	
	{
		ret.set_string(currentLeaderboard_position.toString());
	};
	
	pluginProto.exps = new Exps();

}());