define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojox/mobile/Pane",
        "dojox/mobile/ProgressIndicator",
        "dojox/gesture/swipe",
        'dojo/on',
        'dojo/query',
        "dojo/request/script",
        "nba-player-stats/config/appConfig",
        "nba-player-stats/widgets/helpUtils",
        'dojo/i18n!nba-player-stats/nls/playerDetail',
        'dojo/domReady!'
    ],
    function (declare, array, Pane, ProgressIndicator, swipe, on, query, script, appConfig, helpUtils, nls) {

        return {
            beforeActivate: function () {
                
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                this.loadProgressIndicator();
                this.conference = 'East';
                this.teams = helpUtils.getTeams();
                this.getTeamsInfo();
                this.setHeader();
                this.tabButtonEastHandler = on(this.tabButtonEast,'click',function(evt) {
                    _t.loadProgressIndicator();
                    _t.conference = 'East';
                    _t.getTeamsInfo();
                })
                this.tabButtonWestHandler = on(this.tabButtonWest,'click',function(evt) {
                    _t.loadProgressIndicator();
                    _t.conference = 'West';
                    _t.getTeamsInfo();
                })

                this.tabButtonCompleteHandler =  on(this.tabButtonComplete,'click',function(evt) {
                    _t.loadProgressIndicator();
                    _t.conference = 'Complete';
                    _t.getTeamsInfo();
                })
                this.tabButtonPlayoffPictureHandler = on(this.tabButtonPlayoffPicture,'click',function(evt) {
                    _t.loadProgressIndicator();
                    _t.showPlayoffPicture();
                })

                window.scrollTo(0, 0);

            },

            setHeader: function () {

                var icon;
                array.forEach(this.config.mainMenu, function (item) {
                    if (item.target == 'standings') {
                        icon = item.icon;
                    }
                })
                this.headingStandings.domNode.style.backgroundColor = this.config.header.headerColor;
                this.headingStandings.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + 'Standings');
            },

            loadProgressIndicator: function () {
                this.prog = ProgressIndicator.getInstance();
                this.divProgress.addChild(this.prog);
                this.prog.start();
                this.standingsView.style.opacity = '0.5';
            },

            closeProgressIndicator: function () {
                this.prog.stop();
                this.standingsView.style.opacity = '1';
            },

            getTeamsInfo: function () {
                var _t = this;
                var teamsInConference = array.filter(this.teams,function(item) {
                    return (_t.conference == 'Complete' || item.conf == _t.conference);
                })

                var teams = [];
                helpUtils.getJsonData(this.config.teamsIndex).then(function (response) {
                    var resultSets = response.resultSets[0];
                    var rowSet = resultSets.rowSet;
                    console.log('Set: ' + JSON.stringify(rowSet));

                    array.forEach(rowSet, function (row) {
                        var team = {};
                        team.name = row[row.length-1];
                        team.games = row[2];
                        team.wins = row[3];
                        team.losses = row[4];
                        team.winpct = row[5];
                        var numElems = array.filter(teamsInConference,function(item) {
                            return item.label == team.name;
                        })
                        if (numElems.length>0) {
                            teams.push(team);
                        }
                    });
                    teams.sort(function(teamA,teamB){
                        if (teamA.wins > teamB.wins) return -1;
                        if (teamA.wins < teamB.wins) return 1;
                        if (teamA.wins == teamB.wins) {
                            if (teamA.losses > teamB.losses) return 1;
                            if (teamB.losses < teamB.losses) return -1;
                            return 0;
                        }
                    });

                    var content = '<table style="width: 95%;margin: 5px;font-size:10pt">';
                    //Header
                    content += '<tr style="font-weight: bold;">';
                    content += '<td style=" width: 35%;"><div >Team</div></td>';
                    content += '<td style=" width: 5%;"><div ></div></td>';
                    content += '<td style=" width: 15%;"><div>Games</div></td>';
                    content += '<td style=" width: 15%;"><div>Wins</div></td>';
                    content += '<td style=" width: 15%;"><div>Losses</div></td>';
                    content += '<td style=" width: 15%;"><div>Win %</div></td>';
                    content += '</tr>';

                    array.forEach(teams,function(team) {
                        content += '<tr>';
                        content += '<td style=" width: 35%;"><div class="teamCell">'+team.name+'</div></td>';
                        content += '<td style=" width: 5%;"><div ></div></td>';
                        content += '<td style=" width: 15%;"><div>'+team.games+'</div></td>';
                        content += '<td style=" width: 15%;"><div>'+team.wins+'</div></td>';
                        content += '<td style=" width: 15%;"><div>'+team.losses+'</div></td>';
                        content += '<td style=" width: 15%;"><div>'+team.winpct+'</div></td>';
                        content += '</tr>';

                    });

                    content += "</table>";
                    _t.standingsView.innerHTML = content;

                    query(".teamCell").forEach(function (node) {
                        on(node, "click", function (event) {
                            var teamName = node.innerHTML;
                            var team = array.filter(_t.teams,function(item) {
                                return item.label == teamName;
                            })
                            var transOpts = {
                                target: "teamStats",
                                params: {
                                    teamName: team[0].label,
                                    acronym: team[0].acronym //Team ACRONYM. TODO: CHANGE THIS!!
                                }
                            };
                            console.log('TransOpts: ' + JSON.stringify(transOpts));
                            _t.app.transitionToView(event.target, transOpts, event);
                        });
                    });

                    _t.closeProgressIndicator();

                });

            },
            showPlayoffPicture: function() {
                var _t = this;
                var content = '<table style="width: 95%;margin: 5px;font-size:10pt">';
                //Header
                content += '<tr>';
                content += '<td colspan="3" style="width: 50%; font-size: 14pt;" class="infoClass"><div>East</div></td>';
                content += '<td colspan="4" style="width: 50%; font-size: 14pt;" class="infoClass"><div>West</div></td>';
                content += '</tr>';

                var eastPairings=[];
                var westPairings=[];
                helpUtils.getJsonData(this.config.playoffPicture).then(function (response) {
                    var resultSets = response.resultSets;
                    array.forEach(resultSets,function(resultSet) {
                        if (resultSet.name=="EastConfPlayoffPicture") {
                            //East
                            var pairings = resultSet.rowSet;
                            array.forEach(pairings,function(pairing) {
                                eastPairings.push(pairing);
                            })
                        }
                        else if (resultSet.name=="WestConfPlayoffPicture") {
                            //West
                            var pairings = resultSet.rowSet;
                            array.forEach(pairings,function(pairing) {
                                westPairings.push(pairing);
                            })
                        }
                    });

                    array.forEach(eastPairings,function(pairing,i) {
                        var eastTeam1Label = eastPairings[i][2].trim();
                        var eastTeam2Label = eastPairings[i][5].trim();
                        var westTeam1Label = westPairings[i][2].trim();
                        var westTeam2Label = westPairings[i][5].trim();
                        var eastTeam1=_t._getTeamForLabel(eastTeam1Label);
                        var eastTeam2=_t._getTeamForLabel(eastTeam2Label);
                        var westTeam1=_t._getTeamForLabel(westTeam1Label);
                        var westTeam2=_t._getTeamForLabel(westTeam2Label);

                        content += '<tr>';
                        content += '<td style="text-align: center; width: 20%;"><div></div></td>';
                        content += '<td style="text-align: center; width: 3%;"><div>VS</div></td>';
                        content += '<td style="text-align: center; width: 20%;"><div></div></td>';
                        content += '<td style="text-align: center; width: 4%;"><div></div></td>';
                        content += '<td style="text-align: center; width: 20%;"><div></div></td>';
                        content += '<td style="text-align: center; width: 3%;"><div>VS</div></td>';
                        content += '<td style="text-align: center; width: 20%;"><div></div></td>';
                        content += '</tr>'
                        content += '<tr>';
                        content += '<td style="text-align: center; width: 20%;"><div>'+eastTeam1Label+'<br>'+'('+(i+1)+')'+'</div></td>';
                        content += '<td style="text-align: center; width: 3%;"><div>VS</div></td>';
                        content += '<td style="text-align: center; width: 20%;"><div>'+eastTeam2Label+'<br>'+'('+(8-i)+')'+'</div></td>';
                        content += '<td style="text-align: center; width: 4%;"><div></div></td>';
                        content += '<td style="text-align: center; width: 20%;"><div>'+westTeam1Label+'<br>'+'('+(i+1)+')'+'</div></td>';
                        content += '<td style="text-align: center; width: 3%;"><div>VS</div></td>';
                        content += '<td style="text-align: center; width: 20%;"><div>'+westTeam2Label+'<br>'+'('+(8-i)+')'+'</div></td>';
                        content += '</tr>';

                    })

                    content += '</table>';

                    _t.standingsView.innerHTML = content;
                    _t.closeProgressIndicator();

                    //PLAYOFF BRACKET
                     //helpUtils.getJsonData(_t.config.playoffBracket).then(function (response) {
                    /*
                    script(_t.config.playoffBracket, {
                        checkString:"data"
                    }).then(function (response) {
                             console.log('Playoff Bracket: ' + JSON.stringify(response));
                         _t.standingsView.innerHTML = content;
                         _t.closeProgressIndicator();
                     });
                    */

                });


            },

            _getTeamForLabel: function(teamLabel) {
                var tokens = teamLabel.split(' ');
                var teams = helpUtils.getTeams();
                var teamFound = null;
                array.forEach(tokens,function(label) {
                    array.forEach(teams,function(team) {
                        if (team.label.indexOf(label)!=-1) {
                            teamFound = team;
                        }
                    })
                });
                return teamFound;
            },

            beforeDeactivate: function () {
                this.tabButtonEast.set('selected', true);
                this.tabButtonEastHandler.remove();
                this.tabButtonWestHandler.remove();
                this.tabButtonCompleteHandler.remove();
                this.tabButtonPlayoffPictureHandler.remove();
            }

        };
    }
);