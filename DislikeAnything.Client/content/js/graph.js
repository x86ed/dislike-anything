var graph = (function(){
	
	var types = {
			"5"  : "event",
			"7"	 : "photo",
			"17" : "share",
			"22" : "status"	
		};	

	function getGraphUrl(parameters){
		var endpoint, url;
		console.log(parameters);
		console.log(parameters.type_id + " = " + types[parameters.type_id])
		switch(types[parameters.type_id]){
			case "event":
				endpoint = parameters.assoc_obj_id
				break;
			case "photo":
				endpoint = parameters.target_fbid;
				url = "https://www.facebook.com/photo.php?fbid=" + parameters.target_fbid;
				break;
			case "share":
			case "status":
			default:
				endpoint = parameters.actor + "_" + parameters.target_fbid;
				url = "https://www.facebook.com/permalink.php?story_fbid=" + parameters.target_fbid + "&id=" + parameters.actor;
				console.log(parameters);
				break;
		}
		
		//console.log("link to item - " + url);
		
		if(endpoint != ""){
			//return "https://graph.facebook.com/" + endpoint;
			endpoint = "https://graph.facebook.com/" + endpoint;
		}		
		
		return {
			url : url, 
			endpoint : endpoint
		};
	}
	
	function getGraphNode(parameters, accessToken, callback){
		var graphUrl = getGraphUrl(parameters);
		console.log(graphUrl);
		var url = graphUrl.endpoint + "?access_token=" + accessToken;
		console.log(url);
		$.get(url, function(result){
			getGraphNodeComplete(result, graphUrl, callback);
		}).error(function(error){
			getGraphNodeComplete(error.responseText, graphUrl, callback);
		});
	}
	
	function getGraphNodeComplete(response, graphUrl, callback){
		graphObject = JSON.parse(response);
		graphObject.url = graphUrl.url;
		graphObject.endpoint = graphUrl.endpoint;
		callback(graphObject);
	}
	
	return {		
		getGraphUrl : getGraphUrl,
		getGraphNode : getGraphNode
	}
})();