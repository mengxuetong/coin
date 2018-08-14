<template>
    <header class="header-wrap">
        <div class="header-inner content-width">
            <div class="float-l logo-box">
                <img class="coin-logo" src="../assets/images/logo-1.png" alt="logo">
            </div>
            <div class="float-r login-box">
                <button class="coin-button" @click="forgetIdentity" v-if="loginName">Forget Identity</button>
                <button class="coin-button margin-l-r-20" @click="requestIdentity" v-if="!loginName">Provide Identity</button>
            </div>
            <div class="float-r login-box" v-if="loginName">
                {{loginName}}
            </div>
            <div class="price-box text-center">
                <ul>
                    <li>
                        <i class="coin-icon icon-all"></i>
                        <span>{{totalEos}}</span>
                    </li>
                    <li style="width: 150px;">
                        <i class="coin-icon icon-time"></i>
                        <span class="tt">{{times.hour}}</span> :
                        <span class="tt">{{times.minute}}</span> :
                        <span class="tt">{{times.second}}</span>
                    </li>
                    <li>
                        <i class="coin-icon icon-coin"></i>
                        <span>{{totalCoin}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        name: "Header",
        props: ['totalEos', 'totalCoin', 'loginName', 'times'],
        data () {
            return {

            }
        },
        methods: {
            requestIdentity () {
                this.$parent.getIdentity()
            },
            forgetIdentity () {
                this.$parent.destroyIdentity()
            }
        }
    }
</script>

<style lang="less" scoped>
    .header-wrap {
        padding-top: 30px;
        padding-bottom: 30px;
        .coin-logo {
            width: 118px;
            height: 28px;
            vertical-align: middle;
            background: url("../assets/images/logo-1.png") no-repeat;
        }
        .header-inner {
            height: 40px;
            line-height: 40px;
            .price-box {

                font-size: 18px;
                font-family:PingFangSC-Regular;
                margin: 0 auto;

                ul > li {
                    display: inline-block;
                    margin-left: 30px;
                    padding-left: 8px;
                    padding-right: 8px;

                    &:first-child {
                        margin-left: 0;
                    }
                }
            }

            .login-box {
                padding-right: 15px;
            }
        }
    }
    .tt {
        display: inline-block;
        width: 20px;
    }
</style>
