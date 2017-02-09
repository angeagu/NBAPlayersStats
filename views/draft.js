define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/on",
        "dojo/aspect",
        'dgrid/OnDemandGrid',
        'dgrid/Selection',
        'dgrid/extensions/DijitRegistry',
        "dojox/mobile/ValuePicker",
        "dojox/mobile/ValuePickerSlot",
        'dstore/Memory',
        "nba-player-stats/widgets/helpUtils",
        "dojo/i18n!nba-player-stats/nls/draft",
        "nba-player-stats/config/appConfig"
    ],
    function (declare, array, on, aspect, OnDemandGrid, Selection, DijitRegistry, ValuePicker, ValuePickerSlot, Memory, helpUtils, nls, appConfig) {

        return {


            beforeActivate: function () {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                this.setHeader();
                this.year = new Date().getFullYear();
                this.createSpin();
                this.loadDraft();
                window.scrollTo(0, 0);
            },

            setHeader: function () {
                var icon;
                array.forEach(this.config.mainMenu, function (item) {
                    if (item.target == 'draft') {
                        icon = item.icon;
                    }
                })
                this.draftHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.transactionsHeader);
                this.draftHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },

            loadDraft: function() {
                var _t = this;
                var content = '';
                var url = helpUtils.getDraft() + '&Season=' + this.year;
                helpUtils.getJsonData(url).then(function (response) {
                    var resultSet = response.resultSets[0];
                    var rowSet = resultSet.rowSet;
                    _t.createList(rowSet);
                });
            },

            createSpin: function() {
                var _t = this;
                var years = [];
                for (var i = 1947; i <= this.year; i++) {
                    years.push(i.toString());
                }
                this.spinYear.removeChild(this.slotDraft)
                this.slotDraft = new ValuePickerSlot({
                    labels: years,
                    style: {fontSize: "8pt", textAlign: "center", width: "25%"}
                });
                
                this.spinYear.addChild(this.slotDraft)
                if (this.year) {
                    this.slotDraft.set('value',this.year);
                }
                else {
                    this.slotDraft.set('value',years[0]);
                }
                aspect.after(this.slotDraft, "onClick", function () {
                    setTimeout(function() {
                        _t.year = _t.slotDraft.get("value");
                        _t.loadDraft();
                    },500);
                });
            },
            createList: function(rowSet) {
                var _t = this;
                var data = [];
                array.forEach(rowSet,function(row) {
                   var player = {
                        playerId: row[0],
                        number: row[5],
                        round: row[3],
                        name: row[1],
                        team: row[9],
                        from: row[10]
                   }
                   data.push(player);
                });
                var draftStore = new Memory({data: data, idProperty: "playerId"});
                var columns = [
                    {id: 'number', field: 'number', label: '#Pick'},
                    {id: 'round', field: 'round', label: 'Round'},
                    {id: 'name', field: 'name', label: 'Name'},
                    {id: 'team', field: 'team', label: 'Team'},
                    {id: 'from', field: 'from', label: 'From'}
                ];

                if (!this.draftGrid) {
                    this.draftGrid = new (declare([OnDemandGrid, Selection, DijitRegistry]))({
                        selectionMode: "single",
                        collection: draftStore.sort('number', false),
                        columns: columns
                    }, this.divDraftGrid);
                }
                else {
                    this.draftGrid.set("columns", columns);
                    this.draftGrid.set("collection", draftStore.sort('number', false));
                    this.draftGrid.refresh();
                }

                if (this.draftGridListener) {
                    this.draftGridListener.remove();
                }
                this.draftGridListener = this.draftGrid.on(".dgrid-content .dgrid-row:click", function (event) {
                    // Get the rows that were just selected
                    //var jugador = event.rows[0].data;
                    var jugador = _t.draftGrid.row(event).data;
                    var target = 'historicalPlayerDetail';
                    _t.loadedStores.playerList.query({playerid: jugador.playerId}).forEach(function(player) {
                        target = 'playerDetail'
                    });
                    var transOpts = {
                        target: target,
                        params: {
                            playerId: jugador.playerId
                        }
                    };
                    _t.app.transitionToView(event.target, transOpts, event);

                });

                this.draftGrid.on('dgrid-error', function (event) {
                    // Display an error message when an error occurs.
                    var obj = JSON.parse(event.error.response.text);
                    console.log(obj.message);

                });

                //STARTUP of GRIDS
                this.draftGrid.startup();

                //Load customizable rookie list
                this.loadedStores.customizablePlayerList.setData([]);
                var idx = 0;
                draftStore.sort('number', false).forEach(function(player) {
                    _t.loadedStores.customizablePlayerList.put({
                        id: idx,
                        name: player.name,
                        playerId: player.playerid
                    });
                    idx = idx + 1;
                })
            },

            beforeDeactivate: function () {
                
            }

        };
    }
);
