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
		graph.getGraphNode(requestParameters, accessToken, getGraphNodeComplete);
	}
	
	function dislikeUrl(){
		console.log("dislikeUrl")
		console.log(dislikedUrl)
		facebook.dislike(dislikedUrl, accessToken, dislikeComplete);
	}
	
	function getGraphNodeComplete(graphNode){
		console.log("graphNode");
		console.log(graphNode)
		console.log("accessToken - " + accessToken)
		if(dislikedUrl == null) return;
		
		facebook.dislike(dislikedUrl, accessToken, dislikeComplete);
	}
	
	function dislikeComplete(responseObject, data){
		$.get(data.graphObject, function(response){
			var title  = response.match(/<title>(.*)<\/title>/)[1];
			if(responseObject.id){
				showNotification("you dislike this", title);
	       	}else{
	       		if(responseObject.error && responseObject.error.message.indexOf("3501")){
	       			showNotification("You already dislike this", title);
	        	}
	    	}
			
			dislikedUrl = null;
			requestParameters = null;
			dislikeType = null;
		});		
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