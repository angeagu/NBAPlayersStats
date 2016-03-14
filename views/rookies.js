define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/on",
        "nba-player-stats/widgets/helpUtils",
        'dgrid/OnDemandGrid',
        'dgrid/Selection',
        'dgrid/extensions/DijitRegistry',
        'dstore/Memory',
        "dojo/i18n!nba-player-stats/nls/rookies",
        "nba-player-stats/config/appConfig"
    ],
    function (declare, array, on, helpUtils, OnDemandGrid, Selection, DijitRegistry, Memory, nls, appConfig) {

        return {


            beforeActivate: function () {

                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                this.setHeader();
                this.tabButtonSeasonHandler = on(this.tabButtonSeason,'click',function(evt) {
                    _t.loadSortableGrid('season')
                })
                this.tabButtonPlayoffHandler = on(this.tabButtonPlayoff,'click',function(evt) {
                    _t.loadSortableGrid('playoff');
                })
                this.loadSortableGrid('season');
            },

            loadSortableGrid: function(type) {
                var _t = this;
                _t.dstore = new Memory({data: _t.loadedStores.playerList.query({}), idProperty: 'name'});
                var rookiesIds = [];
                var myFilter = _t.dstore.Filter();
                var rookieFilter = myFilter.in('playerid', rookiesIds);

                var filter = new _t.dstore.Filter();
                var playoffFilter = filter.gt('gamesPlayoff', 0);
                var filter = _t.dstore.Filter();
                var rookieAndPlayoffFilter = filter.and(rookieFilter, playoffFilter);

                helpUtils.getJsonData(helpUtils.getRookieIndex()).then(function (response) {
                    var resultSet = response.resultSet;
                    this.rowSet = resultSet.rowSet;
                    array.forEach(this.rowSet, function (row, i) {
                        rookiesIds.push(row[0]);
                    });
                    var columns=[];
                    if (type=='season') {
                        columns = [
                            {id: 'name', field: 'name', label: 'Player', colSpan: 2},
                            {id: 'games', field: 'games', label: 'G'},
                            {id: 'minutes', field: 'minutes', label: 'MPG'},
                            {id: 'points', field: 'points', label: 'PPG'},
                            {id: 'rebounds', field: 'rebounds', label: 'RPG'},
                            {id: 'assists', field: 'assists', label: 'APG'},
                            {id: 'fg_pct', field: 'fg_pct', label: 'FG%'},
                            {id: 'fg3_pct', field: 'fg3_pct', label: '3P%'},
                            {id: 'ft_pct', field: 'ft_pct', label: 'FT%'},
                            {id: 'blocks', field: 'blocks', label: 'BPG'},
                            {id: 'steals', field: 'steals', label: 'SPG'},
                            {id: 'turnovers', field: 'turnovers', label: 'TPG'},
                            {id: 'efficiency', field: 'efficiency', label: 'EFF'}

                        ];

                        if (!_t.rookiesGrid) {
                            _t.rookiesGrid = new (declare([OnDemandGrid, Selection, DijitRegistry]))({
                                selectionMode: "single",
                                collection: _t.dstore.filter(rookieFilter).sort('points', true),
                                columns: columns
                            }, _t.divRookiesGrid);
                        }
                        else {
                            _t.rookiesGrid.set("columns", columns);
                            _t.rookiesGrid.set("collection", _t.dstore.filter(rookieFilter).sort('points', true));
                            _t.rookiesGrid.refresh();
                        }

                    }
                    else if (type=='playoff') {
                        columns = [
                            {id: 'name', field: 'name', label: 'Player', colSpan: 2},
                            {id: 'games', field: 'gamesPlayoff', label: 'G'},
                            {id: 'minutes', field: 'minutesPlayoff', label: 'MPG'},
                            {id: 'points', field: 'pointsPlayoff', label: 'PPG'},
                            {id: 'rebounds', field: 'reboundsPlayoff', label: 'RPG'},
                            {id: 'assists', field: 'assistsPlayoff', label: 'APG'},
                            {id: 'fg_pct', field: 'fg_pctPlayoff', label: 'FG%'},
                            {id: 'fg3_pct', field: 'fg3_pctPlayoff', label: '3P%'},
                            {id: 'ft_pct', field: 'ft_pctPlayoff', label: 'FT%'},
                            {id: 'blocks', field: 'blocksPlayoff', label: 'BPG'},
                            {id: 'steals', field: 'stealsPlayoff', label: 'SPG'},
                            {id: 'turnovers', field: 'turnoversPlayoff', label: 'TPG'},
                            {id: 'efficiency', field: 'efficiencyPlayoff', label: 'EFF'}

                        ];

                        if (!_t.rookiesGrid) {
                            _t.rookiesGrid = new (declare([OnDemandGrid, Selection, DijitRegistry]))({
                                selectionMode: "single",
                                collection: _t.dstore.filter(rookieFilter).sort('pointsPlayoff', true),
                                columns: columns
                            }, _t.divRookiesGrid);
                        }
                        else {
                            _t.rookiesGrid.set("columns", columns);
                            _t.rookiesGrid.set("collection", _t.dstore.filter(rookieFilter).sort('pointsPlayoff', true));
                            _t.rookiesGrid.refresh();
                        }
                    }


                    if (_t.rookiesGridListener) {
                        _t.rookiesGridListener.remove();
                    }
                    _t.rookiesGridListener = _t.rookiesGrid.on("dgrid-select", function (event) {
                        // Get the rows that were just selected
                        var jugador = event.rows[0].data;
                        var transOpts = {
                            target: "playerDetail",
                            params: {
                                playerId: jugador.playerid
                            }
                        };
                        _t.app.transitionToView(event.target, transOpts, event);

                    });

                    _t.rookiesGrid.on('dgrid-error', function (event) {
                        // Display an error message when an error occurs.
                        var obj = JSON.parse(event.error.response.text);
                        console.log(obj.message);

                    });

                    //STARTUP of GRIDS
                    _t.rookiesGrid.startup();


                }).then(function (results) {
                    //console.log('Results: ' + JSON.stringify(results));
                });
            },

            setHeader: function () {
                var icon;
                array.forEach(this.config.mainMenu, function (item) {
                    if (item.target == 'rookies') {
                        icon = item.icon;
                    }
                })
                this.rookiesHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.rookiesHeader);
                this.rookiesHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },

            beforeDeactivate: function () {
                this.tabButtonSeason.set('selected', true);
                if (this.rookiesGridListener) {
                    this.rookiesGridListener.remove();
                }
                if (this.rookiesGridPlayoffListener) {
                    this.rookiesGridPlayoffListener.remove();
                }
            }

        };
    }
);
