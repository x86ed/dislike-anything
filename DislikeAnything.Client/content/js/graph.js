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
				break;
		}
		
		endpoint = "https://graph.facebook.com/" + endpoint;
		
		return {
			url : url, 
			endpoint : endpoint,
			actor : parameters.actor
		};
	}
	
	function generateDislikeUrl(parameters, accessToken, callback){
		getGraphNode(parameters, accessToken, function(graphNode){
			var url = utility.baseDomain + "/GraphObject.aspx?url=" +  encodeURIComponent(graphNode.url) + "&title=" + encodeURIComponent(graphNode.pageTitle) + "&type=website";
			callback(url, graphNode.title);
		});
	}
	
	function getGraphNode(parameters, accessToken, callback){
		var graphUrl = getGraphUrl(parameters);
		var url = graphUrl.endpoint + "?access_token=" + accessToken;
		$.get(url, function(result){
			getGraphNodeComplete(result, graphUrl, callback);
		}).error(function(error){
			getGraphNodeComplete(error.responseText, graphUrl, callback);
		});
	}
	
	function getGraphNodeComplete(response, graphUrl, callback){
		var graphNode = JSON.parse(response);
		console.log(graphNode);
		if(graphNode == false){
			graphNode = graphUrl;
			graphNode.pageTitle = "";
			$.get("https://graph.facebook.com/" + graphNode.actor, function(r){
				graphNode.title = JSON.parse(r).name + "'s post";
				callback(graphNode);
			}).error(function(error){
				graphNode.pageTitle = JSON.parse(error.responseText).name + "'s post";
				callback(graphNode);
			});				
		} else {
			graphNode.url = graphUrl.url;
			graphNode.endpoint = graphUrl.endpoint;
			graphNode.title = graphNode.from.name + "'s post";
			callback(graphNode);
		}		
	}
	
	return {		
		getGraphUrl : getGraphUrl,
		getGraphNode : getGraphNode,
		generateDislikeUrl: generateDislikeUrl
	}
})();