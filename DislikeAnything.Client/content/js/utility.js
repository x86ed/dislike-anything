var utility = function(){
	
	return {
		
		baseDomain: "http://dislikeanything.com",
		
		getCurrentUrl:
			function(callback){
				chrome.tabs.getSelected(null, function(tab){
					callback(tab.url);
				});
			},
			
		popup:
	    	function (url, title, width, height) {
				var left = (window.screen.width / 2) - (width / 2) - 10;
				var top = (window.screen.height / 2) - (height / 2) - 50;
			
				window.open (url,title,"location=1,status=no,scrollbars=no,width=" + width + ",height=" + height + ",resizable=yes,left=" + left + ",top=" + top + ",screenX=" + left + ",screenY=" + top + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no").focus();
			},
	
	}
	
}();