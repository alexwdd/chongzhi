const global={
    APP_NAME: '帮帮卖',

    checkMobile:function(checkVal){
        var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
		if(!reg.test(checkVal)){
            return false;
        }else{
            return true;
        }
    },
    checkChinese:function(checkVal){
        var reg = /^[\u4E00-\u9FA5]{1,5}$/;
        if(!reg.test(checkVal)){
            return false;
        }else{
            return true;
        }
    },
    checkPassword:function(checkVal){
        if (checkVal.length<6 || checkVal.length>20) {
            return false;
        }else{
            return true;
        }
    }
    
};
export default global