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
                this.loadProgressIndicator();
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

            createBoxscore: function () {
                var _t = this;
                var boxscoreUrl = 'http://stats.nba.com/stats/boxscore?GameID='+this.gameId+'&RangeType=0&StartPeriod=0&EndPeriod=0&StartRange=0&EndRange=0';
                    helpUtils.getJsonData(boxscoreUrl).then(function (response) {
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
                        homeTeam.winsLosses = homeRowSet[6];
                        var homeTeamIcon = require.toUrl("nba-player-stats") + '/icons/' + homeTeam.acronym + '.gif';
                        var awayTeam = helpUtils.getTeams().filter(function(team) {
                            return team.acronym == awayRowSet[4]
                        })[0];
                        awayTeam.winsLosses = awayRowSet[6];
                        var awayTeamIcon = require.toUrl("nba-player-stats") + '/icons/' + awayTeam.acronym + '.gif';
                        var homePoints = homeRowSet[homeRowSet.length-1]
                        var awayPoints = awayRowSet[awayRowSet.length-1]

                        var content = '<table style="width: 100%; margin: 5px; font-size: 10pt;">';
                        content += '<tr><th>';
                        content += '<div class="boxscoreHeader"><img src="'+awayTeamIcon+'" </img>&nbsp;'+awayPoints+'&nbsp;';
                        content += awayTeam.acronym + '  at  ';
                        content += homeTeam.acronym + '&nbsp;';
                        content += content = +homePoints+'&nbsp;<img src="'+homeTeamIcon+'" </img></div>';
                        content += '</th></tr></table>';
                        _t.divBoxscore.innerHTML += content;

                        var content = '<table style="width: 100%; margin: 5px; font-size: 10pt;">';
                        content += '<tr><th>';
                        content +='<table style="width: 100%; font-size: 10pt;">'
                        var trHeader='<tr style="font-weight: bold;">';
                        var trHome='<tr style="font-weight: normal;">';
                        var trAway='<tr style="font-weight: normal;">';
                        var flag = true;
                        for (var i=7;i<homeRowSet.length && flag;i++) {
                            if (homeRowSet[i]==0 && awayRowSet[i]==0) {
                                flag = false;
                            }
                            else {
                                if (i>=7 && i <=10) {
                                    trHeader += '<td>Q'+(i-6)+'</td>'
                                }
                                else {
                                    trHeader += '<td>OT'+(i-10)+'</td>'
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

                        //Boxscore
                        var playerStats = resultSets.filter(function(resultSet) {
                            return resultSet.name == 'PlayerStats';
                        });
                        var teamStats = resultSets.filter(function(resultSet) {
                            return resultSet.name == 'TeamStats';
                        });

                        //Away Team
                        var content = _t.getDetailedBoxScoreForTeam(playerStats,teamStats,awayTeam)
                        _t.divBoxscore.innerHTML += content + '<br>';

                        //HomeTeam
                        content = _t.getDetailedBoxScoreForTeam(playerStats,teamStats,homeTeam)
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
                array.forEach(playerStatsRowset,function(rowSet) {
                    if (rowSet[8]!=null) {
                        content += '<tr><td><span value="'+rowSet[4]+'" class="player">' + rowSet[5] + '</span></td><td>' + rowSet[6] + '</td><td>' + rowSet[8] + '</td><td>' + rowSet[26] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td><td>' + rowSet[9]+'/'+rowSet[10] +'</td><td>' + rowSet[12]+'/'+rowSet[13] + '</td><td>' + rowSet[15]+'/'+rowSet[16] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[25] + '</td><td>' + rowSet[24] + '</td><td>' + rowSet[22] + '</td><td>' + rowSet[rowSet.length-1] + '</td></tr>';
                    }
                    else {
                        content += '<tr><td><span value="'+rowSet[4]+'" class="player">' + rowSet[5] + '</span></td><td colspan="12" style="font-weight: bold;">'+rowSet[7]+'</td></tr>';
                    }
                })

                var teamStatsRowset = teamStats[0].rowSet;
                var rowSet = teamStatsRowset.filter(function(rowSet){
                    return rowSet[3] == team.acronym;
                })[0];
                //"GAME_ID","TEAM_ID","TEAM_NAME","TEAM_ABBREVIATION","TEAM_CITY","MIN","FGM","FGA","FG_PCT","FG3M","FG3A","FG3_PCT","FTM","FTA","FT_PCT","OREB","DREB","REB","AST","STL","BLK","TO","PF","23PTS","PLUS_MINUS"]
                content += '<tr style="font-weight: bold;"><td>Team Total</td><td> &nbsp;</td><td>' + rowSet[5] + '</td><td>' + rowSet[23] + '</td><td>' + rowSet[17] + '</td><td>' + rowSet[18] + '</td><td>' + rowSet[6]+'/'+rowSet[7] +'</td><td>' + rowSet[9]+'/'+rowSet[10] + '</td><td>' + rowSet[12]+'/'+rowSet[13] + '</td><td>' + rowSet[19] + '</td><td>' + rowSet[20] + '</td><td>' + rowSet[21] + '</td><td>' + rowSet[22] + '</td><td>' + rowSet[rowSet.length-1] + '</td></tr>';

                content += '</table>';

                return content;
            },

            setHeader: function () {
                //Set header
                this.boxscoreDetailHeading.set('label', '<span class="fa fa-table nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.boxscoreDetailHeading);
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