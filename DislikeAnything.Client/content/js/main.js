var main = (function () {	
	
	adaptor.init(init);
	
	$(document).ready(function(){
		
		//if the user needed to log in or connect with the app...
		if(location.href.indexOf(facebook.appInfo.redirectUrl) == 0)
		{
			finishDislikeAfterLogin();
			window.open('', '_self', '');
			window.close();
		}
	});	
	
	function init(doc){	
		adaptor.initjQuery();
		run(doc);
	};
	
	function run(doc) {
		var DOM = doc == undefined ? adaptor.getDOM() : doc;
		
		var home_stream_length = 0;
		setInterval(function(){
			var tempLength = $("#home_stream li").length;
			if(tempLength > home_stream_length){
				home_stream_length = tempLength;
				addDislikeLinkInFacebook();
			}
		}, 1000);
	}
	
	function finishDislikeAfterLogin(){
		facebook.parseAccessToken(document.body.innerHTML, function(accessToken){
			request = {
					"action" : "dislikeAfterLogin",
					parameters: {accessToken: accessToken}
				};								
			chrome.extension.sendRequest(request);		
		});		
	}
	
	function addDislikeLinkInFacebook(){
		
		$(".commentable_item:not(:has(.dislike)):has(input[name=feedback_params])").each(function(){
			$this = $(this);
			
			var params = $("input[name=feedback_params]", $this).val();
		
			$like_link = $(".like_link", $this);
			
			$("<a class='dislike'>Dislike</a>")
			.insertAfter($like_link)
			.val(params)
			.click(function(){
				var parameters = JSON.parse($(this).val());	
				//console.log(parameters);
				//graph.getGraphNode(parameters);
				
				request = {
						"action" : "dislikeStream",
						"parameters" : parameters
					};								
				chrome.extension.sendRequest(request);
			});
			
			$("<text> &middot; <text>").insertAfter($like_link);				
		});
	}
	
	return{
	}

})();