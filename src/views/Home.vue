<template>
    <div class="main">
        <header-bar :total-eos="totalEos" :total-coin="totalCoin" :login-name="loginName" :times="times"></header-bar>
        <div class="content content-width clearfix">
            <div class="coin-top-tip text-center">
                <h3>
                    <transition enter-active-class="animated bounceIn" leave-active-class="animated bounceOut">
                        <p v-show="isAnimate">Put coins and surprise yourself</p>
                    </transition>
                </h3>
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
            <!--<div class="timer time-top text-center">-->
                <!--<div class="hours"></div>-->
                <!--<div class="minutes"></div>-->
                <!--<div class="seconds"></div>-->
            <!--</div>-->
            <div class="input-area-wrap">
                <div class="input-icon-box float-l text-center">
                    <i class="eos-icon"></i>
                </div>
                <div class="input-eos-box float-r text-center">@ {{countEos}}eos</div>
                <div class="input-coin-box text-center">{{coin}} coin</div>
            </div>
            <div class="coin-buttons-wrap">
                <button class="coin-button button-120" @click="addCoin(1)">+1 Coin</button>
                <button class="coin-button button-120" @click="addCoin(5)">+5 Coin</button>
                <button class="coin-button button-120" @click="addCoin(10)">+10 Coin</button>
                <button class="coin-button button-120" @click="addCoin(20)">+20 Coin</button>
                <button class="coin-button button-140" @click="addCoin(50)">+50 Coin</button>
                <button class="coin-button button-160" @click="addCoin(100)">+100 Coin</button>
                <button class="coin-button button-160" @click="addCoin(200)">+200 Coin</button>
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
                                <li v-if="accountName">
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
                            <li>
                                <span class="left">
                                    Your Coins
                                </span>
                                <span class="right">
                                    {{yourCoin}} COIN
                                </span>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <footer-bar></footer-bar>
        <div class="layer" v-if="showDown">
            <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=zh-CN">Install the MetaMask</a>
        </div>
        <div class="layer" v-if="showChrome">
            <p>Please use chrome</p>
        </div>
        <div class="layer" v-show="showLoading">
            <p>Please wait...</p>
        </div>
        <div class="layer transparent-0" v-show="pageLoading">
            <div id="ajaxloader1"></div>
        </div>
    </div>
</template>

<script scoped>
    import HeaderBar from '../components/HeaderBar'
    import FooterBar from '../components/FooterBar'
    import Config from '../config'
    import Web3 from 'web3'


    const checkBrowser = function() {
        let agent = window.navigator.userAgent
        return /chrome/i.test(agent)
    }
    const initWeb3 = function () {
        return new Promise(function (resolve, reject) {
            // Check for injected web3 (mist/metamask)
            let web3js = window.web3
            if (typeof web3js !== 'undefined') {
                let web3 = new Web3(web3js.currentProvider)
                resolve({
                    // injectedWeb3: web3.isConnected(),
                    web3 () {
                        return web3
                    }
                })
            } else {
                // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
                reject(new Error('Unable to connect to Metamask'))
            }
        })
    }
    export default {
        name: "Home",
        components: {
            HeaderBar,
            FooterBar
        },
        data () {

            return {
                isAnimate: false,
                showDown: false,
                showChrome: false,
                showLoading: false,
                pageLoading: true,
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
                privateKey: '',
                publicKey: '',
                loginName: '',
                accountName:'',
                transferTo: Config.accountToName,
                identity: null,
                tableName: Config.userTable,
                gamesName: Config.gamesTable,
                tokenName: Config.tokenName,
                eosio: 'eosio.token',
                network: Config.network,
                payAmount: '0.0001 EOS',
                requiredFields: {
                    accounts: [
                        {...Config.network}
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
            init: async function() {
                    if (!checkBrowser()) {
                        this.pageLoading = false
                        this.showChrome = true
                        return
                    }
                    await this.getScatter() // get scatter

                    // check scatter
                    if (!this.scatter){
                        this.pageLoading = false
                        this.showDown = true
                        return false
                    }

                    // if (this.scatter && this.scatter.identity) {
                    //     await this.destroyIdentity()
                    //     await this.getEos()
                    // }
                    await this.getEos()
                    this.findTable()
                    this.getIdentity(this.requiredFields)
            },
            initWeb: async function() {
                let web3Promise
                try {
                    web3Promise = await initWeb3()
                }catch (err){
                    console.log(err)
                }
                if (web3Promise) {
                    this.web3 = web3Promise.web3()
                    console.log(this.web3)
                }

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
                if (this.coin === 0) {
                    return false
                }
                if (!this.checkScatter()) {
                    this.showDown = true
                    return false
                }
                if(!this.checkIdentity()) {
                    this.getIdentity(this.requiredFields)
                    return false
                }

                /*if (this.countTime <= 0) {
                    this.$swal({
                        type: 'warning',
                        text: 'Game over',
                        confirmButtonText: 'sure',
                        showCancelButton: false
                    })
                    return false
                }*/

                const accountFrom = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');

                if (accountFrom) {

                    this.accountName = accountFrom.name
                    const accountTo = this.transferTo;
                    const eosOptions = {
                        // keyProvider: this.privateKey,
                        authorization: `${this.accountName}@active`
                    };

                    this.showLoading = true

                    this.eos.contract(this.eosio)
                        .then(contract => {
                            contract.transfer({from: accountFrom.name, to: accountTo, quantity: this.countEos + ' EOS', memo: this.coin}, eosOptions).then(res => {
                                this.showLoading = false
                                this.$swal({
                                    type: 'success',
                                    text: 'Successful transaction',
                                    confirmButtonText: 'sure',
                                    showCancelButton: false
                                })

                            }).catch(e => {
                                this.showLoading = false
                                if(e.toString().includes("overdrawn balance") || e.toString().includes("no balance object found")){
                                    alert("No money, go back to Getting Started and refill")
                                }
                            })

                        })
                        .catch(e => {
                            console.log(e)
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

                if (parseFloat(this.yourEos) <= 0) {
                    this.$swal({
                        type: 'warning',
                        text: 'Your balance is insufficient',
                        confirmButtonText: 'sure',
                        showCancelButton: false
                    }).then((res) => {})
                    return false
                }

                const accountFrom = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');

                if (accountFrom) {
                    this.accountName = accountFrom.name
                    const eosOptions = {
                        keyProvider: this.privateKey,
                        authorization: `${this.accountName}@active`
                    };
                    this.showLoading = true

                    this.eos.contract(this.tokenName)
                        .then(contract => {
                            contract.withdraw({account: accountFrom.name, quantity: this.yourEos}, eosOptions).then(res => {
                                this.showLoading = false
                                this.$swal({
                                    type: 'success',
                                    text: 'Successful transaction',
                                    confirmButtonText: 'sure',
                                    showCancelButton: false
                                })

                            }).catch(e => {
                                this.showLoading = false
                                if (e) {
                                    let msg = e.error.details[0].message
                                    this.$swal({
                                        type: 'warning',
                                        text: msg,
                                        confirmButtonText: 'sure',
                                        showCancelButton: false
                                    })
                                }
                                if(e.toString().includes("overdrawn balance") || e.toString().includes("no balance object found")){
                                    this.$swal({
                                        type: 'warning',
                                        text: 'No money, go back to Getting Started and refill',
                                        confirmButtonText: 'sure',
                                        showCancelButton: false
                                    })
                                }
                            })
                        })
                        .catch(e => {
                            if (e) {
                                this.$swal({
                                    type: 'warning',
                                    text: e.toString(),
                                    confirmButtonText: 'sure',
                                    showCancelButton: false
                                })
                            }
                        })
                }
            },
            countDown (times) {
                if (this.timer) {
                    clearInterval(this.timer)
                }

                this.timer = setInterval(() => {
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
                }, 1000);
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
                    // await getInfo.call(this)

                    // find games table
                    await findTables.call(this, {tableName: this.gamesName}, function(res) {
                            this.pageLoading = false

                            let data = res.rows[0]
                            if (data && this.endTime != data.end_time && data.end_time !== 0) {
                                this.totalCoin = data.nr_of_coins
                                this.totalEos = data.bonus
                                this.endTime = data.end_time
                                this.currentPrice = data.next_token_rate
                                this.roundNum = data.round
                                this.countTime = this.endTime - (new Date().getTime() / 1000)
                                this.countDown(this.countTime - 1)

                                // let myDate = new Date(this.endTime * 1000).format('yyyy/MM/dd hh:mm:ss')
                                // $(".hours, .minutes, .seconds").empty()

                                // let flip = $(".timer").flipTimer({
                                //     direction: 'down',
                                //     date: myDate,
                                //     template: ''
                                // })
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

                initFind.call(this)
                    .then(res => {
                        if (!this.isAnimate) {
                            this.isAnimate = true
                        }
                    })
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
                this.coin += num
            },
            resetCoin () {
                this.coin = 0
            }
        },
        computed: {
            countEos () {
                let num = this.coin * (this.currentPrice / 10000)
                return num.toFixed(4)
            }
        },
        created () {
            this.initWeb()
        },
        mounted () {
            this.$nextTick(() => {
                // let d = new Date();
                // let myDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + (d.getSeconds() + 30);
                // let myDate = new Date(15667778888)
                // $(".timer").flipTimer({
                //    direction: 'down',
                //    date: myDate
                // })
                // this.countDown(this.leftTime)
            })
        },
        beforeDestroy () {
            if (this.timer) {
                clearInterval(this.timer)
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable.less";
    .time-top {
        margin-top: 40px;
    }
    .layer {
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        background-color: rgba(0, 0, 0, .8);
        display: flex;
        justify-content: center;
        align-items: center;

        &.transparent-0 {
            background-color: #111 !important;
        }
        p, a, a:link {
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
            border: 1px solid #fff;
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
