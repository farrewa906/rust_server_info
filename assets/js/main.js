var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function damageToReason(dmg){
	switch(dmg){
		case"Hunger":
			return"🍴 умер от голода";

		case"Thirst":
			return"🕱 умер от жажды";

		case"Cold":
			return"❄ насмерть замёрз";

		case"Drowned":
			return"🕱 утанул";

		case"Heat":
			return"🔥 сгорел";

		case"Bleeding":
			return"🕱 умер от кровопотери";

		case"Poison":
			return"🕱 отравился";

		case"Suicide":
			return"🕱 больше не хотел жить";

		case"Bullet":
			return"🔫 был застрелян";

		case"Slash":
			return"✂ был зарублен";

		case"BluntTrauma":
			return"🔨 убит тупым предметом";

		case"Fall":
			return"🕱 разбился";

		case"Radiation":
			return"☢ умер от радиации";

		case"Bite":
			return"был кем-то скушан";
	}
	return"🕱 умер";
}

function connect(adr){
	if(typeof WebSocket=="undefined"){
		alert(_("Sorry, your browser does not support WebSockets. Please consider an upgrade to use RustWeb!"));
		return;
	}
	//console.log("connecting to websocket ...");
	show_message("Пробую подключится к websocket", "sys");

	var socket = connect.socket =new WebSocket("ws://"+adr+"/ms");
	socket.onopen=function(){
		//console.log("connected to websocket");
		show_message("Успешное подключение к websocket", "sys");
	}
	socket.onmessage=function(e){
		var msg=e.data,cmd,data;var p=msg.indexOf(" ");
		try{
			if(p<0){
				cmd=msg;data=null;
			}else{
				cmd=msg.substring(0,p);
				data=JSON.parse(msg.substring(p+ 1));
			}
		}catch(e){
			//console.log("invalid server message: "+ msg);
				show_message("invalid server message: "+ msg);
		}

		//console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + cmd);

		switch(cmd){
			case"hello":
				//console.log("greeted by server");
				show_message("Приветствуем сервер", "sys");
				socket.send("hello");
			break;

			case"session":
				//console.log("received session info: "+ data._id);
				show_message("received session info: "+ data._id);
				session=data;
				userId=data.id;
				toggleCss("signedin",true);
				toggleCss("owner",session.owner);

				if(!config.enableLocationSharing)$friends.hide();
				else$friends.show();

				try{
					$('#signin').tooltipster('hide');
				}catch(err){

				}
				
				updateAllies();
				updateRecent();

				if(session.owner){
					if(!config.displayBuildings){
						toggleCss("displayBuildings",true);
						updateBuildings();
						intervals.push(setInterval(updateBuildings,60000*30));
					}
					if(!config.displayMortality){
						toggleCss("displayMortality",true);
						updateMortality();
						intervals.push(setInterval(updateMortality,60000*15));
					}
					toggleCss("displayLoot",true);
					updateLoot();
					intervals.push(setInterval(updateLoot,60000*10));
					onResize();
				}
				report('SignedIn');
			break;

			case"l":
				if(!config.enableLocationSharing&&!session.owner&&data.id!=userId){
					//console.log("skipped player location as location sharing is disabled");
				show_message("skipped player location as location sharing is disabled");
					break;
				}
				updatePlayerLocation(data,false);
			break;

			case"s":
				if(!config.enableLocationSharing){
					//console.log("skipped sleeper location as location sharing is disabled");
				show_message("skipped sleeper location as location sharing is disabled");
					break;
				}
				updatePlayerLocation(data,true);
			break;

			case"player.connect":
				//console.log("received player connect: "+ data.id);
				show_message("received player connect: "+ data.id);
			break;

			case"player.disconnect":
				//console.log("received player disconnect: "+ data.id);
				show_message("received player disconnect: "+ data.id);
			break;

			case"player.chat":
				//console.log(data.name + " : "+ data.message);
				show_message(data.name + " : "+ data.message, "chat");
			break;

			case"player.spawn":
				//console.log("received player spawn: "+ data.id);
				show_message("🕯 Игрок "+ data.name + " заспавнился", "spawn");
			break;

			case"player.death":
				//console.log(data.name + " " + damageToReason(data.lastDamage));
				show_message(data.name + " " + damageToReason(data.lastDamage), "dead");
			break;

			break;

			case"p":
			case"h":
				updateSpecialLocation(cmd,data);
			break;

			case"plane.drop":
			break;

			case"owner.toggle":
				if(!data.owner){
					notify(_("{YOU} are now using the map as player",{"YOU":"<strong>"+_("You")+"</strong>"}));
					var newLocations={};
					for(var i in locations)
						if(locations.hasOwnProperty(i)&&locations[i].type=="player"&&locations[i].id!=userId&&!isShare(locations[i].id)){
							if(locations[i].elem)
								locations[i].elem.remove();
							}else
								newLocations[i]=locations[i];
								locations=newLocations;
						}else{
							notify(_("{YOU} are now using the map as admin",{"YOU":"<strong>"+_("You")+"</strong>"}));
						}
			break;

			case"ping":
				//console.log("ping");
				show_message("ping");
			break;

			default:
				//console.log("received unknown command: "+ cmd);
				show_message("received unknown command: "+ cmd);
			break;
		}
	}
}

function show_message(message, style="none") {
	Data = new Date();
	Hour = Data.getHours();
		if (Hour < 10) { Hour = "0" + Hour }
	Minutes = Data.getMinutes();
		if (Minutes < 10) { Minutes = "0" + Minutes }
	Seconds = Data.getSeconds();
		if (Seconds < 10) { Seconds = "0" + Seconds }

	$('#chat').prepend("<div class='well well-sm " + style + "'>[" + Hour + ":" + Minutes +  ":" + Seconds + "] " + message + "</div>");
}

function updateInfo(adr) {
	$.getJSON(window.location.pathname + 'scripts/json.php?adr='+adr+'&type=status', function(data) {
		$('#sname').html(data.hostname);
		$('#players').html(data.players);
		$('#maxplayers').html(data.maxplayers);
		$('#sleep').html(data.sleepers);
		$('#level').html(data.level);
		$('#size').html(data.world.size);
		$('#seed').html(data.world.seed);
		$('#time').html(data.env.time);
		$('#vers').html(data.version.io);
		show_message("Обновление информации", "update");
		updateGraf(data);
		updatePlayers(adr);
		getMap(adr, data.world.size);  // ита плоха !!! =С
		getDeaths(adr, data.world.size);
	});
}

function updateGraf(data){
	window.myChart.data.datasets = [{label: "online",backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],data: [data.players,data.sleepers,data.maxplayers-data.players]}];
	window.myChart.options.title.text = 'Онлайн '+data.players+' / '+data.maxplayers+' ( '+data.sleepers+' спящие )';
	window.myChart.update();
}

function updatePlayers(adr){
	$("#map-wr").append('<div id="playersPreloader"><i class="fa fa-cog fa-spin" aria-hidden="true"></i></div>');
	$.ajax({
		url: window.location.pathname + "scripts/getPlayersList.php?adr="+adr,
		context: document.body,
		success: function(data){
			$("#playersList").html(data);
			$("#playersPreloader").remove();
		}
	});    
    
}

function getMap(adr, worldSize){
	$("#players-wrap").append('<div id="mapPreloader"><i class="fa fa-cog fa-spin" aria-hidden="true"></i></div>');
	$("#map").attr('src', window.location.pathname + 'scripts/getMap.php?adr='+adr);
	$.getJSON(window.location.pathname + 'scripts/getMonuments.php?adr='+adr, function(data) {
		mmap(data, worldSize);
	});
}


function mmap(data, worldSize){
	var mapW = $('#map').width();
	var mapH = $('#map').height();
	var	mSize = worldSize;
	var dotW = 20;
	var dotH = 20;

	console.log(data);

	var lang = {};
	lang = $.ajax({
		url: window.location.pathname + "resourse/lang/ru.json",
		dataType: "json",
		async: false
	}).responseText;

	lang = JSON.parse(lang);


	$.each(data, function(index, value){
		var x = (mapW / 2) + ( value['position']['x'] / ( mSize / mapW ) );
		x = x - (dotW / 2);
		var z = (mapW / 2) - ( value['position']['z'] / ( mSize / mapW ) );
		z = z - (dotH / 2);

		var iName = value['name'];
		var dotDescr = "";

		if ( iName == "vendingmachine.deployed") {
			dotDescr = "<div class='vendingmachine-title'>Магазин</div><hr>";
			$.each(value.goods, function(index, value){
				dotDescr += "<div class='vendingmachine'>Продаётся: " + lang[value.item] + " [" + value.itemAmount + "шт.]<br>Цена: " + lang[value.currency] + " [" + value.currencyAmount + "шт.]<br> Возможно " + value.inStock + " cделок </div>";
			});
			
		}else{
			dotDescr = lang[iName];
			if (typeof(dotDescr) == "undefined") {
				dotDescr = iName;
			}
		}

		$('#map-wr').append('<img src="' + window.location.pathname + 'resourse/img/' + mapDotImg(iName) + '.png" style="width:' + dotW + 'px;height:' + dotH + 'px;position:absolute;left:'+x+'px;top:'+z+'px;"  data-toggle="tooltip" data-placement="top" title="" data-original-title="' + dotDescr + '">');

	});

	$('[data-toggle="tooltip"]').tooltip({
		'html' : true
	});
}

function getDeaths(adr, worldSize){
	var mapW = $('#map').width();
	var mapH = $('#map').height();
	var	mSize = worldSize;
	var dotW = 20;
	var dotH = 20;

	var deathsList = {};
	deathsList = $.ajax({
		url: window.location.pathname + "scripts/getDeaths.php?adr="+adr,
		dataType: "json",
		async: false
	}).responseText;

	deathsList = JSON.parse(deathsList);

	$.each(deathsList, function(index, value){

		if ( index == 30 ) { return false; }

		var x = (mapW / 2) + ( value['x'] / ( mSize / mapW ) );
		x = x - (dotW / 2);
		var z = (mapW / 2) - ( value['z'] / ( mSize / mapW ) );
		z = z - (dotH / 2);

		$('#map-wr').append('<img src="' + window.location.pathname + 'resourse/img/dead.png" style="width:' + dotW + 'px;height:' + dotH + 'px;position:absolute;left:'+x+'px;top:'+z+'px;"  data-toggle="tooltip" data-placement="top" title="" data-original-title="Смерть<br>Причина: '+value['cause']+'">');
	
	});

	$("#mapPreloader").remove();
}

function mapDotImg(name){
	switch(name){
		case 'power_sub_big_1':
		case 'power_sub_big_2':
		case 'power_sub_big_3':
		case 'power_sub_small_1':
		case 'power_sub_small_2':
		case 'power_sub_small_3':
			return "powersub";
		break;

		case 'military_tunnel_1':
		case 'military_tunnel_2':
		case 'military_tunnel_3':
			return "militarytunnel";
		break;

		case 'airfield_1':
		case 'airfield_2':
		case 'airfield_3':
			return "airfield";
		break;
		
		case 'vendingmachine.deployed':
			return "vendor";
		break;

		case 'sphere_tank':
			return "spheretank";
		break;

		case 'launch_site_1':
		case 'launch_site_2':
		case 'launch_site_3':
			return "launchsite";
		break;

		case 'harbor_1':
		case 'harbor_2':
		case 'harbor_3':
			return "harbor";
		break;

		case 'powerplant_1':
		case 'powerplant_2':
		case 'powerplant_3':
			return "powerplant";
		break;

		case 'satellite_dish':
			return "dish";
		break;

		case 'trainyard_1':
		case 'trainyard_2':
		case 'trainyard_3':
			return "trainyard";
		break;

		case 'radtown_small_1':
		case 'radtown_small_2':
		case 'radtown_small_3':
		case 'radtown_bid_1':
		case 'radtown_bid_2':
		case 'radtown_bid_3':
			return "radtown";
		break;

		case 'water_treatment_plant_1':
		case 'water_treatment_plant_2':
		case 'water_treatment_plant_3':
			return "watertreatment";
		break;

        case 'cave_small_easy':
        case 'cave_small_medium':
        case 'cave_small_hard':
        case 'cave_medium_easy':
        case 'cave_medium_medium':
        case 'cave_medium_hard':
        case 'cave_large_easy':
        case 'cave_large_medium':
        case 'cave_large_hard':
            return "cave";
        break;

        case 'supermarket_1':
            return "supermarket";
        break;

        case 'gas_station_1':
            return "gasstation";
        break;

		default:
			return name;
		break;
	}
}


function updateSpecialLocation(type,data){
	var elem;
	var key, name, img, rot;

	var mapW = $('#map').width();
	var mapH = $('#map').height();
	var	mSize = $('#size').html();
	var dotW = 20;
	var dotH = 20;

	var x = (mapW / 2) + ( data.x / ( mSize / mapW ) );
	var z = (mapW / 2) - ( data.z / ( mSize / mapW ) );

	if(type==="p"){
		key  = "plane";
		name = "Самолёт";
		img  = window.location.pathname + "resourse/img/plane.png";
	}else{
		key  = "helicopter";
		name = "Вертолёт";
		img  = window.location.pathname + "resourse/img/heli.gif";
		rot  +=180;
	}


	if( !$("."+key).is("#"+key+'-'+ data.id) ){
		show_message("Появился " + name , "annonce");
		$("#map-wr").append(elem=$('<img class="'+key+'" alt="" id="'+key+'-'+ data.id+'" data-toggle="tooltip" data-placement="top" title="" data-original-title="" />'));
		elem.attr("data-original-title",name);
		elem.prop("src",img);
		elem.css({
			width: dotW+"px",
			heiht: dotH+"px",
			transform: "rotate("+data.r+"deg)",
			position: "absolute",
			left: x + "px",
			top: z + "px",
			transition: "linear 1s"			
		});
	}else{
		if (!data.k) {
			elem = $("#"+key+'-'+ data.id);
			elem.css({
				width: dotW+"px",
				heiht: dotH+"px",
				transform: "rotate("+data.r+"deg)",
				position: "absolute",
				left: x + "px",
				top: z + "px",
				transition: "linear 1s"				
			});
		}else{
			show_message(name + " исчез", "annonce");
			alert('KILL');
			$("#"+key+'-'+ data.id).remove();
		}
		
	}
}