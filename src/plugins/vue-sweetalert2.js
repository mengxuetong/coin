import swal from 'sweetalert2'

export default {
    install: (Vue) => {
        // sweetalert2 的设置默认配置的方法
        swal.setDefaults({
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#a016ef',
            cancelButtonColor: 'rgb(193,193,193)',
            confirmButtonText: 'sure',
            cancelButtonText: 'cancel'
        })

        // 添加全局方法
        Vue.swal = swal
        // 添加实例方法
        Vue.prototype.$swal = swal
    }
}
