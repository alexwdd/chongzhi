const global={
    APP_NAME: '新加坡圈',

    checkMobile:function(checkVal){
        var reg = /^[0-9]{8}$/;
		if(!reg.test(checkVal)){
            return false;
        }else{
            return true;
        }
    }
    
};
export default global