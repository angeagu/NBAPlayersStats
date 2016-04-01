define(["dojo/_base/declare",
        "dojo/on",
        "dojo/hash",
        "dojo/query",
        "dojo/i18n!nba-player-stats/nls/teamStats",
        "nba-player-stats/config/appConfig"
    ],
    function (declare, on, hash, query, nls, appConfig) {

        return {

            beforeActivate: function () {
                this.showTeamStats();

            },

            beforeDeactivate: function () {
                this.tabButtonSeason.set('selected', true);
                this.tabButtonSeasonHandler.remove();
                this.tabButtonPlayoffHandler.remove();
            },

            setHeader: function () {
                var icon;
                this.teamStatsHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + this.teamName);
                this.teamStatsHeading.domNode.style.backgroundColor = this.config.header.headerColor;
                this.divLogo.innerHTML = '<div style="text-align: center;"><br><img src="' + require.toUrl("nba-player-stats") + '/img/' + this.acronym + '.gif"></img></div>';
            },

            showTeamStats: function (acronym,teamName) {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                if (acronym) {
                    this.acronym = acronym;
                }
                else {
                    this.acronym = decodeURIComponent(this.params.acronym);
                }
                if (teamName) {
                    this.teamName = teamName;
                }
                else {
                    this.teamName = decodeURIComponent(this.params.teamName);
                }

                console.log('Team Name: ' + this.teamName);

                this.setHeader();
                this.getPreviousAndNextTeams();

                this.tabButtonSeason.set('selected', true);
                if (this.tabButtonSeasonHandler) {
                    this.tabButtonSeasonHandler.remove();
                }
                if (this.tabButtonPlayoffHandler) {
                    this.tabButtonPlayoffHandler.remove();
                }
                this.tabButtonSeasonHandler = on(this.tabButtonSeason,'click',function(evt) {
                    _t.showTeamStats();
                })
                this.tabButtonPlayoffHandler = on(this.tabButtonPlayoff,'click',function(evt) {
                    _t.showTeamStatsPlayoff();
                })

                var text = '<table id="teamStatsTable" style="width: 95%; margin: 5px;">';
                text += '<tr style="font-weight: bold;"><td>Name</td><td>GM</td><td>Mins.</td><td>Points</td><td>Rebs.</td><td>Assists</td><td>Blocks</td><td>Steals</td></tr>';
                var playerData = [];
                this.loadedStores.playerList.query({team: this.acronym}, {
                    sort: [{
                        attribute: 'points',
                        descending: true
                    }]
                }).forEach(function (jugador, i) {
                    text += '<tr>';
                    text += '<td id="playername">';
                    if (jugador.name.indexOf('\'') != -1) {
                        var escapedStringJugador = jugador.name.replace("\'", "\\\'");
                        var searchName = escapedStringJugador;
                        var displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
                    }
                    else {
                        var searchName = jugador.name;
                        var displayName = jugador.name.split(' ')[0].charAt(0) + '. ' + jugador.name.split(' ')[1];
                    }

                    text += '<span value="'+jugador.playerid+'" class="player">' + displayName + '</span>';
                    text += '</td>';
                    text += '<td>';
                    text += jugador.games;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.minutes;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.points;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.rebounds;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.assists;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.blocks;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.steals;
                    text += '</td>';
                    text += '</tr>';

                    //UpdateCustomizablePlayerList array
                    playerData.push({id: i, playerId: jugador.playerid})
                });
                this.loadedStores.customizablePlayerList.setData(playerData);

                text += '</table>';
                this.divTeamStats.innerHTML = text;

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

            },

            showTeamStatsPlayoff: function () {
                var _t = this;
                var text = '<table id="teamStatsTable" style="width: 95%; margin: 5px;">';
                text += '<tr style="font-weight: bold;"><td>Name</td><td>GM</td><td>Mins.</td><td>Points</td><td>Rebs.</td><td>Assists</td><td>Blocks</td><td>Steals</td></tr>';
                var playerData = [];
                this.loadedStores.playerList.query({team: this.acronym}, {
                    sort: [{
                        attribute: 'points',
                        descending: true
                    }]
                }).forEach(function (jugador, i) {
                    text += '<tr>';
                    text += '<td id="playername">';
                    if (jugador.name.indexOf('\'') != -1) {
                        var escapedStringJugador = jugador.name.replace("\'", "\\\'");
                        var searchName = escapedStringJugador;
                        var displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
                    }
                    else {
                        var searchName = jugador.name;
                        var displayName = jugador.name.split(' ')[0].charAt(0) + '. ' + jugador.name.split(' ')[1];
                    }

                    text += '<span value="' + jugador.playerid + '" class="player">' + displayName + '</span>';
                    text += '</td>';
                    text += '<td>';
                    text += jugador.gamesPlayoff;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.minutesPlayoff;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.pointsPlayoff;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.reboundsPlayoff;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.assistsPlayoff;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.blocksPlayoff;
                    text += '</td>';
                    text += '<td>';
                    text += jugador.stealsPlayoff;
                    text += '</td>';
                    text += '</tr>';

                    //UpdateCustomizablePlayerList array
                    playerData.push({id: i, playerId: jugador.playerid})
                });
                this.loadedStores.customizablePlayerList.setData(playerData);

                text += '</table>';
                this.divTeamStats.innerHTML = text;

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
            },

            getPreviousAndNextTeams: function () {
                var _t = this;
                var item = this.loadedStores.teamList.query({acronym: _t.acronym})[0];
                if (item && item.hasOwnProperty('id')) {
                    this.next_btn.set('className', "fa fa-caret-down fa-2x");
                    this.next_btn.set('style', "color: white;outline: none !important; height: 100%; width: 30px; line-height: 44px;");
                    this.prev_btn.set('className', "fa fa-caret-up fa-2x");
                    this.prev_btn.set('style', "color: white;outline: none !important; height: 100%; width: 30px; line-height: 44px;");

                    var itemId = item.id;
                    var nextTeam = this.loadedStores.teamList.query({id: itemId + 1})
                    if (nextTeam.length > 0) {
                        this.nextTeam = nextTeam[0];
                    }
                    else {
                        this.nextTeam = this.loadedStores.teamList.query({id: 0})[0]
                    }

                    var previousTeam = this.loadedStores.teamList.query({id: itemId - 1})
                    if (previousTeam.length > 0) {
                        this.previousTeam = previousTeam[0];

                    }
                    else {
                        var lastIndex = this.loadedStores.teamList.query().length;
                        this.previousTeam = this.loadedStores.teamList.query({id: lastIndex - 1})[0]
                    }

                    this.prev_btn.onClick = function () {
                        if (_t.previousTeam) {
                            _t.showTeamStats(_t.previousTeam.acronym,_t.previousTeam.teamName);
                        }
                    }
                    this.next_btn.onClick = function () {
                        if (_t.nextTeam) {
                            _t.showTeamStats(_t.nextTeam.acronym,_t.nextTeam.teamName);
                        }

                    }
                }

            },

        };
    }
);
