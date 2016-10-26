define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojox/mobile/Pane",
        "dojox/mobile/ProgressIndicator",
        "dojox/gesture/swipe",
        'dojo/on',
        "nba-player-stats/config/appConfig",
        "nba-player-stats/widgets/helpUtils",
        'dojo/domReady!'
    ],
    function (declare, array, Pane, ProgressIndicator, swipe, on, appConfig, helpUtils) {

        return {
            beforeActivate: function () {

                this.loadPlayerData();

            },

            loadPlayerData: function (playerId) {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                this.clearPlayerViewHeader();
                this.loadProgressIndicator();

                this.tabButtonAverage.set('selected', true);
                if (this.tabButtonAverageHandler) {
                    this.tabButtonAverageHandler.remove();
                }
                if (this.tabButtonCareerHandler) {
                    this.tabButtonCareerHandler.remove();
                }
                this.tabButtonAverageHandler = on(this.tabButtonAverage, 'click', function (evt) {
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

                var playerFound = false;
                var queryPromise = this.loadedStores.historicalPlayerList.query({playerid: this.playerId}).forEach(function (jugador) {
                    playerFound = true;
                    _t.jugador = jugador;
                    var playerHeaderText = '<div class="playerDetailHeaderClass">' + jugador.name;
                    _t.playerHeader.innerHTML = playerHeaderText;
                    _t.playerHeader.style['background-color'] = _t.config.header.mainMenuHeaderColor;
                    _t.getPlayerInfo();

                    _t.setHeader();
                    _t.getPreviousAndNextPlayers();
                    _t.setEventListeners();
                    _t.closeProgressIndicator();

                });
                if (!playerFound) {
                    _t.setHeader();
                    _t.playerHeader.innerHTML = '<div class="playerDetailHeaderClass">' + 'No Data Available';
                    _t.playerHeader.style['background-color'] = _t.config.header.mainMenuHeaderColor;
                    _t.closeProgressIndicator();
                }

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

                    var resultSetsInfo = response.resultSets[0];
                    var rowSetInfo = resultSetsInfo.rowSet[0];

                    var birthdate = new Date(rowSetInfo[6]);
                    _t.jugador.birthdate = birthdate.getMonth() + 1 + '/' + birthdate.getDate() + '/' + birthdate.getFullYear();
                    _t.jugador.from = rowSetInfo[9];
                    _t.jugador.country = rowSetInfo[8];
                    _t.jugador.height = rowSetInfo[10];
                    _t.jugador.weight = rowSetInfo[11];
                    _t.jugador.number = rowSetInfo[13];
                    _t.jugador.numSeasons = rowSetInfo[12] + 1;
                    _t.jugador.position = rowSetInfo[14];


                    _t.jugador.careerGames = 0;
                    _t.jugador.careerMinutes = 0;
                    _t.jugador.careerFgm = 0;
                    _t.jugador.careerFga = 0;
                    _t.jugador.careerFg_pct = 0;
                    _t.jugador.careerFg3m = 0;
                    _t.jugador.careerFg3a = 0;
                    _t.jugador.careerFg3_pct = 0;
                    _t.jugador.careerFtm = 0;
                    _t.jugador.careerFta = 0;
                    _t.jugador.careerFt_pct = 0;
                    _t.jugador.careerOreb = 0;
                    _t.jugador.careerDreb = 0;
                    _t.jugador.careerRebounds = 0;
                    _t.jugador.careerAssists = 0;
                    _t.jugador.careerSteals = 0;
                    _t.jugador.careerBlocks = 0;
                    _t.jugador.careerTurnovers = 0;
                    _t.jugador.careerFouls = 0;
                    _t.jugador.careerPoints = 0;

                    _t.jugador.careerGamesPlayoff = 0;
                    _t.jugador.careerMinutesPlayoff = 0;
                    _t.jugador.careerFgmPlayoff = 0;
                    _t.jugador.careerFgaPlayoff = 0;
                    _t.jugador.careerFg_pctPlayoff = 0;
                    _t.jugador.careerFg3mPlayoff = 0;
                    _t.jugador.careerFg3aPlayoff = 0;
                    _t.jugador.careerFg3_pctPlayoff = 0;
                    _t.jugador.careerFtmPlayoff = 0;
                    _t.jugador.careerFtaPlayoff = 0;
                    _t.jugador.careerFt_pctPlayoff = 0;
                    _t.jugador.careerOrebPlayoff = 0;
                    _t.jugador.careerDrebPlayoff = 0;
                    _t.jugador.careerReboundsPlayoff = 0;
                    _t.jugador.careerAssistsPlayoff = 0;
                    _t.jugador.careerStealsPlayoff = 0;
                    _t.jugador.careerBlocksPlayoff = 0;
                    _t.jugador.careerTurnoversPlayoff = 0;
                    _t.jugador.careerFoulsPlayoff = 0;
                    _t.jugador.careerPointsPlayoff = 0;


                    resultSetsInfo = response.resultSets[1];
                    rowSetInfo = resultSetsInfo.rowSet[0];
                    _t.jugador.numAllStar = rowSetInfo[6];


                    //["PLAYER_ID", "SEASON_ID", "LEAGUE_ID", "TEAM_ID", "TEAM_ABBREVIATION", "PLAYER_AGE", "GP", "GS", "MIN", "FGM", "FGA", "FG_PCT", "FG3M", "FG3A", "FG3_PCT", "FTM", "FTA", "FT_PCT", "OREB", "DREB", "REB", "AST", "STL", "BLK", "TOV", "PF", "PTS"]
                    helpUtils.getJsonData("http://stats.nba.com/stats/playercareerstats?LeagueID=00&PerMode=PerGame&PlayerID=" + _t.playerId).then(function (response) {
                        var resultSetsCareer = response.resultSets[1];
                        var rowSetCareer = resultSetsCareer.rowSet[0];
                        if (rowSetCareer) {
                            _t.jugador.careerGames = (rowSetCareer[3] != null && rowSetCareer[3] != undefined) ? rowSetCareer[3] : 0;
                            _t.jugador.careerMinutes = (rowSetCareer[5] != null && rowSetCareer[5] != undefined) ? rowSetCareer[5] : 0;
                            _t.jugador.careerFgm = (rowSetCareer[6] != null && rowSetCareer[6] != undefined) ? rowSetCareer[6] : 0;
                            _t.jugador.careerFga = (rowSetCareer[7] != null && rowSetCareer[7] != undefined) ? rowSetCareer[7] : 0;
                            _t.jugador.careerFg_pct = (rowSetCareer[8] != null && rowSetCareer[8] != undefined) ? rowSetCareer[8] : 0;
                            _t.jugador.careerFg3m = (rowSetCareer[9] != null && rowSetCareer[9] != undefined) ? rowSetCareer[9] : 0;
                            _t.jugador.careerFg3a = (rowSetCareer[10] != null && rowSetCareer[10] != undefined) ? rowSetCareer[10] : 0;
                            _t.jugador.careerFg3_pct = (rowSetCareer[11] != null && rowSetCareer[11] != undefined) ? rowSetCareer[11] : 0;
                            _t.jugador.careerFtm = (rowSetCareer[12] != null && rowSetCareer[12] != undefined) ? rowSetCareer[12] : 0;
                            _t.jugador.careerFta = (rowSetCareer[13] != null && rowSetCareer[13] != undefined) ? rowSetCareer[13] : 0;
                            _t.jugador.careerFt_pct = (rowSetCareer[14] != null && rowSetCareer[14] != undefined) ? rowSetCareer[14] : 0;
                            _t.jugador.careerOreb = (rowSetCareer[15] != null && rowSetCareer[15] != undefined) ? rowSetCareer[15] : 0;
                            _t.jugador.careerDreb = (rowSetCareer[16] != null && rowSetCareer[16] != undefined) ? rowSetCareer[16] : 0;
                            _t.jugador.careerRebounds = (rowSetCareer[17] != null && rowSetCareer[17] != undefined) ? rowSetCareer[17] : 0;
                            _t.jugador.careerAssists = (rowSetCareer[18] != null && rowSetCareer[18] != undefined) ? rowSetCareer[18] : 0;
                            _t.jugador.careerSteals = (rowSetCareer[19] != null && rowSetCareer[19] != undefined) ? rowSetCareer[19] : 0;
                            _t.jugador.careerBlocks = (rowSetCareer[20] != null && rowSetCareer[20] != undefined) ? rowSetCareer[20] : 0;
                            _t.jugador.careerTurnovers = (rowSetCareer[21] != null && rowSetCareer[21] != undefined) ? rowSetCareer[21] : 0;
                            _t.jugador.careerFouls = (rowSetCareer[22] != null && rowSetCareer[22] != undefined) ? rowSetCareer[22] : 0;
                            _t.jugador.careerPoints = (rowSetCareer[23] != null && rowSetCareer[23] != undefined) ? rowSetCareer[23] : 0;
                        }

                        var resultSetsCareerPlayoff = response.resultSets[3];
                        var rowSetCareerPlayoff = resultSetsCareerPlayoff.rowSet[0];
                        if (rowSetCareerPlayoff) {
                            _t.jugador.careerGamesPlayoff = (rowSetCareerPlayoff[3] != null && rowSetCareerPlayoff[3] != undefined) ? rowSetCareerPlayoff[3] : 0;
                            _t.jugador.careerMinutesPlayoff = (rowSetCareerPlayoff[5] != null && rowSetCareerPlayoff[5] != undefined) ? rowSetCareerPlayoff[5] : 0;
                            _t.jugador.careerFgmPlayoff = (rowSetCareerPlayoff[6] != null && rowSetCareerPlayoff[6] != undefined) ? rowSetCareerPlayoff[6] : 0;
                            _t.jugador.careerFgaPlayoff = (rowSetCareerPlayoff[7] != null && rowSetCareerPlayoff[7] != undefined) ? rowSetCareerPlayoff[7] : 0;
                            _t.jugador.careerFg_pctPlayoff = (rowSetCareerPlayoff[8] != null && rowSetCareerPlayoff[8] != undefined) ? rowSetCareerPlayoff[8] : 0;
                            _t.jugador.careerFg3mPlayoff = (rowSetCareerPlayoff[9] != null && rowSetCareerPlayoff[9] != undefined) ? rowSetCareerPlayoff[9] : 0;
                            _t.jugador.careerFg3aPlayoff = (rowSetCareerPlayoff[10] != null && rowSetCareerPlayoff[10] != undefined) ? rowSetCareerPlayoff[10] : 0;
                            _t.jugador.careerFg3_pctPlayoff = (rowSetCareerPlayoff[11] != null && rowSetCareerPlayoff[11] != undefined) ? rowSetCareerPlayoff[11] : 0;
                            _t.jugador.careerFtmPlayoff = (rowSetCareerPlayoff[12] != null && rowSetCareerPlayoff[12] != undefined) ? rowSetCareerPlayoff[12] : 0;
                            _t.jugador.careerFtaPlayoff = (rowSetCareerPlayoff[13] != null && rowSetCareerPlayoff[13] != undefined) ? rowSetCareerPlayoff[13] : 0;
                            _t.jugador.careerFt_pctPlayoff = (rowSetCareerPlayoff[14] != null && rowSetCareerPlayoff[14] != undefined) ? rowSetCareerPlayoff[14] : 0;
                            _t.jugador.careerOrebPlayoff = (rowSetCareerPlayoff[15] != null && rowSetCareerPlayoff[15] != undefined) ? rowSetCareerPlayoff[15] : 0;
                            _t.jugador.careerDrebPlayoff = (rowSetCareerPlayoff[16] != null && rowSetCareerPlayoff[16] != undefined) ? rowSetCareerPlayoff[16] : 0;
                            _t.jugador.careerReboundsPlayoff = (rowSetCareerPlayoff[17] != null && rowSetCareerPlayoff[17] != undefined) ? rowSetCareerPlayoff[17] : 0;
                            _t.jugador.careerAssistsPlayoff = (rowSetCareerPlayoff[18] != null && rowSetCareerPlayoff[18] != undefined) ? rowSetCareerPlayoff[18] : 0;
                            _t.jugador.careerStealsPlayoff = (rowSetCareerPlayoff[19] != null && rowSetCareerPlayoff[19] != undefined) ? rowSetCareerPlayoff[19] : 0;
                            _t.jugador.careerBlocksPlayoff = (rowSetCareerPlayoff[20] != null && rowSetCareerPlayoff[20] != undefined) ? rowSetCareerPlayoff[20] : 0;
                            _t.jugador.careerTurnoversPlayoff = (rowSetCareerPlayoff[21] != null && rowSetCareerPlayoff[21] != undefined) ? rowSetCareerPlayoff[21] : 0;
                            _t.jugador.careerFoulsPlayoff = (rowSetCareerPlayoff[22] != null && rowSetCareerPlayoff[22] != undefined) ? rowSetCareerPlayoff[22] : 0;
                            _t.jugador.careerPointsPlayoff = (rowSetCareerPlayoff[23] != null && rowSetCareerPlayoff[23] != undefined) ? rowSetCareerPlayoff[23] : 0;
                        }

                        //Create PlayerView Header.
                        _t.createPlayerViewHeader();
                        //Create Stats Pane.
                        _t.createStatsPane();
                    });
                });
            },

            createPlayerViewHeader: function () {
                var _t = this;
                var content = '<table style="width: 95%;margin: 5px;">';
                content += '<tr>';
                content += '<td style="width: 42%;"><div class="infoClass playerStationDataTimestamp" style="text-align: right !important;">' + '#' + this.jugador.number + '<br><span>' + this.jugador.birthdate + '<br>' + this.jugador.country + '</span>' + '</div></td>'
                content += '<td style="width: 15%;">'
                content += '<div class="infoClass playerStationDataTimestamp" style="text-align: center !important;">'
                //content += '<img src="http://stats.nba.com/media/players/230x185/' + this.jugador.playerid + '.png" height="72px", width="90px"></img>';
                content += '</div>';
                content += '</td>';
                content += '<td style="width: 42%;"><div class="infoClass detailPlayerDataTimestamp" style="text-align: left !important;"><span>' + this.jugador.position + '<br>' + this.jugador.weight + ' lbs/' + this.jugador.height + '<br>Exp:' + this.jugador.numSeasons + ' years<br>All Star: ' + this.jugador.numAllStar + ' times<br>From: ' + this.jugador.from + '</span>';
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
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + 'Regular Season' + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + 'Plaoyff' + '</div></td>';
                content += '</tr>';
                //Games
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Games' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerGames + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerGamesPlayoff + '</div></td>';
                content += '</tr>';
                //Minutes
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Minutes' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerMinutes + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerMinutesPlayoff + '</div></td>';
                content += '</tr>';
                //Points
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Points' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerPoints + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerPointsPlayoff + '</div></td>';
                content += '</tr>';
                //Rebounds
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Rebounds' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerRebounds + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerReboundsPlayoff + '</div></td>';
                content += '</tr>';
                //Assists
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Assists' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerAssists + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerAssistsPlayoff + '</div></td>';
                content += '</tr>';
                //Steals
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Steals' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerSteals + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerStealsPlayoff + '</div></td>';
                content += '</tr>';
                //Turnovers
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Turnovers' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerTurnovers + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerTurnoversPlayoff + '</div></td>';
                content += '</tr>';
                //Blocks
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Blocks' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerBlocks + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerBlocksPlayoff + '</div></td>';
                content += '</tr>';
                //FG
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'FG %' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerFg_pct + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerFg_pctPlayoff + '</div></td>';
                content += '</tr>';
                //F3G
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + '3PT FG %' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerFg3_pct + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerFg3_pctPlayoff + '</div></td>';
                content += '</tr>';
                //FT
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'FT %' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerFt_pct + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerFt_pctPlayoff + '</div></td>';
                content += '</tr>';
                //OREB
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Off. Reb.' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerOreb + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerOrebPlayoff + '</div></td>';
                content += '</tr>';
                //DREB
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Def. Reb.' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerDreb + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerDrebPlayoff + '</div></td>';
                content += '</tr>';
                //FOULS
                content += '<tr>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell1">' + 'Fouls' + '</div></td>';
                content += '<td style=" width: 5%;"></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerFouls + '</div></td>';
                content += '<td style=" width: 25%;"><div class="infoClass detailClassificationCell2">' + this.jugador.careerFoulsPlayoff + '</div></td>';
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
                    var rowSets = resultSets.rowSet;

                    rowSets = rowSets.reverse();
                    var content = '<table style="width: 100%; margin: 5px; font-size: 8pt;">';
                    content += '<tr><th colspan="13" style="font-size: 12pt">Regular Season</th></tr>';
                    content += '<tr style="font-weight: bold;"><td>Season</th><td>Team</th><td>G</th><td>Min</th><td>Pt</th><td>FG%</th><td>F3%</th><td>FT%</th><td>Reb</th><td>Ast</th><td>Blk</th><td>Stl</th><td>Tov</th>';
                    content += '</tr>';
                    array.forEach(rowSets, function (rowSet) {
                        content += '<tr><td>' + rowSet[1] + '</td><td>' + rowSet[4] + '</td><td>' + rowSet[6] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[26] + '</td><td>' + rowSet[11] + '</td><td>' + rowSet[14] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[22] + '</td><td>' + rowSet[24] + '</td></tr>';
                    })
                    content += '</table><br>'

                    helpUtils.getJsonData("http://stats.nba.com/stats/playercareerstats?LeagueID=00&PerMode=PerGame&PlayerID=" + _t.playerId).then(function (response) {
                        var resultSets = response.resultSets[2];
                        var rowSets = resultSets.rowSet;

                        rowSets = rowSets.reverse();
                        content += '<table style="width: 100%; margin: 5px; font-size: 8pt;">';
                        content += '<tr><th colspan="13" style="font-size: 12pt">Playoffs</th></tr>';
                        content += '<tr style="font-weight: bold;"><td>Season</th><td>Team</th><td>G</th><td>Min</th><td>Pt</th><td>FG%</th><td>F3%</th><td>FT%</th><td>Reb</th><td>Ast</th><td>Blk</th><td>Stl</th><td>Tov</th>';
                        content += '</tr>';
                        array.forEach(rowSets, function (rowSet) {
                            content += '<tr><td>' + rowSet[1] + '</td><td>' + rowSet[4] + '</td><td>' + rowSet[6] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[26] + '</td><td>' + rowSet[11] + '</td><td>' + rowSet[14] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[22] + '</td><td>' + rowSet[24] + '</td></tr>';
                        })
                        content += '</table><br>'

                        _t.playerView.innerHTML = content;
                        _t.closeProgressIndicator();
                    });


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
                this.nextPlayer=null;
                this.previousPlayer=null;
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

                this.swipeHandler = on(this.stationDetailScrollableView, swipe, function (e) {
                });

                this.swipeEndHandler = on(this.stationDetailScrollableView, swipe.end, function (e) {
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
                this.tabButtonAverage.set('selected', true);
                this.clearPlayerViewHeader();
                if (this.swipeHandler) {
                    this.swipeHandler.remove();
                }
                if (this.swipeEndHandler) {
                    this.swipeEndHandler.remove();
                }
                this.tabButtonAverageHandler.remove();
                this.tabButtonCareerHandler.remove();
            }
        };
    }
);