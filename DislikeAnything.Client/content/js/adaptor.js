var adaptor = function () {
	
	return {
		browserType : {
			chrome : "Chrome",
			firefox : "Firefox"
		},
		
		getBrowser : function(){
			if(navigator.userAgent.indexOf(adaptor.browserType.firefox) != -1)
				return adaptor.browserType.firefox;
			
			if(navigator.userAgent.indexOf(adaptor.browserType.chrome) != -1)
				return adaptor.browserType.chrome;
		},
		
		getDOM : function(){
			dom = null;
			
			switch(adaptor.getBrowser()){
				case adaptor.browserType.chrome:
					dom = document;
					break;
				case adaptor.browserType.firefox:
					if(content != null)
						dom = content.document;
					break;
			}
			return dom;
		},
		
		init : function(func){
			switch(adaptor.getBrowser()){
				case adaptor.browserType.chrome:
					window.addEventListener("load", function(){func();}, false);
					break;
				case adaptor.browserType.firefox:
					adaptor.loadjQuery(adaptor);
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
		},
		
		ajaxRequest : function(ajaxRequest, callback){
			switch(adaptor.getBrowser()){
				case adaptor.browserType.chrome:
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
		},
		
		initjQuery : function (){
			if(adaptor.getBrowser() == adaptor.browserType.firefox){
				var jQuery = adaptor.jQuery;
				var $ = function(selector,context){
					return new jQuery.fn.init(selector, context);
					//return new jQuery.fn.init(selector,context||window._content.document);
				};
				$.fn = $.prototype = jQuery.fn;
				//adaptor.env=context;
				//adaptor.env=window._content.document;
			}
		},
		
		loadjQuery : function(context){
			var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
			loader.loadSubScript("chrome://eggcrate/content/js/jquery-1.6.1.min.js",context);
			var jQuery = window.jQuery.noConflict(true);
    			if( typeof(jQuery.fn._init) == 'undefined') { jQuery.fn._init = jQuery.fn.init; }
			adaptor.jQuery = jQuery;
		}		
	}
}();
