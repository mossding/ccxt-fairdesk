'use strict';

var Exchange = require('./base/Exchange.js');
var errors = require('./base/errors.js');
var number = require('./base/functions/number.js');

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------

class fairdesk extends Exchange["default"] {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'fairdesk',
            'name': 'Fairdesk',
            'countries': [ 'Singapore' ], // Singapore
            'rateLimit': 100,
            'version': 'v1',
            'certified': false,
            'pro': true,
            'hostname': 'api.fairdesk.com',
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': undefined, // has but not fully implemented
                'future': false,
                'option': false,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'createOrder': true,
                'editOrder': false,
                'fetchBalance': true,
                'fetchBorrowRate': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchBorrowRates': false,
                'fetchBorrowRatesPerSymbol': false,
                'fetchClosedOrders': true,
                'fetchCurrencies': false,
                'fetchDepositAddress': true,
                'fetchDeposits': true,
                'fetchIndexOHLCV': false,
                'fetchLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchPositions': true,
                'fetchPremiumIndexOHLCV': false,
                'fetchTicker': true,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchWithdrawals': false,
                'setLeverage': true,
                'transfer': false,
                'withdraw': false,
            },
            'urls': {
                'logo': 'https://static.fairdesk.com/font/fairdesklogo.png',
                'test': {
                    'public': 'https://api-testnet.fairdesk.com/api/v1/public',
                    'private': 'https://api-testnet.fairdesk.com/api/v1/private',
                },
                'api': {
                    'public': 'https://{hostname}/api/v1/public',
                    'private': 'https://{hostname}/api/v1/private',
                },
                'www': 'https://www.fairdesk.com',
                'doc': 'https://github.com/fairdesk/fairdesk-api-docs',
                'fees': 'https://www.fairdesk.com/fees',
                'referral': 'https://www.fairdesk.com/signup?ref=URIJD5NI',
            },
            'timeframes': {
                '1m': '60',
                '3m': '180',
                '5m': '300',
                '15m': '900',
                '30m': '1800',
                '1h': '3600',
                '2h': '7200',
                '3h': '10800',
                '4h': '14400',
                '6h': '21600',
                '12h': '43200',
                '1d': '86400',
                '1w': '604800',
                '1M': '2592000',
            },
            'api': {
                'public': {
                    'get': [
                        'products', // contracts only
                        'md/orderbook', // ?symbol=BTCUSDT
                        'md/ticker24h', // ?symbol=BTCUSDT
                        'md/trade-recent', // ?symbol=BTCUSDT
                        'md/trade-history', // ?symbol=BTCUSDT&from=1651382628000
                        'md/kline', // ?symbol=BTCUSDT&interval=5m&from=1651382628000&to=1651469028000
                    ],
                },
                'private': {
                    'get': [
                        // swap
                        'account/order-detail', // orderId=571643709
                        'account/order-histories', // ?symbol=&type=&pageIndex=1&pageSize=1000
                        'account/balance',
                        'account/symbol-config',
                        'account/open-orders',
                        'account/positions',
                        'account/current-positions',
                        'account/trade-histories',
                        // wallet
                        'wallet/deposit-address', // ?currency=ETH
                        'wallet/deposit-records', // ?startTime=0&currency=USDT&pageIndex=1&pageSize=20
                    ],
                    'post': [
                        // swap
                        'trade/place-order',
                        'trade/cancel-all-order',
                    ],
                    'put': [
                        // swap
                        'account/config/adjust-leverage',
                    ],
                    'delete': [
                        // swap
                        'trade/cancel-order',
                    ],
                },
            },
            'precisionMode': number.TICK_SIZE,
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'taker': this.parseNumber ('0.001'),
                    'maker': this.parseNumber ('0.001'),
                },
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
            },
            'exceptions': {
                'exact': {
                    "1000" : 'NO_SUCH_ACCOUNT',                        // no such account.
                    "1002" : 'ACCOUNT_SETTLED_CURRENCY_NOT_MATCH',     // account settled currency do not match.
                    "1004" : 'MIN_LEVERAGE_RATIO',                     // leverage is too small
                    "1005" : 'MAX_LEVERAGE_RATIO',                     // leverage is too large.
                    "1006" : 'NEW_LEVERAGE_EQUAL_OLD',                 // leverage is equal old leverage.
                    "1007" : 'MARGIN_NOT_ENOUGH',                      // margin not enough.
                    "1008" : 'BALANCE_INSUFFICIENT',                   // balance insufficient.
                    "1009" : 'RECHARGE_AMOUNT_ILLEGAL',                // the amount of recharge is illegal.
                    "1010" : 'BALANCE_CHANGE_AMOUNT_ILLEGAL',          // the amount of balance change is illegal.
                    "1011" : 'INVALID_MARGIN_CHANGE_AMOUNT',           // invalid margin change amount.
                    "1012" : 'ISOLATED_LEVERAGE_REJECT_WITH_POSITION', // leverage reduction is not supported in Isolated Margin Mode with open positions.
                    "1013" : 'BALANCE_VERSION_NOT_EQUAL',              // balance version not equal.
                    "2000" : 'INVALID_SYMBOL_ID',                      // invalid symbol id.
                    "2004" : 'DUPLICATED_ASSET_NAME',                  // duplicated asset name
                    "2005" : 'DUPLICATED_ASSET_ID',                    // duplicated asset id
                    "2006" : 'INVALID_ASSET_ID',                       // invalid asset id.
                    "4000" : 'NO_SUCH_ORDER',                          // no such order.
                    "4001" : 'PRICE_MISSING',                          // price is missing.
                    "4002" : 'QTY_MISSING',                            // qty is missing.
                    "4003" : 'INVALID_QTY',                            // qty is invalid.
                    "4004" : 'INVALID_CURRENCY_ID',                    // invalid currency id.
                    "4005" : 'UNABLE_TO_FILL',                         // unable to fill.
                    "4006" : 'ORDER_WOULD_IMMEDIATELY_TRIGGER',        // order would immediately trigger.
                    "4007" : 'REDUCE_ONLY_REJECT',                     // reduce only reject.
                    "4008" : 'POSITION_NOT_SUFFICIENT',                // position is not sufficient.
                    "4009" : 'REDUCE_ONLY_BUY_ERROR',                  // reduce only rejected, position more than 0 while buy.
                    "4010" : 'REDUCE_ONLY_SELL_ERROR',                 // reduce only rejected, position less than 0 while sell.
                    "4011" : 'MAX_OPEN_ORDER_LIMIT',                   // max open order limit.
                    "4012" : 'MAX_CONDITIONAL_ORDER_LIMIT',            // max conditional order limit.
                    "4013" : 'INVALID_CONDITIONAL_ORDER',              // conditional order is invalid.
                    "4014" : 'CLI_ORD_ID_DUPLICATE',                   // clientOrderId duplicated.
                    "4015" : 'REDUCE_ONLY_ILLEGAL',                    // reduce only reject, order type not supported.
                    "4020" : 'CANCEL_REJECTED',                        // unknown order sent.
                    "4021" : 'UNKNOWN_UPDATE_TYPE',                    // unknown update type.
                    "4030" : 'REDUCE_ONLY_MARGIN_CHECK_FAILED',        // reduceOnly order Failed. please check your existing position and open orders.
                    "4040" : 'UNABLE_TO_PARSE_ORDER',                  // unable to parse order.
                    "4050" : 'MARKET_ORDER_REJECT',                    // the counter party's best price does not meet the PERCENT_PRICE filter limit.
                    "4051" : 'ORDER_PRICE_RANGE_REJECT',               // order price not in the proper range.
                    "4060" : 'TRIGGER_PRICE_MISSING',                  // trigger price is missing.
                    "4070" : 'NO_OPEN_ORDER',                          // no open orders to close
                    "4071" : 'ORDER_ID_DUPLICATE',                     // order id duplicated.
                    "5000" : 'INVALID_POSITION_SIDE',                  // positionSide is not valid.
                    "5001" : 'POSITION_SIDE_NOT_MATCH',                // positionSide does not match with userSetting.
                    "5002" : 'ADD_ISOLATED_MARGIN_NO_POSITION_REJECT', // isolated position quantity should more than 0 when add margin.
                    "5003" : 'NO_BALANCE_FOR_ADD_MARGIN',              // No balance for add position margin.
                    "5004" : 'POSITION_MARGIN_CAN_NOT_DECREASE',       // Position margin can not decrease.
                    "100" :  'TIMEOUT',                                // Request time out.
                    "200" :  'PRICE_LESS_THAN_ZERO',                   // Price less than 0.
                    "201" :  'PRICE_LESS_THAN_MIN_PRICE',              // Price less than min price.
                    "202" :  'PRICE_GREATER_THAN_MAX_PRICE',           // Price greater than max price.
                    "203" :  'PRICE_NOT_INCREASED_BY_TICK_SIZE',       // Price not increased by tick size.
                    "204" :  'QTY_LESS_THAN_ZERO',                     // Quantity less than zero.
                    "205" :  'QTY_GREATER_THAN_MAX_QTY',               // Quantity greater than max quantity.
                    "206" :  'QTY_LESS_THAN_MIN_QTY',                  // Quantity less than min quantity.
                    "207" :  'QTY_NOT_INCREASED_BY_STEP_SIZE',         // Qty not increased by step size.
                    "208" :  'TRIGGER_PRICE_LESS_THAN_ZERO',           // Trigger price less than zero.
                    "209" :  'TRIGGER_PRICE_GREATER_THAN_MAX_PRICE',   // Trigger price greater than max price.
                    "210" :  'PRICE_TRIGGER_TYPE_IS_NULL_OR_ILLEGAL',  // Price trigger type is null or illegal.
                    "211" :  'NOT_SUPPORT_ORDER_TYPE',                 // not support order type.
                    "212" :  'INVALID_CL_ORD_ID_LEN',                  // client order length is not valid.
                    "213" :  'INVALID_CL_ORD_ID',                      // client order id is not valid.
                    "214" :  'CL_ORD_ID_ILLEGAL_CHARS',                // Illegal characters found in a parameter.
                    "216" :  'MANDATORY_PARAM_EMPTY_OR_MALFORMED',     // Mandatory parameter {%s} was not sent, was empty/null, or malformed.
                    "217" :  'PARAM_NOT_REQUIRED',                     // Parameter '%s' not required.
                    "218" :  'INVALID_SIDE',                           // Invalid side.
                    "219" :  'OPTIONAL_PARAMS_BAD_COMBO',              // Combination of optional parameters '%s' invalid.
                    "220" :  'INVALID_PRICE_RANGE',                    // price range not valid
                    "221" :  'QTY_TOO_LARGE',                          // Qty too large.
                    "250" :  'INVALID_CURRENCY',                       // invalid currency.
                    "300" :  'INVALID_SYMBOL',                         // invalid symbol.
                    "301" :  'SYMBOL_CAN_NOT_TRADING',                 // symbol can not trading now.
                    "302" :  'SYMBOL_ORDER_CAN_NOT_CANCEL',            // symbol order can not cancel now.
                    "400" :  'INVALID_ACCOUNT',                        // invalid account.
                    "401" :  'ACCOUNT_CAN_NOT_TRADE',                  // account could not trade.
                    "402" :  'INVALID_LEVERAGE',                       // invalid leverage.
                    "403" :  'INVALID_USER_ID',                        // invalid user id.
                    "405" :  'INVALID_WITHDRAW_BALANCE',               // invalid withdraw balance.
                    "408" :  'ACCOUNT_MARGIN_NOT_ENOUGH',              // account margin not enough.
                    "501" :  'WALLET_INSUFFICIENT_BALANCE'             // wallet insufficient balance
                },
                'broad': {
                    '401 Insufficient privilege': errors.PermissionDenied, // {"code": "401","msg": "401 Insufficient privilege."}
                    '401 Request IP mismatch': errors.PermissionDenied, // {"code": "401","msg": "401 Request IP mismatch."}
                    'Failed to find api-key': errors.AuthenticationError, // {"msg":"Failed to find api-key 1c5ec63fd-660d-43ea-847a-0d3ba69e106e","code":10500}
                    'Missing required parameter': errors.BadRequest, // {"msg":"Missing required parameter","code":10500}
                    'API Signature verification failed': errors.AuthenticationError, // {"msg":"API Signature verification failed.","code":10500}
                    'Api key not found': errors.AuthenticationError, // {"msg":"Api key not found 698dc9e3-6faa-4910-9476-12857e79e198","code":"10500"}
                },
            },
            'options': {
                'x-fairdesk-request-expiry': 60, // in seconds
                'createOrderByQuoteRequiresPrice': true,
                'networks': {
                    'ERC20': 'ETH',
                    'TRC20': 'TRX',
                },
                'defaultNetworks': {
                    'USDT': 'ETH',
                },
                'defaultSubType': 'linear',
                'accountsByType': {
                    'future': 'future',
                },
            },
        });
    }

    parseSafeNumber (value = undefined) {
        if (value === undefined) {
            return value;
        }
        let parts = value.split (',');
        value = parts.join ('');
        parts = value.split (' ');
        return this.safeNumber (parts, 0);
    }

    parseSwapMarket (market) {
        const id = this.safeString (market, 'symbol');
        const baseId = this.safeString (market, 'baseCurrency');
        const quoteId = this.safeString (market, 'quoteCurrency');
        const settleId = this.safeString (market, 'settleCurrency');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const settle = this.safeCurrencyCode (settleId);
        const maxLevel = this.safeString (market, 'maxLeverage');
        return {
            'id': id,
            'symbol': base + '/' + quote,
            'base': base,
            'quote': quote,
            'settle': settle,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': settleId,
            'type': 'swap',
            'spot': false,
            'margin': false,
            'swap': true,
            'future': false,
            'option': false,
            'active': true,
            'contract': false,
            'linear': true,
            'inverse': false,
            'taker': this.parseNumber (this.safeString (market, 'takerFeeRate')),
            'maker': this.parseNumber (this.safeString (market, 'makerFeeRate')),
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': this.safeNumber (market, 'stepSize'),
                'price': this.safeNumber (market, 'tickSize'),
            },
            'limits': {
                'leverage': {
                    'min': this.parseNumber ('1'),
                    'max': this.parseNumber (maxLevel),
                },
                'amount': {
                    'min': this.parseNumber (this.safeString (market, 'minOrderQty')),
                    'max': this.parseNumber (this.safeString (market, 'maxOrderQty')),
                },
                'price': {
                    'min': this.parseNumber (this.safeString (market, 'minPrice')),
                    'max': this.parseNumber (this.safeString (market, 'maxPrice')),
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'info': market,
        };
    }

    async fetchMarkets (params = {}) {
        const response = await this.publicGetProducts (params);
        // {
        //     "status": 0,
        //     "error": "OK",
        //     "data": [    {
        //         "symbolId": 1211,
        //         "symbol": "btcusdt",
        //         "displayName": "BTC/USDT",
        //         "baseCurrency": "BTC",
        //         "quoteCurrency": "USDT",
        //         "settleCurrency": "USDT",
        //         "productType": "Perpetual",
        //         "tickSize": "0.500000",
        //         "stepSize": "0.001000",
        //         "maxPrice": "500000.000000",
        //         "minPrice": "0.500000",
        //         "maxOrderQty": "100.000000",
        //         "minOrderQty": "0.000000",
        //         "maxLeverage": 125,
        //         "defaultLeverage": 20,
        //         "priceDecimal": 1,
        //         "amountDecimal": 3,
        //         "fundingInterval": "Every 8 hours",
        //         "makerFeeRate": "0.0001",
        //         "takerFeeRate": "0.00015",
        //         "marketPriceDiffRate": 0.1,
        //         "limitPriceDiffRate": 0.1,
        //         "strategyPriceDiffRate": 0.075,
        //         "liquidationFeeRate": 0.01
        //     },]
        // }
        const products = response.data;
        const result = [];
        for (let i = 0; i < products.length; i++) {
            let market = products[i];
            market = this.parseSwapMarket (market);
            result.push (market);
        }
        return result;
    }

    parseBidAsk (bidask, priceKey = 0, amountKey = 1, market = undefined) {
        if (market === undefined) {
            throw new errors.ArgumentsRequired (this.id + ' parseBidAsk() requires a market argument');
        }
        const amount = this.safeString (bidask, amountKey);
        return [
            this.parseNumber (this.safeString (bidask, priceKey)),
            this.parseNumber (amount),
        ];
    }

    parseOrderBook (orderbook, symbol, timestamp = undefined, bidsKey = 'bids', asksKey = 'asks', priceKey = 0, amountKey = 1, market = undefined) {
        const result = {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'nonce': undefined,
        };
        const sides = [ bidsKey, asksKey ];
        for (let i = 0; i < sides.length; i++) {
            const side = sides[i];
            const orders = [];
            const bidasks = this.safeValue (orderbook, side);
            for (let k = 0; k < bidasks.length; k++) {
                orders.push (this.parseBidAsk (bidasks[k], priceKey, amountKey, market));
            }
            result[side] = orders;
        }
        result[bidsKey] = this.sortBy (result[bidsKey], 0, true);
        result[asksKey] = this.sortBy (result[asksKey], 0);
        return result;
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const symbolId = this.parseSymbol (symbol);
        const market = this.market (symbolId);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicGetMdOrderbook (this.extend (request, params));
        // {
        //     "status": 0,
        //     "error": "OK",
        //     "data": {
        //         "symbol": "btcusdt",
        //         "bids": [
        //             [ 35886.500000, 0.314000 ],
        //             [ 35886.000000, 0.204000 ],
        //         ],
        //         "asks": [
        //             [ 35887.500000, 0.058000 ],
        //             [ 35888.000000, 0.038000 ],
        //         ],
        //     }
        //   }
        const result = this.safeValue (response, 'data', {});
        const timestamp = this.safeIntegerProduct (result, 'timestamp', 0.000001);
        return this.parseOrderBook (result, symbol, timestamp, 'bids', 'asks', 0, 1, market);
    }

    parseOHLCV (ohlcv, market = undefined) {
        return [
            this.parseNumber (this.safeString (ohlcv, 'closeTime')),
            this.parseNumber (this.safeString (ohlcv, 'open')),
            this.parseNumber (this.safeString (ohlcv, 'high')),
            this.parseNumber (this.safeString (ohlcv, 'low')),
            this.parseNumber (this.safeString (ohlcv, 'close')),
            this.parseNumber (this.safeString (ohlcv, 'volume')),
        ];
    }

    async fetchOHLCV (symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        const request = {
            'interval': timeframe,
        };
        let startTime = 0;
        let endTime = 0;
        const duration = this.parseTimeframe (timeframe);
        const now = this.seconds ();
        if (since !== undefined) {
            if (limit === undefined) {
                limit = 1000; // max 1000
            }
            since = parseInt (since / 1000);
            startTime = since;
            // time ranges ending in the future are not accepted
            // https://github.com/ccxt/ccxt/issues/8050
            endTime = Math.min (now, this.sum (since, duration * limit));
        } else if (limit !== undefined) {
            limit = Math.min (limit, 1000);
            startTime = now - duration * this.sum (limit, 1);
            endTime = now;
        } else {
            throw new errors.ArgumentsRequired (this.id + ' fetchOHLCV() requires a since argument, or a limit argument, or both');
        }
        request['from'] = startTime * 1000;
        request['to'] = endTime * 1000;
        await this.loadMarkets ();
        const symbolId = this.parseSymbol (symbol);
        const market = this.market (symbolId);
        request['symbol'] = market['id'];
        const response = await this.publicGetMdKline (this.extend (request, params));
        // {
        //     "status": 0,
        //     "error": "OK",
        //     "data": [    {
        //         "openTime": 1651382700000,
        //         "intervalId": "5m",
        //         "closeTime": 1651382999999,
        //         "open": 38076.000000,
        //         "close": 38095.000000,
        //         "high": 38098.000000,
        //         "low": 38056.500000,
        //         "avgPrice": 38066.500000,
        //         "volume": 0.067000,
        //         "quoteVolume": 2551.822500,
        //         "symbol": "btcusdt",
        //         "closed": true,
        //         "numTrades": 15
        //     },]
        // }
        const rows = this.safeValue (response, 'data', {});
        return this.parseOHLCVs (rows, market, timeframe, since, limit);
    }

    parseTicker (ticker, market = undefined) {
        const marketId = this.safeString (ticker, 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const timestamp = this.parseNumber (this.safeString (ticker, 'timestamp'));
        const last = this.safeString (ticker, 'close');
        const open = this.safeString (ticker, 'open');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString (ticker, 'high'),
            'low': this.safeString (ticker, 'low'),
            'open': open,
            'close': last,
            'last': last,
            'bid': undefined,
            'bidVolume': undefined,
            'ask': undefined,
            'askVolume': undefined,
            'vwap': undefined,
            'previousClose': undefined, // previous day close
            'change': last - open,
            'percentage': (last - open) / open * 100,
            'average': this.safeString (ticker, 'averagePrice'),
            'baseVolume': this.safeString (ticker, 'baseVolume'),
            'quoteVolume': this.safeString (ticker, 'quoteVolume'),
            'info': ticker,
        }, market, false);
    }

    parseSymbol (symbol) {
        const str = symbol.replace ('/', '');
        return str.toLowerCase ();
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const symbolId = this.parseSymbol (symbol);
        const market = this.market (symbolId);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicGetMdTicker24h (this.extend (request, params));
        // {
        //     "status": 0,
        //     "error": "OK",
        //     "data": {
        //       "symbol": "btcusdt",
        //       "timestamp": 1651895571086,
        //       "open": 36439.500000,
        //       "high": 36542.500000,
        //       "low": 35344.500000,
        //       "close": 35890.000000,
        //       "indexPrice": 35891.0,
        //       "markPrice": 35892.9,
        //       "openInterest": 74.275366,
        //       "fundingRate": 0.00010000,
        //       "predicateFundingRate": 0.000100,
        //       "baseVolume": 313.214000,
        //       "quoteVolume": 11280153.148
        //     }
        // }
        const result = this.safeValue (response, 'data', {});
        return this.parseTicker (result, market);
    }

    async fetchTrades (symbol, since = undefined, limit = undefined, params = {}) {
        const symbolId = this.parseSymbol (symbol);
        await this.loadMarkets ();
        const market = this.market (symbolId);
        const request = {
            'symbol': market['id'],
        };
        let method = 'publicGetMdTradeRecent';
        if (since) {
            method = 'publicGetMdTradeHistory';
            request['from'] = since;
        }
        const response = await this[method] (this.extend (request, params));
        // {
        //     "status": 0,
        //     "error": "OK",
        //     "data": {
        //       "symbol": "btcusdt",
        //       "timestamp": 1651895759240,
        //       "trades": [{
        //         "tradeId": 245418671,
        //         "orderId": 45014798997,
        //         "qty": 38408.500000,
        //         "price": 38408.500000,
        //         "timestamp": 1651447203805,
        //         "updateId": 47240871986,
        //         "taker": true,
        //         "buyMaker": false
        //       },]
        //     }
        // }
        const result = this.safeValue (response, 'data', {});
        const trades = this.safeValue (result, 'trades', []);
        return this.parsePubTrades (trades, market, since, limit);
    }

    parsePubTrades (trades, market = undefined, since = undefined, limit = undefined, params = {}) {
        const result = [];
        for (let i = 0; i < trades.length; i++) {
            const item = trades[i];
            result.push (this.parsePubTrade (item, market));
        }
        return result;
    }

    parseMyTrades (trades, market = undefined, since = undefined, limit = undefined, params = {}) {
        const result = [];
        for (let i = 0; i < trades.length; i++) {
            const item = trades[i];
            result.push (this.parseMyTrade (item, market));
        }
        return result;
    }


    parsePubTrade (trade, market = undefined) {
        const symbol = market['symbol'];
        const timestamp = this.safeNumber (trade, 'timestamp');
        return {
            'info': trade,
            'id': this.safeString (trade, 'tradeId'),
            'symbol': symbol,
            'order': this.safeString (trade, 'orderId'),
            'price': this.safeString (trade, 'price'),
            'amount': this.safeString (trade, 'qty'),
            'takerOrMaker': 'taker',
            'type': undefined,
            'side': undefined,
            'cost': undefined,
            'fee': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp)
        };
    }

    parseMyTrade (trade, market = undefined) {
        const symbol = market['symbol'];
        const timestamp = this.safeNumber (trade, 'timestamp');
        const isMaker = this.safeValue (trade, 'maker');
        const side = this.safeStringLower (trade, 'side');
        const positionSide = this.safeStringLower (trade, 'positionSide');
        return {
            'info': trade,
            'id': this.safeString (trade, 'tradeId'),
            'symbol': symbol,
            'order': this.safeString (trade, 'orderId'),
            'type': undefined,
            'side': side,
            'positionSide': positionSide,
            'takerOrMaker': isMaker ? "maker" : "taker",
            'price': this.safeString (trade, 'lastPrice'),
            'amount': this.safeString (trade, 'lastQty'),
            'cost': undefined,
            'fee': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp)
        };
    }

    parseSwapBalance (response) {
        const data = this.safeValue (response, 'data', {});
        const balance = this.safeValue (data, 'accounts', {})[0];
        const free = this.safeNumber (balance, 'availBalance');
        const used = this.safeNumber (balance, 'positionMargin');
        const total = this.safeNumber (balance, 'accountBalance');
        return {
            'info': balance,
            'USDT': {
                free,
                used,
                total,
            },
            'free': { 'USDT': free },
            'used': { 'USDT': used },
            'total': { 'USDT': total },
        };
    }

    async fetchBalance (params = {}) {
        await this.loadMarkets ();
        const request = {};
        const response = await this.privateGetAccountBalance (this.extend (request, params));
        // {
        //     "status": "0",
        //     "error": "OK",
        //     "data": {
        //       "marginBalanceUsd": "439275458.22",
        //       "marginBalanceBtc": "12247.58222118",
        //       "totalAccountBalance": "439275458.34",
        //       "totalUnRealizedPnL": "-0.12",
        //       "accounts": [
        //         {
        //           "currency": "USDT",
        //           "icon": "https://fairdesk-app2public-prod.s3.ap-southeast-1.amazonaws.com/currency/USDT.png",
        //           "accountBalance": "439275458.34",
        //           "availBalance": "439275440.23",
        //           "unRealizedPnL": "-0.12",
        //           "positionMargin": "10.84",
        //           "bonus": "495.00",
        //           "bonusBalance": "0.00",
        //           "display": "Tether"
        //         }
        //       ]
        //     }
        //   }
        return this.parseSwapBalance (response);
    }

    parseOrderType (type) {
        const types = {
            'LIMIT': 'limit',
            'MARKET': 'market',
        };
        return this.safeString (types, type, type);
    }

    parseTimeInForce (timeInForce) {
        const timeInForces = {
            'GTC': 'GTC',
            'POST_ONLY': 'PO',
            'IOC': 'IOC',
            'FOK': 'FOK',
        };
        return this.safeString (timeInForces, timeInForce, timeInForce);
    }

    parseOrders (orders, market = undefined, since = undefined, limit = undefined, params = {}) {
        const result = [];
        for (let i = 0; i < orders.length; i++) {
            const item = orders[i];
            result.push (this.parseOrder (item));
        }
        return result;
    }

    parseOrder (order, market = undefined) {
        const symbol = this.safeString (order, 'symbol');
        const state = () => {
            let value = '';
            if (this.safeString (order, 'status') === 'FILLED') {
                value = 'closed';
            }
            if (this.safeString (order, 'status') === 'CANCELED') {
                value = 'canceled';
            }
            if (this.safeString (order, 'status') === 'EXPIRED') {
                value = 'expired';
            }
            if (this.safeString (order, 'status') === 'NEW') {
                value = 'open';
            }
            return value;
        };
        const status = state (); // 'open', 'closed', 'canceled', 'expired', 'rejected'
        const side = this.safeStringLower (order, 'side');
        const positionSide = this.safeStringLower (order, 'positionSide');
        const type = this.parseOrderType (this.safeString (order, 'type'));
        const price = this.parseNumber (this.safeString (order, 'price') === '--' ? '' : this.safeString (order, 'price'));
        const amount = this.safeNumber (order, 'origQty');
        const remaining = amount - this.safeNumber (order, 'executedQty');
        const timestamp = this.safeNumber (order, 'transactTime');
        const timeInForce = this.parseTimeInForce (this.safeString (order, 'timeInForce'));
        return {
            'info': order,
            'id': this.safeString (order, 'orderId'),
            'clientOrderId': this.safeString (order, 'clientOrderId'),
            'datetime': this.iso8601 (timestamp),
            'timestamp': timestamp,
            'lastTradeTimestamp': timestamp,
            'symbol': symbol,
            'type': type,
            'timeInForce': timeInForce,
            'postOnly': (timeInForce === 'PO'),
            'side': side,
            'positionSide': positionSide,
            'price': price,
            'stopPrice': this.safeNumber (order, 'triggerPrice'),
            'amount': amount,
            'filled': this.safeNumber (order, 'executedQty'),
            'remaining': remaining,
            'cost': undefined,
            'average': undefined,
            'status': status,
            'fee': undefined,
            'trades': undefined,
        };
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        if (type.toLocaleUpperCase () !== 'MARKET' && type.toLocaleUpperCase () !== 'LIMIT') {
            throw new errors.ArgumentsRequired (this.id + ' createOrder() only support Market or Limit type');
        }
        await this.loadMarkets ();
        const symbolId = this.parseSymbol (symbol);
        const market = this.market (symbolId);
        const sideValue = side.toLocaleUpperCase ();
        const request = {
            'symbol': market['id'],
            'price': price,
            'quantity': amount,
            'side': sideValue, // SELL, BUY
            'type': type.toLocaleUpperCase (), // MARKET, LIMIT
            'clientOrderId': `CCXT_${this.uuid ()}`,
            'orderRespType': 'ACK',
            'positionSide': params.positionSide || (sideValue === 'BUY' ? 'LONG' : 'SHORT'),
            'isolated': params.isolated || false,
            'slTriggerPrice': params.slTriggerPrice || null,
            'slTriggerType': params.slTriggerType || null,
            'tpTriggerPrice': params.tpTriggerPrice || null,
            'tpTriggerType': params.tpTriggerType || null,
            'timeInForce': params.timeInForce || 'GTC',
        };
        if (type === 'Market') {
            request['timeInForce'] = null;
            request['price'] = null;
        }
        const response = await this.privatePostTradePlaceOrder (this.extend (request, params));
        // {
        //     "status": "0",
        //     "error": "OK",
        //     "data": {
        //       "orderId": "46021554552",
        //       "clientOrderId": "CCXT_018ff2a6-82bd-46ac-ac1a-95bd2254f70f",
        //       "symbol": "btcusdt",
        //       "isolated": true,
        //       "cumQty": "0.000000",
        //       "cumQuote": "0.000000",
        //       "executedQty": "0.000000",
        //       "avgPrice": "0.000000",
        //       "origQty": "0.001000",
        //       "price": "50000.000000",
        //       "side": "SELL",
        //       "positionSide": "SHORT",
        //       "timeInForce": "GTC",
        //       "origType": "LIMIT",
        //       "type": "LIMIT",
        //       "activatePrice": null,
        //       "priceRate": null,
        //       "timestamp": 1652004521408,
        //       "triggerPrice": "0.000000",
        //       "triggerType": "TRIGGER_NONE",
        //       "tpTriggerType": "MARK_PRICE",
        //       "tpTriggerPrice": "30000.000000",
        //       "slTriggerType": "MARK_PRICE",
        //       "slTriggerPrice": "60000.000000",
        //       "strategyParentId": "0",
        //       "status": "NEW"
        //     }
        // }
        const data = this.safeValue (response, 'data', {});
        return this.parseOrder (data, market);
    }

    async cancelOrder (id, symbol = undefined, params = {}) {
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
        }
        const symbolId = this.parseSymbol (symbol);
        await this.loadMarkets ();
        const market = this.market (symbolId);
        const request = {
            'symbol': market['id'],
            'orderId': id,
        };
        const response = await this.privateDeleteTradeCancelOrder (this.extend (request, params));
        // {
        //     "status": "0",
        //     "error": "OK",
        //     "data": {
        //         "orderId": "46016822947",
        //         "clientOrderId": "strategy_sub_46016822945_46016822947",
        //         "symbol": "btcusdt",
        //         "isolated": false,
        //         "cumQty": "0.000000",
        //         "cumQuote": "0.000000",
        //         "executedQty": "0.000000",
        //         "avgPrice": "0.000000",
        //         "origQty": "0.001000",
        //         "price": "0.000000",
        //         "side": "SELL",
        //         "positionSide": "LONG",
        //         "timeInForce": "IOC",
        //         "origType": "TAKE_PROFIT_MARKET",
        //         "type": "TAKE_PROFIT_MARKET",
        //         "activatePrice": null,
        //         "priceRate": null,
        //         "triggerPrice": "50000.000000",
        //         "triggerType": "LAST_PRICE",
        //         "tpTriggerType": "TRIGGER_NONE",
        //         "tpTriggerPrice": "0.000000",
        //         "slTriggerType": "TRIGGER_NONE",
        //         "slTriggerPrice": "0.000000",
        //         "strategyParentId": "46016822945",
        //         "status": "NEW"
        //     }
        // }
        if (response.status !== '0') {
            return response;
        }
        const data = this.safeValue (response, 'data', {});
        return this.parseOrder (data, market);
    }

    async cancelAllOrders (symbol = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'settleCcy': 'USDT',
        };
        // {
        //     data: {symbol: null}
        //     symbol: null
        //     error: "OK"
        //     status: 0
        // }
        return await this.privatePostTradeCancelAllOrder (this.extend (request, params));
    }

    async fetchOrder (id, symbol = undefined, params = {}) {
        const request = {
            'orderId': id,
        };
        const response = await this.privateGetAccountOrderDetail (this.extend (request, params));
        // {
        //     "status": "0",
        //     "error": "OK",
        //     "data": {
        //       "orderId": "45979094101",
        //       "symbol": "btcusdt",
        //       "type": "LIMIT",
        //       "origQty": "0.001",
        //       "executedQty": "0.000",
        //       "avlPrice": "0.0",
        //       "price": "50000.0",
        //       "fee": "0.00000000",
        //       "realizedPnl": "0.00000000",
        //       "timeInForce": "GTC",
        //       "isolated": false,
        //       "side": "SELL",
        //       "positionSide": "SHORT",
        //       "status": "CANCELED",
        //       "trades": [],
        //       "transactTime": "1651908682456",
        //       "baseCcy": "BTC",
        //       "quoteCcy": "USDT",
        //       "settledCcy": "USDT"
        //     }
        // }
        const data = this.safeValue (response, 'data', {});
        return this.parseOrder (data);
    }

    async fetchOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired (this.id + ' fetchOrders() requires a symbol argument');
        }
        const symbolId = this.parseSymbol (symbol);
        await this.loadMarkets ();
        const market = this.market (symbolId);
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['start'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.privateGetAccountOrderHistories (this.extend (request, params));
        // {
        //     "status": 0,
        //     "error": null,
        //     "data": {
        //       "rows": [
        //         {
        //           "orderId": 45979094101,
        //           "clientOrderId": "WEB_Ml6Zo-GV8HSq",
        //           "symbol": "btcusdt",
        //           "type": "LIMIT",
        //           "origQty": "0.001",
        //           "executedQty": "0.000",
        //           "avlPrice": "0.0",
        //           "price": "50000.0",
        //           "timeInForce": "GTC",
        //           "isolated": false,
        //           "side": "SELL",
        //           "positionSide": "SHORT",
        //           "transactTime": 1651908682456,
        //           "markPriceAtPlace": "35842.9",
        //           "lastPriceAtPlace": "35959.0",
        //           "status": "CANCELED",
        //           "closePosition": false,
        //           "triggerPrice": "0.0",
        //           "triggerType": "TRIGGER_NONE",
        //           "tpTriggerType": "TRIGGER_NONE",
        //           "tpTriggerPrice": "0.0",
        //           "slTriggerType": "TRIGGER_NONE",
        //           "slTriggerPrice": "0.0",
        //           "strategyParentId": 0,
        //           "liqCounterpartyType": "L_NONE",
        //           "baseCcy": "BTC",
        //           "settledCcy": "USDT"
        //         }
        //       ],
        //       "total": 1
        //     }
        // }
        const data = this.safeValue (response, 'data', {});
        const rows = this.safeValue (data, 'rows', []);
        return this.parseOrders (rows, market, since, limit);
    }

    async fetchOpenOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired (this.id + ' fetchOpenOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const symbolId = this.parseSymbol (symbol);
        const market = this.market (symbolId);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.privateGetAccountOpenOrders (this.extend (request, params));
        // {
        //     "status": "0",
        //     "error": "OK",
        //     "data": [
        //       {
        //         "orderId": "46016469910",
        //         "clientOrderId": "CCXT_789a8c13-96d7-4ed1-b0ff-9e5fd1ea6831",
        //         "symbol": "btcusdt",
        //         "type": "LIMIT",
        //         "origQty": "0.001",
        //         "executedQty": "0.000",
        //         "price": "50000.0",
        //         "timeInForce": "POST_ONLY",
        //         "isolated": true,
        //         "side": "SELL",
        //         "positionSide": "SHORT",
        //         "transactTime": "1651907590785",
        //         "status": "NEW",
        //         "markPriceAtPlace": "35813.2",
        //         "lastPriceAtPlace": null,
        //         "closePosition": false,
        //         "triggerPrice": "0.0",
        //         "triggerType": "TRIGGER_NONE",
        //         "tpTriggerType": "MARK_PRICE",
        //         "tpTriggerPrice": "30000.0",
        //         "slTriggerType": "MARK_PRICE",
        //         "slTriggerPrice": "60000.0",
        //         "strategyParentId": "0"
        //       }
        //     ]
        // }
        const data = this.safeValue (response, 'data', {});
        return this.parseOrders (data, market, since, limit);
    }

    async fetchClosedOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired (this.id + ' fetchClosedOrders() requires a symbol argument');
        }
        const symbolId = this.parseSymbol (symbol);
        await this.loadMarkets ();
        const market = this.market (symbolId);
        const request = {
            'symbol': market['id'],
            'status': 'CANCELED',
        };
        if (since !== undefined) {
            request['start'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.privateGetAccountOrderHistories (this.extend (request, params));
        // {
        //     "status": 0,
        //     "error": null,
        //     "data": {
        //       "rows": [     {
        //         "orderId": 45719135140,
        //         "clientOrderId": "liq_close_5cf4e09084b44f59a612fa78fd7bcb7c",
        //         "symbol": "btcusdt",
        //         "type": "LIQUIDATION",
        //         "origQty": "0.020",
        //         "executedQty": "0.020",
        //         "avlPrice": "36492.0",
        //         "price": "36210.979",
        //         "timeInForce": "IOC",
        //         "isolated": true,
        //         "side": "SELL",
        //         "positionSide": "LONG",
        //         "transactTime": 1651775063605,
        //         "markPriceAtPlace": "36352.5",
        //         "lastPriceAtPlace": "36573.0",
        //         "status": "FILLED",
        //         "closePosition": false,
        //         "triggerPrice": "0.0",
        //         "triggerType": "TRIGGER_NONE",
        //         "tpTriggerType": "TRIGGER_NONE",
        //         "tpTriggerPrice": "0.0",
        //         "slTriggerType": "TRIGGER_NONE",
        //         "slTriggerPrice": "0.0",
        //         "strategyParentId": 0,
        //         "liqCounterpartyType": "L_ORDER_BOOK",
        //         "baseCcy": "BTC",
        //         "settledCcy": "USDT"
        //       },],
        //       "total": 430
        //     }
        // }
        const data = this.safeValue (response, 'data', {});
        const rows = this.safeValue (data, 'rows', []);
        return this.parseOrders (rows, market, since, limit);
    }

    async fetchMyTrades (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired (this.id + ' fetchMyTrades() requires a symbol argument');
        }
        await this.loadMarkets ();
        const symbolId = this.parseSymbol (symbol);
        const market = this.market (symbolId);
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['start'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.privateGetAccountTradeHistories (this.extend (request, params));
        // {
        //     "status": 0,
        //     "error": null,
        //     "data": {
        //       "rows": [{
        //         "tradeId": 246864319,
        //         "userId": 100177,
        //         "orderId": 45719135140,
        //         "symbol": "btcusdt",
        //         "side": "SELL",
        //         "positionSide": "LONG",
        //         "fee": "0.00000000",
        //         "lastQty": "0.020",
        //         "lastPrice": "36492.0",
        //         "realizedPnl": "-30.88000000",
        //         "isolated": true,
        //         "liquidationType": "L_ORDER_BOOK",
        //         "baseCcy": "BTC",
        //         "settledCcy": "USDT",
        //         "transactionTime": 1651775063605,
        //         "maker": false
        //       },],
        //       "total": 1334
        //     }
        // }
        const data = this.safeValue (response, 'data', {});
        const rows = this.safeValue (data, 'rows', []);
        return this.parseMyTrades (rows, market, since, limit);
    }

    async fetchDepositAddress (code, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'currency': currency['id'],
        };
        const defaultNetworks = this.safeValue (this.options, 'defaultNetworks');
        const defaultNetwork = this.safeStringUpper (defaultNetworks, code);
        const networks = this.safeValue (this.options, 'networks', {});
        let network = this.safeStringUpper (params, 'network', defaultNetwork);
        network = this.safeString (networks, network, network);
        if (network === undefined) {
            request['chainName'] = currency['id'];
        } else {
            request['chainName'] = network;
            params = this.omit (params, 'network');
        }
        const response = await this.privateGetWalletDepositAddress (this.extend (request, params));
        // {
        //     "status": 0,
        //     "error": "OK",
        //     "data": [
        //       {
        //         "chain": "ERC20",
        //         "address": "0x4015534850f3756e99fe580180e51c7a47e39ea8",
        //         "maintain": true
        //       }
        //     ]
        // }
        const data = this.safeValue (response, 'data', {})[0];
        const address = this.safeString (data, 'address');
        const chain = this.safeString (data, 'chain');
        this.checkAddress (address);
        return {
            'network': chain,
            'currency': code,
            'address': address,
            'info': data,
        };
    }

    async fetchDeposits (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const response = await this.privateGetWalletDepositRecords (params);
        // {
        //     "status": 0,
        //     "error": null,
        //     "data": {
        //       "rows": [
        //         {
        //           "id": 364,
        //           "userId": 100177,
        //           "currency": "USDT",
        //           "address": "TWZ8CxmCBy8g5s8CPNhgvqs53QnRW2oPEh",
        //           "chain": "TRC20",
        //           "tag": null,
        //           "amount": "10.13",
        //           "confirmations": 13,
        //           "minConfirmations": 12,
        //           "type": "DEPOSIT",
        //           "txId": "f7494c8bfb7ace290362dc0935888bc50603c02d05b969d099f860886777aad7",
        //           "status": "Complete",
        //           "time": 1631522282000
        //         }
        //       ],
        //       "total": 1
        //     }
        // }
        const data = this.safeValue (response, 'data', {});
        const rows = this.safeValue (data, 'rows', {});
        return this.parseTransactions (rows, currency, since, limit);
    }

    parseTransactionStatus (status) {
        const statuses = {
            'Success': 'ok',
            'Succeed': 'ok',
        };
        return this.safeString (statuses, status, status);
    }

    parseTransaction (transaction, currency = undefined) {
        const id = this.safeString (transaction, 'id');
        const address = this.safeString (transaction, 'address');
        const tag = undefined;
        const txid = this.safeString (transaction, 'txId');
        const currencyId = this.safeString (transaction, 'currency');
        currency = this.safeCurrency (currencyId, currency);
        const code = currency['code'];
        const timestamp = this.safeInteger (transaction, 'time');
        let type = this.safeStringLower (transaction, 'type');
        const feeCost = this.parseNumber (this.safeString (transaction, 'fee'));
        let fee = undefined;
        if (feeCost !== undefined) {
            type = 'withdrawal';
            fee = {
                'cost': feeCost,
                'currency': code,
            };
        }
        const status = this.parseTransactionStatus (this.safeString (transaction, 'status'));
        const amount = this.parseNumber (this.safeString (transaction, 'amount'));
        return {
            'info': transaction,
            'id': id,
            'txid': txid,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'network': this.safeString (transaction, 'chain'),
            'address': address,
            'addressTo': address,
            'addressFrom': undefined,
            'tag': tag,
            'tagTo': tag,
            'tagFrom': undefined,
            'type': type,
            'amount': amount,
            'currency': code,
            'status': status,
            'updated': undefined,
            'fee': fee,
        };
    }

    async fetchPositions (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {};
        const response = await this.privateGetAccountCurrentPositions (this.extend (request, params));
        // {
        //     "status": "0",
        //     "error": "OK",
        //     "data": [
        //       {
        //         "symbol": "btcusdt",
        //         "positionSide": "LONG",
        //         "isolated": false,
        //         "avgEntryPrice": "35907.49953800",
        //         "quantity": "0.01300000",
        //         "markPrice": "34112.0",
        //         "isolatedMargin": "0.00000000",
        //         "frozenMargin": "0.00000000",
        //         "margin": "",
        //         "liqPrice": "",
        //         "lastFundingTime": "0",
        //         "lastTxTime": "1651907743728",
        //         "baseCurrency": "BTC",
        //         "quoteCurrency": "USDT",
        //         "settleCurrency": "USDT",
        //         "curTermRealisedPnl": "0.00000000",
        //         "curTermFirstOrderId": "45844695358",
        //         "cumRealizedPnl": "-9628.25998900",
        //         "arenaTrade": null
        //       }
        //     ]
        // }
        const positions = this.safeValue (response, 'data', {});
        const result = [];
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i];
            result.push (this.parsePosition (position));
        }
        return this.filterByArray (result, 'symbol', symbols, false);
    }

    parsePosition (position, market = undefined) {
        const marketId = this.safeString (position, 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const margin = this.safeString (position, 'margin');
        const positionSide = this.safeStringLower (position, 'positionSide');
        const marginType = this.safeString (position, 'isolated') === 'true' ? 'isolated' : 'cross';
        const timestamp = this.parseNumber (this.safeString (position, 'lastTxTime'));
        const qty = this.parseNumber(this.safeString(position, 'quantity'));
        const entryPrice = this.parseNumber (this.safeString (position, 'avgEntryPrice'));
        const markPrice = this.parseNumber (this.safeString (position, 'markPrice'));
        const notional = qty * markPrice;
        const sign = positionSide === 'long' ? 1 : -1;
        const unrealizedPnl = (markPrice - entryPrice) * qty * sign;
        return {
            'info': position,
            'symbol': symbol,
            'positionSide': positionSide,
            'quantity': qty,
            'unrealizedPnl': unrealizedPnl,
            'margin': this.parseNumber (margin),
            'notional': notional,
            'markPrice': this.parseNumber (this.safeString (position, 'markPrice')),
            'entryPrice': entryPrice,
            'timestamp': timestamp,
            'initialMargin': marginType === 'isolated' ? this.safeString (position, 'isolatedMargin') : undefined,
            'datetime': this.iso8601 (timestamp),
            'marginType': marginType,
        };
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const query = this.omit (params, this.extractParams (path));
        const requestPath = '/' + this.implodeParams (path, params);
        let url = requestPath;
        let queryString = '';
        if (method === 'GET') {
            if (Object.keys (query).length) {
                queryString = this.urlencodeWithArrayRepeat (query);
                url += '?' + queryString;
            }
        }
        if (api === 'private') {
            this.checkRequiredCredentials ();
            const timestamp = this.milliseconds ();
            const xFairdeskRequestExpiry = this.safeInteger (this.options, 'x-fairdesk-request-expiry', 60);
            const expiry = this.sum (timestamp, xFairdeskRequestExpiry * 1000);
            const expiryString = expiry.toString ();
            headers = {
                'x-fairdesk-access-key': this.apiKey,
                'x-fairdesk-request-expiry': expiryString,
            };
            let payload = '';
            if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
                payload = this.json (params);
                body = payload;
                headers['Content-Type'] = 'application/json';
            }
            const auth = '/api/v1/private' + requestPath + queryString + expiryString + payload;
            headers['x-fairdesk-request-signature'] = this.hmac (this.encode (auth), this.encode (this.secret));
        }
        url = this.implodeHostname (this.urls['api'][api]) + url;
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    async setLeverage (leverage, symbol = undefined, params = {}) {
        // WARNING: THIS WILL INCREASE LIQUIDATION PRICE FOR OPEN ISOLATED LONG POSITIONS
        // AND DECREASE LIQUIDATION PRICE FOR OPEN ISOLATED SHORT POSITIONS
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired (this.id + ' setLeverage() requires a symbol argument');
        }
        await this.loadMarkets ();
        const symbolId = this.parseSymbol (symbol);
        const market = this.market (symbolId);
        if ((this.parseNumber (leverage) < 1) || (this.parseNumber (leverage) > this.parseNumber (market.info['maxLeverage']))) {
            throw new errors.BadRequest (this.id + ' ' + symbol + ' leverage should be between 1 and ' + market.info['maxLeverage']);
        }
        const request = {
            'symbol': market['id'],
            'leverage': leverage,
            'isolated': params.isolated || false,
        };
        const response = await this.privatePutAccountConfigAdjustLeverage (this.extend (request, params));
        // {
        //     status: '0',
        //     error: 'OK',
        //     data: {
        //       symbol: null,
        //       isolated: false,
        //       leverage: '50',
        //       maxNotionalValue: '0'
        //     }
        // }
        return response;
    }

    handleErrors (httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return;
        }
        const errorCode = this.safeString (response, 'status');
        const message = this.safeString (response, 'error');
        if ((errorCode !== undefined) && (errorCode !== '0')) {
            const feedback = this.id + ' ' + body;
            this.throwExactlyMatchedException (this.exceptions['exact'], errorCode, feedback);
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, feedback);
            throw new errors.ExchangeError (feedback);
        }
    }
}

module.exports = fairdesk;
