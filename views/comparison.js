define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/promise/all",
        "dojox/mobile/Pane",
        "dojox/mobile/ProgressIndicator",
        "dojox/gesture/swipe",
        'dojo/dom-geometry',
        'dojo/on',
        'dojo/query',
        'dojo/dom-class',
        "nba-player-stats/config/appConfig",
        "nba-player-stats/widgets/helpUtils",
        'dojo/i18n!nba-player-stats/nls/playerDetail',
        'dojo/domReady!'
    ],
    function (declare, array, all, Pane, ProgressIndicator, swipe, domGeometry, on, query, domClass, appConfig, helpUtils, nls) {

        return {
            beforeActivate: function () {
                query(".detailClassificationCell2").forEach(function(node) {
                    domClass.remove(node,"comparisonHighlight");
                })
                this.loadPlayerData();

            },

            loadPlayerData: function (playerId) {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                this.loadProgressIndicator();

                this.player1id = decodeURIComponent(decodeURIComponent(this.params.player1id));
                this.player2id = decodeURIComponent(decodeURIComponent(this.params.player2id));

                this.loadedStores.playerList.query({playerid: this.player1id}).forEach(function (player) {
                    _t.player1 = player;
                });

                this.loadedStores.playerList.query({playerid: this.player2id}).forEach(function (player) {
                    _t.player2 = player;
                });

                var playerHeaderText = '<div class="playerDetailHeaderClass">' + "PLAYER COMPARISON";
                _t.comparisonHeader.innerHTML = playerHeaderText;
                _t.comparisonHeader.style['background-color'] = _t.config.header.mainMenuHeaderColor;

                this.setHeader();
                this.createStatsPane();
                this.closeProgressIndicator();

            },

            setHeader: function () {

                this.comparisonPlayerDetail.domNode.style.backgroundColor = this.config.header.headerColor;
                this.comparisonPlayerDetail.labelNode.style.display = 'inline';
                this.comparisonPlayerDetail.set('label','<span class="nbaPlayerStatsHeaderIcon"></span>&nbsp; Comparison');
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


            createStatsPane: function () {
                var _t = this;

                //Names
                this.divPlayer1Name.innerHTML = this.player1.name;
                this.divPlayer2Name.innerHTML = this.player2.name;
                //Images
                //this.divImgPlayer1.src='http://stats.nba.com/media/players/230x185/' + this.player1.playerid + '.png'
                //this.divImgPlayer2.src='http://stats.nba.com/media/players/230x185/' + this.player2.playerid + '.png'

                //Games
                this.divPlayer1games.innerHTML = this.player1.games;
                this.divPlayer2games.innerHTML = this.player2.games;
                this.divPlayer1gamesPlayoff.innerHTML = this.player1.gamesPlayoff;
                this.divPlayer2gamesPlayoff.innerHTML = this.player2.gamesPlayoff;
                if (this.player1.games > this.player2.games) {
                    domClass.add(this.divPlayer1games, "comparisonHighlight");
                } else if (this.player2.games > this.player1.games) {
                    domClass.add(this.divPlayer2games, "comparisonHighlight");
                }
                if (this.player1.gamesPlayoff > this.player2.gamesPlayoff) {
                    domClass.add(this.divPlayer1gamesPlayoff, "comparisonHighlight");

                } else if (this.player2.gamesPlayoff > this.player1.gamesPlayoff) {
                    domClass.add(this.divPlayer2gamesPlayoff, "comparisonHighlight");
                }

                //Minutes
                this.divPlayer1minutes.innerHTML = this.player1.minutes;
                this.divPlayer2minutes.innerHTML = this.player2.minutes;
                this.divPlayer1minutesPlayoff.innerHTML = this.player1.minutesPlayoff;
                this.divPlayer2minutesPlayoff.innerHTML = this.player2.minutesPlayoff;
                if (this.player1.minutes > this.player2.minutes) {
                    domClass.add(this.divPlayer1minutes, "comparisonHighlight");
                } else if (this.player2.minutes > this.player1.minutes) {
                    domClass.add(this.divPlayer2minutes, "comparisonHighlight");
                }
                if (this.player1.minutesPlayoff > this.player2.minutesPlayoff) {
                    domClass.add(this.divPlayer1minutesPlayoff, "comparisonHighlight");

                } else if (this.player2.minutesPlayoff > this.player1.minutesPlayoff) {
                    domClass.add(this.divPlayer2minutesPlayoff, "comparisonHighlight");
                }
                
                //Points
                this.divPlayer1points.innerHTML = this.player1.points;
                this.divPlayer2points.innerHTML = this.player2.points;
                this.divPlayer1pointsPlayoff.innerHTML = this.player1.pointsPlayoff;
                this.divPlayer2pointsPlayoff.innerHTML = this.player2.pointsPlayoff;
                if (this.player1.points > this.player2.points) {
                    domClass.add(this.divPlayer1points, "comparisonHighlight");
                } else if (this.player2.points > this.player1.points) {
                    domClass.add(this.divPlayer2points, "comparisonHighlight");
                }
                if (this.player1.pointsPlayoff > this.player2.pointsPlayoff) {
                    domClass.add(this.divPlayer1pointsPlayoff, "comparisonHighlight");

                } else if (this.player2.pointsPlayoff > this.player1.pointsPlayoff) {
                    domClass.add(this.divPlayer2pointsPlayoff, "comparisonHighlight");
                }

                //Rebounds
                this.divPlayer1rebounds.innerHTML = this.player1.rebounds;
                this.divPlayer2rebounds.innerHTML = this.player2.rebounds;
                this.divPlayer1reboundsPlayoff.innerHTML = this.player1.reboundsPlayoff;
                this.divPlayer2reboundsPlayoff.innerHTML = this.player2.reboundsPlayoff;
                if (this.player1.rebounds > this.player2.rebounds) {
                    domClass.add(this.divPlayer1rebounds, "comparisonHighlight");
                } else if (this.player2.rebounds > this.player1.rebounds) {
                    domClass.add(this.divPlayer2rebounds, "comparisonHighlight");
                }
                if (this.player1.reboundsPlayoff > this.player2.reboundsPlayoff) {
                    domClass.add(this.divPlayer1reboundsPlayoff, "comparisonHighlight");

                } else if (this.player2.reboundsPlayoff > this.player1.reboundsPlayoff) {
                    domClass.add(this.divPlayer2reboundsPlayoff, "comparisonHighlight");
                }

                //Assists
                this.divPlayer1assists.innerHTML = this.player1.assists;
                this.divPlayer2assists.innerHTML = this.player2.assists;
                this.divPlayer1assistsPlayoff.innerHTML = this.player1.assistsPlayoff;
                this.divPlayer2assistsPlayoff.innerHTML = this.player2.assistsPlayoff;
                if (this.player1.assists > this.player2.assists) {
                    domClass.add(this.divPlayer1assists, "comparisonHighlight");
                } else if (this.player2.assists > this.player1.assists) {
                    domClass.add(this.divPlayer2assists, "comparisonHighlight");
                }
                if (this.player1.assistsPlayoff > this.player2.assistsPlayoff) {
                    domClass.add(this.divPlayer1assistsPlayoff, "comparisonHighlight");

                } else if (this.player2.assistsPlayoff > this.player1.assistsPlayoff) {
                    domClass.add(this.divPlayer2assistsPlayoff, "comparisonHighlight");
                }

                //Steals
                this.divPlayer1steals.innerHTML = this.player1.steals;
                this.divPlayer2steals.innerHTML = this.player2.steals;
                this.divPlayer1stealsPlayoff.innerHTML = this.player1.stealsPlayoff;
                this.divPlayer2stealsPlayoff.innerHTML = this.player2.stealsPlayoff;
                if (this.player1.steals > this.player2.steals) {
                    domClass.add(this.divPlayer1steals, "comparisonHighlight");
                } else if (this.player2.steals > this.player1.steals) {
                    domClass.add(this.divPlayer2steals, "comparisonHighlight");
                }
                if (this.player1.stealsPlayoff > this.player2.stealsPlayoff) {
                    domClass.add(this.divPlayer1stealsPlayoff, "comparisonHighlight");

                } else if (this.player2.stealsPlayoff > this.player1.stealsPlayoff) {
                    domClass.add(this.divPlayer2stealsPlayoff, "comparisonHighlight");
                }

                //Turnovers
                this.divPlayer1turnovers.innerHTML = this.player1.turnovers;
                this.divPlayer2turnovers.innerHTML = this.player2.turnovers;
                this.divPlayer1turnoversPlayoff.innerHTML = this.player1.turnoversPlayoff;
                this.divPlayer2turnoversPlayoff.innerHTML = this.player2.turnoversPlayoff;
                if (this.player1.turnovers > this.player2.turnovers) {
                    domClass.add(this.divPlayer1turnovers, "comparisonHighlight");
                } else if (this.player2.turnovers > this.player1.turnovers) {
                    domClass.add(this.divPlayer2turnovers, "comparisonHighlight");
                }
                if (this.player1.turnoversPlayoff > this.player2.turnoversPlayoff) {
                    domClass.add(this.divPlayer1turnoversPlayoff, "comparisonHighlight");

                } else if (this.player2.turnoversPlayoff > this.player1.turnoversPlayoff) {
                    domClass.add(this.divPlayer2turnoversPlayoff, "comparisonHighlight");
                }

                //Blocks
                this.divPlayer1blocks.innerHTML = this.player1.blocks;
                this.divPlayer2blocks.innerHTML = this.player2.blocks;
                this.divPlayer1blocksPlayoff.innerHTML = this.player1.blocksPlayoff;
                this.divPlayer2blocksPlayoff.innerHTML = this.player2.blocksPlayoff;
                if (this.player1.blocks > this.player2.blocks) {
                    domClass.add(this.divPlayer1blocks, "comparisonHighlight");
                } else if (this.player2.blocks > this.player1.blocks) {
                    domClass.add(this.divPlayer2blocks, "comparisonHighlight");
                }
                if (this.player1.blocksPlayoff > this.player2.blocksPlayoff) {
                    domClass.add(this.divPlayer1blocksPlayoff, "comparisonHighlight");

                } else if (this.player2.blocksPlayoff > this.player1.blocksPlayoff) {
                    domClass.add(this.divPlayer2blocksPlayoff, "comparisonHighlight");
                }

                //fg%
                this.divPlayer1fgpct.innerHTML = this.player1.fg_pct;
                this.divPlayer2fgpct.innerHTML = this.player2.fg_pct;
                this.divPlayer1fgpctPlayoff.innerHTML = this.player1.fg_pctPlayoff;
                this.divPlayer2fgpctPlayoff.innerHTML = this.player2.fg_pctPlayoff;
                if (this.player1.fg_pct > this.player2.fg_pct) {
                    domClass.add(this.divPlayer1fgpct, "comparisonHighlight");
                } else if (this.player2.fg_pct > this.player1.fg_pct) {
                    domClass.add(this.divPlayer2fgpct, "comparisonHighlight");
                }
                if (this.player1.fg_pctPlayoff > this.player2.fg_pctPlayoff) {
                    domClass.add(this.divPlayer1fgpctPlayoff, "comparisonHighlight");

                } else if (this.player2.fg_pctPlayoff > this.player1.fg_pctPlayoff) {
                    domClass.add(this.divPlayer2fgpctPlayoff, "comparisonHighlight");
                }

                //fg3%
                this.divPlayer1f3pct.innerHTML = this.player1.fg3_pct;
                this.divPlayer2f3pct.innerHTML = this.player2.fg3_pct;
                this.divPlayer1f3pctPlayoff.innerHTML = this.player1.fg3_pctPlayoff;
                this.divPlayer2f3pctPlayoff.innerHTML = this.player2.fg3_pctPlayoff;
                if (this.player1.fg3_pct > this.player2.fg3_pct) {
                    domClass.add(this.divPlayer1f3pct, "comparisonHighlight");
                } else if (this.player2.fg3_pct > this.player1.fg3_pct) {
                    domClass.add(this.divPlayer2f3pct, "comparisonHighlight");
                }
                if (this.player1.fg3_pctPlayoff > this.player2.fg3_pctPlayoff) {
                    domClass.add(this.divPlayer1f3pctPlayoff, "comparisonHighlight");

                } else if (this.player2.fg3_pctPlayoff > this.player1.fg3_pctPlayoff) {
                    domClass.add(this.divPlayer2f3pctPlayoff, "comparisonHighlight");
                }


                //ft%
                this.divPlayer1ftpct.innerHTML = this.player1.ft_pct;
                this.divPlayer2ftpct.innerHTML = this.player2.ft_pct;
                this.divPlayer1ftpctPlayoff.innerHTML = this.player1.ft_pctPlayoff;
                this.divPlayer2ftpctPlayoff.innerHTML = this.player2.ft_pctPlayoff;
                if (this.player1.ft_pct > this.player2.ft_pct) {
                    domClass.add(this.divPlayer1ftpct, "comparisonHighlight");
                } else if (this.player2.ft_pct > this.player1.ft_pct) {
                    domClass.add(this.divPlayer2ftpct, "comparisonHighlight");
                }
                if (this.player1.ft_pctPlayoff > this.player2.ft_pctPlayoff) {
                    domClass.add(this.divPlayer1ftpctPlayoff, "comparisonHighlight");

                } else if (this.player2.ft_pctPlayoff > this.player1.ft_pctPlayoff) {
                    domClass.add(this.divPlayer2ftpctPlayoff, "comparisonHighlight");
                }

                //efficiency
                this.divPlayer1Eff.innerHTML = this.player1.efficiency;
                this.divPlayer2Eff.innerHTML = this.player2.efficiency;
                this.divPlayer1EffPlayoff.innerHTML = this.player1.efficiencyPlayoff;
                this.divPlayer2EffPlayoff.innerHTML = this.player2.efficiencyPlayoff;
                if (this.player1.efficiency > this.player2.efficiency) {
                    domClass.add(this.divPlayer1Eff, "comparisonHighlight");
                } else if (this.player2.efficiency > this.player1.efficiency) {
                    domClass.add(this.divPlayer2Eff, "comparisonHighlight");
                }
                if (this.player1.efficiencyPlayoff > this.player2.efficiencyPlayoff) {
                    domClass.add(this.divPlayer1EffPlayoff, "comparisonHighlight");

                } else if (this.player2.efficiencyPlayoff > this.player1.efficiencyPlayoff) {
                    domClass.add(this.divPlayer2EffPlayoff, "comparisonHighlight");
                }


                //OReb
                this.divPlayer1oreb.innerHTML = this.player1.oreb;
                this.divPlayer2oreb.innerHTML = this.player2.oreb;
                this.divPlayer1orebPlayoff.innerHTML = this.player1.orebPlayoff;
                this.divPlayer2orebPlayoff.innerHTML = this.player2.orebPlayoff;
                if (this.player1.oreb > this.player2.oreb) {
                    domClass.add(this.divPlayer1oreb, "comparisonHighlight");
                } else if (this.player2.oreb > this.player1.oreb) {
                    domClass.add(this.divPlayer2oreb, "comparisonHighlight");
                }
                if (this.player1.orebPlayoff > this.player2.orebPlayoff) {
                    domClass.add(this.divPlayer1orebPlayoff, "comparisonHighlight");

                } else if (this.player2.orebPlayoff > this.player1.orebPlayoff) {
                    domClass.add(this.divPlayer2orebPlayoff, "comparisonHighlight");
                }
                
                //DReb
                this.divPlayer1dreb.innerHTML = this.player1.dreb;
                this.divPlayer2dreb.innerHTML = this.player2.dreb;
                this.divPlayer1drebPlayoff.innerHTML = this.player1.drebPlayoff;
                this.divPlayer2drebPlayoff.innerHTML = this.player2.drebPlayoff;
                if (this.player1.dreb > this.player2.dreb) {
                    domClass.add(this.divPlayer1dreb, "comparisonHighlight");
                } else if (this.player2.dreb > this.player1.dreb) {
                    domClass.add(this.divPlayer2dreb, "comparisonHighlight");
                }
                if (this.player1.drebPlayoff > this.player2.drebPlayoff) {
                    domClass.add(this.divPlayer1drebPlayoff, "comparisonHighlight");

                } else if (this.player2.drebPlayoff > this.player1.drebPlayoff) {
                    domClass.add(this.divPlayer2drebPlayoff, "comparisonHighlight");
                }

                //Asistst Per Turnover
                this.divPlayer1assistsPerTurnover.innerHTML = this.player1.assistsPerTurnover;
                this.divPlayer2assistsPerTurnover.innerHTML = this.player2.assistsPerTurnover;
                this.divPlayer1assistsPerTurnoverPlayoff.innerHTML = this.player1.assistsPerTurnoverPlayoff;
                this.divPlayer2assistsPerTurnoverPlayoff.innerHTML = this.player2.assistsPerTurnoverPlayoff;
                if (this.player1.assistsPerTurnover > this.player2.assistsPerTurnover) {
                    domClass.add(this.divPlayer1assistsPerTurnover, "comparisonHighlight");
                } else if (this.player2.assistsPerTurnover > this.player1.assistsPerTurnover) {
                    domClass.add(this.divPlayer2assistsPerTurnover, "comparisonHighlight");
                }
                if (this.player1.assistsPerTurnoverPlayoff > this.player2.assistsPerTurnoverPlayoff) {
                    domClass.add(this.divPlayer1assistsPerTurnoverPlayoff, "comparisonHighlight");

                } else if (this.player2.assistsPerTurnoverPlayoff > this.player1.assistsPerTurnoverPlayoff) {
                    domClass.add(this.divPlayer2assistsPerTurnoverPlayoff, "comparisonHighlight");
                }


                //Steals Per Turnover
                this.divPlayer1stealsPerTurnover.innerHTML = this.player1.stealsPerTurnover;
                this.divPlayer2stealsPerTurnover.innerHTML = this.player2.stealsPerTurnover;
                this.divPlayer1stealsPerTurnoverPlayoff.innerHTML = this.player1.stealsPerTurnoverPlayoff;
                this.divPlayer2stealsPerTurnoverPlayoff.innerHTML = this.player2.stealsPerTurnoverPlayoff;
                if (this.player1.stealsPerTurnover > this.player2.stealsPerTurnover) {
                    domClass.add(this.divPlayer1stealsPerTurnover, "comparisonHighlight");
                } else if (this.player2.stealsPerTurnover > this.player1.stealsPerTurnover) {
                    domClass.add(this.divPlayer2stealsPerTurnover, "comparisonHighlight");
                }
                if (this.player1.stealsPerTurnoverPlayoff > this.player2.stealsPerTurnoverPlayoff) {
                    domClass.add(this.divPlayer1stealsPerTurnoverPlayoff, "comparisonHighlight");

                } else if (this.player2.stealsPerTurnoverPlayoff > this.player1.stealsPerTurnoverPlayoff) {
                    domClass.add(this.divPlayer2stealsPerTurnoverPlayoff, "comparisonHighlight");
                }

                //Fouls
                this.divPlayer1fouls.innerHTML = this.player1.fouls;
                this.divPlayer2fouls.innerHTML = this.player2.fouls;
                this.divPlayer1foulsPlayoff.innerHTML = this.player1.foulsPlayoff;
                this.divPlayer2foulsPlayoff.innerHTML = this.player2.foulsPlayoff;
                if (this.player1.fouls > this.player2.fouls) {
                    domClass.add(this.divPlayer1fouls, "comparisonHighlight");
                } else if (this.player2.fouls > this.player1.fouls) {
                    domClass.add(this.divPlayer2fouls, "comparisonHighlight");
                }
                if (this.player1.foulsPlayoff > this.player2.foulsPlayoff) {
                    domClass.add(this.divPlayer1foulsPlayoff, "comparisonHighlight");

                } else if (this.player2.foulsPlayoff > this.player1.foulsPlayoff) {
                    domClass.add(this.divPlayer2foulsPlayoff, "comparisonHighlight");
                }

            },

            clearPlayerView: function () {
                var _t = this;
                if (this.comparisonView.getChildren().length != 0) {
                    var children = this.comparisonView.getChildren();
                    array.forEach(children, function (child) {
                        _t.comparisonView.removeChild(child);
                    })
                }
            },

            beforeDeactivate: function () {
                //this.clearPlayerView();
            }
        };
    }
);