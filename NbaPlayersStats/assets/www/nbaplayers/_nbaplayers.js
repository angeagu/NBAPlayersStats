$.support.cors = true;
$.mobile.allowCrossDomainPages = true;
$.mobile.phonegapNavigationEnabled = true;

var pacers = new Array(20);
var indexPacers=0;
var heat = new Array(20);
var indexHeat=0;
var raptors = new Array(20);
var indexRaptors=0;
var bulls = new Array(20);
var indexBulls=0;
var nets = new Array(20);
var indexNets=0;
var wizards = new Array(20);
var indexWizards=0;
var bobcats = new Array(20);
var indexBobcats=0;
var hawks = new Array(20);
var indexHawks=0;
var knicks = new Array(20);
var indexKnicks=0;
var cavaliers = new Array(20);
var indexCavaliers=0;
var pistons = new Array(20);
var indexPistons=0;
var celtics = new Array(20);
var indexCeltics=0;
var magic = new Array(20);
var indexMagic=0;
var sixers = new Array(20);
var indexSixers=0;
var bucks = new Array(20);
var indexBucks=0;
var spurs = new Array(20);
var indexSpurs=0;
var thunder = new Array(20);
var indexThunder=0;
var clippers = new Array(20);
var indexClippers=0;
var lakers = new Array(20);
var indexLakers=0;
var rockets = new Array(20);
var indexRockets=0;
var blazers = new Array(20);
var indexBlazers=0;
var warriors = new Array(20);
var indexWarriors=0;
var grizzlies = new Array(20);
var indexGrizzlies=0;
var mavericks = new Array(20);
var indexMavericks=0;
var suns = new Array(20);
var indexSuns=0;
var timberwolves = new Array(20);
var indexTimberwolves=0;
var nuggets = new Array(20);
var indexNuggets=0;
var pelicans = new Array(20);
var indexPelicans=0;
var kings = new Array(20);
var indexKings=0;
var jazz = new Array(20);
var indexJazz=0;
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
var playoffsEnabled=false;

var restartRequest = function() {
    
    resetData();
    
	modaldialog = $('#loadingDataPopup');
	modaldialog.empty();
	modaldialog.append('<br><br><br>Loading Data. Please Wait... <br><br><br><br>');
	modaldialog.popup( "open" );
	console.log('Restarting request...');
	callJSON();
}

var resetData = function () {
    pacers = new Array(20);
    indexPacers=0;
    heat = new Array(20);
    indexHeat=0;
    raptors = new Array(20);
    indexRaptors=0;
    bulls = new Array(20);
    indexBulls=0;
    nets = new Array(20);
    indexNets=0;
    wizards = new Array(20);
    indexWizards=0;
    bobcats = new Array(20);
    indexBobcats=0;
    hawks = new Array(20);
    indexHawks=0;
    knicks = new Array(20);
    indexKnicks=0;
    cavaliers = new Array(20);
    indexCavaliers=0;
    pistons = new Array(20);
    indexPistons=0;
    celtics = new Array(20);
    indexCeltics=0;
    magic = new Array(20);
    indexMagic=0;
    sixers = new Array(20);
    indexSixers=0;
    bucks = new Array(20);
    indexBucks=0;
    spurs = new Array(20);
    indexSpurs=0;
    thunder = new Array(20);
    indexThunder=0;
    clippers = new Array(20);
    indexClippers=0;
    lakers = new Array(20);
    indexLakers=0;
    rockets = new Array(20);
    indexRockets=0;
    blazers = new Array(20);
    indexBlazers=0;
    warriors = new Array(20);
    indexWarriors=0;
    grizzlies = new Array(20);
    indexGrizzlies=0;
    mavericks = new Array(20);
    indexMavericks=0;
    suns = new Array(20);
    indexSuns=0;
    timberwolves = new Array(20);
    indexTimberwolves=0;
    nuggets = new Array(20);
    indexNuggets=0;
    pelicans = new Array(20);
    indexPelicans=0;
    kings = new Array(20);
    indexKings=0;
    jazz = new Array(20);
    indexJazz=0;
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
	//alert('call JSON....');
	console.log('call JSON....');
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
	console.log('procesando respuesta callJSON');
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
		
		if (equipo == 'IND') {pacers[indexPacers]=nombre;indexPacers++;}
		else if (equipo == 'MIA') {heat[indexHeat]=nombre;indexHeat++;}
		else if (equipo == 'TOR') {raptors[indexRaptors]=nombre;indexRaptors++;}
		else if (equipo == 'CHI') {bulls[indexBulls]=nombre;indexBulls++;}
		else if (equipo == 'BKN') {nets[indexNets]=nombre;indexNets++;}
		else if (equipo == 'WAS') {wizards[indexWizards]=nombre;indexWizards++;}
		else if (equipo == 'CHA') {bobcats[indexBobcats]=nombre;indexBobcats++;}
		else if (equipo == 'ATL') {hawks[indexHawks]=nombre;indexHawks++;}
		else if (equipo == 'NYK') {knicks[indexKnicks]=nombre;indexKnicks++;}
		else if (equipo == 'CLE') {cavaliers[indexCavaliers]=nombre;indexCavaliers++;}
		else if (equipo == 'DET') {pistons[indexPistons]=nombre;indexPistons++;}
		else if (equipo == 'BOS') {celtics[indexCeltics]=nombre;indexCeltics++;}
		else if (equipo == 'ORL') {magic[indexMagic]=nombre;indexMagic++;}
		else if (equipo == 'PHI') {sixers[indexSixers]=nombre;indexSixers++;}
		else if (equipo == 'MIL') {bucks[indexBucks]=nombre;indexBucks++;}
		else if (equipo == 'SAS') {spurs[indexSpurs]=nombre;indexSpurs++;}
		else if (equipo == 'OKC') {thunder[indexThunder]=nombre;indexThunder++;}
		else if (equipo == 'LAC') {clippers[indexClippers]=nombre;indexClippers++;}
		else if (equipo == 'LAL') {lakers[indexLakers]=nombre;indexLakers++;}
		else if (equipo == 'HOU') {rockets[indexRockets]=nombre;indexRockets++;}
		else if (equipo == 'POR') {blazers[indexBlazers]=nombre;indexBlazers++;}
		else if (equipo == 'GSW') {warriors[indexWarriors]=nombre;indexWarriors++;}
		else if (equipo == 'MEM') {grizzlies[indexGrizzlies]=nombre;indexGrizzlies++;}
		else if (equipo == 'DAL') {mavericks[indexMavericks]=nombre;indexMavericks++;}
		else if (equipo == 'PHX') {suns[indexSuns]=nombre;indexSuns++;}
		else if (equipo == 'MIN') {timberwolves[indexTimberwolves]=nombre;indexTimberwolves++;}
		else if (equipo == 'DEN') {nuggets[indexNuggets]=nombre;indexNuggets++;}
		else if (equipo == 'NOP') {pelicans[indexPelicans]=nombre;indexPelicans++;}
		else if (equipo == 'SAC') {kings[indexKings]=nombre;indexKings++;}
		else if (equipo == 'UTA') {jazz[indexJazz]=nombre;indexJazz++;}
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
	console.log('jsondataready');
	//alert('jsondataready');
	//Una vez tenemos los datos json, cargamos el listview
	//de busqueda de los jugadores.
	crearListaListView(arrayJugadores);
}


var callAsistenciasStats = function() {	
	console.log('callAsistenciasStats...');
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
	console.log('asistenciasdataready');
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
	console.log('rebotesdataready');
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
	console.log('taponesrobosdataready');
	modaldialog.popup( "close" );
	if (!jsondataplayoffready && playoffsEnabled) {
	    callJSONPlayoff();
	}
}



/* FUNCIONES PARA PLAYOFFS */


var callJSONPlayoff = function() {	
	//alert('call JSON Playoff....');
	console.log('call JSON Playoff....');
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
	console.log('procesando respuesta callJSONPlayoff');
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
	console.log('jsondataplayoffready');
	//alert('jsondataready');
	if (!asistenciasdataplayoffready) {
	    callAsistenciasStatsPlayoff();
	}
}

var callAsistenciasStatsPlayoff = function() {	
	console.log('callAsistenciasStatsPlayoff...');
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
	console.log('asistenciasdataplayoffready');
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
	console.log('rebotesdatareadyplayoff');
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
	console.log('taponesrobosdataplayoffready');
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
	console.log('Error al procesar SQL: ' + error)
}


function exitoBBDD(error) {
	console.log('Ejecucion de sql correcta');
	var db = window.openDatabase("NBAPLAYERS", "1.0", "NBAPLAYERS", 1000000);
	db.transaction(cargarListaEquipos,errorBBDD);
	
}

function poblarBBDD(transaction) {
	
	//transaction.executeSql('DROP TABLE IF EXISTS PLAYERS');
	transaction.executeSql('DROP TABLE IF EXISTS TEAMS');
	//transaction.executeSql('CREATE TABLE PLAYERS (NOMBRE TEXT, APELLIDO TEXT,ID_EQUIPO REAL);');
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
	transaction.executeSql('INSERT INTO TEAMS (ID_EQUIPO,NOMBRE,CONFERENCIA,SIGLAS) VALUES ("21","Charlotte Bobcats","Este","CHA")');
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
	
	
	if (!taponesrobosdataready) {
		
		callJSON();	
	
	}
	
	
	//Mostramos una ventana modal para evitar que el usuario seleccione datos
	//antes de cargarse los datos por la invocación JSON.
	modaldialog = $('#loadingDataPopup');
	modaldialog.empty();
	modaldialog.append('<br><br><br>Loading Data. Please Wait... <br><br><br><br>');
	modaldialog.popup( "open" );		
	
}

function cargarListaEquipos() {
	console.log('Entrando en cargarListaEquipos');
	//Cargamos la lista de equipos, y antes cargamos el ListView();
	var db = window.openDatabase("NBAPLAYERS", "1.0", "NBAPLAYERS", 1000000);
	db.transaction(function(transaction){
		transaction.executeSql('SELECT * FROM TEAMS ORDER BY NOMBRE ASC', [], crearTablaListaEquipos, errorBBDD);
	},errorBBDD);
}


function crearTablaListaEquipos(transaction,results) {
	console.log("Entrando en crearTablaListaEquipos");
	console.log("Num filas devueltas: " + results.rows.length);
	if (results.rows.length==0) {
	    console.log('No hay resultados');
	    return false;
	}
	$select = $('#select-equipo');
	$select.empty();
	for (var i=0; i<results.rows.length; i++) {
		var row = results.rows.item(i);
		//console.log("Fila = " + i + " NOMBRE = " + row.NOMBRE + " Conferencia  " + row.CONFERENCIA );
		$select.append('<option value="'+row.SIGLAS+'">'+row.NOMBRE+'</option>');
	}
	$select.selectmenu("refresh", true);

}

function actualizaJugadores() {
	console.log('Entrando en actualizaJugadores');
	$select = $('#select-equipo');
	var siglas = $select.val();
	
	if (siglas == 'IND') {crearListaJugadores(pacers);}
	else if (siglas == 'MIA') {crearListaJugadores(heat);}
	else if (siglas == 'TOR') {crearListaJugadores(raptors);}
	else if (siglas == 'CHI') {crearListaJugadores(bulls);}
	else if (siglas == 'BKN') {crearListaJugadores(nets);}
	else if (siglas == 'WAS') {crearListaJugadores(wizards);}
	else if (siglas == 'CHA') {crearListaJugadores(bobcats);}
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
	console.log('entrando en crear lista jugadores');
	console.log("Num filas devueltas: " + results.length);
	if (results.length==0) {
	    console.log('No hay resultados');
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
	    console.log('No hay resultados');
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
	alert('Entrando en ObtenerDatosPErsonalesJugador con param: ' + param);
	$.ajax({
	url: direccionDatosPersonales,
	contentType: "application/json",
	data: param,
	dataType: 'json',
	crossDomain: true,
	timeout:10000,
	success: procesaRespuestaDatosPersonales,
	error: function(xhr, status, errThrown) {
	    	if (status == 'timeout') {
	    	    var out = "Can't load personal data from player." + "\n";
	    	    out += "Please Click Reload Stats Button";
	    	    console.log('Request Timeout obtenerDatosPersonalesJugador....');
	    	}
		modaldialog.popup( "close" );
		alert(out);
	}
});
	
	alert('Invocacion a ' +direccionDatosPersonales+ '  realizada.');
}

function procesaRespuestaDatosPersonales(data) {
	
	alert ('ENTRANDO en procesaRespuestaDatosPersonales.');
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
	alert('datospersonalesready');
	console.log('datospersonalesready');
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
			/*
			alert ('Llamando a obtenerDatosPersonalesJugador');
			obtenerDatosPersonalesJugador(playerid);
			alert ('TrasLLamada a obtenerDatosPErsonales.');
			*/
			
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
			var partidos = player.partidos;
			if (partidos==undefined) {
			    partidos = 0;
			}
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
		
			//alert(datagridtext);
			
			$('#playerPopup').append(datagridtext);
			$('#playerPopup').popup( "open" );

		}
		
	}
	
}



function onBackKeyDown(e) {
	navigator.notification.confirm(
	("Desea salir de la aplicacion?"),
	saliraplicacion(1),
	'NBA Player Stats',
	'YES,NO');
	 
}

function saliraplicacion(button) {
   //alert('entrando con button: ' + button);
   if(button=="1" || button==1) {
    navigator.app.exitApp();
   }
}
