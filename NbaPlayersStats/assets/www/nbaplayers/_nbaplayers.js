$.support.cors = true;
$.mobile.allowCrossDomainPages = true;
$.mobile.phonegapNavigationEnabled = true;

var pacers = [];
var heat = [];
var raptors = [];
var bulls = [];
var nets = [];
var wizards = [];
var hornets = [];
var hawks = [];
var knicks = [];
var cavaliers = [];
var pistons = [];
var celtics = [];
var magic = [];
var sixers = [];
var bucks = [];
var spurs = [];
var thunder = [];
var clippers = [];
var lakers = [];
var rockets = [];
var blazers = [];
var warriors = [];
var grizzlies = [];
var mavericks = [];
var suns = [];
var timberwolves = [];
var nuggets = [];
var pelicans = [];
var kings = [];
var jazz = [];

var arrayJugadores;
var jsondataready=false;
var asistenciasdataready=false;
var rebotesdataready=false;
var taponesrobosdataready=false;
var jsondataplayoffready=false;
var asistenciasdataplayoffready=false;
var rebotesdataplayoffready=false;
var taponesrobosdataplayoffready=false;
var datospersonalesready=false;
var modaldialog=null;
var nameSelect='';
var playoffsEnabled=true;


var restartRequest = function() {
    
    resetData();
    
	modaldialog = $('#loadingDataPopup');
	modaldialog.empty();
	modaldialog.append('<br><br><br>Loading Data. Please Wait... <br><br><br><br>');
	modaldialog.popup( "open" );
	//console.log('Restarting request...');
	callJSON();
}

var resetData = function () {
    pacers = [];
    heat = [];
    raptors = [];
    bulls = [];
    nets = [];
    wizards = [];
    hornets = [];
    hawks = [];
    knicks = [];
    cavaliers = [];
    pistons = [];
    celtics = [];
    magic = [];
    sixers = [];
    bucks = [];
    spurs = [];
    thunder = [];
    clippers = [];
    lakers = [];
    rockets = [];
    blazers = [];
    warriors = [];
    grizzlies = [];
    mavericks = [];
    suns = [];
    timberwolves = [];
    nuggets = [];
    pelicans = [];
    kings = [];
    jazz = [];
    arrayJugadores = new Array(725);
    jsondataready=false;
    asistenciasdataready=false;
    rebotesdataready=false;
    taponesrobosdataready=false;
    jsondataplayoffready=false;
    asistenciasdataplayoffready=false;
    rebotesdataplayoffready=false;
    taponesrobosdataplayoffready=false;
}

var callJSON = function() {	
	//console.log('call JSON....');
	$.ajax({
	url: 'http://stats.nba.com/js/data/sportvu/2014/shootingData.json?callback=procesaRespuesta',
	contentType: "application/json",
	data: {},
	dataType: 'json',
	crossDomain: true,
	timeout:10000,
	success: procesaRespuesta,
	error: function(xhr, status, errThrown) {
		
	    	if (status == 'timeout') {
	    	    var out = "Request Timeout. Server Too Busy." + "\n";
	    	    out += "Please Click Reload Stats Button";
	    	    console.log('Request Timeout call JSON....');
	    	}
		modaldialog.popup( "close" );
		alert(out);
		
	}
});

}

function procesaRespuesta(data) {
	var shootingData = data;
	//console.log('procesando respuesta callJSON');
	//la variable shootingData viene en la respuesta, no se necesita declarar.
	var resultSets = shootingData.resultSets[0];
	var rowSet = resultSets.rowSet;	
	//Inicializamos el array de jugadores con el número de jugadores.
	arrayJugadores = new Array(rowSet.length);
	
	for (var i=0; i < rowSet.length; i++) {
		var playerid = rowSet[i][0];
		var nombre = rowSet[i][2] + " " + rowSet[i][3];
		var equipo = rowSet[i][4];
		var partidos = rowSet[i][5];
		var minutos = rowSet[i][6];
		var puntos = rowSet[i][7];
		
		if (equipo == 'IND') {pacers.push(nombre);}
		else if (equipo == 'MIA') {heat.push(nombre);}
		else if (equipo == 'TOR') {raptors.push(nombre);}
		else if (equipo == 'CHI') {bulls.push(nombre);}
		else if (equipo == 'BKN') {nets.push(nombre);}
		else if (equipo == 'WAS') {wizards.push(nombre);}
		else if (equipo == 'CHA') {hornets.push(nombre);}
		else if (equipo == 'ATL') {hawks.push(nombre);}
		else if (equipo == 'NYK') {knicks.push(nombre);}
		else if (equipo == 'CLE') {cavaliers.push(nombre);}
		else if (equipo == 'DET') {pistons.push(nombre);}
		else if (equipo == 'BOS') {celtics.push(nombre);}
		else if (equipo == 'ORL') {magic.push(nombre);}
		else if (equipo == 'PHI') {sixers.push(nombre);}
		else if (equipo == 'MIL') {bucks.push(nombre);}
		else if (equipo == 'SAS') {spurs.push(nombre);}
		else if (equipo == 'OKC') {thunder.push(nombre);}
		else if (equipo == 'LAC') {clippers.push(nombre);}
		else if (equipo == 'LAL') {lakers.push(nombre);}
		else if (equipo == 'HOU') {rockets.push(nombre);}
		else if (equipo == 'POR') {blazers.push(nombre);}
		else if (equipo == 'GSW') {warriors.push(nombre);}
		else if (equipo == 'MEM') {grizzlies.push(nombre);}
		else if (equipo == 'DAL') {mavericks.push(nombre);}
		else if (equipo == 'PHX') {suns.push(nombre);}
		else if (equipo == 'MIN') {timberwolves.push(nombre);}
		else if (equipo == 'DEN') {nuggets.push(nombre);}
		else if (equipo == 'NOP') {pelicans.push(nombre);}
		else if (equipo == 'SAC') {kings.push(nombre);}
		else if (equipo == 'UTA') {jazz.push(nombre);}
		var player = new jugador();
		player.playerid=playerid;
		player.nombre=nombre;
		player.equipo=equipo;
		player.partidos=partidos;
		player.minutos=minutos;
		player.puntos=puntos;
		arrayJugadores[i]=player;

	}
	jsondataready=true;
	//console.log('jsondataready');
	//alert('jsondataready');
	//Una vez tenemos los datos json, cargamos el listview
	//de busqueda de los jugadores.
	crearListaListView(arrayJugadores);
}


var callAsistenciasStats = function() {	
	//console.log('callAsistenciasStats...');
	$.ajax({
	url: 'http://stats.nba.com/js/data/sportvu/2014/passingData.json?callback=procesaRespuestaAsistencias',
	contentType: "application/json",
	data: {},
	dataType: 'json',
	crossDomain: true,
	timeout:10000,
	success: procesaRespuestaAsistencias,
	error: function(xhr, status, errThrown) {
		
		if (status == 'timeout') {
	    	    var out = "Request Timeout. Server Too Busy." + "\n";
	    	    out += "Please Click Reload Stats Button";
	    	    console.log('Request Timeout callAsistenciasStats....');
	    	}
		modaldialog.popup( "close" );
		alert(out);
		
	}
});

}

function procesaRespuestaAsistencias(data) {
	
	var passingData = data;
	var resultSets = passingData.resultSets[0];
	var rowSet = resultSets.rowSet;
	
	while(!jsondataready) {
	}
	
	for (var i=0; i < rowSet.length; i++) {
		
		var nombre = rowSet[i][2] + " " + rowSet[i][3];
		var equipo = rowSet[i][4];
		var asistencias = rowSet[i][8];
			
		for (var j=0;i<arrayJugadores.length;j++) {
			
			var player = arrayJugadores[j];
			if (player != undefined && player !=null && 
                player.nombre==nombre && player.equipo==equipo) {
				player.asistencias=asistencias;
				arrayJugadores[j]=player;
				break;
			}
            
		}
		
	}
	asistenciasdataready=true;
	//alert('asistenciasdataready');
	//console.log('asistenciasdataready');
	if (!rebotesdataready) {
		callRebotesStats();	
	}
}



var callRebotesStats = function() {	
	$.ajax({
	url: 'http://stats.nba.com/js/data/sportvu/2014/reboundingData.json?callback=procesaRespuestaRebotes',
    contentType: "application/json",
	data: {},
	dataType: 'json',
	crossDomain: true,
	timeout:5000,
	success: procesaRespuestaRebotes,
	error: function(xhr, status, errThrown) {
		
		if (status == 'timeout') {
	    	    var out = "Request Timeout. Server Too Busy." + "\n";
	    	    out += "Please Click Reload Stats Button";
	    	    console.log('Request Timeout callRebotesStats....');
	    	}
		modaldialog.popup( "close" );
		alert(out);
	}
});

}

function procesaRespuestaRebotes(data) {
	while(!asistenciasdataready) {
	}
	
	var reboundingData = data;
	var resultSets = reboundingData.resultSets[0];
	var rowSet = resultSets.rowSet;	
	
	for (var i=0; i < rowSet.length; i++) {
		
		var nombre = rowSet[i][2] + " " + rowSet[i][3];
		var equipo = rowSet[i][4];
		var rebotes = rowSet[i][7];
			
		for (var j=0;i<arrayJugadores.length;j++) {
			
			var player = arrayJugadores[j];
			if (player.nombre==nombre && player.equipo==equipo) {				
				player.rebotes=rebotes;
				arrayJugadores[j]=player;
				break;
			}
		}
		
	}
	rebotesdataready=true;
	//alert('rebotesdataready');
	//console.log('rebotesdataready');
	if (!taponesrobosdataready) {
		callTaponesRobosStats();	
	}
}
	


var callTaponesRobosStats = function() {	
	$.ajax({
	url: 'http://stats.nba.com/js/data/sportvu/2014/defenseData.json?callback=procesaRespuestaTaponesRobos',
    contentType: "application/json",
	data: {},
	dataType: 'json',
	crossDomain: true,
	timeout:5000,
	success: procesaRespuestaTaponesRobos,
	error: function(xhr, status, errThrown) {
		
	    	if (status == 'timeout') {
	    	    var out = "Request Timeout. Server Too Busy." + "\n";
	    	    out += "Please Click Reload Stats Button";
	    	    console.log('Request Timeout callTaponesRobosStats....');
	    	}
		modaldialog.popup( "close" );
		alert(out);
	}
});

}

function procesaRespuestaTaponesRobos(data) {
	while(!rebotesdataready) {
	}
	
	var defenseData = data;
	var resultSets = defenseData.resultSets[0];
	var rowSet = resultSets.rowSet;	
	
	for (var i=0; i < rowSet.length; i++) {
		
		var nombre = rowSet[i][2] + " " + rowSet[i][3];
		var equipo = rowSet[i][4];
		var tapones = rowSet[i][7];
		var robos = rowSet[i][8];
			
		for (var j=0;i<arrayJugadores.length;j++) {
			
			var player = arrayJugadores[j];
			if (player.nombre==nombre && player.equipo==equipo) {				
				player.tapones=tapones;
				player.robos=robos;
				arrayJugadores[j]=player;
				break;
			}
		}
		
	}
	taponesrobosdataready=true;
	//alert('taponesrobosdataready');
	//console.log('taponesrobosdataready');
	modaldialog.popup( "close" );
	if (!jsondataplayoffready && playoffsEnabled) {
	    callJSONPlayoff();
	}
}



/* FUNCIONES PARA PLAYOFFS */


var callJSONPlayoff = function() {	
	//alert('call JSON Playoff....');
	//console.log('call JSON Playoff....');
	$.ajax({
	url: 'http://stats.nba.com/js/data/sportvu/2014/shootingDataPost.json?callback=procesaRespuestaPlayoff',
	contentType: "application/json",
	data: {},
	dataType: 'json',
	crossDomain: true,
	timeout:5000,
	success: procesaRespuestaPlayoff,
	error: function(xhr, status, errThrown) {
		
	    	if (status == 'timeout') {
	    	    var out = "Request Timeout. Server Too Busy." + "\n";
	    	    out += "Please Click Reload Stats Button";
	    	    console.log('Request Timeout callJSONPlayoff....');
	    	}
		modaldialog.popup( "close" );
		alert(out);
	}
});

}

function procesaRespuestaPlayoff(data) {
    
    	while (!taponesrobosdataready) {
    	    
    	}
    var shootingDataPost = data;
	//alert('procesando respuesta');
	//console.log('procesando respuesta callJSONPlayoff');
	//la variable shootingData viene en la respuesta, no se necesita declarar.
	var resultSets = shootingDataPost.resultSets[0];
	var rowSet = resultSets.rowSet;	
	
	for (var i=0; i < rowSet.length; i++) {
		var nombre = rowSet[i][2] + " " + rowSet[i][3];
		var equipo = rowSet[i][4];
		var partidos = rowSet[i][5];
		var minutos = rowSet[i][6];
		var puntos = rowSet[i][7];
		for (var j=0;i<arrayJugadores.length;j++) {
			
			var player = arrayJugadores[j];
			if (player.nombre==nombre && player.equipo==equipo) {				
				player.partidosPlayoff=partidos;
				player.minutosPlayoff=minutos;
				player.puntosPlayoff=puntos;
				arrayJugadores[j]=player;
				break;
			}
		}
	}
	jsondataplayoffready=true;
	//console.log('jsondataplayoffready');
	//alert('jsondataready');
	if (!asistenciasdataplayoffready) {
	    callAsistenciasStatsPlayoff();
	}
}

var callAsistenciasStatsPlayoff = function() {	
	//console.log('callAsistenciasStatsPlayoff...');
	$.ajax({
	url: 'http://stats.nba.com/js/data/sportvu/2014/passingDataPost.json?callback=procesaRespuestaAsistenciasPlayoff',
	contentType: "application/json",
	data: {},
	dataType: 'json',
	crossDomain: true,
	timeout:10000,
	success: procesaRespuestaAsistenciasPlayoff,
	error: function(xhr, status, errThrown) {

		if (status == 'timeout') {
	    	    var out = "Request Timeout. Server Too Busy." + "\n";
	    	    out += "Please Click Reload Stats Button";
	    	    console.log('Request Timeout callAsistenciasStatsPlayoff....');
	    	}
		modaldialog.popup( "close" );
		alert(out);
	}
});

}

function procesaRespuestaAsistenciasPlayoff(data) {
	while(!jsondataplayoffready) {
	}
	
	var passingDataPost = data;
	var resultSets = passingDataPost.resultSets[0];
	var rowSet = resultSets.rowSet;	
	
	for (var i=0; i < rowSet.length; i++) {
		
		var nombre = rowSet[i][2] + " " + rowSet[i][3];
		var equipo = rowSet[i][4];
		var asistencias = rowSet[i][8];
			
		for (var j=0;i<arrayJugadores.length;j++) {
			
			var player = arrayJugadores[j];
			if (player.nombre==nombre && player.equipo==equipo) {				
				player.asistenciasPlayoff=asistencias;
				arrayJugadores[j]=player;
				break;
			}
		}
		
	}
	asistenciasdataplayoffready=true;
	//alert('asistenciasdataready');
	//console.log('asistenciasdataplayoffready');
	if (!rebotesdataplayoffready) {
		callRebotesStatsPlayoff();	
	}
}



var callRebotesStatsPlayoff = function() {	
	$.ajax({
	url: 'http://stats.nba.com/js/data/sportvu/2014/reboundingDataPost.json?callback=procesaRespuestaRebotesPlayoff',
	contentType: "application/json",
	data: {},
	dataType: 'json',
	crossDomain: true,
	timeout:10000,
	success: procesaRespuestaRebotesPlayoff,
	error: function(xhr, status, errThrown) {
		if (status == 'timeout') {
	    	    var out = "Request Timeout. Server Too Busy." + "\n";
	    	    out += "Please Click Reload Stats Button";
	    	    console.log('Request Timeout callRebotesStatsPlayoff....');
	    	}
		modaldialog.popup( "close" );
		alert(out);
	}
});

}

function procesaRespuestaRebotesPlayoff(data) {
	while(!asistenciasdataplayoffready) {
	}
	
	var reboundingDataPost = data;
	var resultSets = reboundingDataPost.resultSets[0];
	var rowSet = resultSets.rowSet;	
	
	for (var i=0; i < rowSet.length; i++) {
		
		var nombre = rowSet[i][2] + " " + rowSet[i][3];
		var equipo = rowSet[i][4];
		var rebotes = rowSet[i][7];
			
		for (var j=0;i<arrayJugadores.length;j++) {
			
			var player = arrayJugadores[j];
			if (player.nombre==nombre && player.equipo==equipo) {				
				player.rebotesPlayoff=rebotes;
				arrayJugadores[j]=player;
				break;
			}
		}
		
	}
	rebotesdataplayoffready=true;
	//alert('rebotesdataready');
	//console.log('rebotesdatareadyplayoff');
	if (!taponesrobosdataplayoffready) {
		callTaponesRobosStatsPlayoff();	
	}
}
	


var callTaponesRobosStatsPlayoff = function() {	
	$.ajax({
	url: 'http://stats.nba.com/js/data/sportvu/2014/defenseDataPost.json?callback=procesaRespuestaTaponesRobosPlayoff',
	contentType: "application/json",
	data: {},
	dataType: 'json',
	crossDomain: true,
	timeout:10000,
	success: procesaRespuestaTaponesRobosPlayoff,
	error: function(xhr, status, errThrown) {

	    	if (status == 'timeout') {
	    	    var out = "Request Timeout. Server Too Busy." + "\n";
	    	    out += "Please Click Reload Stats Button";
	    	    console.log('Request Timeout callTaponesRobosStatsPlayoff....');
	    	}
		modaldialog.popup( "close" );
		alert(out);
	}
});

}

function procesaRespuestaTaponesRobosPlayoff(data) {
	while(!rebotesdataplayoffready) {
	}
	
	var defenseDataPost = data;
	var resultSets = defenseDataPost.resultSets[0];
	var rowSet = resultSets.rowSet;	
	
	for (var i=0; i < rowSet.length; i++) {
		
		var nombre = rowSet[i][2] + " " + rowSet[i][3];
		var equipo = rowSet[i][4];
		var tapones = rowSet[i][7];
		var robos = rowSet[i][8];
			
		for (var j=0;i<arrayJugadores.length;j++) {
			
			var player = arrayJugadores[j];
			if (player.nombre==nombre && player.equipo==equipo) {				
				player.taponesPlayoff=tapones;
				player.robosPlayoff=robos;
				arrayJugadores[j]=player;
				break;
			}
		}
		
	}
	taponesrobosdataplayoffready=true;
	//alert('taponesrobosdataready');
	//console.log('taponesrobosdataplayoffready');
	modaldialog.popup( "close" );
}


/* FIN FUNCIONES PARA PLAYOFFS */



function jugador() {
	this.playerid="0";
	this.nombre="";
	this.equipo="";
	this.numPartidos="0"; 
	this.minutos="0";
	this.puntos="0";
	this.rebotes="0";
	this.asistencias="0";
	this.robos="0";
	this.perdidas="0";
	this.tapones="0";
	this.faltas="0";
	this.TC="0";
	this.T3="0";
	this.TL="0";		
	this.numPartidosPlayoff="0"; 
	this.minutosPlayoff="0";
	this.puntosPlayoff="0";
	this.rebotesPlayoff="0";
	this.asistenciasPlayoff="0";
	this.robosPlayoff="0";
	this.perdidasPlayoff="0";
	this.taponesPlayoff="0";
	this.faltasPlayoff="0";
	this.TCPlayoff="0";
	this.T3Playoff="0";
	this.TLPlayoff="0";
	this.fechanacimiento="";
	this.college="";
	this.pais="";
	this.peso="0";
	this.altura="0";
	this.numero="0";
	this.posicion="";
	}

function onDeviceReady() {
	var db = window.openDatabase("NBAPLAYERS", "1.0", "NBAPLAYERS", 1000000);
	db.transaction(poblarBBDD,errorBBDD,exitoBBDD);
}

function errorBBDD(error) {
	//alert ('Error al procesar SQL: ' + error.message + " error: " + error.code);
	//console.log('Error al procesar SQL: ' + error)
}


function exitoBBDD(error) {
	//console.log('Ejecucion de sql correcta');
	var db = window.openDatabase("NBAPLAYERS", "1.0", "NBAPLAYERS", 1000000);
	db.transaction(cargarListaEquipos,errorBBDD);
	
}

function poblarBBDD(transaction) {
	
	transaction.executeSql('DROP TABLE IF EXISTS TEAMS');
	transaction.executeSql('CREATE TABLE TEAMS (ID_EQUIPO REAL, NOMBRE TEXT, CONFERENCIA TEXT, SIGLAS TEXT);');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("1","Miami Heat","Este","MIA")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("2","New York Knicks","Este","NYK")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("3","Indiana Pacers","Este","IND")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("4","Chicago Bulls","Este","CHI")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("5","Boston Celtics","Este","BOS")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("6","Brooklyn Nets","Este","BKN")');
	
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("7","San Antonio Spurs","Oeste","SAS")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("8","Oklahoma City Thunder","Oeste","OKC")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("9","Los Angeles Clippers","Oeste","LAC")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("10","Los Angeles Lakers","Oeste","LAL")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("11","Denver Nuggets","Oeste","DEN")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("12","Memphis Grizzlies","Oeste","MEM")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("13","Atlanta Hawks","Este","ATL")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("14","Milwaukee Bucks","Este","MIL")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("15","Toronto Raptors","Este","TOR")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("16","Philadelphia 76ers","Este","PHI")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("17","Washington Wizards","Este","WAS")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("18","Detroit Pistons","Este","DET")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("19","Cleveland Cavaliers","Este","CLE")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("20","Orlando Magic","Este","ORL")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("21","Charlotte Hornets","Este","CHA")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("22","Golden State Warriors","Oeste","GSW")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("23","Houston Rockets","Oeste","HOU")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("24","Utah Jazz","Oeste","UTA")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("25","Dallas Mavericks","Oeste","DAL")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("26","Portland Trail Blazers","Oeste","POR")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("27","Minnesota Timberwolves","Oeste","MIN")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("28","Sacramento Kings","Oeste","SAC")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("29","New Orleans Pelicans","Oeste","NOP")');
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("30","Phoenix Suns","Oeste","PHX")');

	/*
	 * INVOCACIONES DE DATOS JSON
	 */
	
	//Mostramos una ventana modal para evitar que el usuario seleccione datos
    //antes de cargarse los datos por la invocación JSON.
	modaldialog = $('#loadingDataPopup');
    modaldialog.empty();
	modaldialog.append('<br><br><br>Loading Data. Please Wait... <br><br><br><br>');
    modaldialog.popup( "open" );
    
	if (!taponesrobosdataready) {		
		callJSON();
	}
    else {
        crearListaListView(arrayJugadores);
    }
	modaldialog.popup( "close" );
}

function cargarListaEquipos() {
	//console.log('Entrando en cargarListaEquipos con nameSelect: ' + nameSelect);
    if (nameSelect == 'select-equipo-statsbyteam') {
        $select = $('#select-equipo-statsbyteam');
    }
    else {
        $select = $('#select-equipo');
    }
    nameSelect='';
    
	//Cargamos la lista de equipos, y antes cargamos el ListView();
	var db = window.openDatabase("NBAPLAYERS", "1.0", "NBAPLAYERS", 1000000);
	db.transaction(function(transaction){
                   transaction.executeSql('SELECT * FROM TEAMS ORDER BY NOMBRE ASC', [],
                                          function crearTablaListaEquipos(transaction,results) {
                                            //console.log("Entrando en crearTablaListaEquipos. Num filas devueltas: " + results.rows.length);
                                            if (results.rows.length==0) {
                                                //console.log('No hay resultados');
                                                return false;
                                            }
                                          
                                            $select.empty();
                                            for (var i=0; i<results.rows.length; i++) {
                                                var row = results.rows.item(i);
                                                $select.append('<option value="'+row.SIGLAS+'">'+row.NOMBRE+'</option>');
                                            }
                                                $select.selectmenu("refresh", true);
                                          		
                                            },errorBBDD);
	},errorBBDD);

}


function actualizaJugadores() {
	//console.log('Entrando en actualizaJugadores');
	$select = $('#select-equipo');
	var siglas = $select.val();
	
	if (siglas == 'IND') {crearListaJugadores(pacers);}
	else if (siglas == 'MIA') {crearListaJugadores(heat);}
	else if (siglas == 'TOR') {crearListaJugadores(raptors);}
	else if (siglas == 'CHI') {crearListaJugadores(bulls);}
	else if (siglas == 'BKN') {crearListaJugadores(nets);}
	else if (siglas == 'WAS') {crearListaJugadores(wizards);}
	else if (siglas == 'CHA') {crearListaJugadores(hornets);}
	else if (siglas == 'ATL') {crearListaJugadores(hawks);}
	else if (siglas == 'NYK') {crearListaJugadores(knicks);}
	else if (siglas == 'CLE') {crearListaJugadores(cavaliers);}
	else if (siglas == 'DET') {crearListaJugadores(pistons);}
	else if (siglas == 'BOS') {crearListaJugadores(celtics);}
	else if (siglas == 'ORL') {crearListaJugadores(magic);}
	else if (siglas == 'PHI') {crearListaJugadores(sixers);}
	else if (siglas == 'MIL') {crearListaJugadores(bucks);}
	else if (siglas == 'SAS') {crearListaJugadores(spurs);}
	else if (siglas == 'OKC') {crearListaJugadores(thunder);}
	else if (siglas == 'LAC') {crearListaJugadores(clippers);}
	else if (siglas == 'LAL') {crearListaJugadores(lakers);}
	else if (siglas == 'HOU') {crearListaJugadores(rockets);}
	else if (siglas == 'POR') {crearListaJugadores(blazers);}
	else if (siglas == 'GSW') {crearListaJugadores(warriors);}
	else if (siglas == 'MEM') {crearListaJugadores(grizzlies);}
	else if (siglas == 'DAL') {crearListaJugadores(mavericks);}
	else if (siglas == 'PHX') {crearListaJugadores(suns);}
	else if (siglas == 'MIN') {crearListaJugadores(timberwolves);}
	else if (siglas == 'DEN') {crearListaJugadores(nuggets);}
	else if (siglas == 'NOP') {crearListaJugadores(pelicans);}
	else if (siglas == 'SAC') {crearListaJugadores(kings);}
	else if (siglas == 'UTA') {crearListaJugadores(jazz);}
	
	
}


function crearListaJugadores(results) {
	//console.log('entrando en crear lista jugadores');
	//console.log("Num filas devueltas: " + results.length);
	if (results.length==0) {
	    //console.log('No hay resultados');
	    return false;
	}
	
	$select = $('#select-jugador');
	$select.empty();
	for (var i=0; i<results.length; i++) {
		var nombre = results[i];
		if (nombre!=null && nombre!=undefined) {
			$select.append('<option value="'+nombre+'">'+nombre+'</option>');
		}
	}
	$select.selectmenu("refresh", true);
	
}

function crearListaListView(results) {
	//alert('crearListaListView con ' + results.length);
	if (results.length==0) {
	    //console.log('No hay resultados');
	    return false;
	}

	$listview = $('#listview-jugadores');
	$listview.empty();
	for (var i=0; i<results.length; i++) {
		if (results[i]!=undefined && results[i]!=null) {
			var jugador = results[i].nombre;
			var equipo = results[i].equipo;
		}

		if (jugador!=null && jugador!=undefined) {
			
			var escapedStringJugador;
			var text;
			if (jugador.indexOf('\'') != -1) {
				var escapedStringJugador = jugador.replace("\'","\\\'");
				text = '<li class="ui-screen-hidden" data-filtertext="'+jugador+'"><a href="#" onclick="javascript:cargarJugador(\''+escapedStringJugador+'-'+equipo+'\');" >'+jugador+'  -  '+equipo+'</a></li>';
			}
			else {
				text = '<li class="ui-screen-hidden" data-filtertext="'+jugador+'"><a href="#" onclick="javascript:cargarJugador(\''+jugador+'-'+equipo+'\');" >'+jugador+'  -  '+equipo+'</a></li>';
			}

			
			$listview.append(text);
			
		}
	}
	
	$listview.listview();
	$listview.listview('refresh');

	callAsistenciasStats();
}

var obtenerDatosPersonalesJugador = function(playerid) {	
	var param = "{PlayerID:'" + playerid + "',callback:'procesaDatosPersonalesJugador'}";
	//var direccionDatosPersonales = 'http://stats.nba.com/stats/commonplayerinfo/?callback=procesaDatosPersonalesJugador';
	var direccionDatosPersonales = 'http://stats.nba.com/stats/commonplayerinfo';
	//alert('Entrando en ObtenerDatosPErsonalesJugador con param: ' + param);
	$.ajax({
	url: direccionDatosPersonales,
	contentType: "application/json",
	data: param,
	dataType: 'json',
	crossDomain: true,
	timeout:10000,
	error: function(xhr, status, errThrown) {
	    	if (status == 'timeout') {
	    	    var out = "Can't load personal data from player." + "\n";
	    	    out += "Please Click Reload Stats Button";
	    	    //console.log('Request Timeout obtenerDatosPersonalesJugador....');
	    	}
		modaldialog.popup( "close" );
		alert(out);
	}
});

}

function procesaRespuestaDatosPersonales(data) {
	
	//alert ('ENTRANDO en procesaRespuestaDatosPersonales.');
	var datosPersonales=data;
	var resultSets = datosPersonales.resultSets[0];
	var rowSet = resultSets.rowSet[0];	
	
	for (var i=0; i < rowSet.length; i++) {
		
		var nombre = rowSet[i][2] + " " + rowSet[i][3];
		var equipo = rowSet[i][4];
		var fechanacimiento=rowSet[i][6];
		var college=rowSet[i][9];
		var pais=rowSet[i][8];
		var peso=rowSet[i][10];
		var altura=rowSet[i][11];
		var numero=rowSet[i][13];
		var posicion=rowSet[i][14];
			
		for (var j=0;i<arrayJugadores.length;j++) {
			
			var player = arrayJugadores[j];
			if (player.nombre==nombre && player.equipo==equipo) {				
				player.fechanacimiento=fechanacimiento;
				player.college=college;
				player.pais=pais;
				player.peso=peso;
				player.altura=altura;
				player.numero=numero;
				player.posicion=posicion;
				arrayJugadores[j]=player;
				break;
			}
		}
		
	}
	datospersonalesready=true;
	//alert('datospersonalesready');
	//console.log('datospersonalesready');
}

function cargarJugador(string) {
	//alert("entrandoenCargarJugador con string: " + string);
	
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
		//Entramos desde el listview de búsqueda.
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
	
	for (var i=0;i<arrayJugadores.length;i++) {
		var player = arrayJugadores[i];
		if (player!=null && player!=undefined && 
		player.nombre==jugador && player.equipo == equipo) {
			
			var playerid = player.playerid;
			//Realizamos una invocacion JSON con el playerid para obtener los datos personales del jugador
			//obtenerDatosPersonalesJugador(playerid);
			
			var minutos=player.minutos.toString();
			minutos = minutos.substring(0,minutos.indexOf('.')+3);
			var puntos=player.puntos.toString();
			puntos = puntos.substring(0,puntos.indexOf('.')+3);
			var rebotes=player.rebotes.toString();
			rebotes = rebotes.substring(0,rebotes.indexOf('.')+3);
			var asistencias=player.asistencias.toString();
			asistencias = asistencias.substring(0,asistencias.indexOf('.')+3);
			var robos=player.robos.toString();
			robos = robos.substring(0,robos.indexOf('.')+3);
			var tapones=player.tapones.toString();
			tapones = tapones.substring(0,robos.indexOf('.')+3);
			var partidos = player.partidos;
			if (partidos==undefined) {
			    partidos = 0;
			}
			
			/* DATOS PLAYOFF */
			var minutosPlayoff=player.minutosPlayoff.toString();
			minutosPlayoff = minutosPlayoff.substring(0,minutosPlayoff.indexOf('.')+3);
			var puntosPlayoff=player.puntosPlayoff.toString();
			puntosPlayoff = puntosPlayoff.substring(0,puntosPlayoff.indexOf('.')+3);
			var rebotesPlayoff=player.rebotesPlayoff.toString();
			rebotesPlayoff = rebotesPlayoff.substring(0,rebotesPlayoff.indexOf('.')+3);
			var asistenciasPlayoff=player.asistenciasPlayoff.toString();
			asistenciasPlayoff = asistenciasPlayoff.substring(0,asistenciasPlayoff.indexOf('.')+3);
			var robosPlayoff=player.robosPlayoff.toString();
			robosPlayoff = robosPlayoff.substring(0,robosPlayoff.indexOf('.')+3);
			var taponesPlayoff=player.taponesPlayoff.toString();
			taponesPlayoff = taponesPlayoff.substring(0,robosPlayoff.indexOf('.')+3);
			
			var partidosPlayoff = player.partidosPlayoff;
			if (partidosPlayoff==undefined) {
			   	partidosPlayoff = 0;
			}
			
			
			/*
			while (!datospersonalesready) {
				//Hasta que no estén listos los datos personales no generamos la respuesta.
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
			datagridtext += '<div class="ui-block-a"><div id="divName" class="ui-bar ui-bar-a" style="height:40px">'+player.nombre+'</div></div>';
			datagridtext += '<div class="ui-block-b"><div id="divTeam" class="ui-bar ui-bar-a" style="height:40px">'+player.equipo+'</div></div>';
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
	
}


function showCategoryLeaders() {

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

    //SORT FUNCTIONS
    var compareMinutes = function (player1,player2) {
        return player2.minutos - player1.minutos;
    }
    var comparePoints = function (player1,player2) {
        return player2.puntos - player1.puntos;
    }
    var compareRebounds = function (player1,player2) {
        return player2.rebotes - player1.rebotes;
    }
    var compareAssists = function (player1,player2) {
        return player2.asistencias - player1.asistencias;
    }
    var compareBlocks = function (player1,player2) {
        return player2.tapones - player1.tapones;
    }
    var compareSteals = function (player1,player2) {
        return player2.robos - player1.robos;
    }
    
    
    // CATEGORY - POINTS
    var divPoints = $('#divCategoryPoints');
    divPoints.empty();
    arrayJugadores = arrayJugadores.sort(comparePoints);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
            //Si los datos del jugador son únicos, o los datos del jugador son su TOTAL, se ponen en la lista, sino, NO.
            
        	var escapedStringJugador;
        	var displayName;
        	var searchName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	searchName = escapedStringJugador;
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	searchName = jugador.nombre;
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];     
        	}
        	//text +='<tr><td><a href=\'#\' onclick="cargarJugador(\''+searchName+'-'+jugador.equipo+'\'); return false;" >'+ (i+1) + '. ' +displayName+'</a></td><td>'+jugador.puntos+'</td></tr>';
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.puntos + '</td></tr>';
        	i++;
        }
        else {
        	//NO SE METE EN LA LISTA
        }
        j++;

    }
    text+='</table>';
    divPoints.append(text);
    
    // CATEGORY - ASSISTS
    var divAssists = $('#divCategoryAssists');
    divAssists.empty();
    arrayJugadores = arrayJugadores.sort(compareAssists);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
            //Si los datos del jugador son únicos, o los datos del jugador son su TOTAL, se ponen en la lista, sino, NO.
        
        	var escapedStringJugador;
        	var displayName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];
        	}
        
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.asistencias + '</td></tr>';
        	i++;
       	}
        else {
        	//NO SE METE EN LA LISTA
        }
        //Incrementamos el contador para seguir iterando.
        j++;
    }
    text+='</table>';
    divAssists.append(text);
    
    
    // CATEGORY - REBOUNDS
    var divRebounds = $('#divCategoryRebounds');
    divRebounds.empty();
    arrayJugadores = arrayJugadores.sort(compareRebounds);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
        	var escapedStringJugador;
        	var displayName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];
        	}
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.rebotes + '</td></tr>';
        	i++;
        }
        else {
        	//NO SE METE EN LA LISTA
        }
        j++;
    }
    text+='</table>';
    divRebounds.append(text);
     
    
    // CATEGORY - BLOCKS
    
    var divBlocks = $('#divCategoryBlocks');
    divBlocks.empty();
    arrayJugadores = arrayJugadores.sort(compareBlocks);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
        	var escapedStringJugador;
        	var displayName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];
        	}
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.tapones + '</td></tr>';
        	i++;
        }
        else {
        	//NO SE METE EN LA LISTA
        }
        j++;
    }
    text+='</table>';
    divBlocks.append(text);
     
    
    // CATEGORY - STEALS
    var divSteals = $('#divCategorySteals');
    divSteals.empty();
    arrayJugadores = arrayJugadores.sort(compareSteals);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
            //Si los datos del jugador son únicos, o los datos del jugador son su TOTAL, se ponen en la lista, sino, NO.
        	var escapedStringJugador;
        	var displayName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];
        	}
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.robos + '</td></tr>';
        	i++;
        }
        else {
        	//NO SE METE EN LA LISTA
        }
        j++;
    }
    text+='</table>';
    divSteals.append(text);
    
    
    // CATEGORY - MINUTES
    
    var divMinutes = $('#divCategoryMinutes');
    divMinutes.empty();
    arrayJugadores = arrayJugadores.sort(compareMinutes);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
        	var escapedStringJugador;
        	var displayName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];
        	}
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.minutos + '</td></tr>';
        	i++;
        }
        else {
        	//NO SE METE EN LA LISTA
        }
        j++;
    }
    text+='</table>';
    divMinutes.append(text);
    
    
    /*
    * PLAYOFFS
    */
    var divTopCategoriesPlayoff = $('#topCategoriesPlayoff');
    if (!playoffsEnabled) {
    	divTopCategoriesPlayoff.hide();
    }
    
    //SORT FUNCTIONS
    var compareMinutesPlayoff = function (player1,player2) {
        return player2.minutosPlayoff - player1.minutosPlayoff;
    }
    var comparePointsPlayoff = function (player1,player2) {
        return player2.puntosPlayoff - player1.puntosPlayoff;
    }
    var compareReboundsPlayoff = function (player1,player2) {
        return player2.rebotesPlayoff - player1.rebotesPlayoff;
    }
    var compareAssistsPlayoff = function (player1,player2) {
        return player2.asistenciasPlayoff - player1.asistenciasPlayoff;
    }
    var compareBlocksPlayoff = function (player1,player2) {
        return player2.taponesPlayoff - player1.taponesPlayoff;
    }
    var compareStealsPlayoff = function (player1,player2) {
        return player2.robosPlayoff - player1.robosPlayoff;
    }
    
    // CATEGORY - POINTS
    var divPointsPlayoff = $('#divCategoryPointsPlayoff');
    divPointsPlayoff.empty();
    arrayJugadores = arrayJugadores.sort(comparePointsPlayoff);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
            //Si los datos del jugador son únicos, o los datos del jugador son su TOTAL, se ponen en la lista, sino, NO.
        	var escapedStringJugador;
        	var displayName;
        	var searchName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	searchName = escapedStringJugador;
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	searchName = jugador.nombre;
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];     
        	}
        	//text +='<tr><td><a href=\'#\' onclick="cargarJugador(\''+searchName+'-'+jugador.equipo+'\'); return false;" >'+ (i+1) + '. ' +displayName+'</a></td><td>'+jugador.puntos+'</td></tr>';
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.puntosPlayoff + '</td></tr>';
        	i++;
        }
        else {
        	//NO SE METE EN LA LISTA
        }
        j++;

    }
    text+='</table>';
    divPointsPlayoff.append(text);
    
    // CATEGORY - ASSISTS
    var divAssistsPlayoff = $('#divCategoryAssistsPlayoff');
    divAssistsPlayoff.empty();
    arrayJugadores = arrayJugadores.sort(compareAssistsPlayoff);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
            //Si los datos del jugador son únicos, o los datos del jugador son su TOTAL, se ponen en la lista, sino, NO.
        
        	var escapedStringJugador;
        	var displayName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];
        	}
        
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.asistenciasPlayoff + '</td></tr>';
        	i++;
       	}
        else {
        	//NO SE METE EN LA LISTA
        }
        //Incrementamos el contador para seguir iterando.
        j++;
    }
    text+='</table>';
    divAssistsPlayoff.append(text);
    
    
    // CATEGORY - REBOUNDS
    var divReboundsPlayoff = $('#divCategoryReboundsPlayoff');
    divReboundsPlayoff.empty();
    arrayJugadores = arrayJugadores.sort(compareReboundsPlayoff);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
        	var escapedStringJugador;
        	var displayName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];
        	}
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.rebotesPlayoff + '</td></tr>';
        	i++;
        }
        else {
        	//NO SE METE EN LA LISTA
        }
        j++;
    }
    text+='</table>';
    divReboundsPlayoff.append(text);
     
    
    // CATEGORY - BLOCKS
    
    var divBlocksPlayoff = $('#divCategoryBlocksPlayoff');
    divBlocksPlayoff.empty();
    arrayJugadores = arrayJugadores.sort(compareBlocksPlayoff);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
        	var escapedStringJugador;
        	var displayName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];
        	}
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.taponesPlayoff + '</td></tr>';
        	i++;
        }
        else {
        	//NO SE METE EN LA LISTA
        }
        j++;
    }
    text+='</table>';
    divBlocksPlayoff.append(text);
    
    
    // CATEGORY - STEALS
    var divStealsPlayoff = $('#divCategoryStealsPlayoff');
    divStealsPlayoff.empty();
    arrayJugadores = arrayJugadores.sort(compareStealsPlayoff);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
            //Si los datos del jugador son únicos, o los datos del jugador son su TOTAL, se ponen en la lista, sino, NO.
        	var escapedStringJugador;
        	var displayName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];
        	}
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.robosPlayoff + '</td></tr>';
        	i++;
        }
        else {
        	//NO SE METE EN LA LISTA
        }
        j++;
    }
    text+='</table>';
    divStealsPlayoff.append(text);
    
    
    // CATEGORY - MINUTES
    
    var divMinutesPlayoff = $('#divCategoryMinutesPlayoff');
    divMinutesPlayoff.empty();
    arrayJugadores = arrayJugadores.sort(compareMinutesPlayoff);
    var text='<table>';
	var i = 0;
	var j = 0;
    while(i<10) {
        var jugador = arrayJugadores[j];
        
        var arrayFiltrado = arrayJugadores.filter(function(player) {
                                                  return player.nombre == jugador.nombre;
                                                  });
        if (arrayFiltrado.length == 1 || jugador.equipo == 'TOTAL') {
        	var escapedStringJugador;
        	var displayName;
        	if (jugador.nombre.indexOf('\'') != -1) {
            	var escapedStringJugador = jugador.nombre.replace("\'","\\\'");
            	displayName = escapedStringJugador.split(' ')[0].charAt(0) + '. ' + escapedStringJugador.split(' ')[1];
        	}
        	else {
            	displayName = jugador.nombre.split(' ')[0].charAt(0) + '. ' + jugador.nombre.split(' ')[1];
        	}
        	text += '<tr><td>' + (i+1) + '. ' + displayName+' </td><td>'+jugador.minutosPlayoff + '</td></tr>';
        	i++;
        }
        else {
        	//NO SE METE EN LA LISTA
        }
        j++;
    }
    text+='</table>';
    divMinutesPlayoff.append(text);
    
    
}

function showTeamStats() {
    
    $('input:radio[name="radioTeamStats"][value="regularSeason"]').click();
    $('input:radio[name="radioTeamStats"][value="regularSeason"]').click();
    
    $select = $('#select-equipo-statsbyteam');
	var siglas = $select.val();
    arrayJugadores = arrayJugadores.sort(function (player1,player2) {
                                            return player2.puntos - player1.puntos;
                                         });
    
    var arrayFiltrado = arrayJugadores.filter(function(player) {
                          return player.equipo == siglas;
                          });
    
    var divTeamStats = $('#divTeamStats');
    divTeamStats.empty();
    var text='<div align="center"><span align="center"><b>REGULAR SEASON</b></span></div>';
    text += '<table id="teamStatsTable">';
    text+='<tr><th>Name</th><th>Games</th><th>Mins.</th><th>Points</th><th>Rebs.</th><th>Assists</th><th>Blocks</th><th>Steals</th></tr>';
    for (var i=0; i<arrayFiltrado.length; i++) {
        text+= '<tr>';
        text+= '<td id="playername">';
        text+= arrayFiltrado[i].nombre;
        text+= '</td>';
        text+= '<td>';
        text+= arrayFiltrado[i].partidos;
        text+= '</td>';
        text+= '<td>';
        text+= arrayFiltrado[i].minutos;
        text+= '</td>';
        text+= '<td>';
        text+= arrayFiltrado[i].puntos;
        text+= '</td>';
        text+= '<td>';
        text+= arrayFiltrado[i].rebotes
        text+= '</td>';
        text+= '<td>';
        text+= arrayFiltrado[i].asistencias;
        text+= '</td>';
        text+= '<td>';
        text+= arrayFiltrado[i].tapones;
        text+= '</td>';
        text+= '<td>';
        text+= arrayFiltrado[i].robos;
        text+= '</td>';
        text+= '</tr>';
    }
    text += '</table>';
    divTeamStats.append(text);
    
    //PLAYOFFS
    
    var esEquipoPlayoff=false;
    var divTeamPlayoffStats = $('#divTeamPlayoffStats');
    divTeamPlayoffStats.empty();
    divTeamPlayoffStats.hide();
    if (!playoffsEnabled) {
    	divTeamPlayoffStats.hide();
    } else {
    	arrayJugadores = arrayJugadores.sort(function (player1,player2) {
                                            return player2.puntosPlayoff - player1.puntosPlayoff;
                                         });
    
    	var arrayFiltrado = arrayJugadores.filter(function(player) {
                          return player.equipo == siglas;
                          });
    	divTeamPlayoffStats.empty();
    	var text = '<div align="center"><span align="center"><b>PLAYOFFS</b></span></div>';
    	text += '<table id="teamPlayoffStatsTable">';
    	text+='<tr><th>Name</th><th>Games</th><th>Mins.</th><th>Points</th><th>Rebs.</th><th>Assists</th><th>Blocks</th><th>Steals</th></tr>';
	    for (var i=0; i<arrayFiltrado.length; i++) {
    	    text+= '<tr>';
        	text+= '<td id="playername">';
        	text+= arrayFiltrado[i].nombre;
        	text+= '</td>';
        	text+= '<td>';
        	if (arrayFiltrado[i].partidosPlayoff!=0 && arrayFiltrado[i].partidosPlayoff!=undefined) {
        		esEquipoPlayoff=true;
        	}
        	if (arrayFiltrado[i].partidosPlayoff==undefined) {
        		arrayFiltrado[i].partidosPlayoff="0";
        	}
        	text+= arrayFiltrado[i].partidosPlayoff;
        	text+= '</td>';
        	text+= '<td>';
        	text+= arrayFiltrado[i].minutosPlayoff;
        	text+= '</td>';
        	text+= '<td>';
        	text+= arrayFiltrado[i].puntosPlayoff;
        	text+= '</td>';
        	text+= '<td>';
        	text+= arrayFiltrado[i].rebotesPlayoff;
        	text+= '</td>';
        	text+= '<td>';
        	text+= arrayFiltrado[i].asistenciasPlayoff;
        	text+= '</td>';
        	text+= '<td>';
        	text+= arrayFiltrado[i].taponesPlayoff;
        	text+= '</td>';
        	text+= '<td>';
        	text+= arrayFiltrado[i].robosPlayoff;
        	text+= '</td>';
        	text+= '</tr>';
    	}
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
}


function onBackKeyDown(e) {
	//alert('backkeydown');
	$('#playerPopup').popup( "close" );
	e.preventDefault();
	navigator.notification.confirm(
	'Do you want to exit the app?',
	saliraplicacion(1),
	'NBA Player Stats',
	['YES','NO']);
}

function saliraplicacion(button) {
   //alert('entrando con button: ' + button);
   if(button=="1" || button==1) {
    if(navigator.app){
        navigator.app.exitApp();
	}else if(navigator.device){
        navigator.device.exitApp();
		}
   }
}
