define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/on",
        "dojox/mobile/ListItem",
        "dojox/mobile/EdgeToEdgeStoreList",
        'dojox/mobile/ScrollableView',
        "nba-player-stats/widgets/helpUtils",
        "nba-player-stats/config/appConfig"
    ],
    function (declare, array, domConstruct, on, ListItem, EdgeToEdgeStoreList, ScrollableView, helpUtils, appConfig) {

        var MenuListItem = declare(ListItem, {
            clickable: true
        });

        return {

            beforeActivate: function () {
                this.category = decodeURIComponent(this.params.category);
                this.categoryLabel = decodeURIComponent(decodeURIComponent(this.params.categoryLabel));
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                this.tabButtonSeasonHandler = on(this.tabButtonSeason, 'click', function (evt) {
                    _t.loadCategory(_t.category)
                })
                this.tabButtonPlayoffHandler = on(this.tabButtonPlayoff, 'click', function (evt) {
                    _t.loadCategory(_t.category + 'Playoff');
                })
                //Set Header
                this.setHeader();
                this.loadCategory(this.category);
            },

            loadCategory: function (category) {
                var _t = this;
                var i = 0;
                var playerData = [];
                this.clearPlayerList();
                var generalMinimum = helpUtils.getStatisticalMinimums().generalMinimum;
                var statisticalMinimums = helpUtils.getStatisticalMinimums();
                var generalMinimumPlayoff = helpUtils.getStatisticalMinimumsPlayoff().generalPlayoffMinimum;
                var statisticalMinimumsPlayoff = helpUtils.getStatisticalMinimumsPlayoff();
                this.loadedStores.playerList.query(function (player) {
                        if (category.indexOf('Playoff') == -1) {
                            if (['fg_pct', 'ft_pct', 'fg3_pct', 'assistsPerTurnover', 'stealsPerTurnover'].indexOf(category) != -1) { //Field Goal %, FT %, F3G %
                                if (category == 'fg_pct') {
                                    if ((player.games >= generalMinimum) && ((player.fga * player.games) >= (statisticalMinimums[category + 'Minimum'] * player.games))) {
                                        return player;
                                    }
                                }
                                else if (category == 'ft_pct') {
                                    if ((player.games >= generalMinimum) && ((player.fta * player.games) >= (statisticalMinimums[category + 'Minimum'] * player.games))) {
                                        return player;
                                    }

                                }
                                else if (category == 'fg3_pct') {
                                    if ((player.games >= generalMinimum) && ((player.fg3a * player.games) >= (statisticalMinimums[category + 'Minimum'] * player.games))) {
                                        return player;
                                    }
                                }
                                else if (category == 'stealsPerTurnover') {
                                    if ((player.games >= generalMinimum) && (player.steals >= (statisticalMinimums[category + 'Minimum']))) {
                                        return player;
                                    }
                                }
                                else if (category == 'assistsPerTurnover') {
                                    if ((player.games >= generalMinimum) && (player.assists >= (statisticalMinimums[category + 'Minimum']))) {
                                        return player;
                                    }
                                }
                            }
                            else {
                                if (player.games >= generalMinimum) {
                                    return player;
                                }
                            }
                        }
                        else {
                            //return player;
                            if (['fg_pctPlayoff', 'ft_pctPlayoff', 'fg3_pctPlayoff', 'assistsPerTurnoverPlayoff', 'stealsPerTurnoverPlayoff'].indexOf(category) != -1) { //Field Goal %, FT %, F3G %
                                if (category == 'fg_pctPlayoff') {
                                    console.log('GamesPlayoff: ' + generalMinimumPlayoff + ':' + player.gamesPlayoff);
                                    console.log('FG_Playoff: ' + (statisticalMinimumsPlayoff[category + 'Minimum'] * player.gamesPlayoff) + ':' + player.fgaPlayoff);
                                    if ((player.gamesPlayoff >= generalMinimumPlayoff) && ((player.fgaPlayoff * player.gamesPlayoff) >= (statisticalMinimumsPlayoff[category + 'Minimum'] * player.gamesPlayoff))) {
                                        return player;
                                    }

                                }
                                else if (category == 'ft_pctPlayoff') {
                                    if ((player.gamesPlayoff >= generalMinimumPlayoff) && ((player.ftaPlayoff * player.gamesPlayoff) >= (statisticalMinimumsPlayoff[category + 'Minimum'] * player.gamesPlayoff))) {
                                        return player;
                                    }

                                }
                                else if (category == 'fg3_pctPlayoff') {
                                    if ((player.gamesPlayoff >= generalMinimumPlayoff) && ((player.fg3aPlayoff * player.gamesPlayoff) >= (statisticalMinimumsPlayoff[category + 'Minimum'] * player.gamesPlayoff))) {
                                        return player;
                                    }
                                }
                                else if (category == 'stealsPerTurnoverPlayoff') {
                                    if ((player.gamesPlayoff >= generalMinimumPlayoff) && (player.stealsPlayoff >= (statisticalMinimumsPlayoff[category + 'Minimum']))) {
                                        return player;
                                    }
                                }
                                else if (category == 'assistsPerTurnoverPlayoff') {
                                    if ((player.gamesPlayoff >= generalMinimumPlayoff) && (player.assistsPlayoff >= (statisticalMinimumsPlayoff[category + 'Minimum']))) {
                                        return player;
                                    }
                                }
                            }
                            else {
                                if (player.gamesPlayoff >= generalMinimumPlayoff) {
                                    return player;
                                }
                            }
                        }
                    },
                    {
                        sort: [{
                            attribute: category,
                            descending: true
                        }]
                    }).forEach(function (jugador) {
                        if (i < 50 && jugador[category] != 0) {
                            var text = '';
                            var escapedStringJugador;
                            var displayName;
                            var searchName;
                            if (jugador.name.indexOf('\'') != -1) {
                                var escapedStringJugador = jugador.name.replace("\'", "\\\'");
                                displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
                            }
                            else {
                                displayName = jugador.name.split(' ')[0].charAt(0) + '. ' + jugador.name.split(' ')[1];
                            }
                            var menuItem = new MenuListItem()
                            menuItem.labelNode.style.height = '0px';
                            var divLabel = domConstruct.create("div", {
                                className: "nbaPlayerStatsMenuItemNoFloatNormalWidth",
                                layout: "left"
                            }, menuItem.domNode);
                            divLabel.innerHTML = (i + 1) + ' - ' + displayName;
                            var divStat = domConstruct.create("div", {className: "ListItemRightTextCategories"}, menuItem.domNode);
                            divStat.innerHTML = jugador[category]
                            menuItem.target = 'playerDetail';
                            //menuItem.icon = require.toUrl("nba-player-stats") + '/icons/' + jugador.team + '.gif';

                            var params = {
                                playerId: jugador.playerid
                            };
                            menuItem.transitionOptions = {params: params};
                            _t.playerList.addChild(menuItem);

                            //UpdateCustomizablePlayerList array
                            playerData.push({id: i, playerId: jugador.playerid})
                        }
                        i++;
                    });

                this.loadedStores.customizablePlayerList.setData(playerData);
                window.scrollTo(0, 0);
            },

            setHeader: function () {
                var icon;
                array.forEach(this.config.mainMenu, function (item) {
                    if (item.target == 'categories') {
                        icon = item.icon;
                    }
                })
                this.categoriesHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + this.categoryLabel);
                this.categoriesHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },
            clearPlayerList: function () {
                var _t = this;
                if (this.playerList.getChildren().length != 0) {
                    var children = this.playerList.getChildren();
                    array.forEach(children, function (child) {
                        _t.playerList.removeChild(child);
                    })
                }
            },
            beforeDeactivate: function () {
                this.tabButtonSeason.set('selected', true);
                this.clearPlayerList();
                this.tabButtonSeasonHandler.remove();
                this.tabButtonPlayoffHandler.remove();
            }

        };
    }
);
