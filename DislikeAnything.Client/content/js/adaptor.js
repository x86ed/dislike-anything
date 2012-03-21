var adaptor = function () {
	
	var browserType = {
						chrome : "Chrome",
						firefox : "Firefox"
					  };
	
	function getBrowser(){
		if(navigator.userAgent.indexOf(browserType.firefox) != -1)
			return browserType.firefox;
		
		if(navigator.userAgent.indexOf(browserType.chrome) != -1)
			return browserType.chrome;
	}
	
	function getDOM(){
		dom = null;
		
		switch(getBrowser()){
			case browserType.chrome:
				dom = document;
				break;
			case browserType.firefox:
				if(content != null)
					dom = content.document;
				break;
		}
		return dom;
	}
	
	function init(func){
		switch(getBrowser()){
			case browserType.chrome:
				window.addEventListener("load", function(){func();}, false);
				break;
			case browserType.firefox:
				loadjQuery(adaptor);
				window.addEventListener("load", function(){		
					var appcontent = document.getElementById("appcontent");   // browser
					if(appcontent)
						appcontent.addEventListener("DOMContentLoaded", function(sender){
							 var doc = sender.originalTarget; // doc is document that triggered "onload" event
							 //if(doc.location != content.document.location) return; // only fire event on currently open tab
					         //if (doc.nodeName == "#document") return; // only douments
					         if (doc.defaultView != doc.defaultView.top) return; //only top window.
					         if (doc.defaultView.frameElement) return; // skip iframes/frames
							 func(doc);
						}, true);					
				}, false);
				break;
		}
	}
	
	function ajaxRequest(ajaxRequest, callback){
		switch(getBrowser()){
			case browserType.chrome:
				request = {
					"action" : "ajax",
					"ajaxRequest" : ajaxRequest
				};								
				chrome.extension.sendRequest(request, callback);
				break;
				
			default:
				utility.ajax(ajaxRequest, callback);
				break;			
		}			
	}
	
	function initjQuery(){
		if(getBrowser() == adaptor.browserType.firefox){
			var jQuery = jQuery;
			var $ = function(selector,context){
				return new jQuery.fn.init(selector, context);
				//return new jQuery.fn.init(selector,context||window._content.document);
			};
			$.fn = $.prototype = jQuery.fn;
			//adaptor.env=context;
			//adaptor.env=window._content.document;
		}
	}
	
	function loadjQuery(context){
		var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
		loader.loadSubScript("chrome://eggcrate/content/js/jquery-1.6.1.min.js",context);
		var jQuery = window.jQuery.noConflict(true);
			if( typeof(jQuery.fn._init) == 'undefined') { jQuery.fn._init = jQuery.fn.init; }
		adaptor.jQuery = jQuery;
	}	

	return {
		browserType : browserType,
		
		getBrowser : getBrowser,
		
		getDOM : getDOM,
		
		init : init,
		
		ajaxRequest : ajaxRequest,
		
		initjQuery : initjQuery,
		
		loadjQuery : loadjQuery	
	}
}();
