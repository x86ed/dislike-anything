var graph = function(){

	return {
	
		types : 
			{
				"5"  : "event",
				"7"	 : "photo",
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
						break;
					case "status":
						endpoint = parameters.actor + "_" + parameters.target_fbid;
						break;
					default:
						endpoint = "";
						console.log(parameters);
						break;
				}
				
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