const global={
    APP_NAME: '新加坡圈',

    checkMobile:function(checkVal){
        var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
		if(!reg.test(checkVal)){
            return false;
        }else{
            return true;
        }
    }
    
};
export default global