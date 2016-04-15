define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojox/mobile/ListItem",
        "dojox/mobile/EdgeToEdgeStoreList",
        "dojox/mobile/FilteredListMixin",
        'dojox/mobile/ScrollableView',
        "nba-player-stats/config/appConfig",
        "dojo/i18n!nba-player-stats/nls/favorites"
    ],
    function (declare, array, domConstruct, ListItem, EdgeToEdgeStoreList, FilteredListMixin, ScrollableView, appConfig, nls) {
        var FavoritesListItem = declare(ListItem, {
            clickable: true,
            postMixInProperties: function () {
                this.inherited(arguments);
                this.transitionOptions = {
                    params: {}
                }
            }
        });

        return {

            beforeActivate: function () {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer]
                this.setHeader();
                var idxPlayer = 0;
                var idxTeam = 0;
                var favorites = this.loadedStores.favorites.query({}, {sort: [{attribute: 'name'}]});
                this.loadedStores.customizablePlayerList.setData([]);
                this.loadedStores.teamList.setData([]);

                array.forEach(favorites, function (favorite) {
                    if (favorite['name']) {
                        var listItem = new FavoritesListItem()
                        listItem.labelNode.style.height = '0px';
                        var divLabel = domConstruct.create("div", {
                            className: "nbaPlayerStatsMenuItem",
                            layout: "left"
                        }, listItem.domNode);
                        var player_name = favorite['name'];
                        divLabel.innerHTML = player_name;

                        var params = {};
                        //Set Target
                        if (favorite.acronym) {
                            //Target
                            listItem.target= "teamStats",
                            params.acronym = encodeURIComponent(favorite.acronym);
                            params.teamName = encodeURIComponent(favorite.name);
                            listItem.icon = require.toUrl("nba-player-stats") + '/icons/' + favorite.acronym + '.gif';

                            _t.loadedStores.teamList.put({
                                id: idxTeam,
                                acronym: favorite.acronym,
                                teamName: favorite.name
                            })
                            idxTeam = idxTeam + 1;
                        }
                        else {
                            //Target
                            listItem.target= "playerDetail",
                            //Set params
                            params.playerId = encodeURIComponent(favorite['playerid']);
                            listItem.icon = require.toUrl("nba-player-stats") + '/icons/' + favorite.team + '.gif';

                            //Add to store
                            _t.loadedStores.customizablePlayerList.put({
                                id: idxPlayer,
                                name: player_name,
                                playerId: params.playerId
                            });
                            idxPlayer = idxPlayer + 1;

                        }
                        listItem.transitionOptions = {params: params};

                        _t.favorites_list.addChild(listItem);


                    }
                });

            },

            setHeader: function () {
                //Set header
                var icon;
                array.forEach(this.config.mainMenu, function (item) {
                    if (item.target == 'favorites') {
                        icon = item.icon;
                    }
                })
                this.favoritesHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.favoritesListHeader);
                this.favoritesHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },

            beforeDeactivate: function () {
                var _t = this;
                if (this.favorites_list.getChildren().length != 0) {
                    var children = this.favorites_list.getChildren();
                    array.forEach(children, function (child) {
                        _t.favorites_list.removeChild(child);
                    })
                }
            }


        };
    }
);