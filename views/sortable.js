define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/on",
        "dojo/hash",
        "dojo/io-query",
        "nba-player-stats/widgets/helpUtils",
        'dgrid/OnDemandGrid',
        'dgrid/Selection',
        'dgrid/Selector',
        'dgrid/extensions/DijitRegistry',
        'dstore/Memory',
        "dojo/i18n!nba-player-stats/nls/sortable",
        "nba-player-stats/config/appConfig"
    ],
    function (declare, array, on, hash, ioQuery, helpUtils, OnDemandGrid, Selection, Selector, DijitRegistry, Memory, nls, appConfig) {

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
                this.setCustomizablePlayerList();
                this.loadSortableGrid('season');

            },

            loadSortableGrid: function(type) {
                var _t = this;
                var columns;
                _t.dstore = new Memory({data: _t.loadedStores.playerList.query({}), idProperty: 'name'});
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

                    if (!_t.sortableGrid) {
                        _t.sortableGrid = new (declare([OnDemandGrid, Selection, Selector, DijitRegistry]))({
                            selectionMode: "single",
                            collection: _t.dstore.sort('points', true),
                            columns: columns
                        }, _t.divSortableGrid);

                    }
                    else {
                        _t.sortableGrid.set("columns", columns);
                        _t.sortableGrid.set("collection", _t.dstore.sort('points', true));
                        //_t.sortableGrid.set('sort', [ { property: 'points', descending: true } ]);
                        _t.sortableGrid.refresh();
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


                    //GRID PLAYOFF
                    var filter = new _t.dstore.Filter();
                    var playoffFilter = filter.gt('gamesPlayoff', 0);

                    if (!_t.sortableGrid) {
                        _t.sortableGrid = new (declare([OnDemandGrid, Selection, Selector, DijitRegistry]))({
                            selectionMode: "single",
                            //collection: _t.dstore.filter(playoffFilter).filter(playoffFilter).sort('pointsPlayoff', true),
                            collection: _t.dstore.sort('pointsPlayoff', true),
                            columns: columns
                        }, _t.divSortableGrid);
                    }
                    else {
                        //_t.sortableGrid.set("collection", _t.dstore.filter(playoffFilter).filter(playoffFilter).sort('pointsPlayoff', true));
                        _t.sortableGrid.set("columns", columns);
                        _t.sortableGrid.set("collection", _t.dstore.sort('pointsPlayoff', true));
                        _t.sortableGrid.refresh();
                    }
                }

                if (this.sortableGridListener) {
                    this.sortableGridListener.remove();
                }

                _t.sortableGridListener = _t.sortableGrid.on("dgrid-select", function (event) {
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

                _t.sortableGrid.on('dgrid-error', function (event) {
                    // Display an error message when an error occurs.
                    var obj = JSON.parse(event.error.response.text);
                    console.log(obj.message);
                });

                _t.sortableGrid.startup();
            },

            setCustomizablePlayerList: function() {
                var _t = this;
                this.loadedStores.customizablePlayerList.setData([]);
                var idx = 0;
                this.loadedStores.playerList.query({}).forEach(function(player) {
                    _t.loadedStores.customizablePlayerList.put({
                        id: idx,
                        name: player.name,
                        playerId: player.playerid
                    });
                    idx = idx + 1;
                })
            },

            setHeader: function () {
                var icon;
                array.forEach(this.config.mainMenu, function (item) {
                    if (item.target == 'sortable') {
                        icon = item.icon;
                    }
                })
                this.sortableHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.sortableHeader);
                this.sortableHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },

            beforeDeactivate: function () {
                this.tabButtonSeason.set('selected', true);
                if (this.sortableGridListener) {
                    this.sortableGridListener.remove();
                }

                this.tabButtonSeasonHandler.remove();
                this.tabButtonPlayoffHandler.remove();
            }

        };
    }
);
