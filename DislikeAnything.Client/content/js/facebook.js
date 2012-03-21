var facebook = (function(){

    var uid =  "";
    var access_token = "";
    var eventsSubscribed =  false;
    
    var appInfo = {
			       appId: "241081449272853",
			       namespace: "dislikeanything",
			       redirectUrl: utility.baseDomain + "/Login.aspx",
			       scope: "publish_actions"
				};

    function init (callback) {

        FB.init({
            appId: appInfo.appId,
            status: true,
            cookie: true,
            xfbml: true
        });
        if (callback != undefined)
            callback();
    }
        
	function login(){
		url = "https://www.facebook.com/dialog/oauth?client_id=" + appInfo.appId + "&redirect_uri=" + appInfo.redirectUrl + "&scope=" + appInfo.scope;
		utility.popup(url + "&display=popup", "Login", 640, 246);
	};
	
	function parseAccessToken(data, callback){
		
		console.log("parse access token");
		console.log(data);
		
		result = JSON.parse(data);
		console.log(result);
		if(typeof callback == "function")
			callback(result.access_token);
	};
		
	function getPageDislikeStatus(url, callback){
		login(function(access_token){
			endpoint = "https://graph.facebook.com/me/dislikeanything:not_like";
			data = {"access_token" : access_token}
			$.get(endpoint, data, function(response){
				var dislikes = response.data;
				var isDisliked = false;
				for(var i in dislikes){
					if(dislikes[i].data.website.url == url){
						isDisliked = true;
						break;
					}
				}
				callback(isDisliked)
			}, "json");
		});
	};
		
	function dislike(url, accessToken, callback){
		postTimeline(appInfo.namespace, "website", url, "not_like", accessToken, callback);
	}

    function postTimeline(appNamespace, graphObjectType, graphObject, action, accessToken, callback) {

        var data = {
            appNamespace: appNamespace,
            graphObjectType: graphObjectType,
            graphObject: graphObject,
            action: action,
            accessToken: accessToken
        };

        console.log(data);

        var url = utility.baseDomain + "/GraphConnection.ashx";
        console.log(url)
        $.post(url, data, function (response) {
        	console.log(response)
        	var responseObject = JSON.parse(response);        	
        	if(typeof callback == "function")
				callback(responseObject, data);
        });
    }
    
    return {
    	appInfo : appInfo,
    	dislike : dislike,
    	login : login,
    	parseAccessToken : parseAccessToken
    
    }
})();
