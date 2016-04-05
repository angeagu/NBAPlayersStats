define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/promise/all",
        "dojox/mobile/Pane",
        "dojox/mobile/ProgressIndicator",
        "dojox/gesture/swipe",
        'dojo/dom-geometry',
        'dojo/on',
        'dojo/window',
        "nba-player-stats/config/appConfig",
        "nba-player-stats/widgets/helpUtils",
        'dojo/i18n!nba-player-stats/nls/playerDetail',
        'dojo/domReady!'
    ],
    function (declare, array, all, Pane, ProgressIndicator, swipe, domGeometry, on, winRef, appConfig, helpUtils, nls) {

        return {
            beforeActivate: function () {

                this.loadPlayerData();

            },

            loadPlayerData: function (playerId) {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                this.panes = [];
                this.clearPlayerViewHeader();
                this.loadProgressIndicator();

                this.tabButtonSeason.set('selected', true);
                if (this.tabButtonSeasonHandler) {
                    this.tabButtonSeasonHandler.remove();
                }
                if (this.tabButtonCareerHandler) {
                    this.tabButtonCareerHandler.remove();
                }
                this.tabButtonSeasonHandler = on(this.tabButtonSeason, 'click', function (evt) {
                    _t.loadProgressIndicator();
                    _t.createStatsPane();
                })
                this.tabButtonCareerHandler = on(this.tabButtonCareer, 'click', function (evt) {
                    _t.loadProgressIndicator();
                    _t.getPlayerCareerInfo();
                })

                if (!playerId) {
                    this.playerId = decodeURIComponent(decodeURIComponent(this.params.playerId)); //Double decoding to avoid errors on user reloading playerDetail view.
                }
                else {
                    this.playerId = playerId;
                }

                console.log('Load Player Data')
                this.loadedStores.playerList.query({playerid: this.playerId}).forEach(function (jugador) {
                    _t.jugador = jugador;
                    var playerHeaderText = '<div class="playerDetailHeaderClass">' + jugador.name;
                    _t.playerHeader.innerHTML = playerHeaderText;
                    _t.playerHeader.style['background-color'] = _t.config.header.mainMenuHeaderColor;
                    _t.getPlayerInfo();

                });

                this.setHeader();
                this.getPreviousAndNextPlayers();
                this.checkFavorite();
                this.setEventListeners();
                winRef.scrollIntoView(this.headingPlayerDetail.domNode);
                this.closeProgressIndicator();

            },

            setHeader: function () {

                this.headingPlayerDetail.domNode.style.backgroundColor = this.config.header.headerColor;
                this.headingPlayerDetail.labelNode.style.display = 'inline';
                this.headingPlayerDetail.labelNode.innerHTML = '<span class="nbaPlayerStatsHeaderIcon"></span>&nbsp; Player Stats';
            },

            loadProgressIndicator: function () {
                this.prog = ProgressIndicator.getInstance();
                this.divProgress.addChild(this.prog);
                this.prog.start();
                this.detail.domNode.style.opacity = '0.5';
            },

            closeProgressIndicator: function () {
                this.prog.stop();
                this.detail.domNode.style.opacity = '1';
            },

            getPlayerInfo: function () {
                var _t = this;
                helpUtils.getJsonData("http://stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID=" + this.playerId + "&SeasonType=Regular+Season").then(function (response) {
                    var resultSets = response.resultSets[0];
                    var rowSet = resultSets.rowSet[0];

                    var birthdate = new Date(rowSet[6]);
                    _t.jugador.birthdate = birthdate.getMonth() + 1 + '/' + birthdate.getDate() + '/' + birthdate.getFullYear();
                    _t.jugador.from = rowSet[9];
                    _t.jugador.country = rowSet[8];
                    _t.jugador.height = rowSet[10];
                    _t.jugador.weight = rowSet[11];
                    _t.jugador.number = rowSet[13];
                    _t.jugador.numSeasons = rowSet[12];
                    _t.jugador.position = rowSet[14];

                    //Create PlayerView Header.
                    _t.createPlayerViewHeader();
                    //Create Stats Pane.
                    _t.createStatsPane();
                });
            },

            createPlayerViewHeader: function () {
                var _t = this;
                var content = '<table style="width: 95%;margin: 5px;">';
                content += '<tr>';
                content += '<td style="width: 33%;"><div class="infoClass playerStationDataTimestamp" style="text-align: right !important;">' + '#' + this.jugador.number + '<br><span>' + this.jugador.team + '<br>' + this.jugador.birthdate + '<br>' + this.jugador.country + '</span>' + '</div></td>'
                content += '<td style="width: 33%;">'
                content += '<div class="infoClass playerStationDataTimestamp" style="text-align: center !important;">'
                content += '<img src="http://stats.nba.com/media/players/230x185/' + this.jugador.playerid + '.png" height="72px", width="90px"></img>';
                content += '</div>';
                content += '</td>';
                content += '<td style="width: 33%;"><div class="infoClass detailPlayerDataTimestamp" style="text-align: left !important;"><span>' + this.jugador.position + '<br>' + this.jugador.weight + ' lbs/' + this.jugador.height + '<br>Exp:' + this.jugador.numSeasons + ' years<br>From: ' + this.jugador.from + '</span>';
                content += '</div>';
                content += '</td>';
                content += '</tr>';
                content += '</table>';
                var pane = new Pane({
                    innerHTML: content
                });

                _t.playerViewHeader.addChild(pane);
            },

            createStatsPane: function () {
                var _t = this;
                var content = '';
                content += '<table style="width: 95%;margin: 5px;">';
                //Header
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1"></div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + 'Season' + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + 'Playoff' + '</div></td>';
                content += '</tr>';
                //Games
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Games' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.games + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.gamesPlayoff + '</div></td>';
                content += '</tr>';
                //Minutes
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Minutes' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.minutes + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.minutesPlayoff + '</div></td>';
                content += '</tr>';
                //Points
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Points' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.points + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.pointsPlayoff + '</div></td>';
                content += '</tr>';
                //Rebounds
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Rebounds' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.rebounds + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.reboundsPlayoff + '</div></td>';
                content += '</tr>';
                //Assists
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Assists' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.assists + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.assistsPlayoff + '</div></td>';
                content += '</tr>';
                //Steals
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Steals' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.steals + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.stealsPlayoff + '</div></td>';
                content += '</tr>';
                //Turnovers
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Turnovers' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.turnovers + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.turnoversPlayoff + '</div></td>';
                content += '</tr>';
                //Blocks
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Blocks' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.blocks + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.blocksPlayoff + '</div></td>';
                content += '</tr>';
                //FG
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'FG %' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.fg_pct + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.fg_pctPlayoff + '</div></td>';
                content += '</tr>';
                //F3G
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + '3PT FG %' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.fg3_pct + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.fg3_pctPlayoff + '</div></td>';
                content += '</tr>';
                //FT
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'FT %' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.ft_pct + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.ft_pctPlayoff + '</div></td>';
                content += '</tr>';
                //EFFICIENCY
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Efficiency' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.efficiency + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.efficiencyPlayoff + '</div></td>';
                content += '</tr>';
                //OREB
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Off. Reb.' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.oreb + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.orebPlayoff + '</div></td>';
                content += '</tr>';
                //DREB
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Def. Reb.' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.dreb + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.drebPlayoff + '</div></td>';
                content += '</tr>';
                //AST/TOV
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Ast/Tov' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.assistsPerTurnover + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.assistsPerTurnoverPlayoff + '</div></td>';
                content += '</tr>';
                //STL/TOV
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Stl/Tov' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.stealsPerTurnover + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.stealsPerTurnoverPlayoff + '</div></td>';
                content += '</tr>';
                //FOULS
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Fouls' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.fouls + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.foulsPlayoff + '</div></td>';
                content += '</tr>';
                content += '<tr><td><br></td><td><br></td><td><br></td></tr>';
                content += '</table><br></div>';

                _t.playerView.innerHTML = content;
                _t.closeProgressIndicator();

            },

            getPlayerCareerInfo: function () {
                var _t = this;
                helpUtils.getJsonData("http://stats.nba.com/stats/playercareerstats?LeagueID=00&PerMode=PerGame&PlayerID=" + this.playerId).then(function (response) {
                    var resultSets = response.resultSets[0];
                    console.log('ResultSets: ' + JSON.stringify(resultSets));
                    var rowSets = resultSets.rowSet;

                    rowSets = rowSets.reverse();

                    var content = '<table style="width: 100%; margin: 5px; font-size: 8pt;">';
                    content += '<tr><th colspan="13" style="font-size: 12pt">Regular Season</th></tr>';
                    content += '<tr style="font-weight: bold;"><td>Season</td><td>Team</td><td>G</td><td>Min</td><td>Pt</td><td>FG%</td><td>F3%</td><td>FT%</td><td>Reb</td><td>Ast</td><td>Blk</td><td>Stl</td><td>Tov</td>';
                    content += '</tr>';
                    array.forEach(rowSets, function (rowSet) {
                        content += '<tr><td>' + rowSet[1] + '</td><td>' + rowSet[4] + '</td><td>' + rowSet[6] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[26] + '</td><td>' + rowSet[11] + '</td><td>' + rowSet[14] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td><td>' + rowSet[22] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[24] + '</td></tr>';
                    })

                    //Career Season Totals
                    resultSets = response.resultSets[1];
                    var rowSet = resultSets.rowSet[0];
                    content += '<tr style="font-weight: bold;"><td>Totals</td><td>&nbsp;</td><td>' + rowSet[3] + '</td><td>' + rowSet[5] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[11] + '</td><td>' + rowSet[14] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[18] + '</td><td>' + rowSet[19] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td></tr>';
                    content += '</table><br>'

                    var resultSets = response.resultSets[2];
                    var rowSets = resultSets.rowSet;

                    rowSets = rowSets.reverse();
                    content += '<table style="width: 100%; margin: 5px; font-size: 8pt;">';
                    content += '<tr><th colspan="13" style="font-size: 12pt">Playoffs</th></tr>';
                    content += '<tr style="font-weight: bold;"><td>Season</td><td>Team</td><td>G</td><td>Min</td><td>Pt</td><td>FG%</td><td>F3%</td><td>FT%</td><td>Reb</td><td>Ast</td><td>Blk</td><td>Stl</td><td>Tov</td>';
                    content += '</tr>';
                    array.forEach(rowSets, function (rowSet) {
                        content += '<tr><td>' + rowSet[1] + '</td><td>' + rowSet[4] + '</td><td>' + rowSet[6] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[26] + '</td><td>' + rowSet[11] + '</td><td>' + rowSet[14] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[22] + '</td><td>' + rowSet[24] + '</td></tr>';
                    })

                    //Career Playoff Totals
                    if (response.resultSets[3]) {
                        resultSets = response.resultSets[3];
                        var rowSet = resultSets.rowSet[0];
                        if (rowSet && rowSet.length > 0) {
                            content += '<tr style="font-weight: bold;"><td>Totals</td><td>&nbsp;</td><td>' + rowSet[3] + '</td><td>' + rowSet[5] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[11] + '</td><td>' + rowSet[14] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[18] + '</td><td>' + rowSet[19] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td></tr>';

                        }
                    }
                    content += '</table><br>'

                    //ALL STAR
                    if (response.resultSets[4]) {
                        resultSets = response.resultSets[4];
                        var rowSets = resultSets.rowSet;
                        rowSets = rowSets.reverse();
                        if (rowSets && rowSets.length > 0) {
                            content += '<table style="width: 100%; margin: 5px; font-size: 8pt;">';
                            content += '<tr><th colspan="13" style="font-size: 12pt">ALL STAR</th></tr>';
                            content += '<tr style="font-weight: bold;"><td>Season</td><td>Team</td><td>G</td><td>Min</td><td>Pt</td><td>FG%</td><td>F3%</td><td>FT%</td><td>Reb</td><td>Ast</td><td>Blk</td><td>Stl</td><td>Tov</td>';
                            content += '</tr>';
                            array.forEach(rowSets, function (rowSet) {
                                content += '<tr><td>' + rowSet[1] + '</td><td>' + rowSet[4] + '</td><td>' + rowSet[6] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[26] + '</td><td>' + rowSet[11] + '</td><td>' + rowSet[14] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td><td>' + rowSet[22] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[24] + '</td></tr>';
                            })

                            //All Star Totals
                            if (response.resultSets[5]) {
                                resultSets = response.resultSets[5];
                                var rowSet = resultSets.rowSet[0];
                                if (rowSet && rowSet.length > 0)
                                    content += '<tr style="font-weight: bold;"><td>Totals</td><td>&nbsp;</td><td>' + rowSet[3] + '</td><td>' + rowSet[5] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[11] + '</td><td>' + rowSet[14] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[18] + '</td><td>' + rowSet[19] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td></tr>';
                                content += '</table><br>'
                            }


                        }
                    }

                    //COLLEGE
                    if (response.resultSets[6]) {
                        resultSets = response.resultSets[6];
                        var rowSets = resultSets.rowSet;
                        rowSets = rowSets.reverse();
                        if (rowSets && rowSets.length > 0) {
                            content += '<table style="width: 100%; margin: 5px; font-size: 8pt;">';
                            content += '<tr><th colspan="13" style="font-size: 12pt">College</th></tr>';
                            content += '<tr style="font-weight: bold;"><td>Season</td><td>Team</td><td>G</td><td>Min</td><td>Pt</td><td>FG%</td><td>F3%</td><td>FT%</td><td>Reb</td><td>Ast</td><td>Blk</td><td>Stl</td><td>Tov</td>';
                            content += '</tr>';
                            array.forEach(rowSets, function (rowSet) {
                                content += '<tr><td>' + rowSet[1] + '</td><td>' + rowSet[4] + '</td><td>' + rowSet[6] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[26] + '</td><td>' + rowSet[11] + '</td><td>' + rowSet[14] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td><td>' + rowSet[22] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[24] + '</td></tr>';
                            })

                            //All Star Totals
                            if (response.resultSets[7]) {
                                resultSets = response.resultSets[7];
                                var rowSet = resultSets.rowSet[0];
                                if (rowSet && rowSet.length > 0)
                                    content += '<tr style="font-weight: bold;"><td>Totals</td><td>&nbsp;</td><td>' + rowSet[3] + '</td><td>' + rowSet[5] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[11] + '</td><td>' + rowSet[14] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[18] + '</td><td>' + rowSet[19] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td></tr>';
                                content += '</table><br>'
                            }


                        }
                    }


                    _t.playerView.innerHTML = content;
                    _t.closeProgressIndicator();

                });
            },

            checkFavorite: function () {
                var _t = this;
                if (_t.loadedStores.favorites.query({playerid: _t.playerId}).length > 0) {
                    this.fav_btn.set('className', "fa fa-star fa-lg");
                } else {
                    this.fav_btn.set('className', "fa fa-star-o fa-lg");
                }
                this.fav_btn.set('style', "color: white;outline: none !important; vertical-align: 15%;");

                this.fav_btn.onClick = function () {
                    if (_t.loadedStores.favorites.query({playerid: _t.playerId}).length > 0) {
                        _t.loadedStores.favorites.remove(_t.jugador.name);
                        _t.fav_btn.set('className', "fa fa-star-o fa-lg");
                    } else {
                        _t.loadedStores.favorites.put(_t.jugador);
                        _t.fav_btn.set('className', "fa fa-star fa-lg");
                    }
                    _t.fav_btn.set('style', "color: white;outline: none !important; vertical-align: 15%;");
                };
            },

            getPreviousAndNextPlayers: function () {
                var _t = this;
                var item = this.loadedStores.customizablePlayerList.query({playerId: _t.playerId})[0];
                if (item && item.hasOwnProperty('id')) {
                    this.next_btn.set('className', "fa fa-caret-down fa-2x");
                    this.next_btn.set('style', "color: white;outline: none !important; height: 100%; width: 30px; line-height: 44px;");
                    this.prev_btn.set('className', "fa fa-caret-up fa-2x");
                    this.prev_btn.set('style', "color: white;outline: none !important; height: 100%; width: 30px; line-height: 44px;");

                    var itemId = item.id;
                    var nextPlayer = this.loadedStores.customizablePlayerList.query({id: itemId + 1})
                    if (nextPlayer.length > 0) {
                        this.nextPlayer = nextPlayer[0];
                    }
                    else {
                        this.nextPlayer = this.loadedStores.customizablePlayerList.query({id: 0})[0]
                    }

                    var previousPlayer = this.loadedStores.customizablePlayerList.query({id: itemId - 1})
                    if (previousPlayer.length > 0) {
                        this.previousPlayer = previousPlayer[0];

                    }
                    else {
                        var lastIndex = this.loadedStores.customizablePlayerList.query().length;
                        this.previousPlayer = this.loadedStores.customizablePlayerList.query({id: lastIndex - 1})[0]
                    }

                    this.prev_btn.onClick = function () {
                        if (_t.previousPlayer) {
                            _t.loadPlayerData(_t.previousPlayer.playerId);
                        }
                    }
                    this.next_btn.onClick = function () {
                        if (_t.nextPlayer) {
                            _t.loadPlayerData(_t.nextPlayer.playerId);
                        }

                    }
                }

            },

            setEventListeners: function () {
                var _t = this;
                if (this.swipeHandler) {
                    this.swipeHandler.remove();
                }
                if (this.swipeEndHandler) {
                    this.swipeEndHandler.remove();
                }

                this.swipeHandler = on(this.playerDetailScrollableView, swipe, function (e) {
                });

                this.swipeEndHandler = on(this.playerDetailScrollableView, swipe.end, function (e) {
                    if (e.time > 250) {
                        //Minimum duration of swipping --> 200msec
                        //if (e.dy < 0) {
                        if (e.dx > 0) {
                            //Swipe left
                            if (_t.previousStation) {
                                _t.loadStationData(_t.previousStation);
                            }
                        }
                        else {
                            //Swipe right
                            if (_t.nextStation) {
                                _t.loadStationData(_t.nextStation);
                            }
                        }
                    }

                });

            },

            clearPlayerViewHeader: function () {
                var _t = this;
                if (this.playerViewHeader.getChildren().length != 0) {
                    var children = this.playerViewHeader.getChildren();
                    array.forEach(children, function (child) {
                        _t.playerViewHeader.removeChild(child);
                    })
                }

            },

            beforeDeactivate: function () {
                this.tabButtonSeason.set('selected', true);
                this.clearPlayerViewHeader();
                this.swipeEndHandler.remove();
                this.swipeHandler.remove();
                this.tabButtonSeasonHandler.remove();
                this.tabButtonCareerHandler.remove();
            }
        };
    }
);