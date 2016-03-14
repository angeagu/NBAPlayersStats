var miniExcludes = {
	/*'static-wiski-web-mobile/config/appConfig': 1*/
},copyOnlyRe = [

],copyOnlyList = {
	/*'static-wiski-web-mobile/config/appConfig': 1*/
};

var profile = {
	resourceTags: {
		miniExclude: function (filename, mid) {
			return mid in miniExcludes;
		},
		copyOnly: function(filename, mid){
			for(var i = copyOnlyRe.length; i--;){
				if(copyOnlyRe[i].test(mid)){
					return true;
				}
			}
			return (mid in copyOnlyList)
		}
	}
};
