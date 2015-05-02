define([
    "dojo/_base/declare",
    'dojo/_base/array',
    'dojo/request/script',
    'dojo/dom',
    'dstore/Memory',
    'dgrid/OnDemandGrid',
    'dgrid/Selection'
    ],
    function(declare,array,script,dom,Memory,OnDemandGrid,Selection) {

        return declare([], {
            playerArray: [],
            teams: [],
            rowSet: [],
            dataReady: false,
            playoffsEnabled: true,
            playerStore: null,
            teamsStore: null,

            getData: function () {

				var modaldialog = $('#loadingDataPopup');
				modaldialog.empty();
				modaldialog.append('<br><br><br>Loading NBA.com Player Data. Please Wait... <br><br><br><br>');
				modaldialog.popup( "open" );
				
                var _this = this;
                this.getTeams();
                //Shooting
                //var url = 'http://stats.nba.com/js/data/sportvu/2014/shootingData.json';
                //REGULAR SEASON
                script.get("http://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=Totals&Scope=S&Season=2014-15&SeasonType=Regular+Season&StatCategory=PTS", {
                    jsonp: "callback"
                }).then(function (response) {
                    
                    //console.log('Response: ' + JSON.stringify(response));
                    _this._parseData(response);
                    
                    //PLAYOFFS
                	script.get("http://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=Totals&Scope=S&Season=2014-15&SeasonType=Playoffs&StatCategory=PTS", {
                    	jsonp: "callback"
                		}).then(function (response) {
                    		//console.log('Response: ' + JSON.stringify(response));
                    		_this._parseDataPlayoffs(response);
                    		_this.showCategoryLeaders();
                    		_this.createSortableGrid();
                    		_this.createRookiesGrid();
                    		modaldialog.popup( "close" );
                		}).then(function (results) {
                    		//console.log('Results: ' + JSON.stringify(results));
                    		modaldialog.popup( "close" );
                	});
                	
                }).then(function (results) {
                	//console.log('Results: ' + JSON.stringify(results));
                	modaldialog.popup( "close" );
                });
                
				showTab('tabPlayers');
            },

            _parseData: function(jsondata) {
                //console.log('jsonData: ' + JSON.stringify(jsondata));
                //var parsedData = JSON.parse(jsondata);
                var _t = this;
                var resultSet = jsondata.resultSet;
                this.rowSet = resultSet.rowSet;
                for (var i = 0; i < this.rowSet.length; i++) {
                    var partidos=_t.rowSet[i][4];
                    var player = {
                        playerid: _t.rowSet[i][0],
                        name: _t.rowSet[i][2],
                        team: _t.rowSet[i][3],
                        games: _t.rowSet[i][4],
                        minutes: parseFloat((_t.rowSet[i][5]/partidos).toFixed(1)),
                        fgm: parseFloat((_t.rowSet[i][6]/partidos).toFixed(1)),
                        fga: parseFloat((_t.rowSet[i][7]/partidos).toFixed(1)),
                        fg_pct: parseFloat((_t.rowSet[i][8]*100).toFixed(1)),
                        fg3m: parseFloat((_t.rowSet[i][9]/partidos).toFixed(1)),
                        fg3a: parseFloat((_t.rowSet[i][10]/partidos).toFixed(1)),
                        fg3_pct: parseFloat((_t.rowSet[i][11]*100).toFixed(1)),
                        ftm: parseFloat((_t.rowSet[i][12]/partidos).toFixed(1)),
                        fta: parseFloat((_t.rowSet[i][13]/partidos).toFixed(1)),
                        ft_pct: parseFloat((_t.rowSet[i][14]*100).toFixed(1)),
                        oreb: parseFloat((_t.rowSet[i][15]/partidos).toFixed(1)),
                        dreb: parseFloat((_t.rowSet[i][16]/partidos).toFixed(1)),
                        rebounds: parseFloat((_t.rowSet[i][17]/partidos).toFixed(1)),
                        assists: parseFloat((_t.rowSet[i][18]/partidos).toFixed(1)),
                        steals: parseFloat((_t.rowSet[i][19]/partidos).toFixed(1)),
                        blocks: parseFloat((_t.rowSet[i][20]/partidos).toFixed(1)),
                        turnovers: parseFloat((_t.rowSet[i][21]/partidos).toFixed(1)),
                        points: parseFloat((_t.rowSet[i][23]/partidos).toFixed(1)),
                        efficiency: parseFloat((_t.rowSet[i][24]/partidos).toFixed(1)),
                        fouls: parseFloat((_t.rowSet[i][22]/partidos).toFixed(1)),
                        assistsPerTurnover: parseFloat((_t.rowSet[i][25]).toFixed(1)),
                        stealsPerTurnover: parseFloat((_t.rowSet[i][26]).toFixed(1)),
                        gamesPlayoff: 0,
                		minutesPlayoff: 0,
                		fgmPlayoff: 0,
                		fgaPlayoff: 0,
                		fg_pctPlayoff: 0,
                		fg3mPlayoff: 0,
                		fg3aPlayoff: 0,
                		fg3_pctPlayoff: 0,
                		ftmPlayoff: 0,
                		ftaPlayoff: 0,
                		ft_pctPlayoff: 0,
                		orebPlayoff: 0,
                		drebPlayoff: 0,
                		reboundsPlayoff: 0,
                		assistsPlayoff: 0,
                		stealsPlayoff: 0,
                		blocksPlayoff: 0,
                		turnoversPlayoff: 0,
                		pointsPlayoff: 0,
                		efficiencyPlayoff: 0,
                		foulsPlayoff: 0,
                        assistsPerTurnoverPlayoff: 0,
                        stealsPerTurnoverPlayoff: 0
                    }

                    this.playerArray.push(player);
                }

				//console.log('jsonData: ' + JSON.stringify(this.playerArray));
				this.dataReady=true;
				this._initializenbaplayers(this.playerArray);
            },
            
            _parseDataPlayoffs: function(jsondata) {
                //console.log('parseDataPlayoffs jsonData: ' + JSON.stringify(jsondata));
                //var parsedData = JSON.parse(jsondata);
                var _t = this;
                var resultSet = jsondata.resultSet;
                this.rowSet = resultSet.rowSet;
                array.forEach(this.rowSet, function(row,i) {
                		var playerid = row[0];
                		array.forEach(_t.playerArray, function(player,j) {
                			if (player.playerid == playerid) {
                				//PLAYOFF DATA
                				var partidos = row[4];
                        		player.gamesPlayoff= row[4];
                        		player.minutesPlayoff= parseFloat((row[5]/partidos).toFixed(1));
                        		player.fgmPlayoff= parseFloat((row[6]/partidos).toFixed(1));
                        		player.fgaPlayoff= parseFloat((row[7]/partidos).toFixed(1));
                        		player.fg_pctPlayoff= parseFloat((_t.rowSet[i][8]*100).toFixed(1));
                        		player.fg3mPlayoff= parseFloat((row[9]/partidos).toFixed(1));
                        		player.fg3aPlayoff= parseFloat((row[10]/partidos).toFixed(1));
                        		player.fg3_pctPlayoff= parseFloat((_t.rowSet[i][11]*100).toFixed(1));
                        		player.ftmPlayoff= parseFloat((row[12]/partidos).toFixed(1));
                        		player.ftaPlayoff= parseFloat((row[13]/partidos).toFixed(1));
                        		player.ft_pctPlayoff= parseFloat((_t.rowSet[i][14]*100).toFixed(1));
                        		player.orebPlayoff= parseFloat((row[15]/partidos).toFixed(1));
                        		player.drebPlayoff= parseFloat((row[16]/partidos).toFixed(1));
                        		player.reboundsPlayoff= parseFloat((row[17]/partidos).toFixed(1));
                        		player.assistsPlayoff= parseFloat((row[18]/partidos).toFixed(1));
                        		player.stealsPlayoff= parseFloat((row[19]/partidos).toFixed(1));
                        		player.blocksPlayoff= parseFloat((row[20]/partidos).toFixed(1));
                        		player.turnoversPlayoff= parseFloat((row[21]/partidos).toFixed(1));
                        		player.pointsPlayoff= parseFloat((row[23]/partidos).toFixed(1));
                        		player.efficiencyPlayoff= parseFloat((row[24]/partidos).toFixed(1));
                        		player.foulsPlayoff= parseFloat((_t.rowSet[i][22]/partidos).toFixed(1));
                        		player.assistsPerTurnoverPlayoff= parseFloat((_t.rowSet[i][25]).toFixed(1));
                        		player.stealsPerTurnoverPlayoff= parseFloat((_t.rowSet[i][26]).toFixed(1));
                        		//console.log('player: ' +  JSON.stringify(_t.playerArray[i]));
                        	}
                        	
                		});
				});
                
                //Creamos el store
                this.playerStore = new Memory({data:this.playerArray, idProperty: 'playerid'});
            },

            getTeams: function() {
            	
                this.teams.push({id_team:1,name:"New York Knicks",conf:"East",acronym:"NYK"});
                this.teams.push({id_team:2,name:"Indiana Pacers",conf:"East",acronym:"IND"});
                this.teams.push({id_team:3,name:"Chicago Bulls",conf:"East",acronym:"CHI"});
                this.teams.push({id_team:4,name:"Boston Celtics",conf:"East",acronym:"BOS"});
                this.teams.push({id_team:5,name:"Brooklyn Nets",conf:"East",acronym:"BKN"});
                this.teams.push({id_team:6,name:"San Antonio Spurs",conf:"West",acronym:"SAS"});
                this.teams.push({id_team:7,name:"Oklahoma City Thunder",conf:"West",acronym:"OKC"});
                this.teams.push({id_team:8,name:"Los Angeles Clippers",conf:"West",acronym:"LAC"});
                this.teams.push({id_team:9,name:"Los Angeles Lakers",conf:"West",acronym:"LAL"});
                this.teams.push({id_team:10,name:"Denver Nuggets",conf:"West",acronym:"DEN"});
                this.teams.push({id_team:11,name:"Memphis Grizzlies",conf:"West",acronym:"MEM"});
                this.teams.push({id_team:12,name:"Atlanta Hawks",conf:"East",acronym:"ATL"});
                this.teams.push({id_team:13,name:"Milwaukee Bucks",conf:"East",acronym:"MIL"});
                this.teams.push({id_team:14,name:"Toronto Raptors",conf:"East",acronym:"TOR"});
                this.teams.push({id_team:15,name:"Philadelphia 76ers",conf:"East",acronym:"PHI"});
                this.teams.push({id_team:16,name:"Washington Wizards",conf:"East",acronym:"WAS"});
                this.teams.push({id_team:17,name:"Detroit Pistons",conf:"East",acronym:"DET"});
                this.teams.push({id_team:18,name:"Cleveland Cavaliers",conf:"East",acronym:"CLE"});
                this.teams.push({id_team:19,name:"Orlando Magic",conf:"East",acronym:"ORL"});
                this.teams.push({id_team:20,name:"Charlotte Hornets",conf:"East",acronym:"CHA"});
                this.teams.push({id_team:21,name:"Golden State Warriors",conf:"West",acronym:"GSW"});
                this.teams.push({id_team:22,name:"Houston Rockets",conf:"West",acronym:"HOU"});
                this.teams.push({id_team:23,name:"Utah Jazz",conf:"West",acronym:"UTA"});
                this.teams.push({id_team:24,name:"Dallas Mavericks",conf:"West",acronym:"DAL"});
                this.teams.push({id_team:25,name:"Portland Trail Blazers",conf:"West",acronym:"POR"});
                this.teams.push({id_team:26,name:"Minnesota Timberwolves",conf:"West",acronym:"MIN"});
                this.teams.push({id_team:27,name:"Sacramento Kings",conf:"West",acronym:"SAC"});
                this.teams.push({id_team:28,name:"New Orleans Pelicans",conf:"West",acronym:"NOP"});
                this.teams.push({id_team:29,name:"Phoenix Suns",conf:"West",acronym:"PHX"});
                
                
               
            },
            
            _initializenbaplayers: function (playerArray) {
            
    		   this.crearListaListView(this.playerArray);
			},
			
			crearListaListView: function (results) {
				//console.log('entrando con results: ' + JSON.stringify(results))
				var text;
				if (results.length==0) {
	    			//console.log('No hay resultados');
	    			return false;
				}

				$listview = $('#listview-jugadores');
				$listview.empty();
				for (var i=0; i<results.length; i++) {
					if (results[i]!=undefined && results[i]!=null) {
						var jugador = results[i].name;
						var equipo = results[i].team;
					}

					if (jugador!=null && jugador!=undefined) {
			
						var escapedStringJugador;
						var text;
						if (jugador.indexOf('\'') != -1) {
							var escapedStringJugador = jugador.replace("\'","\\\'");
							text = '<li class="ui-screen-hidden" data-filtertext="'+jugador+'"><a href="#" onclick="javascript:playerData.cargarJugador(\''+escapedStringJugador+'-'+equipo+'\');" >'+jugador+'  -  '+equipo+'</a></li>';
						}
						else {
							text = '<li class="ui-screen-hidden" data-filtertext="'+jugador+'"><a href="#" onclick="javascript:playerData.cargarJugador(\''+jugador+'-'+equipo+'\');" >'+jugador+'  -  '+equipo+'</a></li>';
						}

					$listview.append(text);
			
				}
			}
	
			$listview.listview();
			$listview.listview('refresh');

			},
			
			actualizaJugadores: function(nameSelectEquipo,nameSelectJugador) {
				//console.log('Entrando en actualizaJugadores con nameSelectEquipo: ' + nameSelectEquipo);
				nameSelectEquipo = '#'+ nameSelectEquipo;
				$select = $(nameSelectEquipo);
				var siglas = $select.val();
				var filteredArray = array.filter(this.playerArray, function(jugador){
      				return jugador.team == siglas;
    			});
    			//console.log('Filtered Array: ' + JSON.stringify(filteredArray));
    			this.crearListaJugadores(nameSelectJugador,filteredArray);	
	
			},
			
			cargarListaEquipos: function(nameSelect) {
				var _t = this;
				nameSelect = '#'+nameSelect
				$select = $(nameSelect);
                $select.empty();
                
                if (this.teamsStore == null) {
                	this.teamsStore = new Memory({data:this.teams, idProperty: 'acronym'});
                }
                
                this.teamsStore.filter()
                .sort({
					property: 'name',
					descending: false
				})
				.forEach(function (team) {
                //array.forEach(this.teams,function(team,i) {
                    	$select.append('<option value="'+team.acronym+'">'+team.name+'</option>');
                    	$select.selectmenu("refresh", true);
              		
                });

			},
			
			crearListaJugadores: function(nameSelectJugador,results) {
				//console.log('entrando en crear lista jugadores con nameSelectJugador: ' + nameSelectJugador);
				//console.log("Num filas devueltas: " + results.length);
				if (results.length==0) {
	    			//console.log('No hay resultados');
	    			return false;
				}
	
				nameSelectJugador = '#'+nameSelectJugador;
				$select = $(nameSelectJugador);
				$select.empty();
				for (var i=0; i<results.length; i++) {
					var nombre = results[i].name;
					if (nombre!=null && nombre!=undefined) {
						$select.append('<option value="'+nombre+'">'+nombre+'</option>');
					}
				}
				$select.selectmenu("refresh", true);
	
			},
			
			cargarJugador: function(string) {
				//console.log("entrandoenCargarJugador con string: " + string);
				$('#playerPopup').popup( "open" );
				if (string.length == 0) { 
					var jugador = '';
					//De momento, si no se carga la URL, no se pone el Lower Case.
					var selectJugador = $('#select-jugador').val();
					var equipo = $('#select-equipo').val();
	
					if (selectJugador!=undefined && selectJugador.length>0) {
						jugador = selectJugador;
					}
					else {
						jugador = string;
					}
				}
				else {
					//Entramos desde el listview de b�squeda.
					var array = string.split("-");
					if (array.length == 2) {
						jugador = array[0];
						equipo = array[1];
					}
					else if (array.length > 2) {
						jugador = array[0] + '-' + array[1];
						equipo = array[2];
					}
				} 
	
				var datagridtext = "";
				//$('#playerPopup').empty();
					
				this.playerStore.filter({ name: jugador })
				.forEach(function (player) {	
						
						//Player Personal Info
						//PLAYOFFS
                		script.get("http://stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID="+player.playerid+"&SeasonType=Regular+Season", {
                    		jsonp: "callback"
                		}).then(function (response) {
                			//$('#playerPopup').append("Loading Player Data...........................................................");
                			var resultSets = response.resultSets[0];
                			var rowSet = resultSets.rowSet[0];
                    		
                    		var birthdate = new Date(rowSet[6]);
                    		player.birthdate= birthdate.getMonth() + 1 + '/' + birthdate.getDate() + '/' + birthdate.getFullYear();
                    		player.from=rowSet[9];
                    		player.country=rowSet[8];
                    		player.height=rowSet[10];
                    		player.weight=rowSet[11];
                    		player.number=rowSet[13];
                    		player.numSeasons=rowSet[12];
                    		player.position=rowSet[14];
                    		
                    		//Headers
                    		$('#divPlayerName').empty().append(player.name+'<br><span class="playerInfoClass">'+player.team+'<br>'+player.birthdate+'<br>'+player.country+'</span>');
                    		$('#divPlayerInfo').empty().append('<span class="playerInfoClass2">'+player.weight+' lbs/'+player.height+'<br>Exp:'+player.numSeasons+' years<br>From: '+player.from+'</span>');
                    		$('#divImage').empty().append('<img src="http://stats.nba.com/media/players/230x185/'+player.playerid+'.png" height="60px", width="75px"></img>');
                    		//console.log('Player: ' + JSON.stringify(player));
                    		//Cabeceras
							/*datagridtext += '<div id="datagrid" class="ui-grid-b">';
					
							datagridtext += '<div class="ui-block-a"><div id="divName" class="ui-bar ui-bar-c" style="height:100px">'+</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divTeam" class="ui-bar ui-bar-c" style="height:100px"><span class="playerInfoClass2">'+player.weight+' lbs/'+player.height+'<br>Exp:'+player.numSeasons+' years<br>From: '+player.from+'</span></div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divTeam" class="ui-bar ui-bar-c" style="height:100px"><img src="http://stats.nba.com/media/players/230x185/'+player.playerid+'.png" height="60px", width="75px"></img></div></div>';
			
			
							datagridtext += '<div class="ui-block-a"><div id="divName" class="ui-bar ui-bar-a" style="height:10px">Category</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divTeam" class="ui-bar ui-bar-a" style="height:10px">Season</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divTeam" class="ui-bar ui-bar-a" style="height:10px">Playoff</div></div>';
			
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Games</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divGames" class="ui-bar ui-bar-b" style="height:10px">'+player.games+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divGames" class="ui-bar ui-bar-b" style="height:10px">'+player.gamesPlayoff+'</div></div>';
			
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Minutes</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.minutes+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.minutesPlayoff+'</div></div>';
			
			
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Points</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divPoints" class="ui-bar ui-bar-b" style="height:10px">'+player.points+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divPoints" class="ui-bar ui-bar-b" style="height:10px">'+player.pointsPlayoff+'</div></div>';
			
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Rebounds</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divRebounds" class="ui-bar ui-bar-b" style="height:10px">'+player.rebounds+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divRebounds" class="ui-bar ui-bar-b" style="height:10px">'+player.reboundsPlayoff+'</div></div>';
			
			
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Assists</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divAssists" class="ui-bar ui-bar-b" style="height:10px">'+player.assists+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divAssists" class="ui-bar ui-bar-b" style="height:10px">'+player.assistsPlayoff+'</div></div>';
			
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Steals</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divSteals" class="ui-bar ui-bar-b" style="height:10px">'+player.steals+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divSteals" class="ui-bar ui-bar-b" style="height:10px">'+player.stealsPlayoff+'</div></div>';
			
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Turnovers</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divSteals" class="ui-bar ui-bar-b" style="height:10px">'+player.turnovers+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divSteals" class="ui-bar ui-bar-b" style="height:10px">'+player.turnoversPlayoff+'</div></div>';
			
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Blocks</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divBlocks" class="ui-bar ui-bar-b" style="height:10px">'+player.blocks+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divBlocks" class="ui-bar ui-bar-b" style="height:10px">'+player.blocksPlayoff+'</div></div>';
						
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">FG %</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.fg_pct+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.fg_pctPlayoff+'</div></div>';
						
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">3PFG%</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.fg3_pct+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.fg3_pctPlayoff+'</div></div>';
						
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">FT %</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.ft_pct+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.ft_pctPlayoff+'</div></div>';
						
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Off-Reb</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.oreb+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.orebPlayoff+'</div></div>';
						
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Deff-Reb</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.dreb+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.drebPlayoff+'</div></div>';
						
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Ast/Tov</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.assistsPerTurnover+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.assistsPerTurnoverPlayoff+'</div></div>';
						
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Stl/Tov</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.stealsPerTurnover+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.stealsPerTurnoverPlayoff+'</div></div>';
						
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Fouls</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.fouls+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.foulsPlayoff+'</div></div>';
						
							datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:10px">Efficiency</div></div>';
							datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.efficiency+'</div></div>';
							datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:10px">'+player.efficiencyPlayoff+'</div></div>';
			
							datagridtext += '</div>';
							datagridtext += '<br>';
							datagridtext += '<div  align="center">';
							datagridtext += '<input type="button" value="Close" onclick="$(\'#playerPopup\').popup( \'close\' ); return false;" >';
							//datagridtext += '<a href="index.html" onclick="$(\'#playerPopup\').popup( \'close\' );" data-role="button" data-mini="true">Close</a>';
							datagridtext += '</div>';		
							
							$('#playerPopup').empty();
							$('#playerPopup').append(datagridtext);
							*/
							
                    		
                    		
                    		
                		}).then(function (results) {
                    		//console.log('Results: ' + JSON.stringify(results));
                		});
						

                		//Data
                		$('#divGames').empty().append(player.games);
                		$('#divGamesPlayoff').empty().append(player.gamesPlayoff);
                		$('#divPoints').empty().append(player.points);
                		$('#divPointsPlayoff').empty().append(player.pointsPlayoff);
                		$('#divAssists').empty().append(player.assists);
                		$('#divAssistsPlayoff').empty().append(player.assistsPlayoff);
                		$('#divRebounds').empty().append(player.rebounds);
                		$('#divReboundsPlayoff').empty().append(player.reboundsPlayoff);
                		$('#divSteals').empty().append(player.steals);
                		$('#divStealsPlayoff').empty().append(player.stealsPlayoff);
                		$('#divBlocks').empty().append(player.blocks);
                		$('#divBlocksPlayoff').empty().append(player.blocksPlayoff);
                		$('#divMinutes').empty().append(player.minutes);
                		$('#divMinutesPlayoff').empty().append(player.minutesPlayoff);
                		$('#divTurnovers').empty().append(player.turnovers);
                		$('#divTurnoversPlayoff').empty().append(player.turnoversPlayoff);
                		$('#divAssistsPerTurnover').empty().append(player.assistsPerTurnover);
                		$('#divAssistsPerTurnoverPlayoff').empty().append(player.assistsPerTurnoverPlayoff);
                		$('#divStealsPerTurnover').empty().append(player.stealsPerTurnover);
                		$('#divStealsPerTurnoverPlayoff').empty().append(player.stealsPerTurnoverPlayoff);
                		$('#divFgPct').empty().append(player.fg_pct);
                		$('#divFgPctPlayoff').empty().append(player.fg_pctPlayoff);
                		$('#divFg3Pct').empty().append(player.fg3_pct);
                		$('#divFg3PctPlayoff').empty().append(player.fg3_pctPlayoff);
                		$('#divFtPct').empty().append(player.ft_pct);
                		$('#divFtPctPlayoff').empty().append(player.ft_pctPlayoff);
                		$('#divOReb').empty().append(player.oreb);
                		$('#divORebPlayoff').empty().append(player.orebPlayoff);
                		$('#divDReb').empty().append(player.dreb);
                		$('#divDRebPlayoff').empty().append(player.drebPlayoff);
                		$('#divFouls').empty().append(player.dreb);
                		$('#divFoulsPlayoff').empty().append(player.drebPlayoff);
                		$('#divEfficiency').empty().append(player.efficiency);
                		$('#divEfficiencyPlayoff').empty().append(player.efficiencyPlayoff);
						
					//}
					
				});
				
			},
			
			showTeamStats: function() {
				$('input:radio[name="radioTeamStats"][value="regularSeason"]').click();
    			$('input:radio[name="radioTeamStats"][value="regularSeason"]').click();
    
    			$select = $('#select-equipo-statsbyteam');
				var siglas = $select.val();
    
    			var divTeamStats = $('#divTeamStats');
    			divTeamStats.empty();
    			var text='<div align="center"><span align="center"><b>REGULAR SEASON</b></span></div>';
    			text += '<table id="teamStatsTable">';
    			text+='<tr><th>Name</th><th>Games</th><th>Mins.</th><th>Points</th><th>Rebs.</th><th>Assists</th><th>Blocks</th><th>Steals</th></tr>';
    			this.playerStore.filter({ team: siglas })
				.sort({
					property: 'points',
					descending: true
				})
				.forEach(function (jugador) {
					text+= '<tr>';
        			text+= '<td id="playername">';
        			text+= jugador.name;
        			text+= '</td>';
        			text+= '<td>';
        			text+= jugador.games;
        			text+= '</td>';
        			text+= '<td>';
        			text+= jugador.minutes;
        			text+= '</td>';
        			text+= '<td>';
        			text+= jugador.points;
        			text+= '</td>';
        			text+= '<td>';
        			text+= jugador.rebounds;
        			text+= '</td>';
        			text+= '<td>';
        			text+= jugador.assists;
        			text+= '</td>';
        			text+= '<td>';
        			text+= jugador.blocks;
        			text+= '</td>';
        			text+= '<td>';
        			text+= jugador.steals;
        			text+= '</td>';
        			text+= '</tr>';
				});
        			
    			text += '</table>';
    			divTeamStats.append(text);
    
			    //PLAYOFFS
    
    			var esEquipoPlayoff=false;
    			var divTeamPlayoffStats = $('#divTeamPlayoffStats');
    			divTeamPlayoffStats.empty();
    			divTeamPlayoffStats.hide();
    			if (!this.playoffsEnabled) {
    				divTeamPlayoffStats.hide();
    			} else {
    				divTeamPlayoffStats.empty();
    				var text = '<div align="center"><span align="center"><b>PLAYOFFS</b></span></div>';
    				text += '<table id="teamPlayoffStatsTable">';
    				text+='<tr><th>Name</th><th>Games</th><th>Mins.</th><th>Points</th><th>Rebs.</th><th>Assists</th><th>Blocks</th><th>Steals</th></tr>';
    				this.playerStore.filter({ team: siglas })
    				.sort({
    					property: 'pointsPlayoff',
    					descending: true
    				})
    				.forEach(function (jugador) {
    	    			text+= '<tr>';
        				text+= '<td id="playername">';
        				text+= jugador.name;
        				text+= '</td>';
        				text+= '<td>';
        				if (jugador.gamesPlayoff!=0 && jugador.gamesPlayoff!=undefined) {
        					esEquipoPlayoff=true;
        				}
        				if (jugador.gamesPlayoff==undefined) {
        					jugador.gamesPlayoff="0";
        				}
        				text+= (jugador.gamesPlayoff==undefined) ? "0" : jugador.gamesPlayoff;
        				text+= '</td>';
        				text+= '<td>';
        				text+= (jugador.minutesPlayoff==undefined) ? "0" : jugador.minutesPlayoff;
        				text+= '</td>';
        				text+= '<td>';
        				text+= (jugador.pointsPlayoff==undefined) ? "0" : jugador.pointsPlayoff;
        				text+= '</td>';
        				text+= '<td>';
        				text+= (jugador.reboundsPlayoff==undefined) ? "0" : jugador.reboundsPlayoff;
        				text+= '</td>';
        				text+= '<td>';
        				text+= (jugador.assistsPlayoff==undefined) ? "0" : jugador.assistsPlayoff;
        				text+= '</td>';
        				text+= '<td>';
        				text+= (jugador.blocksPlayoff==undefined) ? "0" : jugador.blocksPlayoff;
        				text+= '</td>';
        				text+= '<td>';
        				text+= (jugador.stealsPlayoff==undefined) ? "0" : jugador.stealsPlayoff;
        				text+= '</td>';
        				text+= '</tr>';
    				});
    				text += '</table>';
    				if (esEquipoPlayoff) {
    					divTeamPlayoffStats.append(text);
    				}
    				else {
    					divTeamPlayoffStats.append('Team not qualified for playoffs');
    				}
    			}
    
    			$('input[type=radio][name=radioTeamStats]').change(function() {
        			if (this.value == 'regularSeason') {
            			divTeamStats.show();
            			divTeamPlayoffStats.hide();
        			}
        			else if (this.value == 'playoffs') {
        				divTeamStats.hide();
            			divTeamPlayoffStats.show();
        			}
    			});
    
			},
			
			
			showCategoryLeaders: function() {
				var _t = this;
				var divTopCategories = $('#topCategories');
				var divTopCategoriesPlayoff = $('#topCategoriesPlayoff');
				divTopCategoriesPlayoff.hide();
	
				$('input[type=radio][name=radioCategories]').change(function() {
        			if (this.value == 'regularSeason') {
            			divTopCategories.show();
            			divTopCategoriesPlayoff.hide();
        			}
        			else if (this.value == 'playoffs') {
        				divTopCategoriesPlayoff.show();
        				divTopCategories.hide();
            
        			}
    			});
    			
    			function getCategoryLeaders(div,category) {  		
    				div.empty();
    				var text = '<table>';
    				var j = 0;
    				var i = 0;
    				_t.playerStore.sort({
    					property: category,
    					descending: true
    				})
    				.forEach(function (jugador) {
    					if (i<10) {
    						var escapedStringJugador;
            				var displayName;
            				var searchName;
            				if (jugador.name.indexOf('\'') != -1) {
                				var escapedStringJugador = jugador.name.replace("\'","\\\'");
                				searchName = escapedStringJugador;
                				displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
            				}
            				else {
                				searchName = jugador.name;
                				displayName = jugador.name.split(' ')[0].charAt(0) + '. ' + jugador.name.split(' ')[1];     
            				}
            				text +='<tr><td><a href=\'#\' onclick="playerData.cargarJugador(\''+searchName+'-'+jugador.team+'\'); return false;" >'+ (i+1) + '. ' +displayName+'</a></td><td>'+jugador[category]+'</td></tr>';
            				//text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador[category] + '</td></tr>';
            				i = i+1;
    					}
    				});	
        			
        			text+='</table>';
        			div.append(text);
        			return text;
    				
    			}

    			//Regular Season
    			getCategoryLeaders($('#divCategoryPoints'),'points');
    			getCategoryLeaders($('#divCategoryAssists'),'assists');
    			getCategoryLeaders($('#divCategoryRebounds'),'rebounds');
    			getCategoryLeaders($('#divCategoryBlocks'),'blocks');
    			getCategoryLeaders($('#divCategorySteals'),'steals');
    			getCategoryLeaders($('#divCategoryMinutes'),'minutes');
    			getCategoryLeaders($('#divCategoryTurnovers'),'turnovers');
    			getCategoryLeaders($('#divCategoryEfficiency'),'efficiency');
    			getCategoryLeaders($('#divCategoryFieldGoal'),'fg_pct');
    			getCategoryLeaders($('#divCategory3PointFieldGoal'),'fg3_pct');
    			getCategoryLeaders($('#divCategoryFreeThrow'),'ft_pct');
    			getCategoryLeaders($('#divCategoryPersonalFouls'),'fouls');
    			getCategoryLeaders($('#divCategoryAssistsPerTurnover'),'assistsPerTurnover');
    			getCategoryLeaders($('#divCategoryStealsPerTurnover'),'stealsPerTurnover');
    			
    			//Playoffs
    			getCategoryLeaders($('#divCategoryPointsPlayoff'),'pointsPlayoff');
    			getCategoryLeaders($('#divCategoryAssistsPlayoff'),'assistsPlayoff');
    			getCategoryLeaders($('#divCategoryReboundsPlayoff'),'reboundsPlayoff');
    			getCategoryLeaders($('#divCategoryBlocksPlayoff'),'blocksPlayoff');
    			getCategoryLeaders($('#divCategoryStealsPlayoff'),'stealsPlayoff');
    			getCategoryLeaders($('#divCategoryMinutesPlayoff'),'minutesPlayoff');
    			getCategoryLeaders($('#divCategoryTurnoversPlayoff'),'turnoversPlayoff');
    			getCategoryLeaders($('#divCategoryEfficiencyPlayoff'),'efficiencyPlayoff');
    			getCategoryLeaders($('#divCategoryFieldGoalPlayoff'),'fg_pctPlayoff');
    			getCategoryLeaders($('#divCategory3PointFieldGoalPlayoff'),'fg3_pctPlayoff');
    			getCategoryLeaders($('#divCategoryFreeThrowPlayoff'),'ft_pctPlayoff');
    			getCategoryLeaders($('#divCategoryPersonalFoulsPlayoff'),'foulsPlayoff');
    			getCategoryLeaders($('#divCategoryAssistsPerTurnoverPlayoff'),'assistsPerTurnoverPlayoff');
    			getCategoryLeaders($('#divCategoryStealsPerTurnoverPlayoff'),'stealsPerTurnoverPlayoff');
    			 
   			},
   			
   			createSortableGrid: function() {
   				
   				$('input:radio[name="radioSortable"][value="regularSeason"]').click();
   	    		$('input:radio[name="radioSortable"][value="regularSeason"]').click();
   	    			
   				var divSortableGrid = $('#divSortableGrid');
   				var divSortableGridPlayoff = $('#divSortableGridPlayoff');
   				divSortableGrid.empty();
   				divSortableGridPlayoff.empty();
   				divSortableGridPlayoff.hide();
   		
   				$('input[type=radio][name=radioSortable]').change(function() {
   	        		if (this.value == 'regularSeason') {
   	            		divSortableGrid.style.display = 'block';
   						divSortableGridPlayoff.style.display = 'none';
   						sortableGrid.resize();
   	        		}
   	        		else if (this.value == 'playoffs') {
   		       			divSortableGrid.style.display= 'none';
   						divSortableGridPlayoff.style.display = 'block';
   	            		sortableGridPlayoff.resize();
   	        		}
   	    		});
   	    
   			
   				var _t = this;
   				var columns = [
   	                {id: 'name', field: 'name', label: 'Player', colSpan: 2, formatter: function (value) {
                    		var escapedStringJugador;
            				var displayName;
            				var searchName;
            				var text;
            				if (value.indexOf('\'') != -1) {
                				var escapedStringJugador = value.replace("\'","\\\'");
                				searchName = escapedStringJugador;
                				displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
            				}
            				else {
                				searchName = value;
                				displayName = value.split(' ')[0].charAt(0) + '. ' + value.split(' ')[1];     
            				}
            				text ='<a href=\'#\' onclick="playerData.cargarJugador(\''+searchName+'-'+'\'); return false;" >'+value+'</a>';
                    		return text;
                		}},
   	                //{id: 'team', field: 'team', label: 'Team'},
   	                {id: 'games', field: 'games', label: 'G'},
   	                {id: 'minutes', field: 'minutes', label: 'MPG'},
   	                {id: 'points', field: 'points', label: 'PPG'},
   	                {id: 'rebounds', field: 'rebounds', label: 'RPG'},
   	                //{id: 'offrebounds', field: 'oreb', label: 'Off. Rebs/PG'},
   	                //{id: 'defrebounds', field: 'dreb', label: 'Def. Rebs/PG'},
   	                {id: 'assists', field: 'assists', label: 'APG'},
   	                {id: 'fg_pct', field: 'fg3_pct', label: 'FG%'},
   	                {id: 'fg3_pct', field: 'fg3_pct', label: '3P%'},
   	                {id: 'ft_pct', field: 'ft_pct', label: 'FT%'},
   	                {id: 'blocks', field: 'blocks', label: 'BPG'},
   	                {id: 'steals', field: 'steals', label: 'SPG'},
   	                {id: 'turnovers', field: 'turnovers', label: 'TPG'},
   	                {id: 'efficiency', field: 'efficiency', label: 'EFF'}

   	            ];
   	            
   	            var columnsPlayoff = [
   	                {id: 'name', field: 'name', label: 'Player', colSpan: 2, formatter: function (value) {
                    		var escapedStringJugador;
            				var displayName;
            				var searchName;
            				var text;
            				if (value.indexOf('\'') != -1) {
                				var escapedStringJugador = value.replace("\'","\\\'");
                				searchName = escapedStringJugador;
                				displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
            				}
            				else {
                				searchName = value;
                				displayName = value.split(' ')[0].charAt(0) + '. ' + value.split(' ')[1];     
            				}
            				text ='<a href=\'#\' onclick="playerData.cargarJugador(\''+searchName+'-'+'\'); return false;" >'+value+'</a>';
                    		return text;
                		}},
   	                //{id: 'team', field: 'team', label: 'Team'},
   	                {id: 'games', field: 'gamesPlayoff', label: 'G'},
   	                {id: 'minutes', field: 'minutesPlayoff', label: 'MPG'},
   	                {id: 'points', field: 'pointsPlayoff', label: 'PPG'},
   	                {id: 'rebounds', field: 'reboundsPlayoff', label: 'RPG'},
   	                //{id: 'offrebounds', field: 'orebPlayoff', label: 'ORPG'},
   	                //{id: 'defrebounds', field: 'drebPlayoff', label: 'DRPG'},
   	                {id: 'assists', field: 'assistsPlayoff', label: 'APG'},
   	                {id: 'fg_pct', field: 'fg3_pctPlayoff', label: 'FG%'},
   	                {id: 'fg3_pct', field: 'fg3_pctPlayoff', label: '3P%'},
   	                {id: 'ft_pct', field: 'ft_pctPlayoff', label: 'FT%'},
   	                {id: 'blocks', field: 'blocksPlayoff', label: 'BPG'},
   	                {id: 'steals', field: 'stealsPlayoff', label: 'SPG'},
   	                {id: 'turnovers', field: 'turnoversPlayoff', label: 'TPG'},
   	                {id: 'efficiency', field: 'efficiencyPlayoff', label: 'EFF'}

   	            ];

   				var divSortableGrid = dom.byId("divSortableGrid");
   	            var sortableGrid = new (declare([OnDemandGrid]))({
   	                selectionMode: "none",
   	                collection: _t.playerStore.sort('points',true),
   	                columns: columns
   	            }, divSortableGrid);

   	            sortableGrid.on('dgrid-error', function(event) {
   	                // Display an error message when an error occurs.
   	                var obj = JSON.parse(event.error.response.text);
   	                console.log(obj.message);

   	            });
   	            
   	            //GRID PLAYOFF
   	            var filter = new _t.playerStore.Filter();
   	            var playoffFilter = filter.gt('gamesPlayoff',0);
   	            var divSortableGridPlayoff = dom.byId("divSortableGridPlayoff");
   	            var sortableGridPlayoff = new (declare([OnDemandGrid]))({
   	                selectionMode: "none",
   	                collection: _t.playerStore.filter(playoffFilter).sort('pointsPlayoff',true),
   	                columns: columnsPlayoff
   	            }, divSortableGridPlayoff);

   	            

   	            sortableGridPlayoff.on('dgrid-error', function(event) {
   	                // Display an error message when an error occurs.
   	                var obj = JSON.parse(event.error.response.text);
   	                console.log(obj.message);

   	            });
   	            
   	            
   	            //STARTUP of GRIDS
   	            sortableGrid.startup();
   	            sortableGridPlayoff.startup();
   			},
   			
   		createRookiesGrid: function() {
   		
   			var _t = this;
   			var rookiesIds=[];
   			script.get("http://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=Totals&Scope=Rookies&Season=2014-15&SeasonType=Regular+Season&StatCategory=PTS", {
                    jsonp: "callback"
                }).then(function (response) {
                	var resultSet = response.resultSet;
                	this.rowSet = resultSet.rowSet;
                	array.forEach(this.rowSet, function(row,i) {
                		rookiesIds.push(row[0]);
                	});
                	
                	$('input:radio[name="radioRookies"][value="regularSeason"]').click();
   	    			$('input:radio[name="radioRookies"][value="regularSeason"]').click();
   	    			
   					var divRookiesGrid = $('#divRookiesGrid');
   					var divRookiesGridPlayoff = $('#divRookiesGridPlayoff');
   					divRookiesGrid.empty();
   					divRookiesGridPlayoff.empty();
   					divRookiesGridPlayoff.hide();
   		
   					$('input[type=radio][name=radioRookies]').change(function() {
   	        			if (this.value == 'regularSeason') {
   	            			divRookiesGrid.style.display = 'block';
   							divRookiesGridPlayoff.style.display = 'none';
   							rookiesGrid.resize();
   	        			}
   	        			else if (this.value == 'playoffs') {
   		       				divRookiesGrid.style.display= 'none';
   							divRookiesGridPlayoff.style.display = 'block';
   	            			rookiesGridPlayoff.resize();
   	        			}
   	    			});
   	    
   			
   					var columns = [
   	                	{id: 'name', field: 'name', label: 'Player', colSpan: 2,formatter: function (value) {
                    		var escapedStringJugador;
            				var displayName;
            				var searchName;
            				var text;
            				if (value.indexOf('\'') != -1) {
                				var escapedStringJugador = value.replace("\'","\\\'");
                				searchName = escapedStringJugador;
                				displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
            				}
            				else {
                				searchName = value;
                				displayName = value.split(' ')[0].charAt(0) + '. ' + value.split(' ')[1];     
            				}
            				text ='<a href=\'#\' onclick="playerData.cargarJugador(\''+searchName+'-'+'\'); return false;" >'+value+'</a>';
                    		return text;
                		}},
   	                	//{id: 'team', field: 'team', label: 'Team'},
   	                	{id: 'games', field: 'games', label: 'G'},
   	                	{id: 'minutes', field: 'minutes', label: 'MPG'},
   	                	{id: 'points', field: 'points', label: 'PPG'},
   	                	{id: 'rebounds', field: 'rebounds', label: 'RPG'},
   	                	//{id: 'offrebounds', field: 'oreb', label: 'Off. Rebs/PG'},
   	                	//{id: 'defrebounds', field: 'dreb', label: 'Def. Rebs/PG'},
   	                	{id: 'assists', field: 'assists', label: 'APG'},
   	                	{id: 'fg_pct', field: 'fg3_pct', label: 'FG%'},
   	                	{id: 'fg3_pct', field: 'fg3_pct', label: '3P%'},
   	                	{id: 'ft_pct', field: 'ft_pct', label: 'FT%'},
   	                	{id: 'blocks', field: 'blocks', label: 'BPG'},
   	                	{id: 'steals', field: 'steals', label: 'SPG'},
   	                	{id: 'turnovers', field: 'turnovers', label: 'TPG'},
   	                	{id: 'efficiency', field: 'efficiency', label: 'EFF'}

	   	            ];
   	            
   	            	var columnsPlayoff = [
   	                	{id: 'name', field: 'name', label: 'Player', colSpan: 2,formatter: function (value) {
                    		var escapedStringJugador;
            				var displayName;
            				var searchName;
            				var text;
            				if (value.indexOf('\'') != -1) {
                				var escapedStringJugador = value.replace("\'","\\\'");
                				searchName = escapedStringJugador;
                				displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
            				}
            				else {
                				searchName = value;
                				displayName = value.split(' ')[0].charAt(0) + '. ' + value.split(' ')[1];     
            				}
            				text ='<a href=\'#\' onclick="playerData.cargarJugador(\''+searchName+'-'+'\'); return false;" >'+value+'</a>';
                    		return text;
                		}},
   	                	//{id: 'team', field: 'team', label: 'Team'},
   	                	{id: 'games', field: 'gamesPlayoff', label: 'G'},
   	                	{id: 'minutes', field: 'minutesPlayoff', label: 'MPG'},
   	                	{id: 'points', field: 'pointsPlayoff', label: 'PPG'},
   	                	{id: 'rebounds', field: 'reboundsPlayoff', label: 'RPG'},
   	                	//{id: 'offrebounds', field: 'orebPlayoff', label: 'ORPG'},
   	                	//{id: 'defrebounds', field: 'drebPlayoff', label: 'DRPG'},
   	                	{id: 'assists', field: 'assistsPlayoff', label: 'APG'},
   	                	{id: 'fg_pct', field: 'fg3_pctPlayoff', label: 'FG%'},
   	                	{id: 'fg3_pct', field: 'fg3_pctPlayoff', label: '3P%'},
   	                	{id: 'ft_pct', field: 'ft_pctPlayoff', label: 'FT%'},
   	                	{id: 'blocks', field: 'blocksPlayoff', label: 'BPG'},
   	                	{id: 'steals', field: 'stealsPlayoff', label: 'SPG'},
   	                	{id: 'turnovers', field: 'turnoversPlayoff', label: 'TPG'},
   	                	{id: 'efficiency', field: 'efficiencyPlayoff', label: 'EFF'}
	
   		            ];

					var myFilter = new _t.playerStore.Filter();
					var gamesFilter = myFilter.gt('gamesPlayoff',0);
					
					myFilter = new _t.playerStore.Filter();
   	        	    var rookieFilter = myFilter.in('playerid',rookiesIds);
   	               	            
   					var divRookiesGrid = dom.byId("divRookiesGrid");
   	            	var rookiesGrid = new (declare([OnDemandGrid]))({
   	                	selectionMode: "none",
   	                	collection: _t.playerStore.filter(rookieFilter).sort('points',true),
   	                	columns: columns
   	            	}, divRookiesGrid);

   	            	rookiesGrid.on('dgrid-error', function(event) {
   	                	// Display an error message when an error occurs.
   	                	var obj = JSON.parse(event.error.response.text);
   	                	console.log(obj.message);

   	            	});
   	            
   	            	//GRID PLAYOFF
   	            	var filter = new _t.playerStore.Filter();
   	            	var playoffFilter = filter.ne('gamesPlayoff',undefined);
   	            	var filter = new _t.playerStore.Filter();
   	            	var rookieAndPlayoffFilter = filter.and(rookieFilter,playoffFilter);
   	            	var divRookiesGridPlayoff = dom.byId("divRookiesGridPlayoff");
   	            	
   	            	var rookiesGridPlayoff = new (declare([OnDemandGrid]))({
   	                	selectionMode: "none",
   	                	collection: _t.playerStore.filter(gamesFilter).filter(rookieAndPlayoffFilter).sort('pointsPlayoff',true),
   	                	columns: columnsPlayoff
   	            	}, divRookiesGridPlayoff);

   	            

   	            	rookiesGridPlayoff.on('dgrid-error', function(event) {
   	                	// Display an error message when an error occurs.
   	                	var obj = JSON.parse(event.error.response.text);
   	                	console.log(obj.message);

   	            	});
   	            
   	            
   	            	//STARTUP of GRIDS
   	            	rookiesGrid.startup();
   	            	rookiesGridPlayoff.startup();
                	
                	
                }).then(function (results) {
                		//console.log('Results: ' + JSON.stringify(results));
                });
   				
   				
   			},
   			
   			comparePlayers: function() {
   				$('#playerComparisonPopup').popup( "open" );
   				var _t = this;
   				$selectPlayer1 = $('#select-player1');
   				$selectPlayer2 = $('#select-player2');
				
   				var namePlayer1 = $selectPlayer1.val();
   				var namePlayer2 = $selectPlayer2.val();
   				console.log('player1Name: ' + namePlayer1);
   				console.log('player2Name: ' + namePlayer2);
   				var player1;
   				var player2;
   				
   				//Find in store player1
   				_t.playerStore.filter({name:namePlayer1}).forEach(function (jugador) {
   					player1=jugador;
   				});
   				//Find in store player2
   				_t.playerStore.filter({name:namePlayer2}).forEach(function (jugador) {
   					player2=jugador;
   				});
   				
   				console.log('player1Data: ' + JSON.stringify(player1));
   				console.log('player2Data: ' + JSON.stringify(player2));
   				
   				$('#divPlayer1Name').empty().append(player1.name+'<br><span class="playerInfoClass">'+player1.team+'<br></span>');
        		$('#divImagePlayer1').empty().append('<img src="http://stats.nba.com/media/players/230x185/'+player1.playerid+'.png" height="60px", width="75px"></img>');
        		$('#divPlayer2Name').empty().append(player2.name+'<br><span class="playerInfoClass">'+player2.team+'<br></span>');
        		$('#divImagePlayer2').empty().append('<img src="http://stats.nba.com/media/players/230x185/'+player2.playerid+'.png" height="60px", width="75px"></img>');
        		
        		$('#divGamesPlayer1').empty().append(player1.games);
        		$('#divGamesPlayoffPlayer1').empty().append(player1.gamesPlayoff);
        		$('#divPointsPlayer1').empty().append(player1.points);
        		$('#divPointsPlayoffPlayer1').empty().append(player1.pointsPlayoff);
        		$('#divAssistsPlayer1').empty().append(player1.assists);
        		$('#divAssistsPlayoffPlayer1').empty().append(player1.assistsPlayoff);
        		$('#divReboundsPlayer1').empty().append(player1.rebounds);
        		$('#divReboundsPlayoffPlayer1').empty().append(player1.reboundsPlayoff);
        		$('#divStealsPlayer1').empty().append(player1.steals);
        		$('#divStealsPlayoffPlayer1').empty().append(player1.stealsPlayoff);
        		$('#divBlocksPlayer1').empty().append(player1.blocks);
        		$('#divBlocksPlayoffPlayer1').empty().append(player1.blocksPlayoff);
        		$('#divMinutesPlayer1').empty().append(player1.minutes);
        		$('#divMinutesPlayoffPlayer1').empty().append(player1.minutesPlayoff);
        		$('#divTurnoversPlayer1').empty().append(player1.turnovers);
        		$('#divTurnoversPlayoffPlayer1').empty().append(player1.turnoversPlayoff);
        		$('#divAssistsPerTurnoverPlayer1').empty().append(player1.assistsPerTurnover);
        		$('#divAssistsPerTurnoverPlayoffPlayer1').empty().append(player1.assistsPerTurnoverPlayoff);
        		$('#divStealsPerTurnoverPlayer1').empty().append(player1.stealsPerTurnover);
        		$('#divStealsPerTurnoverPlayoffPlayer1').empty().append(player1.stealsPerTurnoverPlayoff);
        		$('#divFgPctPlayer1').empty().append(player1.fg_pct);
        		$('#divFgPctPlayoffPlayer1').empty().append(player1.fg_pctPlayoff);
        		$('#divFg3PctPlayer1').empty().append(player1.fg3_pct);
        		$('#divFg3PctPlayoffPlayer1').empty().append(player1.fg3_pctPlayoff);
        		$('#divFtPctPlayer1').empty().append(player1.ft_pct);
        		$('#divFtPctPlayoffPlayer1').empty().append(player1.ft_pctPlayoff);
        		$('#divORebPlayer1').empty().append(player1.oreb);
        		$('#divORebPlayoffPlayer1').empty().append(player1.orebPlayoff);
        		$('#divDRebPlayer1').empty().append(player1.dreb);
        		$('#divDRebPlayoffPlayer1').empty().append(player1.drebPlayoff);
        		$('#divFoulsPlayer1').empty().append(player1.dreb);
        		$('#divFoulsPlayoffPlayer1').empty().append(player1.drebPlayoff);
        		$('#divEfficiencyPlayer1').empty().append(player1.efficiency);
        		$('#divEfficiencyPlayoffPlayer1').empty().append(player1.efficiencyPlayoff);
        		
        		$('#divGamesPlayer2').empty().append(player2.games);
        		$('#divGamesPlayoffPlayer2').empty().append(player2.gamesPlayoff);
        		$('#divPointsPlayer2').empty().append(player2.points);
        		$('#divPointsPlayoffPlayer2').empty().append(player2.pointsPlayoff);
        		$('#divAssistsPlayer2').empty().append(player2.assists);
        		$('#divAssistsPlayoffPlayer2').empty().append(player2.assistsPlayoff);
        		$('#divReboundsPlayer2').empty().append(player2.rebounds);
        		$('#divReboundsPlayoffPlayer2').empty().append(player2.reboundsPlayoff);
        		$('#divStealsPlayer2').empty().append(player2.steals);
        		$('#divStealsPlayoffPlayer2').empty().append(player2.stealsPlayoff);
        		$('#divBlocksPlayer2').empty().append(player2.blocks);
        		$('#divBlocksPlayoffPlayer2').empty().append(player2.blocksPlayoff);
        		$('#divMinutesPlayer2').empty().append(player2.minutes);
        		$('#divMinutesPlayoffPlayer2').empty().append(player2.minutesPlayoff);
        		$('#divTurnoversPlayer2').empty().append(player2.turnovers);
        		$('#divTurnoversPlayoffPlayer2').empty().append(player2.turnoversPlayoff);
        		$('#divAssistsPerTurnoverPlayer2').empty().append(player2.assistsPerTurnover);
        		$('#divAssistsPerTurnoverPlayoffPlayer2').empty().append(player2.assistsPerTurnoverPlayoff);
        		$('#divStealsPerTurnoverPlayer2').empty().append(player2.stealsPerTurnover);
        		$('#divStealsPerTurnoverPlayoffPlayer2').empty().append(player2.stealsPerTurnoverPlayoff);
        		$('#divFgPctPlayer2').empty().append(player2.fg_pct);
        		$('#divFgPctPlayoffPlayer2').empty().append(player2.fg_pctPlayoff);
        		$('#divFg3PctPlayer2').empty().append(player2.fg3_pct);
        		$('#divFg3PctPlayoffPlayer2').empty().append(player2.fg3_pctPlayoff);
        		$('#divFtPctPlayer2').empty().append(player2.ft_pct);
        		$('#divFtPctPlayoffPlayer2').empty().append(player2.ft_pctPlayoff);
        		$('#divORebPlayer2').empty().append(player2.oreb);
        		$('#divORebPlayoffPlayer2').empty().append(player2.orebPlayoff);
        		$('#divDRebPlayer2').empty().append(player2.dreb);
        		$('#divDRebPlayoffPlayer2').empty().append(player2.drebPlayoff);
        		$('#divFoulsPlayer2').empty().append(player2.dreb);
        		$('#divFoulsPlayoffPlayer2').empty().append(player2.drebPlayoff);
        		$('#divEfficiencyPlayer2').empty().append(player2.efficiency);
        		$('#divEfficiencyPlayoffPlayer2').empty().append(player2.efficiencyPlayoff);
        	
        		(player1.games > player2.games) ? $('#divGamesPlayer1').attr("class","ui-bar ui-bar-e") : $('#divGamesPlayer2').attr("class","ui-bar ui-bar-e");
        		(player1.gamesPlayoff > player2.gamesPlayoff) ? $('#divGamesPlayoffPlayer1').attr("class","ui-bar ui-bar-e") : $('#divGamesPlayoffPlayer2').attr("class","ui-bar ui-bar-e");
        		(player1.points > player2.points) ? $('#divPointsPlayer1').attr("class","ui-bar ui-bar-e") : $('#divPointsPlayer2').attr("class","ui-bar ui-bar-e");
        		(player1.pointsPlayoff > player2.pointsPlayoff) ? $('#divPointsPlayoffPlayer1').attr("class","ui-bar ui-bar-e") : $('#divPointsPlayoffPlayer2').attr("class","ui-bar ui-bar-e");
        		(player1.minutes > player2.minutes) ? $('#divMinutesPlayer1').attr("class","ui-bar ui-bar-e") : $('#divMinutesPlayer2').attr("class","ui-bar ui-bar-e");
        		(player1.minutesPlayoff > player2.minutesPlayoff) ? $('#divMinutesPlayoffPlayer1').attr("class","ui-bar ui-bar-e") : $('#divMinutesPlayoffPlayer2').attr("class","ui-bar ui-bar-e");
        		(player1.rebounds > player2.rebounds) ? $('#divReboundsPlayer1').attr("class","ui-bar ui-bar-e") : $('#divReboundsPlayer2').attr("class","ui-bar ui-bar-e");
        		(player1.reboundsPlayoff > player2.reboundsPlayoff) ? $('#divReboundsPlayoffPlayer1').attr("class","ui-bar ui-bar-e") : $('#divReboundsPlayoffPlayer2').attr("class","ui-bar ui-bar-e");	
        		(player1.assists > player2.assists) ? $('#divAssistsPlayer1').attr("class","ui-bar ui-bar-e") : $('#divAssistsPlayer2').attr("class","ui-bar ui-bar-e");
        		(player1.assistsPlayoff > player2.assistsPlayoff) ? $('#divAssistsPlayoffPlayer1').attr("class","ui-bar ui-bar-e") : $('#divAssistsPlayoffPlayer2').attr("class","ui-bar ui-bar-e");	
        		
   			},
   				
			
		onBackKeyDown: function(e) {
			var _t = this;
			//console.log('backkeydown');
			$('#playerPopup').popup( "close" );
			e.preventDefault();
			navigator.notification.confirm('Do you want to exit the app?',
				_t.saliraplicacion(), 'NBA Player Stats', ['YES','NO']);
		},

		saliraplicacion: function() {
    		if(navigator.app){
        		navigator.app.exitApp();
    		}else if(navigator.device){
        		navigator.device.exitApp();
    		}
		}		
		

        });
});