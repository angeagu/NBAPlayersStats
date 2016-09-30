define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/query",
        "dojo/on",
        "dojox/mobile/View",
        "dojox/mobile/ProgressIndicator",
        "nba-player-stats/config/appConfig",
        "nba-player-stats/widgets/helpUtils",
        "dojo/i18n!nba-player-stats/nls/boxscoreDetail"
    ],
    function (declare, array, query, on, View, ProgressIndicator, appConfig, helpUtils, nls) {

        return {

            beforeActivate: function () {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                this.gameId = this.params.gameId;
                this.setHeader();
                this.loadedStores.customizablePlayerList.setData([]);
                this.setEventHandlers();
                this.createBoxscore();

            },

            loadProgressIndicator: function () {
                this.prog = ProgressIndicator.getInstance();
                this.divProgress.addChild(this.prog);
                this.prog.start();
                this.divContainer.domNode.style.opacity = '0.5';
            },

            closeProgressIndicator: function () {
                this.prog.stop();
                this.divContainer.domNode.style.opacity = '1';
            },

            createBoxscore: function (gameId) {
                var _t = this;
                if (gameId) {
                    this.gameId = gameId;
                }
                this.loadProgressIndicator();
                this.divBoxscore.innerHTML="";
                //var boxscoreUrl = 'http://stats.nba.com/stats/boxscoretraditionalv2?GameID='+this.gameId+'&RangeType=0&StartPeriod=0&EndPeriod=0&StartRange=0&EndRange=0';
                var boxscoreSummary = 'http://stats.nba.com/stats/boxscoresummaryv2?GameID='+this.gameId;
                    helpUtils.getJsonData(boxscoreSummary).then(function (response) {
                        var boxscore = response;
                        var resultSets = response.resultSets;

                        //Header
                        var lineScore = resultSets.filter(function(resultSet) {
                            return resultSet.name == 'LineScore';
                        });
                        var lineScoreRowset = lineScore[0].rowSet;
                        var homeRowSet = lineScoreRowset[0];
                        var awayRowSet = lineScoreRowset[1];
                        var homeTeam = helpUtils.getTeams().filter(function(team) {
                            return team.acronym == homeRowSet[4]
                        })[0];
                        homeTeam.winsLosses = homeRowSet[7];
                        var homeTeamIcon = require.toUrl("nba-player-stats") + '/icons/' + homeTeam.acronym + '.gif';
                        var awayTeam = helpUtils.getTeams().filter(function(team) {
                            return team.acronym == awayRowSet[4]
                        })[0];
                        awayTeam.winsLosses = awayRowSet[7];
                        var awayTeamIcon = require.toUrl("nba-player-stats") + '/icons/' + awayTeam.acronym + '.gif';
                        var homePoints = homeRowSet[homeRowSet.length-1]
                        var awayPoints = awayRowSet[awayRowSet.length-1]

                        var content = '<table style="width: 100%; margin: 5px; font-size: 10pt;">';
                        content += '<tr><th>';
                        content += '<div class="boxscoreHeader">&nbsp;'+awayPoints+'&nbsp;';
                        content += awayTeam.acronym + '  at  ';
                        content += homeTeam.acronym + '&nbsp;';
                        content += content = +homePoints+'&nbsp;</div>';
                        content += '</th></tr></table>';
                        _t.divBoxscore.innerHTML += content;

                        var content = '<table style="width: 100%; margin: 5px; font-size: 10pt;">';
                        content += '<tr><th>';
                        content +='<table style="width: 100%; font-size: 10pt;">'
                        var trHeader='<tr style="font-weight: bold;">';
                        var trHome='<tr style="font-weight: normal;">';
                        var trAway='<tr style="font-weight: normal;">';
                        var flag = true;
                        for (var i=8;i<homeRowSet.length && flag;i++) {
                            if (homeRowSet[i]==0 && awayRowSet[i]==0) {
                                flag = false;
                            }
                            else {
                                if (i>=8 && i <=11) {
                                    trHeader += '<td>Q'+(i-7)+'</td>'
                                }
                                else {
                                    trHeader += '<td>OT'+(i-11)+'</td>'
                                }
                                trHome+= '<td>'+homeRowSet[i]+'</td>'
                                trAway+= '<td>'+awayRowSet[i]+'</td>'
                            }
                        }

                        trHeader+='<td>End</td></tr>';
                        trHome+= '<td>'+homeRowSet[homeRowSet.length-1]+'</td></tr>'
                        trAway+= '<td>'+awayRowSet[awayRowSet.length-1]+'</td></tr>'
                        content += trHeader + trHome + trAway + '</table>';
                        content += '</th></tr></table>';
                        _t.divBoxscore.innerHTML += content;

                        var boxscoreUrl = 'http://stats.nba.com/stats/boxscoretraditionalv2?GameID='+_t.gameId+'&RangeType=0&StartPeriod=0&EndPeriod=0&StartRange=0&EndRange=0';
                        helpUtils.getJsonData(boxscoreUrl).then(function (response) {
                            var resultSets = response.resultSets;
                            //Boxscore
                            var playerStats = resultSets.filter(function (resultSet) {
                                return resultSet.name == 'PlayerStats';
                            });
                            var teamStats = resultSets.filter(function (resultSet) {
                                return resultSet.name == 'TeamStats';
                            });

                            console.log('Away Team: ' + JSON.stringify(awayTeam));
                            console.log('Home Team: ' + JSON.stringify(homeTeam));
                            console.log('Player Stats: ' + JSON.stringify(playerStats));

                            //Away Team
                            var content = _t.getDetailedBoxScoreForTeam(playerStats, teamStats, awayTeam)
                            _t.divBoxscore.innerHTML += content + '<br>';

                            //HomeTeam
                            content = _t.getDetailedBoxScoreForTeam(playerStats, teamStats, homeTeam)
                            console.log('HOME content: ' + content);
                            _t.divBoxscore.innerHTML += content;


                            query(".player").forEach(function (node) {
                                on(node, "click", function (event) {
                                    var playerId = node.attributes['value'].nodeValue;
                                    var transOpts = {
                                        target: "playerDetail",
                                        params: {
                                            playerId: playerId
                                        }
                                    };
                                    _t.app.transitionToView(event.target, transOpts, event);
                                });
                            });

                            _t.closeProgressIndicator();
                            _t.getPreviousAndNextBoxscores();
                        });

                        });


            },

            getDetailedBoxScoreForTeam: function(playerStats,teamStats,team) {
                var content = '<table style="width: 100%; margin: 5px; font-size: 8pt;">';
                content += '<tr><th colspan="13" style="font-size: 12pt">'+team.label+'&nbsp;('+team.winsLosses+')'+'</th></tr>';
                content += '<tr style="font-weight: bold;"><td>Name</td><td>P</td><td>MIN</td><td>PT</td><td>RB</td><td>A</td><td>FG</td><td>F3</td><td>FT</td><td>ST</td><td>BL</td><td>TO</td><td>F</td><td>+/-</td>';
                content += '</tr>';
                var playerStatsRowset = playerStats[0].rowSet;
                playerStatsRowset = playerStatsRowset.filter(function(rowSet){
                    return rowSet[2] == team.acronym;
                });

                //["GAME_ID","TEAM_ID","TEAM_ABBREVIATION","TEAM_CITY","PLAYER_ID","PLAYER_NAME","START_POSITION","COMMENT","MIN","FGM","FGA","FG_PCT","FG3M","FG3A","FG3_PCT","FTM","FTA","FT_PCT","OREB","DREB","REB","AST","STL","BLK","TO","PF","PTS","PLUS_MINUS"]
                array.forEach(playerStatsRowset,function(rowSet) {
                    if (rowSet[8]!=null) {
                        content += '<tr><td><span value="'+rowSet[4]+'" class="player">' + rowSet[5] + '</span></td><td>' + rowSet[6] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[26] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td><td>' + rowSet[9]+'/'+rowSet[10] +'</td><td>' + rowSet[12]+'/'+rowSet[13] + '</td><td>' + rowSet[15]+'/'+rowSet[16] + '</td><td>' + rowSet[22] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[24] + '</td><td>' + rowSet[25] + '</td><td>' + rowSet[rowSet.length-1] + '</td></tr>';
                    }
                    else {
                        content += '<tr><td><span value="'+rowSet[4]+'" class="player">' + rowSet[5] + '</span></td><td colspan="12" style="font-weight: bold;">'+rowSet[7]+'</td></tr>';
                    }
                })

                var teamStatsRowset = teamStats[0].rowSet;
                console.log('TeamstatsRowset: ' + JSON.stringify(teamStatsRowset));
                var rowSet = teamStatsRowset.filter(function(rowSet){
                    console.log('rowSet: ' + JSON.stringify(rowSet));
                    console.log('acronym: ' + team.acronym);
                    return rowSet[3] == team.acronym;
                })[0];
                //"GAME_ID","TEAM_ID","TEAM_NAME","TEAM_ABBREVIATION","TEAM_CITY","MIN","FGM","FGA","FG_PCT","FG3M","FG3A","FG3_PCT","FTM","FTA","FT_PCT","OREB","DREB","REB","AST","STL","BLK","TO","PF","23PTS","PLUS_MINUS"]
                content += '<tr style="font-weight: bold;"><td>Team Total</td><td> &nbsp;</td><td>' + rowSet[5] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[18] + '</td><td>' + rowSet[6]+'/'+rowSet[7] +'</td><td>' + rowSet[9]+'/'+rowSet[10] + '</td><td>' + rowSet[12]+'/'+rowSet[13] + '</td><td>' + rowSet[19] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td><td>' + rowSet[22] + '</td><td>' + rowSet[rowSet.length-1] + '</td></tr>';

                content += '</table>';

                return content;
            },

            getPreviousAndNextBoxscores: function () {
                var _t = this;
                var boxscores = this.loadedStores.boxscoreList.query();
                this.nextBoxscore=null;
                this.previousBoxscore=null;
                var item = this.loadedStores.boxscoreList.query({gameId: this.gameId})[0];
                if (item && item.hasOwnProperty('id')) {
                    this.next_btn.set('className', "fa fa-caret-down fa-2x");
                    this.next_btn.set('style', "color: white;outline: none !important; height: 100%; width: 30px; line-height: 44px;");
                    this.prev_btn.set('className', "fa fa-caret-up fa-2x");
                    this.prev_btn.set('style', "color: white;outline: none !important; height: 100%; width: 30px; line-height: 44px;");

                    var itemId = item.id;
                    var nextBoxscore = this.loadedStores.boxscoreList.query({id: itemId + 1})
                    if (nextBoxscore.length > 0) {
                        this.nextBoxscore = nextBoxscore[0];
                    }
                    else {
                        this.nextBoxscore = this.loadedStores.boxscoreList.query({id: 0})[0]
                    }

                    var previousBoxscore = this.loadedStores.boxscoreList.query({id: itemId - 1})
                    if (previousBoxscore.length > 0) {
                        this.previousBoxscore = previousBoxscore[0];
                    }
                    else {
                        var lastIndex = this.loadedStores.boxscoreList.query().length-1;
                        this.previousBoxscore = this.loadedStores.boxscoreList.query({id: lastIndex})[0]
                    }

                }

            },

            setEventHandlers: function() {
                var _t = this;
                this.prev_btn.onClick = function () {
                    console.log('prev boxscore clicked : ' + JSON.stringify(_t.previousBoxscore))
                    if (_t.previousBoxscore) {
                        _t.createBoxscore(_t.previousBoxscore.gameId);
                    }
                }
                this.next_btn.onClick = function () {
                    console.log('next boxscore clicked : ' + JSON.stringify(_t.nextBoxscore))
                    if (_t.nextBoxscore) {
                        _t.createBoxscore(_t.nextBoxscore.gameId);
                    }

                }
            },

            setHeader: function () {
                //Set header
                //this.boxscoreDetailHeading.set('label', '<span class="fa fa-table nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.boxscoreDetailHeading);
                this.boxscoreDetailHeading.labelNode.style.display = 'inline';
                this.boxscoreDetailHeading.labelNode.innerHTML = '<span class="fa fa-table nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.boxscoreDetailHeading;
                this.boxscoreDetailHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },

            clearBoxscore: function() {
                var _t = this;
                this.divBoxscore.innerHTML = '';

            },

            beforeDeactivate: function () {
                this.clearBoxscore();
            }


        };
    }
);