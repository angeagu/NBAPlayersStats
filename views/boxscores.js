define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojox/mobile/ListItem",
        "dojox/mobile/EdgeToEdgeStoreList",
        'dojox/mobile/ScrollableView',
        "dojox/mobile/ProgressIndicator",
        "nba-player-stats/config/appConfig",
        "nba-player-stats/widgets/helpUtils",
        "dojo/i18n!nba-player-stats/nls/boxscores"
    ],
    function (declare, array, domConstruct, ListItem, EdgeToEdgeStoreList, ScrollableView, ProgressIndicator, appConfig, helpUtils, nls) {
        var BoxscoreListItem = declare(ListItem, {
            target: "boxscoreDetail",
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
                this.config = appConfig[appConfig.selectedCustomer];
                this.setHeader();

                helpUtils.getJsonData(this.config.gameLog).then(function (response) {
                    var resultSets = response.resultSets[0];
                    _t.completeBoxscoreList = resultSets.rowSet;
                        helpUtils.getJsonData(_t.config.gameLogPlayoff).then(function (response) {
                            console.log('BoxscorePlayoff response: ' + JSON.stringify(response));
                            var resultSets2 = response.resultSets[0];
                            var rowSet2 = resultSets2.rowSet;
                            console.log('Rowset2: ' + JSON.stringify(rowSet2))
                            _t.completeBoxscoreList.push.apply(_t.completeBoxscoreList, rowSet2);
                            _t.updateBoxscoreList();
                            _t.datePicker.onDaySet = function () {
                                _t.updateBoxscoreList();
                            };
                            _t.datePicker.onMonthSet = function () {
                                _t.updateBoxscoreList();
                            };
                            _t.datePicker.onYearSet = function () {
                                _t.updateBoxscoreList();
                            };
                        });

                });

            },

            updateBoxscoreList: function () {
                var _t = this;
                this.loadProgressIndicator();
                var date = this.datePicker.get('value');


                this.clearBoxscoreList();

                var boxscores = this.completeBoxscoreList.filter(function (game) {
                    return (game[6].indexOf('vs.') != -1 && game[5] == date);
                })

                if (boxscores.length>0) {
                    var idx=0;
                    this.loadedStores.boxscoreList.setData([]);
                    array.forEach(boxscores, function (boxscore) {
                        var tokens = boxscore[6].split(' ');
                        var homeTeam = tokens[0];
                        var awayTeam = tokens[2];
                        var homeTeamIcon = '';
                        var awayTeamIcon = '';

                        _t.teams = helpUtils.getTeams();
                        //Set acronym in params.
                        array.forEach(_t.teams, function (team) {
                            if (team.acronym == homeTeam) {
                                homeTeamIcon = require.toUrl("nba-player-stats") + '/icons/' + team.acronym + '.gif';
                            }
                            else if (team.acronym == awayTeam) {
                                awayTeamIcon = require.toUrl("nba-player-stats") + '/icons/' + team.acronym + '.gif';
                            }
                        });

                        var listItem = new BoxscoreListItem();
                        listItem.labelNode.style.height = '0px';
                        var label = domConstruct.create("div", {
                            className: "boxscorePlayerStatsMenuItemNoFloatNormalWidth",
                            layout: "left"
                        }, listItem.domNode);

                        var content = '<img src="' + awayTeamIcon + '" </img>&nbsp;&nbsp;';
                        content += awayTeam + '  at  ';
                        content += homeTeam + '&nbsp;&nbsp;';
                        content += content = '<img src="' + homeTeamIcon + '" </img>&nbsp;&nbsp;';
                        label.innerHTML = content;

                        var params = {
                            gameId: boxscore[4]
                        }
                        listItem.transitionOptions = {params: params};

                        _t.boxscoreList.addChild(listItem);

                        //Add to boxscoreStore
                        _t.loadedStores.boxscoreList.put({
                            id: idx,
                            gameId: boxscore[4]
                        });
                        idx = idx + 1;

                    })
                    this.closeProgressIndicator();

                }
                else {
                    var listItem = new BoxscoreListItem();
                    listItem.labelNode.style.height = '0px';
                    var label = domConstruct.create("div", {
                        className: "boxscorePlayerStatsMenuItemNoFloatNormalWidth",
                        layout: "left"
                    }, listItem.domNode);

                    var content = '<span class="infoClass">No finished games yet</span>';
                    label.innerHTML = content;
                    listItem.clickable = false;
                    this.boxscoreList.addChild(listItem);
                    this.closeProgressIndicator();
                }



            },

            setHeader: function () {
                //Set header
                var icon;
                array.forEach(this.config.mainMenu, function (item) {
                    if (item.target == 'boxscores') {
                        icon = item.icon;
                    }
                })
                this.boxscoresHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.boxscoresHeading);
                this.boxscoresHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },

            loadProgressIndicator: function () {
                this.prog = ProgressIndicator.getInstance();
                this.divProgress.addChild(this.prog);
                this.prog.start();
                this.boxscoreList.domNode.style.opacity = '0.5';
            },

            closeProgressIndicator: function () {
                this.prog.stop();
                this.boxscoreList.domNode.style.opacity = '1';
            },

            clearBoxscoreList: function() {
                var _t = this;
                if (this.boxscoreList.getChildren().length != 0) {
                    var children = this.boxscoreList.getChildren();
                    array.forEach(children, function (child) {
                        _t.boxscoreList.removeChild(child);
                    })
                }
            },

            beforeDeactivate: function () {
                this.clearBoxscoreList();
            }


        };
    }
);