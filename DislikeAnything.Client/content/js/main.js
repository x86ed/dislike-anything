var main = function () {	
	
	return {		
		
		init : function(doc){	
			adaptor.initjQuery();
			main.run(doc);
		},
					
		run : function (doc) {
			var DOM = doc == undefined ? adaptor.getDOM() : doc;
			
			$(".commentable_item").each(function(){
				$this = $(this);
				var parms;
				$this.find("input[name=feedback_params]").each(function(){
					params = JSON.parse($(this).val());
				});
				
				$like_link = $this.find(".like_link");
				
				$("<a class='dislike'>Dislike</a>")
				.insertAfter($like_link)
				.val(JSON.stringify(params))
				.click(function(){
					parameters = JSON.parse($(this).val());	
					graph.getGraphNode(parameters);					
				});
				
				$("<text> &middot; <text>").insertAfter($like_link);
			});
		}
	};
}();

adaptor.init(main.init);

$(document).ready(function(){
	if(location.href.indexOf(facebook.appInfo.redirectUrl) == 0)
	{
		facebook.dislike(function(){
			
		});
		window.open('', '_self', '');
		window.close();
	}
});

