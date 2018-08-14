<template>
    <div class="main">
        <header-bar :total-eos="totalEos" :total-coin="totalCoin" :login-name="loginName" :times="times"></header-bar>
        <div class="content content-width clearfix">
            <div class="coin-top-tip text-center">
                <h3>Put a coin and surprise yourself</h3>
            </div>
            <div class="total-eos-wrap text-center">
                <!--{{totalEos | formatPrice}}eos-->
                {{totalEos}}
            </div>
            <div class="countdown-wrap text-center">
                <div class="countdown-box">{{times.hour}}</div>:
                <div class="countdown-box">{{times.minute}}</div>:
                <div class="countdown-box">{{times.second}}</div>
            </div>
            <div class="input-area-wrap">
                <div class="input-icon-box float-l text-center">
                    <i class="eos-icon"></i>
                </div>
                <div class="input-eos-box float-r text-center">@ {{countEos}}eos</div>
                <div class="input-coin-box text-center">{{coin}} coin</div>
            </div>
            <div class="coin-buttons-wrap">
                <button class="coin-button button-120" :class="{'active': coin == 1}" @click="addCoin(1)">+1 Coin</button>
                <button class="coin-button button-120" @click="addCoin(5)" :class="{'active': coin == 5}">+5 Coin</button>
                <button class="coin-button button-120" @click="addCoin(10)" :class="{'active': coin == 10}">+10 Coin</button>
                <button class="coin-button button-120" @click="addCoin(20)" :class="{'active': coin == 20}">+20 Coin</button>
                <button class="coin-button button-140" @click="addCoin(50)" :class="{'active': coin == 50}">+50 Coin</button>
                <button class="coin-button button-160" @click="addCoin(100)" :class="{'active': coin == 100}">+100 Coin</button>
                <button class="coin-button button-160" @click="addCoin(200)" :class="{'active': coin == 200}">+200 Coin</button>
            </div>
            <div class="operate-buttons-wrap">
                <button class="reset-button" @click="resetCoin">Reset coin</button>
                <button class="send-button" style="margin-left: 12px;" @click="doContract">Send Eos</button>
            </div>
            <div class="recording-wrap clearfix">
                <div class="box-area">
                    <div class="area-title">
                        <ul class="area-tab">
                            <li class="font-color">Invest</li>
                        </ul>
                    </div>
                    <div class="area-body">
                        <div v-if="accountName">
                            <ul class="area-content">
                                <li>
                                <span class="left">
                                    Your Coins
                                </span>
                                    <span class="right">
                                    {{yourCoin}} COIN
                                </span>
                                </li>
                                <li>
                                <span class="left">
                                    Your Earnings
                                </span>
                                    <span class="right">
                                    {{yourEos}}
                                </span>
                                </li>
                            </ul>
                            <div class="area-foot-wrap text-center">
                                <button class="withdraw-button" @click="withdraw">Withdraw To Wallet</button>
                            </div>
                        </div>
                        <div class="text-center no-text" v-else>
                            <p>no identity</p>
                        </div>
                    </div>
                </div>
                <div class="box-area">
                    <div class="area-title">
                        <ul class="area-tab">
                            <li class="font-color">Round {{roundNum}}</li>
                        </ul>
                    </div>
                    <div class="area-body">
                        <ul class="area-content">
                            <li>
                                <span class="left">
                                    Total Coins
                                </span>
                                <span class="right">
                                    {{totalCoin}} COIN
                                </span>
                            </li>
                            <li>
                                <span class="left">
                                    Active Pot
                                </span>
                                <span class="right">
                                    {{totalEos}}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <footer-bar></footer-bar>
        <div class="layer" v-if="showDown">
            <a href="https://chrome.google.com/webstore/detail/scatter/ammjpmhgckkpcamddpolhchgomcojkle">download scatter extension </a>
        </div>
        <div class="layer" v-if="showLoading">
            <p>Please Wait</p>
        </div>
    </div>
</template>

<script>
    import HeaderBar from '../components/HeaderBar'
    import FooterBar from '../components/FooterBar'
    import Eos from 'eosjs'
    import $ from 'jquery'
    import 'jqueryTimer'

    export default {
        name: "Home",
        components: {
            HeaderBar,
            FooterBar
        },
        data () {
            const dev = {
                protocol:'http',
                blockchain:'eos',
                host:'193.93.219.219',
                port: 8888,
                chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
                broadcast: true
            }

            const product = {
                protocol:'https', // Defaults to https
                blockchain:'eos',
                host:'nodes.get-scatter.com', // ( or null if endorsed chainId )
                port: 443, // ( or null if defaulting to 80 )
                chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
                broadcast: true
            }

            // const devName = 'daccdaccdacc'
            const devName = 'daccsharashi'
            const productName = 'eosio.token'

            return {
                showDown: false,
                showLoading: false,
                roundNum: '',
                totalEos: '',
                totalCoin: '',
                yourCoin: 0,
                yourEos: 0,
                currentPrice: 0,
                coin: 1,
                remainTime: '',
                currentTime: '',
                countTime: '',
                endTime: '',
                scatter: null,
                eos: null,
                generatingAccount:false,
                sign: '',
                privateKey: '5JjZrpe9jMCCfH3euCq1TYJ9epy7iAxvGWUKnRD1axZLYvEhnr8',
                publicKey: '',
                loginName: '',
                accountName:'',
                transferTo: 'daccsharashi',
                identity: null,
                tableName: 'accounts',
                gamesName: 'app',
                tokenName: devName,
                eosio: 'eosio.token',
                network: dev,
                payAmount: '0.0001 EOS',
                requiredFields: {
                    accounts: [
                        {...dev}
                    ]
                },
                leftTime: 60,
                timer: null,
                times: {
                    hour: '00',
                    minute: '00',
                    second: '00'
                },
                myPlayer: null,
                tableTimer: null

            }
        },
        methods: {
            init () {
                (async () => {

                    await this.getScatter() // get scatter

                    // check scatter
                    if (!this.scatter){
                        this.showDown = true
                        return false
                    }

                    if (this.scatter && this.scatter.identity) {
                        await this.destroyIdentity()
                        await this.getEos()
                    } else if (this.scatter && !this.scatter.identity) {
                        await this.getEos()
                    }
                    this.findTable()
                })()
            },
            // destroy identity
            destroyIdentity () {
                this.loginName = ''
                this.accountName = ''
                return this.scatter.forgetIdentity()
            },
            // get scatter
            getScatter () {
                let p = new Promise((resolve, reject) => {
                    document.addEventListener('scatterLoaded', scatterExtension => {
                        this.scatter = window.scatter;
                        resolve(this.scatter)
                        window.scatter = null;
                        // scatter.requireVersion(8.0);
                    })
                })
                return p
            },
            // get identity
            getIdentity (fields) {
                let deferred
                if (!this.scatter) {
                    let getScatter = async () => {
                        await this.getScatter()
                        deferred = await getIdentity.call(this)
                        deferred.then(res => {
                            find.call(this)
                        })
                    }
                    getScatter()
                } else {
                    deferred = getIdentity.call(this)
                    deferred.then(res => {
                        find.call(this)
                    }).catch(err => {
                        console.log(err)
                    })
                }

                function getIdentity () {
                    let requiredFields = this.requiredFields
                    let p = new Promise((resolve, reject) => {
                        this.scatter.getIdentity(requiredFields).then(identity => {
                            this.identity = identity
                            this.loginName = identity.name
                            resolve(identity)
                        }).catch(err => {
                            reject(err)
                        });
                    })
                    return p
                }
                function find () {
                    this.accountName = this.getAccount().name

                    this.getBalance()
                }
                return deferred

            },
            getAccount () {
                return this.scatter.identity.accounts.find(account => account.blockchain === 'eos');
            },
            // check identity sign
            getAuthenticate () {
                this.scatter.authenticate()
                    .then(sign => {
                        this.sign = sign
                    })
                    .catch(err => {

                    })
            },
            // get eos instance
            getEos () {
                const eosOptions = {};
                this.eos = this.scatter.eos( this.network, Eos, eosOptions, 'https' );
            },
            checkScatter () {
                return this.scatter
            },
            checkIdentity () {
                return this.loginName
            },
            // transfer
            doContract () {
                if (!this.checkScatter()) {
                    this.showDown = true
                    return false
                }
                if(!this.checkIdentity()) {
                    this.getIdentity(this.requiredFields)
                    return false
                }

                const accountFrom = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');

                if (accountFrom) {
                    this.accountName = accountFrom.name
                    const accountTo = this.transferTo;

                    const eosOptions = {
                        authorization: `${this.accountName}@active`
                    };
                    this.showLoading = true
                    this.eos.contract(this.eosio)
                        .then(contract => {
                            this.showLoading = false
                            console.log(contract);
                            // contract.buykeys({player: accountFrom.name, keys: this.countEos + ' EOS'}, eosOptions).then(res => {
                            contract.transfer({from: accountFrom.name, to: accountTo, quantity: this.countEos + ' EOS', memo: ''}, eosOptions).then(res => {
                                this.$swal({
                                    type: 'success',
                                    text: 'Successful transaction',
                                    confirmButtonText: 'sure',
                                    showCancelButton: false
                                }).then((res) => {})

                            }).catch(e => {
                                this.showLoading = false
                                console.log(e);
                                if(e.toString().includes("overdrawn balance") || e.toString().includes("no balance object found")){
                                    alert("No money, go back to Getting Started and refill")
                                }
                            })

                        })
                }

            },
            withdraw () {
                if (!this.checkScatter()) {
                    this.showDown = true
                    return false
                }
                if(!this.checkIdentity()) {
                    this.getIdentity(this.requiredFields)
                    return false
                }

                const accountFrom = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');

                if (accountFrom) {
                    this.accountName = accountFrom.name
                    const eosOptions = {
                        authorization: `${this.accountName}@active`
                    };
                    this.showLoading = true
                    this.eos.contract(this.tokenName)
                        .then(contract => {
                            this.showLoading = false
                            console.log(contract);
                            contract.withdraw({player: accountFrom.name, keys: this.yourEos + ' EOS'}, eosOptions).then(res => {
                                this.$swal({
                                    type: 'success',
                                    text: 'Successful transaction',
                                    confirmButtonText: 'sure',
                                    showCancelButton: false
                                }).then((res) => {})

                            }).catch(e => {
                                this.showLoading = false
                                console.log(e);
                                if(e.toString().includes("overdrawn balance") || e.toString().includes("no balance object found")){
                                    alert("No money, go back to Getting Started and refill")
                                }
                            })
                        })
                }
            },
            countDown (times) {

                this.timer=null;
                this.timer=setInterval(() => {
                    var day=0,
                        hour=0,
                        minute=0,
                        second=0;

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

                    //set time
                    this.$nextTick(() => {
                        this.times.hour = hour
                        this.times.minute = minute
                        this.times.second = second
                    })
                    if (times === 0) {
                        clearInterval(this.timer)
                    }
                    times--;
                },1000);

                if(times<=0){
                    clearInterval(this.timer);
                }
            },
            // find table rows
            findTable () {
                // find tables
                async function initFind ()  {
                    // find user table
                    await findTables.call(this, {tableName: this.tableName}, function(res) {
                        if(this.accountName){
                            this.myPlayer = res.rows.find(x => x.player === this.accountName)
                            if (this.myPlayer) {
                                this.yourCoin = this.myPlayer.coins
                                this.yourEos = this.myPlayer.eos_balance
                            }
                        }
                    })

                    //find info for system time
                    await getInfo.call(this)

                    // find games table
                    await findTables.call(this, {tableName: this.gamesName}, function(res) {
                            let data = res.rows[0]

                            if (data && this.endTime != data.end_time) {
                                console.log(data)
                                this.totalCoin = data.total_coin
                                this.totalEos = data.total_eos
                                this.endTime = data.end_time
                                this.currentPrice = data.current_price
                                this.countTime = this.endTime - (new Date('2018-08-13T08:47:16.000').getTime() / 1000)
                                this.countDown(this.countTime)
                            }
                        })

                    setTimeout(() => {
                        initFind.call(this)
                    }, 1000)
                }
                function findTables(option,cb) {
                    return this.eos.getTableRows({
                        code: this.tokenName,
                        scope: this.tokenName,
                        limit: 100000,
                        table: option.tableName,
                        json: true,
                    }).then(res => {
                        cb && cb.call(this,res)
                    });
                }

                function getInfo () {
                    this.eos.getInfo({})
                        .then(res => {
                            this.currentTime = res.head_block_time
                        })
                }

                initFind.call(this)
            },
            getBalance () {
                this.eos.getCurrencyBalance({
                    code: this.eosio,
                    account: this.accountName,
                    symbol: 'EOS'
                }).then(function(res) {
                    console.log(res);
                });
            },
            addCoin (num) {
                this.coin = num
            },
            resetCoin () {
                this.coin = 1
            }
        },
        computed: {
            countEos () {
                let num = this.coin * 1
                return num.toFixed(4)
            }
        },
        created () {
            this.init()
        },
        mounted () {
            this.$nextTick(() => {
                // let d = new Date();
                // let myDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + (d.getSeconds() + 30);
                // let myDate = new Date(234793247932)
                // $(".timer").flipTimer({
                //    direction: 'down',
                //    date: myDate
                // })
                // this.countDown(this.leftTime)
            })
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable.less";
    
    @keyframes rotatey {
        
    }
    .layer {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        background-color: rgba(0, 0, 0, .8);
        display: flex;
        justify-content: center;
        align-items: center;

        a,a:link {
            color: #fff;
            font-size: 52px;
        }
    }
    .coin-top-tip {
        margin-top: 70px;
        h3 {
            font-size: 48px;
        }
    }
    .total-eos-wrap {
        margin-top: 70px;
        font-size:100px;
        color:rgba(255,255,255,1);
        -webkit-text-stroke: 4px #A016EF;
        .num-family()
    }
    .countdown-wrap {
        margin-top: 68px;
        font-size: 60px;
        height:100px;
        line-height: 100px;

        .countdown-box {
            display: inline-block;
            width:100px;
            margin-right: 20px;
            background:rgba(255,255,255,1);
            border-radius:10px;
            font-size: 60px;
            color: @common-number-color;
            .num-family();
            text-align: center;
        }
    }
    .input-area-wrap {
        width:1100px;
        height:80px;
        margin: 0 auto;
        line-height: 80px;
        margin-top: 70px;
        font-size: 24px;
        color: #333;
        background:rgba(240,240,240,1);
        border-radius:10px;
        overflow: hidden;

        .eos-icon {
            width: 60px;
            height: 60px;
            margin-top: 10px;
            display: inline-block;
            background: url("../assets/images/EOS.png") no-repeat;
        }
        .input-icon-box {
            width: 150px;
            height: 80px;
            background-color: #fff;
        }
        .input-eos-box {
            width: 360px;
            height: 80px;
            background-color: #fff;
        }
        .input-coin-box {
            width: 890px;

        }
    }
    .coin-buttons-wrap {
        width: 1100px;
        margin: 0 auto;
        margin-top: 10px;
        button {
            box-sizing: border-box;
            padding: 0;
            margin-left: 17px;
        }
    }
    .operate-buttons-wrap {
        width: 1100px;
        margin: 0 auto;
        margin-top: 48px;
        .reset-button {
            width:400px;
            height:80px;
            font-size:24px;
            color:rgba(51,51,51,1);
            background:rgba(240,240,240,1);
            border-radius:10px;
        }
        .send-button {
            width:680px;
            height:80px;
            font-size:24px;
            color: #fff;
            cursor: pointer;
            background:rgba(160,22,239,1);
            border-radius:10px;
        }
    }
    .recording-wrap {
        padding-top: 60px;
        width: 1100px;
        margin: 0 auto;
        .box-area {
            width:520px;
            height:342px;
            background:rgba(255,255,255,1);
            border-radius:10px;
            float: left;
            &:last-child {
                margin-left: 60px;
            }

            .area-title {
                height: 80px;
                border-bottom: 2px solid rgba(222,222,222,1);

                .area-tab {

                    li {
                        width: 120px;
                        height: 68px;
                        position: relative;
                        line-height: 80px;
                        font-size: 24px;
                        color: #999;
                        float: left;
                        text-align: center;

                        &.active {
                            color: #09142A;

                            &::after {
                                position: absolute;
                                content: '';
                                bottom: 0;
                                left: 50%;
                                transform: translateX(-50%);
                                width:40px;
                                height:2px;
                                background:rgba(160,22,239,1);
                            }
                        }
                    }
                }
            }

            .area-body {

                .area-content {

                    li {
                        height: 80px;
                        line-height: 80px;
                        font-size: 24px;
                        color: #09142A;
                        padding: 0 28px;
                        span {

                            &.left {
                                float: left;
                            }

                            &.right {
                                float: right;
                            }
                        }
                    }
                }

                .area-foot-wrap {
                    margin-top: 8px;

                    .withdraw-button {
                        width:460px;
                        height:60px;
                        color: #fff;
                        font-size: 14px;
                        display: inline-block;
                        background:rgba(160,22,239,1);
                        border-radius:10px;
                    }
                }
            }
        }
    }
</style>
