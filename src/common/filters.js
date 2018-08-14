import Vue from 'vue'

Vue.filter('formatPrice', val => {
    let str = (val/100).toFixed(2) + '';
    let intSum = str.substring(0,str.indexOf(".")).replace( /\B(?=(?:\d{3})+$)/g, ',' );//取到整数部分
    let dot = str.substring(str.length,str.indexOf("."))//取到小数部分搜索
    let ret = intSum + dot;
    return ret;
})
