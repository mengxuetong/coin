const Utils = {
    formatPrice(val) {
        let str = (val/100).toFixed(2) + '';
        let intSum = str.substring(0,str.indexOf(".")).replace( /\B(?=(?:\d{3})+$)/g, ',' );//取到整数部分
        let dot = str.substring(str.length,str.indexOf("."))//取到小数部分搜索
        let ret = intSum + dot;
        return ret;
    },
    // 倒计时
    countDown (times) {
        //带天数的倒计时

        var timer=null;
        timer=setInterval(function(){
            var day=0,
                hour=0,
                minute=0,
                second=0;//时间默认值

            if(times > 0){
                day = Math.floor(times / (60 * 60 * 24));
                hour = Math.floor(times / (60 * 60)) - (day * 24);
                minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }

            if (day <= 9) day = '0' + day;
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            //
            console.log(day+"天:"+hour+"小时："+minute+"分钟："+second+"秒");
            times--;
        },1000);
        if(times<=0){
            clearInterval(timer);
        }
    }
}

export default Utils
