
// RAF functions
window.requestAnimationFrame = function(f, elem) {}
window.mozRequestAnimationFrame = function(f, elem) {}
window.webkitRequestAnimationFrame = function(f, elem) {}
window.msRequestAnimationFrame = function(f, elem) {}
window.oRequestAnimationFrame = function(f, elem) {}

// LocalForage API
window.localforage = function () {}
window.define = function () {}
window.requireModule = function () {}
window.Promise = function () {}
window.module = function () {}
window.asyncStorage = function () {}
window.localStorageWrapper = function () {}
window.webSQLStorage = function () {}

// FB API
window.fbAsyncInit = function () {}
window.FB = function () {}
window.FB.init = function (i) {}
window.FB.getLoginStatus = function (r) {}
window.FB.api = function (q, r) {}
window.FB.ui = function (q, r) {}
window.FB.Event = function () {}
window.FB.Event.subscribe = function (e, r) {}
window.FB.login = function (r) {}
window.FB.logout = function (r) {}

// Cordova APIs
window.cordova = function () {}
window.Media = function (src_) {}

window.gamecenter = function () {}		// gamecenter plugin

// Web Audio API
window.AudioContext = function () {}
window.webkitAudioContext = function () {}

// Box2D asm.js functions
window.Module = function () {}
window.Module.getCache = function () {}
window.Box2D = function () {}
window.Box2D.JSContactListener = function () {};
window.Box2D.JSContactListener.BeginContact = function () {};
window.Box2D.JSContactListener.EndContact = function () {};
window.Box2D.JSContactFilter = function () {};
window.Box2D.JSContactFilter.ShouldCollide = function () {};

// For the Box2D asm.js build to work correctly in NW.js (depends on some process functions)
window.process = function () {}
window.process.argv = [];
window.process.on = function () {}
window.process.stdout = function () {}
window.process.stdout.once = function () {}
window.process.stderr = function () {}
window.process.stderr.write = function () {}
window.process.exit = function () {}

// AppMobi
window.AppMobi = function () {}
window.Canvas = function () {}

// CocoonJS
window.CocoonJS = function () {}
window.ext = function () {}
window.ext.IDTK_SRV_BOX2D = function () {}
window.ext.IDTK_SRV_BOX2D.makeCall = function () {}
window.ext.IDTK_SRV_BOX2D.makeCallAsync = function () {}

// Ejecta
window.ejecta = function () {}
window.Ejecta = function () {}

// Windows Store apps
window.Windows = function () {}
window.WinJS = function () {}
window.MicrosoftNSJS = function () {}

// Node-webkit
window.require = function () {}
window.process = function () {}
window.nw = function () {}

// Blackberry 10
window.blackberry = function () {}

// Amazon WebApps
window.amzn_wa = function () {}
window.amzn_wa_tester = function () {}

// Prevent mangling new JS features
window.Set = function () {}
window.Map = function () {}

// Google APIs
window.gapi = function () {}
window.google = function () {}

// Crosswalk
window.XAPKReader = function () {}

window.nwf = function () {}
