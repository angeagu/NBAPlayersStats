define(["dojo/_base/declare",
        "dojox/mobile/SpinWheel",
        "dojox/mobile/SpinWheelSlot",
        "dojo/store/Memory",
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/on",
        "nba-player-stats/widgets/helpUtils",
        "dojo/i18n!nba-player-stats/nls/compare",
        "nba-player-stats/config/appConfig",
        "dojo/domReady!",
    ],
    function (declare, SpinWheel, SpinWheelSlot, Memory, array, aspect, on, helpUtils, nls, appConfig) {

        return {

            beforeActivate: function () {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                this.setHeader();

                //Get Teams.
                var teams = helpUtils.getTeams();
                var teamLabels = [];
                array.forEach(teams, function (team) {
                    teamLabels.push(team.acronym);
                })

                if (!this.slot1) {
                    this.slot1 = new SpinWheelSlot({
                        labels: teamLabels,
                        style: {fontSize: "8pt", textAlign: "center", width: "25%"}
                    });
                    this.slot2 = new SpinWheelSlot({
                        labels: [],
                        style: {fontSize: "8pt", textAlign: "center", width: "75%"}
                    });
                    this.spin1.addChild(this.slot1)
                    this.spin1.addChild(this.slot2)
                    this.slot1.value = teamLabels[0];
                }

                if (!this.slot3) {
                    this.slot3 = new SpinWheelSlot({
                        labels: teamLabels,
                        style: {fontSize: "8pt", textAlign: "center", width: "25%"}
                    });
                    this.slot4 = new SpinWheelSlot({
                        labels: [],
                        style: {fontSize: "8pt", textAlign: "center", width: "75%"}
                    });
                    this.spin2.addChild(this.slot3)
                    this.spin2.addChild(this.slot4);
                    this.slot3.value = teamLabels[0];
                }

                this.setSpinHandlers()

                this.compareHandler = on(this.compareButton, "click", function () {
                    _t.comparePlayers();
                });

            },

            setHeader: function () {
                //Set header
                var icon;
                array.forEach(this.config.mainMenu, function (item) {
                    if (item.target == 'compare') {
                        icon = item.icon;
                    }
                })
                this.compareHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.compareHeader);
                this.compareHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },

            setSpinHandlers: function () {
                var _t = this;
                aspect.before(this.slot1, "slideTo", function () {
                    _t.slot2.disableValues(0);
                });
                aspect.after(this.slot1, "stopAnimation", function () {
                    var team = _t.slot1.get("value");
                    var playerLabels = _t.getPlayers(team);
                    _t.spin1.removeChild(_t.slot2)
                    _t.slot2 = new SpinWheelSlot({
                        labels: playerLabels,
                        style: {fontSize: "8pt", textAlign: "center", width: "75%"}
                    });
                    _t.spin1.addChild(_t.slot2);
                });
                aspect.before(this.slot3, "slideTo", function () {
                    _t.slot4.disableValues(0);

                });
                aspect.after(this.slot3, "stopAnimation", function () {
                    var team = _t.slot3.get("value");
                    var playerLabels = _t.getPlayers(team);
                    _t.spin2.removeChild(_t.slot4)
                    _t.slot4 = new SpinWheelSlot({
                        labels: playerLabels,
                        style: {fontSize: "8pt", textAlign: "center", width: "75%"}
                    });
                    _t.spin2.addChild(_t.slot4);
                });

            },

            getPlayers: function (acronym) {
                //Get Players:
                var playerLabels = [];
                this.loadedStores.playerList.query({team: acronym}).forEach(function (player) {
                    if (player.name.indexOf('\'') != -1) {
                        var escapedStringJugador = player.name.replace("\'", "\\\'");
                        var displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
                    }
                    else {
                        var displayName = player.name.split(' ')[0].charAt(0) + '. ' + player.name.split(' ')[1];
                    }
                    playerLabels.push(displayName)
                })
                return playerLabels;
            },

            comparePlayers: function () {
                var _t = this;
                var team1 = this.slot1.get("value");
                var team2 = this.slot3.get("value");
                var player1 = this.slot2.get("value");
                var player2 = this.slot4.get("value");
                this.loadedStores.playerList.query({team: team1}).forEach(function (player) {
                    if (player.name.indexOf('\'') != -1) {
                        var escapedStringJugador = player.name.replace("\'", "\\\'");
                        var displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
                    }
                    else {
                        var displayName = player.name.split(' ')[0].charAt(0) + '. ' + player.name.split(' ')[1];
                    }
                    if (displayName == player1) {
                        console.log('Player Name 1: ' + displayName)
                        _t.player1id = player.playerid;
                    }
                });
                this.loadedStores.playerList.query({team: team2}).forEach(function (player) {
                    if (player.name.indexOf('\'') != -1) {
                        var escapedStringJugador = player.name.replace("\'", "\\\'");
                        var displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
                    }
                    else {
                        var displayName = player.name.split(' ')[0].charAt(0) + '. ' + player.name.split(' ')[1];
                    }
                    if (displayName == player2) {
                        console.log('Player Name 2: ' + displayName)
                        _t.player2id = player.playerid;
                    }
                });

                var transOpts = {
                    target: "comparison",
                    params: {
                        player1id: this.player1id,
                        player2id: this.player2id
                    }
                };
                _t.app.transitionToView(event.target, transOpts, event);
            },

            beforeDeactivate: function () {
                this.compareHandler.remove();
            }

        };
    }
);
