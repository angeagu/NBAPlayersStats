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

            getData: function () {

                var _this = this;
                this.getTeams();
                //Shooting
                //var url = 'http://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=2014-15&SeasonType=Regular+Season&StatCategory=PTS&callback=onResponse';
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
                		}).then(function (results) {
                    		//console.log('Results: ' + JSON.stringify(results));
                	});
                	
                }).then(function (results) {
                	//console.log('Results: ' + JSON.stringify(results));
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
                        fg_pct: _t.rowSet[i][8],
                        fg3m: parseFloat((_t.rowSet[i][9]/partidos).toFixed(1)),
                        fg3a: parseFloat((_t.rowSet[i][10]/partidos).toFixed(1)),
                        fg3_pct: _t.rowSet[i][11],
                        ftm: parseFloat((_t.rowSet[i][12]/partidos).toFixed(1)),
                        fta: parseFloat((_t.rowSet[i][13]/partidos).toFixed(1)),
                        ft_pct: _t.rowSet[i][14],
                        oreb: parseFloat((_t.rowSet[i][15]/partidos).toFixed(1)),
                        dreb: parseFloat((_t.rowSet[i][16]/partidos).toFixed(1)),
                        rebounds: parseFloat((_t.rowSet[i][17]/partidos).toFixed(1)),
                        assists: parseFloat((_t.rowSet[i][18]/partidos).toFixed(1)),
                        steals: parseFloat((_t.rowSet[i][19]/partidos).toFixed(1)),
                        blocks: parseFloat((_t.rowSet[i][20]/partidos).toFixed(1)),
                        turnovers: parseFloat((_t.rowSet[i][21]/partidos).toFixed(1)),
                        points: parseFloat((_t.rowSet[i][23]/partidos).toFixed(1)),
                        efficiency: parseFloat((_t.rowSet[i][24]/partidos).toFixed(1)),
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
                		efficiencyPlayoff: 0
                    }

                    this.playerArray.push(player);
                }

				//console.log('jsonData: ' + JSON.stringify(this.playerArray));
				this.dataReady=true;
                //this._createPlayerGrid(this.playerArray);
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
                        		player.minutesPlayoff= parseFloat((row[5]/partidos).toFixed(1)),
                        		player.fgmPlayoff= parseFloat((row[6]/partidos).toFixed(1)),
                        		player.fgaPlayoff= parseFloat((row[7]/partidos).toFixed(1)),
                        		player.fg_pctPlayoff= row[8],
                        		player.fg3mPlayoff= parseFloat((row[9]/partidos).toFixed(1)),
                        		player.fg3aPlayoff= parseFloat((row[10]/partidos).toFixed(1)),
                        		player.fg3_pctPlayoff= row[11],
                        		player.ftmPlayoff= parseFloat((row[12]/partidos).toFixed(1)),
                        		player.ftaPlayoff= parseFloat((row[13]/partidos).toFixed(1)),
                        		player.ft_pctPlayoff= row[14],
                        		player.orebPlayoff= parseFloat((row[15]/partidos).toFixed(1)),
                        		player.drebPlayoff= parseFloat((row[16]/partidos).toFixed(1)),
                        		player.reboundsPlayoff= parseFloat((row[17]/partidos).toFixed(1)),
                        		player.assistsPlayoff= parseFloat((row[18]/partidos).toFixed(1)),
                        		player.stealsPlayoff= parseFloat((row[19]/partidos).toFixed(1)),
                        		player.blocksPlayoff= parseFloat((row[20]/partidos).toFixed(1)),
                        		player.turnoversPlayoff= parseFloat((row[21]/partidos).toFixed(1)),
                        		player.pointsPlayoff= parseFloat((row[23]/partidos).toFixed(1)),
                        		player.efficiencyPlayoff= parseFloat((row[24]/partidos).toFixed(1))
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
			
			actualizaJugadores: function() {
				//console.log('Entrando en actualizaJugadores');
				$select = $('#select-equipo');
				var siglas = $select.val();
				var filteredArray = array.filter(this.playerArray, function(jugador){
      				return jugador.team == siglas;
    			});
    			//console.log('Filtered Array: ' + JSON.stringify(filteredArray));
    			this.crearListaJugadores(filteredArray);	
	
			},
			
			cargarListaEquipos: function() {
				var _t = this;
				//console.log('Entrando en cargarListaEquipos con nameSelect: ' + nameSelect);
    			if (nameSelect == 'select-equipo-statsbyteam') {
        			$select = $('#select-equipo-statsbyteam');
    			}
    			else {
        			$select = $('#select-equipo');
    			}
    			nameSelect='';
    
                $select.empty();
                array.forEach(this.teams,function(team,i) {
                    	$select.append('<option value="'+team.acronym+'">'+team.name+'</option>');
                    	$select.selectmenu("refresh", true);
              		
                });

			},
			
			crearListaJugadores: function(results) {
				//console.log('entrando en crear lista jugadores');
				//console.log("Num filas devueltas: " + results.length);
				if (results.length==0) {
	    			//console.log('No hay resultados');
	    			return false;
				}
	
				$select = $('#select-jugador');
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
				$('#playerPopup').empty();
	
				for (var i=0;i<this.playerArray.length;i++) {
					var player = this.playerArray[i];
					if (player!=null && player!=undefined && player.name == jugador && player.team == equipo) {
			
						var playerid = player.playerid;
						//Realizamos una invocacion JSON con el playerid para obtener los datos personales del jugador
						//obtenerDatosPersonalesJugador(playerid);
			
						var minutos=player.minutes;
						var puntos=player.points;
						var rebotes=player.rebounds;
						var asistencias=player.assists;
						var robos=player.steals;
						var tapones=player.blocks;
						var partidos = player.games;
						if (partidos==undefined) {
			    			partidos = 0;
						}
			
						/* DATOS PLAYOFF */
						var minutosPlayoff=(player.minutesPlayoff==undefined) ? "0" : player.minutesPlayoff;
						var puntosPlayoff=(player.pointsPlayoff==undefined) ? "0" : player.pointsPlayoff;
						var rebotesPlayoff=(player.reboundsPlayoff==undefined) ? "0" : player.reboundsPlayoff;
						var asistenciasPlayoff=(player.assistsPlayoff==undefined) ? "0" : player.assistsPlayoff;
						var robosPlayoff=(player.stealsPlayoff==undefined) ? "0" : player.stealsPlayoff;
						var taponesPlayoff=(player.blocksPlayoff==undefined) ? "0" : player.blocksPlayoff;
			
						var partidosPlayoff = player.gamesPlayoff;
						if (partidosPlayoff==undefined) {
			   				partidosPlayoff = 0;
						}
			
			
						/*
							while (!datospersonalesready) {
								//Hasta que no est�n listos los datos personales no generamos la respuesta.
							}
						*/
			
						//Cabeceras
						datagridtext += '<div id="datagrid'+i+'" class="ui-grid-b">';
						datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-c" style="height:30px">Name</div></div>';
						datagridtext += '<div class="ui-block-b"><div class="ui-bar ui-bar-c" style="height:30px">Team</div></div>';
						datagridtext += '<div class="ui-block-c"><div class="ui-bar ui-bar-c" style="height:30px"></div></div>';
			
						//Informacion Personal
						/*
						datagridtext += '<div class="ui-block-a"><div id="divName" class="ui-bar ui-bar-a" style="height:80px">'+player.playerid+'-'+player.nombre+'</div></div>';
						datagridtext += '<div class="ui-block-b"><div id="divTeam" class="ui-bar ui-bar-a" style="height:80px">'+player.equipo+'<br>'+player.posicion+'<br>'+player.college+'</div></div>';
						datagridtext += '<div class="ui-block-c"><div id="divTeam" class="ui-bar ui-bar-a" style="height:80px">'+player.fechanacimiento+'<br>'+player.pais+'<br>He: '+player.altura+'<br>We: '+player.peso+'</div></div>';
						*/
						datagridtext += '<div class="ui-block-a"><div id="divName" class="ui-bar ui-bar-a" style="height:40px">'+player.name+'</div></div>';
						datagridtext += '<div class="ui-block-b"><div id="divTeam" class="ui-bar ui-bar-a" style="height:40px">'+player.team+'</div></div>';
						datagridtext += '<div class="ui-block-c"><div id="divTeam" class="ui-bar ui-bar-a" style="height:40px"></div></div>';
			
			
						datagridtext += '<div class="ui-block-a"><div id="divName" class="ui-bar ui-bar-a" style="height:22px">Category</div></div>';
						datagridtext += '<div class="ui-block-b"><div id="divTeam" class="ui-bar ui-bar-a" style="height:22px">Season</div></div>';
						datagridtext += '<div class="ui-block-c"><div id="divTeam" class="ui-bar ui-bar-a" style="height:22px">Playoff</div></div>';
			
						datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:22px">Games</div></div>';
						datagridtext += '<div class="ui-block-b"><div id="divGames" class="ui-bar ui-bar-b" style="height:22px">'+partidos+'</div></div>';
						datagridtext += '<div class="ui-block-c"><div id="divGames" class="ui-bar ui-bar-b" style="height:22px">'+partidosPlayoff+'</div></div>';
			
						datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:22px">Minutes</div></div>';
						datagridtext += '<div class="ui-block-b"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:22px">'+minutos+'</div></div>';
						datagridtext += '<div class="ui-block-c"><div id="divMinutes" class="ui-bar ui-bar-b" style="height:22px">'+minutosPlayoff+'</div></div>';
			
			
						datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:22px">Points</div></div>';
						datagridtext += '<div class="ui-block-b"><div id="divPoints" class="ui-bar ui-bar-b" style="height:22px">'+puntos+'</div></div>';
						datagridtext += '<div class="ui-block-c"><div id="divPoints" class="ui-bar ui-bar-b" style="height:22px">'+puntosPlayoff+'</div></div>';
			
						datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:22px">Rebounds</div></div>';
						datagridtext += '<div class="ui-block-b"><div id="divRebounds" class="ui-bar ui-bar-b" style="height:22px">'+rebotes+'</div></div>';
						datagridtext += '<div class="ui-block-c"><div id="divRebounds" class="ui-bar ui-bar-b" style="height:22px">'+rebotesPlayoff+'</div></div>';
			
			
						datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:22px">Assists</div></div>';
						datagridtext += '<div class="ui-block-b"><div id="divAssists" class="ui-bar ui-bar-b" style="height:22px">'+asistencias+'</div></div>';
						datagridtext += '<div class="ui-block-c"><div id="divAssists" class="ui-bar ui-bar-b" style="height:22px">'+asistenciasPlayoff+'</div></div>';
			
						datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:22px">Steals</div></div>';
						datagridtext += '<div class="ui-block-b"><div id="divSteals" class="ui-bar ui-bar-b" style="height:22px">'+robos+'</div></div>';
						datagridtext += '<div class="ui-block-c"><div id="divSteals" class="ui-bar ui-bar-b" style="height:22px">'+robosPlayoff+'</div></div>';
			
			
						datagridtext += '<div class="ui-block-a"><div class="ui-bar ui-bar-b" style="height:22px">Blocks</div></div>';
						datagridtext += '<div class="ui-block-b"><div id="divBlocks" class="ui-bar ui-bar-b" style="height:22px">'+tapones+'</div></div>';
						datagridtext += '<div class="ui-block-c"><div id="divBlocks" class="ui-bar ui-bar-b" style="height:22px">'+taponesPlayoff+'</div></div>';
			
						datagridtext += '</div>';
						datagridtext += '<br>';
						datagridtext += '<div  align="center">';
						datagridtext += '<input type="button" value="Close" onclick="$(\'#playerPopup\').popup( \'close\' ); return false;" >';
						//datagridtext += '<a href="index.html" onclick="$(\'#playerPopup\').popup( \'close\' );" data-role="button" data-mini="true">Close</a>';
						datagridtext += '</div>';		
			
						$('#playerPopup').append(datagridtext);
						$('#playerPopup').popup( "open" );

					}
		
				}
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
            				//text +='<tr><td><a href=\'#\' onclick="playerData.cargarJugador(\''+searchName+'-'+jugador.team+'\'); return false;" >'+ (i+1) + '. ' +displayName+'</a></td><td>'+jugador.points+'</td></tr>';
            				text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador[category] + '</td></tr>';
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
    			
    			//Playoffs
    			getCategoryLeaders($('#divCategoryPointsPlayoff'),'pointsPlayoff');
    			getCategoryLeaders($('#divCategoryAssistsPlayoff'),'assistsPlayoff');
    			getCategoryLeaders($('#divCategoryReboundsPlayoff'),'reboundsPlayoff');
    			getCategoryLeaders($('#divCategoryBlocksPlayoff'),'blocksPlayoff');
    			getCategoryLeaders($('#divCategoryStealsPlayoff'),'stealsPlayoff');
    			getCategoryLeaders($('#divCategoryMinutesPlayoff'),'minutesPlayoff');
    			 
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
   	                {id: 'name', field: 'name', label: 'Player', colSpan: 2},
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
   	                {id: 'name', field: 'name', label: 'Player', colSpan: 2},
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
   	            var playoffFilter = filter.ne('gamesPlayoff',undefined);
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
			
		onBackKeyDown: function(e) {
			var _t = this;
			//console.log('backkeydown');
			$('#playerPopup').popup( "close" );
			e.preventDefault();
			navigator.notification.confirm('Do you want to exit the app?',
				_t.saliraplicacion(1), 'NBA Player Stats', ['YES','NO']);
		},

		saliraplicacion: function(button) {
   			//alert('entrando con button: ' + button);
   			if(button=="1" || button==1) {
    			if(navigator.app){
        			navigator.app.exitApp();
			}else if(navigator.device){
        		navigator.device.exitApp();
			}
   		}
}		
		

        });
});

