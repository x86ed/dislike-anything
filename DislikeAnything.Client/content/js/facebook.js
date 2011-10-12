var facebook = {

	baseDomain: "http://dislikeanything.com",
	
    uid: "",

    access_token: "",

    eventsSubscribed: false,

    init:
        function (callback) {

            FB.init({
                appId: facebook.appInfo.appId,
                status: true,
                cookie: true,
                xfbml: true
            });
            if (callback != undefined)
                callback();
        },
        
    appInfo:
    	{
	       appId: "241081449272853",
           namespace: "dislikeanything",
           redirectUrl: "http://dislikeanything.com/Login.aspx",
           scope: "publish_actions"
    	},
    
    login:
    	function(callback){
    		url = "https://www.facebook.com/dialog/oauth?display=popup&client_id=" + facebook.appInfo.appId + "&redirect_uri=" + facebook.appInfo.redirectUrl + "&scope=" + facebook.appInfo.scope;
    		$.get(url, function(result){
    			try{
    				facebook.parseAccessToken(result, callback);
    			}catch(ex){
    				if(typeof callback == "function")
    					callback(null);
    				
    				facebook.popup(url, "Login", 640, 246);
    			}
    		})
    	},
	
	popup:
    	function (url, title, width, height) {
			var left = (window.screen.width / 2) - (width / 2) - 10;
			var top = (window.screen.height / 2) - (height / 2) - 50;
		
			window.open (url,title,"location=1,status=no,scrollbars=no,width=" + width + ",height=" + height + ",resizable=yes,left=" + left + ",top=" + top + ",screenX=" + left + ",screenY=" + top + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no").focus();
		},
		
	getCurrentUrl:
		function(callback){
			chrome.tabs.getSelected(null, function(tab){
				callback(tab.url);
			});
		},
    
	parseAccessToken:
		function(data, callback){
			result = JSON.parse(data);
			console.log(result);
			if(typeof callback == "function")
				callback(result.access_token);
		},
		
	dislike:
		function(callback){
			facebook.login(function(accessToken){
				if(accessToken != null)
					facebook.getCurrentUrl(function(url){
						facebook.postTimeline(facebook.appInfo.namespace, "website", url, "not_like", accessToken, callback);
					});
			});
		},

    postTimeline:
        function (appNamespace, graphObjectType, graphObject, action, accessToken, callback) {

            data = {
                appNamespace: appNamespace,
                graphObjectType: graphObjectType,
                graphObject: graphObject,
                action: action,
                accessToken: accessToken
            };

            console.log(data);

            url = "http://dislikeanything.com/GraphConnection.ashx";

            $.post(url, data, function (response) {
            	responseObject = JSON.parse(response);
            	if(responseObject.error && responseObject.error.message.indexOf("3501"))
            		alert("You already dislike this");
            	
            	if(responseObject.id)
            		alert("You dislike this");
            	
            	if(typeof callback == "function")
					callback();
            });
        }
};
