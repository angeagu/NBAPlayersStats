define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/query",
        "dojox/mobile/ListItem",
        "dojox/mobile/EdgeToEdgeStoreList",
        "dojox/mobile/FilteredListMixin",
        "dojox/mobile/LongListMixin",
        'dojox/mobile/ScrollableView',
        'dojox/mobile/ProgressIndicator',
        'dojox/widget/Standby',
        "dojo/store/Memory",
        "dojo/i18n!nba-player-stats/nls/players",
        "nba-player-stats/widgets/helpUtils",
        "nba-player-stats/config/appConfig"
    ],
    function (declare, array, domClass, domConstruct, query, ListItem, EdgeToEdgeStoreList, FilteredListMixin, LongListMixin, ScrollableView, ProgressIndicator, Standby, Memory, nls, helpUtils, appConfig) {

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
                this.setHeader();
                this.standby.target = this.container.domNode;
                this.standby.show();
                _t.createList();
            },

            beforeDeactivate: function () {
                var _t = this;
                if (this.storeList && this.storeList.getChildren().length != 0) {
                    var children = this.storeList.getChildren();
                    array.forEach(children, function (child) {
                        _t.storeList.removeChild(child);
                    });
                }

                domConstruct.destroy(_t.blankDiv);
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
                if (!this.storeList) {
                    this.storeList = new declare([EdgeToEdgeStoreList, FilteredListMixin, LongListMixin])({
                        placeHolder: nls.search,
                        store: emptyStore,
                        pageSize: 50
                    }, this.playerList);
                    setTimeout(function(){
                        _t.storeList.set("store", _t.loadedStores.playerList);
                        _t.storeList.refresh();
                        //Styling Search Menu Items
                        if (_t.storeList.getChildren().length != 0) {
                            array.forEach(_t.storeList.getChildren(), function (children) {
                                domClass.add(children.domNode, "nbaPlayerStatsSearchMenuItem");
                            });
                        }
                        _t.standby.hide();

                    },500);
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
                        _t.standby.hide();
                    },500);
                }
                this.storeList.startup();
                this.storeList.getFilterBox().set("queryExpr", "*${0}*");
                //Place FilterBox
                var filterBox = this.storeList.getFilterBox();
                domClass.add(filterBox.domNode, "playerSearchField")
                this.blankDiv = domConstruct.create("div", {});
                this.blankDiv.innerHTML = '<br>'
                domConstruct.place(this.blankDiv, filterBox.domNode, "after");

                var customizablePlayerListData = [];
                var idx = 0;
                this.loadedStores.playerList.query().forEach(function(player) {
                    customizablePlayerListData.push({id: idx, playerId: player.playerid})
                    idx = idx + 1;
                });
                this.loadedStores.customizablePlayerList.setData(customizablePlayerListData);

                console.log('End of Create list')
            }

        };
    }
);
