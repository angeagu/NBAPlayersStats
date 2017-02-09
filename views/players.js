define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/query",
        "dojo/on",
        "dojox/mobile/ListItem",
        "dojox/mobile/EdgeToEdgeStoreList",
        "dojox/mobile/FilteredListMixin",
        "dojox/mobile/LongListMixin",
        'dojox/mobile/ScrollableView',
        'dojox/mobile/ProgressIndicator',
        "dojo/store/Memory",
        "dojo/i18n!nba-player-stats/nls/players",
        "nba-player-stats/widgets/helpUtils",
        "nba-player-stats/widgets/LocalStore",
        "nba-player-stats/config/appConfig"
    ],
    function (declare, array, domClass, domConstruct, query, on, ListItem, EdgeToEdgeStoreList, FilteredListMixin, LongListMixin, ScrollableView, ProgressIndicator, Memory, nls, helpUtils, LocalStore, appConfig) {

        return {

            playerArray: [],
            teams: [],
            rowSet: [],
            dataReady: false,
            playoffsEnabled: true,
            playerStore: null,
            teamsStore: null,

            beforeActivate: function () {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                //this.searchTextBox.set('value','');
                //this.searchTextBox.set('placeHolder','Search');
                //this.configureSearchBox();
                this.setHeader();
                this.loadProgressIndicator();
                _t.createList();
            },

            beforeDeactivate: function () {
                /*
                var _t = this;
                if (this.storeList && this.storeList.getChildren().length != 0) {
                    var children = this.storeList.getChildren();
                    array.forEach(children, function (child) {
                        _t.storeList.removeChild(child);
                    });
                }
                */
                var emptyStore = new Memory({data: [], idProperty: "label"});
                this.storeList.set("store", emptyStore);
                this.storeList.refresh();
                this.filterBox.set('value','');

            },
            configureSearchBox: function() {
                var _t = this;
                this.searchTextBox.set('placeHolder','Search');
                if (!this.keyUpHandler) {
                    this.keyUpHandler = on(this.searchTextBox,'keyup',function(evt) {
                        var value = _t.searchTextBox.get('value').toUpperCase();
                        if (value.length > 0) {
                            var localStore = new LocalStore({store_name: 'aux'});
                            localStore.setData([]);
                            _t.loadedStores.playerList.query().forEach(function(player) {
                                if (player.name.toUpperCase().indexOf(value)!=-1) {
                                    localStore.add(player)
                                }
                            });
                            _t.storeList.set("store", localStore);
                        }
                        else {
                            _t.storeList.set("store", _t.loadedStores.playerList);
                        }
                        _t.storeList.refresh();
                    });
                }
            },
            loadProgressIndicator: function () {
                this.prog = ProgressIndicator.getInstance();
                this.divProgress.addChild(this.prog);
                this.prog.start();
                this.container.domNode.style.opacity = '0.5';
            },

            closeProgressIndicator: function () {
                this.prog.stop();
                this.container.domNode.style.opacity = '1';
            },

            setHeader: function () {
                var icon;
                array.forEach(this.config.mainMenu, function (item) {
                    if (item.target == 'players') {
                        icon = item.icon;
                    }
                })
                this.playerSearchHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.playerListHeader);
                this.playerSearchHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },

            createList: function() {
                var _t = this;
                //Set up initially empty store to improve list creation speed
                var emptyStore = new Memory({data: [{label: "Loading players..."}], idProperty: "label"});
                //Create playerList.
                this.storeList = new declare([EdgeToEdgeStoreList, LongListMixin,FilteredListMixin])(
                        {filterBoxRef: this.filterBox, placeHolder: 'Search', store: emptyStore});
                this.storeList.placeAt(this.playerListView);
                this.storeList.startup();
                setTimeout(function(){
                    _t.storeList.set("store", _t.loadedStores.playerList);
                    _t.storeList.refresh();
                    //Styling Search Menu Items
                    if (_t.storeList.getChildren().length != 0) {
                        array.forEach(_t.storeList.getChildren(), function (children) {
                            domClass.add(children.domNode, "nbaPlayerStatsSearchMenuItem");
                        });
                    }
                    _t.closeProgressIndicator();
                },500);
                /*
                if (!this.storeList) {
                    this.storeList = new declare([EdgeToEdgeStoreList, FilteredListMixin, LongListMixin])({
                        placeHolder: nls.search,
                        store: emptyStore,
                        pageSize: 50
                    }, this.playerList);
                    
                    
                }
                else {
                    this.storeList.set("store", emptyStore);
                    this.storeList.refresh();
                    setTimeout(function(){
                        _t.storeList.set("store", _t.loadedStores.playerList);
                        _t.storeList.refresh();
                        //Styling Search Menu Items
                        if (_t.storeList.getChildren().length != 0) {
                            array.forEach(_t.storeList.getChildren(), function (children) {
                                domClass.add(children.domNode, "nbaPlayerStatsSearchMenuItem");
                            });
                        }
                        _t.closeProgressIndicator();
                    },500);
                }
                this.storeList.startup();
                */

                this.storeList.getFilterBox().set("queryExpr", "*${0}*");
                //Place FilterBox
                var filterBox = this.storeList.getFilterBox();
                domClass.add(filterBox.domNode, "playerSearchField")
                /*
                this.blankDiv = domConstruct.create("div", {});
                this.blankDiv.innerHTML = '<br>'
                domConstruct.place(this.blankDiv, filterBox.domNode, "after");
                */

                var customizablePlayerListData = [];
                var idx = 0;
                this.loadedStores.playerList.query().forEach(function(player) {
                    customizablePlayerListData.push({id: idx, playerId: player.playerid})
                    idx = idx + 1;
                });
                this.loadedStores.customizablePlayerList.setData(customizablePlayerListData);
                setTimeout(function() {
                    window.scrollTo(0, 0);
                })

            }

        };
    }
);
