var main = function () {	
	
	return {		
		
		init : 
			function(doc){	
				adaptor.initjQuery();
				main.run(doc);
			},
					
		run : 
			function (doc) {
				var DOM = doc == undefined ? adaptor.getDOM() : doc;
				
				var home_stream_length = 0;
				setInterval(function(){
					var tempLength = $("#home_stream li").length;
					if(tempLength > home_stream_length){
						home_stream_length = tempLength;
						main.addDislikeLinkInFacebook();
					}
				}, 1000);
			},
		
		addDislikeLinkInFacebook :
			function(){
				$(".commentable_item:not(:has(.dislike)):has(input[name=feedback_params])").each(function(){
					$this = $(this);
					
					var params = $("input[name=feedback_params]", $this).val();
				
					$like_link = $(".like_link", $this);
					
					$("<a class='dislike'>Dislike</a>")
					.insertAfter($like_link)
					.val(params)
					.click(function(){
						var parameters = JSON.parse($(this).val());	
						console.log(parameters);
						graph.getGraphNode(parameters);					
					});
					
					$("<text> &middot; <text>").insertAfter($like_link);				
				});
			}
	};
}();

adaptor.init(main.init);

$(document).ready(function(){
	
	//if the user needed to log in or connect with the app...
	if(location.href.indexOf(facebook.appInfo.redirectUrl) == 0)
	{
		facebook.dislike();
		window.open('', '_self', '');
		window.close();
	}
});

