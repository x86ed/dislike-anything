var background = (function(){
	
	var accessToken = null;
	var dislikedUrl = null;
	var requestParameters = null;
	
	var dislikeType = null;

	function onRequest(request, sender, callback) {
		console.log("request recieved: " + request.action);
		console.log(request);		
		switch(request.action){
			case "dislikeStream":
				dislikeType = "stream";
				requestParameters = request.parameters;	
				
				if(accessToken == null){
					facebook.login();
				} else {
					dislike();
				}				
				break;
				
			case "dislikeAfterLogin":
				accessToken = request.parameters.accessToken;
				console.log(dislikeType)
				switch(dislikeType){
					case "stream":
						dislike();
						break;
					case "url":
						dislikeUrl();
						break;
				}
				break;
		}
	};
	
	function dislike(){
		//graph.getGraphNode(requestParameters, accessToken, getGraphNodeComplete);
		graph.generateDislikeUrl(requestParameters, accessToken, generateDislikeUrlComplete);
	}
	
	function dislikeUrl(){
		$.get(dislikedUrl, function(response){
			var titleMatch  = response.match(/<title>(.*)<\/title>/);
			var pageTitle = dislikedUrl;
			if(titleMatch.length >= 0){
				pageTitle = titleMatch[1];
			}
			console.log(pageTitle)
			var asciiCodeArray = pageTitle.match(/&#(.*);/);
			console.log(asciiCodeArray)
			for(var i = 0; i<asciiCodeArray.length; i+=2){
				pageTitle = pageTitle.replace(asciiCodeArray[i], String.fromCharCode(asciiCodeArray[i+1]));
			}
			
			facebook.dislike(dislikedUrl, accessToken, pageTitle, dislikeComplete);
		});
	}
	
	function getGraphNodeComplete(graphNode){
		console.log("graphNode");
		console.log(graphNode)
		graph.generateDislikeUrl(graphNode, generateDislikeUrlComplete);		
	}
	
	function generateDislikeUrlComplete(url, pageTitle){
		dislikedUrl = url;
		facebook.dislike(dislikedUrl, accessToken, pageTitle, dislikeComplete);
	}
	
	function dislikeComplete(responseObject, data, pageTitle){		
		if(responseObject.id){
			showNotification("You Dislike This:", pageTitle);
       	}else{
       		if(responseObject.error && responseObject.error.message.indexOf("3501")){
       			showNotification("You Already Dislike This:", pageTitle);
        	}
    	}
		
		dislikedUrl = null;
		requestParameters = null;
		dislikeType = null;
	}
	
	function showNotification(title, message){		
		var notification = webkitNotifications.createNotification(
    			'../skin/icons/icon-48.png',  // icon url - can be relative
    			title,  // notification title
    			message  // notification body text
            );
            notification.ondisplay = function(){
            	chrome.browserAction.setBadgeBackgroundColor({color: [59, 89 , 182 , 255]});
            	chrome.browserAction.setBadgeText({text:"ugh"});
            }  
            notification.show(); 
	}

	// Wire up the listener.
	chrome.extension.onRequest.addListener(onRequest);
	
    // tab click functionality
    chrome.browserAction.onClicked.addListener(function(tab) {
    	dislikedUrl = tab.url; 	
    	dislikeType = "url";
    	if(accessToken == null){
    		facebook.login();
    	} else {
    		dislikeUrl();
    	}
	}); 
    
    return {
    	
    }
})();