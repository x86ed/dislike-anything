var facebook = {

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
    				
    				utility.popup(url, "Login", 640, 246);
    			}
    		})
    	},
	
	parseAccessToken:
		function(data, callback){
			result = JSON.parse(data);
			console.log(result);
			if(typeof callback == "function")
				callback(result.access_token);
		},	
		
	getPageDislikeStatus:
		function(url, callback){
			facebook.login(function(access_token){
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
		},
		
	dislike:
		function(callback){
			facebook.login(function(accessToken){
				if(accessToken != null)
					utility.getCurrentUrl(function(url){
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

            url = utility.baseDomain + "/GraphConnection.ashx";

            $.post(url, data, function (response) {
            	responseObject = JSON.parse(response);
            	if(responseObject.id){
            		var notification = webkitNotifications.createNotification(
            			'../skin/icons/icon-48.png',  // icon url - can be relative
            			'you dislike this',  // notification title
            			data.graphObject  // notification body text
                    );
                    notification.ondisplay = function(){
                    	chrome.browserAction.setBadgeBackgroundColor({color: [59, 89 , 182 , 255]});
                    	chrome.browserAction.setBadgeText({text:"ugh"});
                    }  
                    notification.show(); 
               	}else{
            		alert("error");
            		console.log(responseObject)
            	}
            	//if(responseObject.error && responseObject.error.message.indexOf("3501"))
            	//	alert("You already dislike this");
            	
            	if(typeof callback == "function")
					callback();
            });
        }
};
