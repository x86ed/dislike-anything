var graph = function(){

	return {
	
		types : 
			{
				"5"  : "event",
				"7"	 : "photo",
				"17" : "share",
				"22" : "status"	
			},
		
		getGraphUrl :
			function(parameters){
				console.log(parameters);
				console.log( parameters.type_id + " = " + graph.types[parameters.type_id])
				switch(graph.types[parameters.type_id]){
					case "event":
						endpoint = parameters.assoc_obj_id
						break;
					case "photo":
						endpoint = parameters.target_fbid;
						url = "https://www.facebook.com/photo.php?fbid=10100446005163905" + parameters.target_fbid;
						break;
					case "share":
						endpoint = parameters.actor + "_" + parameters.target_fbid;
						url = "https://www.facebook.com/permalink.php?story_fbid=" + parameters.target_fbid + "&id=" + parameters.actor;
						break;
					case "status":
						endpoint = parameters.actor + "_" + parameters.target_fbid;
						url = "https://www.facebook.com/permalink.php?story_fbid=" + parameters.target_fbid + "&id=" + parameters.actor;
						break;
					default:
						endpoint = "";
						console.log(parameters);
						break;
				}
				
				console.log("link to item - " + url);
				
				if(endpoint != "")
					return "https://graph.facebook.com/" + endpoint;
			},
			
		getGraphNode :
			function(parameters, accessToken){
				var url = graph.getGraphUrl(parameters);
				console.log(url);
				$.get(url, function(result){
					console.log("open graph result:");
					console.log(result);
				});
			}
			
	}

}();