define([
    "dojo/date/locale",
    "dojo/request/script",
    "dojo/_base/array",
    "dojo/Deferred",
    "dojox/mobile/Pane",
    "nba-player-stats/config/appConfig"
], function (locale, script, array, Deferred, Pane, appConfig) {

    return {
        getBaseDir: function () {
            var target = appConfig[appConfig.selectedCustomer].baseDir;
            return target;
        },
        getRootIndex: function () {
            var target = appConfig[appConfig.selectedCustomer].rootIndex;
            return target;
        },
        getRookieIndex: function () {
            var target = appConfig[appConfig.selectedCustomer].rookieIndex;
            return target;
        },
        getRootIndexPlayoff: function () {
            var target = appConfig[appConfig.selectedCustomer].rootIndexPlayoff;
            return target;
        },
        getRookieIndexPlayoff: function () {
            var target = appConfig[appConfig.selectedCustomer].rookieIndexPlayoff;
            return target;
        },
        getAllPlayersIndex: function () {
            var target = appConfig[appConfig.selectedCustomer].allPlayersIndex;
            return target;
        },
        getHtmlDocumentDir: function () {
            return appConfig[appConfig.selectedCustomer].htmlDocumentDir;
        },
        urlCache: [],
        addInCache: function (url, response) {
            var filteredArray = array.filter(this.urlCache, function (item) {
                return item.url == url
            })
            if (filteredArray.length == 0) {
                this.urlCache.push({url: url, response: response});
            }
        },
        getJsonData: function (url) {
            var filteredArray = array.filter(this.urlCache, function (item) {
                return item.url == url
            })
            if (filteredArray.length == 0) {
                //Not in cache
                //Perform Request
                return script.get(url, {jsonp: "callback"});
            }
            else {
                //Return cached response.
                var deferred = new Deferred();
                setTimeout(function () {
                    deferred.resolve(filteredArray[0].response);
                }, 10);
                return deferred.promise;
            }

        },
        formatTimestamp: function (timestamp) {
            if (!timestamp) {
                return "";
            } else {
                return "<div style='text-align: center'>" + locale.format(new Date(timestamp)) + "</div>";
            }
        },
        formatTimestampToText: function (timestamp) {
            if (!timestamp) {
                return "";
            } else {
                return locale.format(new Date(timestamp))
            }
        },
        getTeams: function () {
            var teams = [];
            teams.push({
                id_team: 1,
                label: "New York Knicks",
                conf: "East",
                acronym: "NYK",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 2,
                label: "Indiana Pacers",
                conf: "East",
                acronym: "IND",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 3,
                label: "Chicago Bulls",
                conf: "East",
                acronym: "CHI",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 4,
                label: "Boston Celtics",
                conf: "East",
                acronym: "BOS",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 5,
                label: "Brooklyn Nets",
                conf: "East",
                acronym: "BKN",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 6,
                label: "San Antonio Spurs",
                conf: "West",
                acronym: "SAS",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 7,
                label: "Oklahoma City Thunder",
                conf: "West",
                acronym: "OKC",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 8,
                label: "Los Angeles Clippers",
                conf: "West",
                acronym: "LAC",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 9,
                label: "Los Angeles Lakers",
                conf: "West",
                acronym: "LAL",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 10,
                label: "Denver Nuggets",
                conf: "West",
                acronym: "DEN",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 11,
                label: "Memphis Grizzlies",
                conf: "West",
                acronym: "MEM",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 12,
                label: "Atlanta Hawks",
                conf: "East",
                acronym: "ATL",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 13,
                label: "Milwaukee Bucks",
                conf: "East",
                acronym: "MIL",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 14,
                label: "Toronto Raptors",
                conf: "East",
                acronym: "TOR",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 15,
                label: "Philadelphia 76ers",
                conf: "East",
                acronym: "PHI",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 16,
                label: "Washington Wizards",
                conf: "East",
                acronym: "WAS",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 17,
                label: "Detroit Pistons",
                conf: "East",
                acronym: "DET",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 18,
                label: "Cleveland Cavaliers",
                conf: "East",
                acronym: "CLE",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 19,
                label: "Orlando Magic",
                conf: "East",
                acronym: "ORL",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 20,
                label: "Charlotte Hornets",
                conf: "East",
                acronym: "CHA",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 21,
                label: "Golden State Warriors",
                conf: "West",
                acronym: "GSW",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 22,
                label: "Houston Rockets",
                conf: "West",
                acronym: "HOU",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 23,
                label: "Utah Jazz",
                conf: "West",
                acronym: "UTA",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 24,
                label: "Dallas Mavericks",
                conf: "West",
                acronym: "DAL",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 25,
                label: "Portland Trail Blazers",
                conf: "West",
                acronym: "POR",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 26,
                label: "Minnesota Timberwolves",
                conf: "West",
                acronym: "MIN",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 27,
                label: "Sacramento Kings",
                conf: "West",
                acronym: "SAC",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 28,
                label: "New Orleans Pelicans",
                conf: "West",
                acronym: "NOP",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 29,
                label: "Phoenix Suns",
                conf: "West",
                acronym: "PHX",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.push({
                id_team: 30,
                label: "Miami Heat",
                conf: "East",
                acronym: "MIA",
                moveTo: 'teamStats',
                target: 'teamStats',
                clickable: true
            });
            teams.sort(function (teamA, teamB) {
                if (teamA.acronym < teamB.acronym) return -1;
                if (teamA.acronym > teamB.acronym) return 1;
                return 0;
            });
            return teams;
        },
        _showErrorMessage: function (div, errorURL) {
            if (div.getChildren().length != 0) {
                var children = div.getChildren();
                array.forEach(children, function (child) {
                    if (child instanceof Pane) {
                        console.log('child: ' + JSON.stringify(child));
                        div.removeChild(child);
                    }
                })
            }
            var pane = new Pane({
                innerHTML: '<div>' + appConfig[appConfig.selectedCustomer].resourceNotFoundMessage + '<div><br><div class="fileNotFoundClass">' + appConfig[appConfig.selectedCustomer].fileNotFound + ' ' + errorURL + '</div>'
            });
            div.addChild(pane)

        },
        playerArray: [],
        _parseData: function (jsondata) {
            if (this.playerArray.length == 0) {
                var _t = this;
                var resultSet = jsondata.resultSet;
                this.rowSet = resultSet.rowSet;
                for (var i = 0; i < this.rowSet.length; i++) {
                    var params = {
                        playerId: _t.rowSet[i][0],
                    };
                    var partidos = _t.rowSet[i][4];
                    var player = {
                        playerid: _t.rowSet[i][0],
                        name: _t.rowSet[i][2],
                        team: _t.rowSet[i][3],
                        games: _t.rowSet[i][4],
                        minutes: parseFloat((_t.rowSet[i][5] / partidos).toFixed(1)),
                        fgm: parseFloat((_t.rowSet[i][6] / partidos).toFixed(1)),
                        fga: parseFloat((_t.rowSet[i][7] / partidos).toFixed(1)),
                        fg_pct: parseFloat((_t.rowSet[i][8] * 100).toFixed(1)),
                        fg3m: parseFloat((_t.rowSet[i][9] / partidos).toFixed(1)),
                        fg3a: parseFloat((_t.rowSet[i][10] / partidos).toFixed(1)),
                        fg3_pct: parseFloat((_t.rowSet[i][11] * 100).toFixed(1)),
                        ftm: parseFloat((_t.rowSet[i][12] / partidos).toFixed(1)),
                        fta: parseFloat((_t.rowSet[i][13] / partidos).toFixed(1)),
                        ft_pct: parseFloat((_t.rowSet[i][14] * 100).toFixed(1)),
                        oreb: parseFloat((_t.rowSet[i][15] / partidos).toFixed(1)),
                        dreb: parseFloat((_t.rowSet[i][16] / partidos).toFixed(1)),
                        rebounds: parseFloat((_t.rowSet[i][17] / partidos).toFixed(1)),
                        assists: parseFloat((_t.rowSet[i][18] / partidos).toFixed(1)),
                        steals: parseFloat((_t.rowSet[i][19] / partidos).toFixed(1)),
                        blocks: parseFloat((_t.rowSet[i][20] / partidos).toFixed(1)),
                        turnovers: parseFloat((_t.rowSet[i][21] / partidos).toFixed(1)),
                        points: parseFloat((_t.rowSet[i][23] / partidos).toFixed(1)),
                        efficiency: parseFloat((_t.rowSet[i][24] / partidos).toFixed(1)),
                        fouls: parseFloat((_t.rowSet[i][22] / partidos).toFixed(1)),
                        assistsPerTurnover: parseFloat((_t.rowSet[i][25]).toFixed(1)),
                        stealsPerTurnover: parseFloat((_t.rowSet[i][26]).toFixed(1)),
                        gamesPlayoff: 0,
                        minutesPlayoff: 0,
                        fgmPlayoff: 0,
                        fgaPlayoff: 0,
                        fg_pctPlayoff: 0,
                        fg3mPlayoff: 0,
                        fg3aPlayoff: 0,
                        fg3_pctPlayoff: 0,
                        ftmPlayoff: 0,
                        ftaPlayoff: 0,
                        ft_pctPlayoff: 0,
                        orebPlayoff: 0,
                        drebPlayoff: 0,
                        reboundsPlayoff: 0,
                        assistsPlayoff: 0,
                        stealsPlayoff: 0,
                        blocksPlayoff: 0,
                        turnoversPlayoff: 0,
                        pointsPlayoff: 0,
                        efficiencyPlayoff: 0,
                        foulsPlayoff: 0,
                        assistsPerTurnoverPlayoff: 0,
                        stealsPerTurnoverPlayoff: 0,
                        label: _t.rowSet[i][2],
                        transitionOptions: {params: params},
                        moveTo: 'playerDetail',
                        target: 'playerDetail',
                        clickable: true,
                        //icon: require.toUrl("nba-player-stats") + '/icons/' + _t.rowSet[i][3] + '.gif',
                    }

                    this.playerArray.push(player);
                }

                //console.log('jsonData: ' + JSON.stringify(this.playerArray));
                this.playerArray.sort(function (playerA, playerB) {
                    if (playerA.label < playerB.label) return -1;
                    if (playerA.label > playerB.label) return 1;
                    return 0;
                });

                this.setStatisticalMinimums();
                this.setStatisticalMinimumsPlayoff();
            }
        },
        _parseDataPlayoffs: function (jsondata) {
            //console.log('parseDataPlayoffs jsonData: ' + JSON.stringify(jsondata));
            //var parsedData = JSON.parse(jsondata);
            var _t = this;
            var resultSet = jsondata.resultSet;
            this.rowSet = resultSet.rowSet;
            array.forEach(this.rowSet, function (row, i) {
                var playerid = row[0];
                array.forEach(_t.playerArray, function (player, j) {
                    if (player.playerid == playerid) {
                        //PLAYOFF DATA
                        var partidos = row[4];
                        player.gamesPlayoff = row[4];
                        player.minutesPlayoff = parseFloat((row[5] / partidos).toFixed(1));
                        player.fgmPlayoff = parseFloat((row[6] / partidos).toFixed(1));
                        player.fgaPlayoff = parseFloat((row[7] / partidos).toFixed(1));
                        player.fg_pctPlayoff = parseFloat((_t.rowSet[i][8] * 100).toFixed(1));
                        player.fg3mPlayoff = parseFloat((row[9] / partidos).toFixed(1));
                        player.fg3aPlayoff = parseFloat((row[10] / partidos).toFixed(1));
                        player.fg3_pctPlayoff = parseFloat((_t.rowSet[i][11] * 100).toFixed(1));
                        player.ftmPlayoff = parseFloat((row[12] / partidos).toFixed(1));
                        player.ftaPlayoff = parseFloat((row[13] / partidos).toFixed(1));
                        player.ft_pctPlayoff = parseFloat((_t.rowSet[i][14] * 100).toFixed(1));
                        player.orebPlayoff = parseFloat((row[15] / partidos).toFixed(1));
                        player.drebPlayoff = parseFloat((row[16] / partidos).toFixed(1));
                        player.reboundsPlayoff = parseFloat((row[17] / partidos).toFixed(1));
                        player.assistsPlayoff = parseFloat((row[18] / partidos).toFixed(1));
                        player.stealsPlayoff = parseFloat((row[19] / partidos).toFixed(1));
                        player.blocksPlayoff = parseFloat((row[20] / partidos).toFixed(1));
                        player.turnoversPlayoff = parseFloat((row[21] / partidos).toFixed(1));
                        player.pointsPlayoff = parseFloat((row[23] / partidos).toFixed(1));
                        player.efficiencyPlayoff = parseFloat((row[24] / partidos).toFixed(1));
                        player.foulsPlayoff = parseFloat((_t.rowSet[i][22] / partidos).toFixed(1));
                        player.assistsPerTurnoverPlayoff = parseFloat((_t.rowSet[i][25]).toFixed(1));
                        player.stealsPerTurnoverPlayoff = parseFloat((_t.rowSet[i][26]).toFixed(1));
                        //console.log('player: ' +  JSON.stringify(_t.playerArray[i]));
                    }

                });
            });
        },
        getHistoricalData: function (response) {
            var _t = this;
            var historicalPlayers = [];

            var resultSet = response.resultSets;
            var rowSet = resultSet[0].rowSet;

            array.forEach(rowSet, function (row) {
                if (row[3] == '0') { //Inactive
                    var params = {
                        playerId: row[0],
                    };
                    var player = {
                        playerid: row[0],
                        name: row[2],
                        label: row[2],
                        seasonFrom: row[4],
                        seasonTo: row[5],
                        transitionOptions: {params: params},
                        moveTo: 'historicalPlayerDetail',
                        target: 'historicalPlayerDetail',
                        clickable: true
                    }

                    historicalPlayers.push(player);
                }
            })

            historicalPlayers.sort(function (playerA, playerB) {
                if (playerA.label < playerB.label) return -1;
                if (playerA.label > playerB.label) return 1;
                return 0;
            });
            return historicalPlayers;

        },
        statisticalMinimums: {},
        getStatisticalMinimums: function() {
            return this.statisticalMinimums;
        },
        setStatisticalMinimums: function() {
            var maxNumGames=0;
            array.forEach(this.playerArray, function(player) {
                if (player.games>maxNumGames) {
                    maxNumGames = player.games;
                }
            })

            this.statisticalMinimums = {
                generalMinimum: Math.floor(maxNumGames * 0.7),
                fg_pctMinimum: 3.5,
                ft_pctMinimum: 1.5,
                fg3_pctMinimum: 1,
                assistsPerTurnoverMinimum: 2.5,
                stealsPerTurnoverMinimum: 1
            }
        },
        getStatisticalMinimumsPlayoff: function() {
            return this.statisticalMinimumsPlayoff;
        },
        setStatisticalMinimumsPlayoff: function() {
            var maxNumGamesPlayoff=0;
            array.forEach(this.playerArray, function(player) {
                if (player.gamesPlayoff>maxNumGamesPlayoff) {
                    maxNumGamesPlayoff = player.gamesPlayoff;
                }
            })

            this.statisticalMinimumsPlayoff = {
                generalPlayoffMinimum: Math.floor(maxNumGamesPlayoff * 0.7),
                fg_pctPlayoffMinimum: 3.5,
                ft_pctPlayoffMinimum: 1.5,
                fg3_pctPlayoffMinimum: 1,
                assistsPerTurnoverPlayoffMinimum: 2.5,
                stealsPerTurnoverPlayoffMinimum: 1
            }
        },
        getPlayerArray: function () {
            return this.playerArray;
        }

    }
});
