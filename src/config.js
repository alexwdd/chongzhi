const global={
    APP_NAME: '新加坡圈',
    SCHEME:'ausSingapore://startapp',
    IOS:'https://itunes.apple.com/cn/app/id1437373175?l=zh&ls=1&mt=8',
    ANDROIDS:'https://play.google.com/store/apps/details?id=com.ldw.singapore',

    checkMobile:function(checkVal){
        var reg = /^[0-9]{8}$/;
		if(!reg.test(checkVal)){
            return false;
        }else{
            return true;
        }
    },
    isWeiXin : function(){
        //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
        var ua = window.navigator.userAgent.toLowerCase();
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    },
    isIOS : function(){
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            return true;
        }
    },
    isApp : function(){
        //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
        var ua = window.navigator.userAgent.toLowerCase();
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        if(ua.match(/AustraliaApp/i) == 'australiaapp'){
            return true;
        }else{
            return false;
        }
    }, 
};
export default global