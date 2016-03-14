define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojox/mobile/ListItem",
        "dojox/mobile/EdgeToEdgeStoreList",
        "dojox/mobile/FilteredListMixin",
        'dojox/mobile/ScrollableView',
        "nba-player-stats/widgets/helpUtils",
        "dojo/i18n!nba-player-stats/nls/teams",
        "dojo/store/Memory",
        "nba-player-stats/config/appConfig"
    ],
    function (declare, array, domClass, domConstruct,ListItem, EdgeToEdgeStoreList, FilteredListMixin, ScrollableView, helpUtils, nls, Memory, appConfig) {

        return {

            teams: [],

            beforeActivate: function () {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                this.setHeader();
                this.getTeams();
                this.createList();
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
                    if (item.target == 'teams') {
                        icon = item.icon;
                    }
                })
                this.teamSearchHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.teamListHeader);
                this.teamSearchHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },

            getTeams: function() {
                this.teams = helpUtils.getTeams();

                //Set acronym in params.
                array.forEach(this.teams,function(team) {
                    team.icon = require.toUrl("nba-player-stats") + '/icons/' + team.acronym+ '.gif';
                    var params = {
                        acronym: team.acronym,
                        teamName: team.label
                    };
                    team.transitionOptions = {};
                    team.transitionOptions.params = params;

                });

                this.teams.sort(function (teamA, teamB) {
                    if (teamA.label < teamB.label) return -1;
                    if (teamA.label > teamB.label) return 1;
                    return 0;
                });
            },

            createList: function() {
                //Create Store for EdgeToEdgeStoreList
                var sampleStore = new Memory({data: this.teams, idProperty: "label"});
                if (!this.storeList) {
                    this.storeList = new declare([EdgeToEdgeStoreList, FilteredListMixin])({
                        placeHolder: nls.search,
                        store: sampleStore
                    }, this.teamList);
                }
                else {
                    this.storeList.set("store", sampleStore);
                    this.storeList.refresh();

                }
                this.storeList.startup();
                this.storeList.getFilterBox().set("queryExpr", "*${0}*");
                //Place FilterBox
                var filterBox = this.storeList.getFilterBox();
                domClass.add(filterBox.domNode, "stationSearchField")
                this.blankDiv = domConstruct.create("div", {});
                this.blankDiv.innerHTML = '<br>'
                domConstruct.place(this.blankDiv, filterBox.domNode, "after");

                //Styling Search Menu Items
                if (this.storeList.getChildren().length != 0) {
                    array.forEach(this.storeList.getChildren(), function (children) {
                        domClass.add(children.domNode, "nbaPlayerStatsSearchMenuItem");
                    });
                }
            }

        };
    }
);
