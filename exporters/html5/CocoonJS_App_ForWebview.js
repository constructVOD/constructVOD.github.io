//////////////////////////////////////
// COCOONJS_APP_FORWEBVIEW.JS        //
//////////////////////////////////////

(function()
{
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before adding more functionalities to an extension.");
    if (typeof window.CocoonJS.App === 'undefined' || window.CocoonJS.App === null) throw("The CocoonJS.App object must exist and be valid before adding more functionalities to it.");
    if (navigator.isCocoonJS) throw("Do not inject CocoonJS_App_ForWebView.js file in the CocoonJS environment.");

    CocoonJS.App.nativeExtensionObjectAvailable = CocoonJS.App.nativeExtensionObjectAvailable;

    /**
    * Shows a transparent WebView on top of the CocoonJS hardware accelerated environment rendering context.
    * @param {number} [x] The horizontal position where to show the WebView.
    * @param {number} [y] The vertical position where to show the WebView.
    * @param {number} [width] The horitonzal size of the WebView.
    * @param {number} [height] the vertical size of the WebView.
    */
    CocoonJS.App.show = function(x, y, width, height)
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
           return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "show", arguments);
        }
        else
        {
            var div = window.parent.document.getElementById('CocoonJS_App_ForCocoonJS_WebViewDiv');
            div.style.left = (x ? x : div.style.left)+'px';
            div.style.top = (y ? y : div.style.top)+'px';
            div.style.width = (width ? width : window.parent.innerWidth)+'px';
            div.style.height = (height ? height : window.parent.innerHeight)+'px';
            div.style.display = "block";
            var iframe = window.parent.document.getElementById('CocoonJS_App_ForCocoonJS_WebViewIFrame');
            iframe.style.width = (width ? width : window.parent.innerWidth)+'px';
            iframe.style.height = (height ? height : window.parent.innerHeight)+'px';
        }
    };

    /**
    * Hides the transparent WebView on top of the CocoonJS hardware acceleration environment rendering contect.
    */
    CocoonJS.App.hide = function()
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
           return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "hide", arguments);
        }
        else
        {
            window.parent.document.getElementById('CocoonJS_App_ForCocoonJS_WebViewDiv').style.display = "none";
        }
    };

    /**
    * Loads a resource in the CocoonJS environment from the CocoonJS environment. 
    * @param {string} path The path to the resource. It can be a remote URL or a path to a local file.
    * @param {CocoonJS.App.StorageType} [storageType] An optional parameter to specify at which storage in the device the file path is stored. By default, APP_STORAGE is used.
    * @see CocoonJS.App.load
    */
    CocoonJS.App.loadInCocoonJS = function(path, storageType)
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
            var javaScriptCodeToForward = "ext.IDTK_APP.makeCall('loadPath'";
            if (typeof path !== 'undefined')
            {
                javaScriptCodeToForward += ", '" + path + "'";
                if (typeof storageType !== 'undefined')
                {
                    javaScriptCodeToForward += ", '" + storageType + "'";
                }
            }
            javaScriptCodeToForward += ");";

            return CocoonJS.App.forwardAsync(javaScriptCodeToForward);
        }
        else
        {
            CocoonJS.App.forwardAsync("CocoonJS.App.load('" + path + "');");
        }
    };

    /**
    * NOTE: This function should never be directly called. It will be called from CocoonJS whenever it is needed to work with proxy objects.
    * Setups all the structures that are needed to proxify a webview to type to CocoonJS.
    * @param {string} typeName The name of the type to be proxified.
    * @param {array} eventHandlerNames An array with al the event handlers to be proxified. Needed in order to be able to create callbacks for all the event handlers 
    * and call to the CocoonJS counterparts accordingly.
    */
    CocoonJS.App.setupCocoonJSProxyType = function(typeName, eventHandlerNames)
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
            var parentObject = window;

            // Add a cocoonjs structure the webview type to store some useful information like all the proxy instances that are created, plus the id counter 
            // and the names of all the event handlers and some utility functions.
            parentObject[typeName].cocoonjs = 
            {
                nextId : 0,
                cocoonjsProxyObjects : [],
                eventHandlerNames : eventHandlerNames,

                findCocoonJSProxyObjectForId : function(id)
                {
                    var cocoonjsProxyObject = null;
                    for (var i = 0; cocoonjsProxyObject == null && i < this.cocoonjsProxyObjects.length; i++)
                    {
                        cocoonjsProxyObject = this.cocoonjsProxyObjects[i].id === id ? this.cocoonjsProxyObjects[i] : null;
                    }
                    return cocoonjsProxyObject;
                },

                findCocoonJSProxyObjectForWebviewObject : function(webviewObject)
                {
                    var cocoonjsProxyObject = null;
                    for (var i = 0; cocoonjsProxyObject == null && i < this.cocoonjsProxyObjects.length; i++)
                    {
                        cocoonjsProxyObject = this.cocoonjsProxyObjects[i].webviewObject === webviewObject ? this.cocoonjsProxyObjects[i] : null;
                    }
                    return cocoonjsProxyObject;
                }
            }
        }
    };

    /**
    * NOTE: This function should never be directly called. It will be called from CocoonJS whenever it is needed to work with proxy objects.
    * Creates a new webview proxy object and generates a id to reference it from CocoonJS.
    * @param {string} typeName The name of the type to be proxified.
    * @return The id to be used from CocoonJS to identife the corresponding webview object.
    */
    CocoonJS.App.newCocoonJSProxyObject = function(typeName)
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
            var parentObject = window;

            // Create the instance of the webview object.
            var webviewObject = new parentObject[typeName]();
            // The get the id that will represent it.
            var cocoonjsProxyObjectId = parentObject[typeName].cocoonjs.nextId;
            // Store the created webview object in the structure defined in the setup of proxification.
            parentObject[typeName].cocoonjs.cocoonjsProxyObjects.push( { id : cocoonjsProxyObjectId, webviewObject : webviewObject } );
            // Calculate a new id for the next object.
            parentObject[typeName].cocoonjs.nextId++;

            // Setup all the event handlers.
            for (var i = 0; i < parentObject[typeName].cocoonjs.eventHandlerNames.length; i++)
            {
                (function(eventHandlerName)
                {
                    webviewObject[eventHandlerName] = function(event)
                    {
                        // Look for the proxy object for the target of the event object (the webview object) so it's id can be used to call CocoonJS and
                        // notify that a callback has been performed.
                        var cocoonjsProxyObject = parentObject[typeName].cocoonjs.findCocoonJSProxyObjectForWebviewObject(event.target);
                        var jsCode = "CocoonJS.App.callWebViewProxyEventHandler(" + JSON.stringify(typeName) + ", " + cocoonjsProxyObject.id + ", " + JSON.stringify(eventHandlerName) + ");";
                        CocoonJS.App.forward(jsCode);
                    };
                })(parentObject[typeName].cocoonjs.eventHandlerNames[i]);
            }

            return cocoonjsProxyObjectId;
        }
    };

    /**
    * NOTE: This function should never be directly called. It will be called from CocoonJS whenever it is needed to work with proxy objects.
    * Call a webview object function for a cocoonjs proxy object idetified by it's typeName and id.
    * @param {string} typeName The name of the type of the proxy.
    * @param {number} id The id of the proxy object.
    * @param {string} functionName The name of the function to be called.
    * @return Whatever the function call returns.
    */
    CocoonJS.App.callCocoonJSProxyObjectFunction = function(typeName, id, functionName)
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
            var parentObject = window;
            var argumentsArray = Array.prototype.slice.call(arguments);
            argumentsArray.splice(0, 3);
            var cocoonjsProxyObject = parentObject[typeName].cocoonjs.findCocoonJSProxyObjectForId(id);
            var result = cocoonjsProxyObject.webviewObject[functionName].apply(cocoonjsProxyObject.webviewObject, argumentsArray);
            return result;
        }
    };

    /**
    * NOTE: This function should never be directly called. It will be called from CocoonJS whenever it is needed to work with proxy objects.
    * Sets a value to the corresponding attributeName of a proxy object represented by it's typeName and id.
    * @param {string} typeName The name of the type of the proxy.
    * @param {number} id The id of the proxy object.
    * @param {string} attributeName The name of the attribute to be set.
    * @param {unknown} attributeValue The value to be set to the attribute. 
    */
    CocoonJS.App.setCocoonJSProxyObjectAttribute = function(typeName, id, attributeName, attributeValue)
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
            var parentObject = window;
            var cocoonjsProxyObject = parentObject[typeName].cocoonjs.findCocoonJSProxyObjectForId(id);
            cocoonjsProxyObject.webviewObject[attributeName] = attributeValue;
        }
    };

    /**
    * NOTE: This function should never be directly called. It will be called from CocoonJS whenever it is needed to work with proxy objects.
    * Retrieves the value of the corresponding attributeName of a proxy object represented by it's typeName and id.
    * @param {string} typeName The name of the type of the proxy.
    * @param {number} id The id of the proxy object.
    * @param {string} attributeName The name of the attribute to be retrieved.
    */
    CocoonJS.App.getCocoonJSProxyObjectAttribute = function(typeName, id, attributeName)
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
            var parentObject = window;
            var cocoonjsProxyObject = parentObject[typeName].cocoonjs.findCocoonJSProxyObjectForId(id);
            return cocoonjsProxyObject.webviewObject[attributeName];
        }
    };

    /**
    * NOTE: This function should never be directly called. It will be called from CocoonJS whenever it is needed to work with proxy objects.
    * Deletes a proxy object identifying it using it's typeName and id. Deleting a proxy object mainly means to remove the instance from the global structure
    * that hold all the instances.
    * @param {string} typeName The name of the type of the proxy.
    * @param {number} id The id of the proxy object.
    */
    CocoonJS.App.deleteCocoonJSProxyObject = function(typeName, id)
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
            var parentObject = window;
            var cocoonjsProxyObject = parentObject[typeName].cocoonjs.findCocoonJSProxyObjectForId(id);
            var indexOfCocoonJSProxyObject = parentObject[typeName].cocoonjs.cocoonjsProxyObjects.indexOf(cocoonjsProxyObject);
            parentObject[typeName].cocoonjs.cocoonjsProxyObjects.splice(indexOfCocoonJSProxyObject, 1);
        }
    };

    /**
    * This function allows to forward console messages from the WebView to the CocoonJS
    * debug console. What it does is to change the console object for a new one
    * with all it's methods (log, error, info, debug and warn) forwarding their
    * messages to the CocoonJS environment.
    * The original console object is stored in the CocoonJS.App.originalConsole property.
    */
    CocoonJS.App.proxifyConsole = function() 
    {
        if (!CocoonJS.nativeExtensionObjectAvailable) return;

        if (typeof CocoonJS.App.originalConsole === 'undefined')
        {
            CocoonJS.App.originalConsole = window.console;
        }
        var functions = ["log", "error", "info", "debug", "warn"];
        var newConsole = {};
        for (var i = 0; i < functions.length; i++)
        {
            newConsole[functions[i]] = function(functionName)
            {
                return function(message)
                {
                    ext.IDTK_APP.makeCallAsync("forward", "console." + functionName + "('" + message + "');");
                };
            }(functions[i]);
        }
        window.console = newConsole;
    };

    /**
    * This function restores the original console object and removes the proxified console object.
    */
    CocoonJS.App.deproxifyConsole = function()
    {
        if (window.navigator.isCocoonJS || !CocoonJS.nativeExtensionObjectAvailable) return;
        if (typeof CocoonJS.App.originalConsole !== 'undefined')
        {
            window.console = CocoonJS.App.originalConsole;
            CocoonJS.App.originalConsole = undefined;
        }
    };

    /**
    * Everytime the page is loaded, proxify the console.
    */
    window.addEventListener("load", function()
    {
        CocoonJS.App.proxifyConsole();
    });

    CocoonJS.App.enableFPS = function(fpsLayout, textColor)
    {
        if (!CocoonJS.App.fpsCounter)
        {
            fpsLayout = fpsLayout ? fpsLayout : CocoonJS.App.FPSLayout.TOP_RIGHT;
            textColor = textColor ? textColor : "white";
            CocoonJS.App.fpsCounter = new CocoonJS.FPSCounter();
            CocoonJS.App.fpsDivParentDiv = document.createElement("div");
            var topOrBottom = (fpsLayout === CocoonJS.App.FPSLayout.TOP_LEFT || fpsLayout === CocoonJS.App.FPSLayout.TOP_RIGHT);
            var leftOrRight = (fpsLayout === CocoonJS.App.FPSLayout.TOP_LEFT || fpsLayout === CocoonJS.App.FPSLayout.BOTTOM_LEFT);
            CocoonJS.App.fpsDivParentDiv.style.cssText = "position:absolute; " + (topOrBottom ? "top" : "bottom") + ":0%; width:100%; height:10%;";
            CocoonJS.App.fpsDivParentDiv.innerHTML = "<div id='cocoonjs_fpsDiv' style='background:black; float:" + (leftOrRight ? "left" : "right") + "; color:" + textColor + "''></div>";
            document.body.appendChild(CocoonJS.App.fpsDivParentDiv);
            CocoonJS.App.fpsDiv = document.getElementById("cocoonjs_fpsDiv");
            CocoonJS.App.fpsIntervalId = setInterval(function()
            {
                CocoonJS.App.fpsCounter.update();
                CocoonJS.App.fpsDiv.innerHTML = "< WV FPS: " + (CocoonJS.App.fpsCounter.averageFPS > 60 ? 60 : CocoonJS.App.fpsCounter.averageFPS) + "  >";
            }, 1 / 60);
        }
    };

    CocoonJS.App.disableFPS = function()
    {
        if (CocoonJS.App.fpsIntervalId)
        {
            clearInterval(CocoonJS.App.fpsIntervalId);
            CocoonJS.App.fpsIntervalId = undefined;
        }
        CocoonJS.App.fpsCounter = undefined;
        if (CocoonJS.App.fpsDivParentDiv)
        {
            document.body.removeChild(CocoonJS.App.fpsDivParentDiv);
            CocoonJS.App.fpsDivParentDiv = undefined;
        }
        CocoonJS.App.fpsDiv = undefined;
    };

    /**
    * FOR DOCUMENTATION PURPOSE ONLY! The documentation of the function callback for the {@link CocoonJS.App.onLoadInCocoonJSSucceed} event calls.
    * @name OnLoadInCocoonJSSucceedListener
    * @function
    * @static
    * @memberOf CocoonJS.App
    * @param {string} pageURL A string that represents the page URL loaded.
    */

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the CocoonJS load has completed successfully.
    * The callback function's documentation is represented by {@link CocoonJS.App.OnLoadInCocoonJSSucceedListener}
    * @static
    */
    CocoonJS.App.onLoadInCocoonJSSucceed = new CocoonJS.EventHandler("IDTK_APP", "App", "forwardpageload");

    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the CocoonJS load fails.
    * The callback function does not receive any parameter.
    * @static
    */
    CocoonJS.App.onLoadInCocoonJSFailed = new CocoonJS.EventHandler("IDTK_APP", "App", "forwardpagefail");

})();