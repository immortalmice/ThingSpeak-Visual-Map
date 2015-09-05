var alldata = [];
var faildata = [];
var updatedata = [];
var infowindowque = [];
var channeldata = [];

var map;
var showtype = 0;
var updateflag = true;

function initialize(){
  var mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(23.783832, 120.957181)
  };
  map = new google.maps.Map(document.getElementById('map'),mapOptions);
  getdata('Data/channeldata.json').success(function(response){
  	channeldata = response;
  	processdata();
  });
	var stylesGray = [
    {
      stylers: [
        { hue: "#00ffee" },
        { saturation: -70 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];
  map.setOptions({styles: stylesGray});
  $(function(){
  	$('#submitchannel').on('submit', function(event){
	  	event.preventDefault();
	  	var form = $(this);
	  	var formData = form.serialize();
	  	//console.log(formData);
	  	$.ajax({
	    	type: 'POST', url: '/Data', data: formData
	  	}).done(function(result){
	  		if(result == "登錄成功！重新整理頁面後即可看到你的ProbePot!"){
	  			document.getElementById("acheive").innerHTML = "<div id=\"result\"><p id=\"gresult\">" + result + "</p></div><div id=\"resbut\"><input type=\"button\" class=\"button\" value=\"重新整理\" onclick=\"location.reload();\"></div>";
	  		}else{
	  			document.getElementById("acheive").innerHTML = "<div id=\"result\"><p id=\"bresult\">" + result + "</p></div><div id=\"resbut\"><input type=\"button\" class=\"button\" value=\"重新整理\" onclick=\"location.reload();\"></div>";
	  		}	
	  	});
	});
  });
  update();
}
function createMarker(latlng, id){
    var thisdata = getalldata(id);
    var iconstr = "Pic/s";
    iconstr += thisdata.score;
    iconstr += ".png";
    var marker= new google.maps.Marker({
      position: latlng, 
      map: map,
      title: "ID: " + thisdata.chid,
      icon: iconstr,
      clickable: true
    });
    google.maps.event.addListener(marker, "click", function() {
    	var s = getalldataindex(id);
        console.log(alldata[s]);
        alldata[s].infowindow.setContent("Hello!");
	  	alldata[s].infowindow.open(map,alldata[s].mark);
	  	infowindowque.push(alldata[s].infowindow);
	  	setTimeout("infowindowque.shift().close();",2000);
        var inhtml = "<p class='info info1'>ID:  " + (alldata[s].chid==undefined ? '--' : alldata[s].chid) + "</p>";
        inhtml += "<p class='info info2' style=\"float:right; background-color:#AA7700;\"> " + alldata[s].door + " </p><p class='info info2' style=\"float:right; background-color:#66009D;\"> " + alldata[s].version + " </p> ";
        inhtml += "<font face=\"Microsoft JhengHei\"><h2><font color = #32CD32>" + (alldata[s].chna==undefined ? '--' : alldata[s].chna) + "</font></h2>";
        inhtml += "<div><img class='inline infopic' src=\"Pic/icons/temp.png\">" + "<h4 class='inline'>" + (alldata[s].temps === 1 ? '<font color = \' #CC0000\'>' : '') + "溫度:  " + (alldata[s].temps === 1 ? '</font>' : '') + (alldata[s].temp==undefined ? '--' : alldata[s].temp) + "°C</h4></div>";
        inhtml += "<div><img class='inline infopic' src=\"Pic/icons/humi.png\">" + "<h4 class='inline'>" + (alldata[s].humis === 1 ? '<font color = \' #CC0000\'>' : '') + "濕度:  " + (alldata[s].humis === 1 ? '</font>' : '') + (alldata[s].humi==undefined ? '--' : alldata[s].humi) + "%</h4></div>";
        inhtml += "<div><img class='inline infopic' src=\"Pic/icons/ppm.png\">" + "<h4 class='inline'>" + (alldata[s].ppms === 1 ? '<font color = \' #CC0000\'>' : '') + "空氣汙染:  " +  (alldata[s].ppms === 1 ? '</font>' : '') + (alldata[s].ppm==undefined ? '--' : alldata[s].ppm) + "ppm</h4></div>";
        inhtml += "<div><img class='inline infopic' src=\"Pic/icons/dust.png\">" + "<h4 class='inline'>" + (alldata[s].dusts === 1 ? '<font color = \' #CC0000\'>' : '') + "懸浮微粒:  " + (alldata[s].dusts === 1 ? '</font>' : '') + (alldata[s].dust==undefined ? '--' : alldata[s].dust) + "μg/m<sup>3</sup></h4></div>";
        inhtml += "<p class= 'info' id='maker' style=\" float: right;\"><b>自造者: " + alldata[s].maker + "</b></p></font>";
        document.getElementById("pointdata").innerHTML = inhtml;
        document.getElementById("field2").innerHTML="<iframe width=\"300\" height=\"200\" style=\"border: 0px; margin: 0px;\" src=\"http://api.thingspeak.com/channels/" + alldata[s].chid + "/charts/1?width=300&height=200&median=30&results=720&dynamic=true&type=spline&color=green&title=%E6%BA%AB%E5%BA%A6%20(%E2%84%83)\" ></iframe>";
        document.getElementById("field3").innerHTML="<iframe width=\"300\" height=\"200\" style=\"border: 0px; margin: 0px;\" src=\"http://api.thingspeak.com/channels/" + alldata[s].chid + "/charts/2?width=300&height=200&median=30&results=720&dynamic=true&type=spline&color=blue&title=%E7%9B%B8%E5%B0%8D%E6%BF%95%E5%BA%A6%20(%25)\" ></iframe>";
        document.getElementById("field1").innerHTML="<iframe width=\"300\" height=\"200\" style=\"border: 0px; margin: 0px;\" src=\"http://api.thingspeak.com/channels/" + alldata[s].chid + "/charts/3?width=300&height=200&yaxismax=1300&yaxismin=0&median=240&days=7&dynamic=true&color=chocolate&title=%E5%9C%9F%E5%A3%A4%E6%BF%95%E5%BA%A6\" ></iframe>";
        document.getElementById("field4").innerHTML="<iframe width=\"300\" height=\"200\" style=\"border: 0px; margin: 0px;\" src=\"http://api.thingspeak.com/channels/" + alldata[s].chid + "/charts/4?width=300&height=200&yaxismin=0&median=30&results=720&dynamic=true&type=spline&color=darkred&title=%E7%A9%BA%E6%B0%A3%E6%B1%99%E6%9F%93%20(ppm)\" ></iframe>";
        document.getElementById("field5").innerHTML="<iframe width=\"300\" height=\"200\" style=\"border: 0px; margin: 0px;\" src=\"http://api.thingspeak.com/channels/" + alldata[s].chid + "/charts/5?width=300&height=200&yaxismin=0&median=30&results=720&dynamic=true&type=spline&color=grey&title=%E6%87%B8%E6%B5%AE%E5%BE%AE%E7%B2%92%20(%CE%BCg%2Fm3)\" ></iframe>";
    });
    return marker;
}
function buttonclick(type){
	showtype = type;
	if(type === 0){
		document.getElementById("picbar").innerHTML = "";
		for(var i = 0; i<=alldata.length-1; i++){
			changeicon(alldata[i].score,alldata[i].mark);
		}
	}else if(type === 1){
		document.getElementById("picbar").innerHTML = "<img class=\"bar\" src=\"Pic/tempbar.png\">";
		for(var i = 0; i<=alldata.length-1; i++){
			changeicon(alldata[i].temp,alldata[i].mark);
		}
	}else if(type === 2){
		document.getElementById("picbar").innerHTML = "<img class=\"bar\" src=\"Pic/humibar.png\">";
		for(var i = 0; i<=alldata.length-1; i++){
			changeicon(alldata[i].humi,alldata[i].mark);
		}
	}else if(type === 3){
		document.getElementById("picbar").innerHTML = "<img class=\"bar\" src=\"Pic/dustbar.png\">";
		for(var i = 0; i<=alldata.length-1; i++){
			changeicon(alldata[i].ppm,alldata[i].mark);
		}
	}else if(type === 4){
		document.getElementById("picbar").innerHTML = "<img class=\"bar\" src=\"Pic/ppmbar.png\">";
		for(var i = 0; i<=alldata.length-1; i++){
			changeicon(alldata[i].dust,alldata[i].mark);
		}
	}
}
function changeicon(data,mark){
	if(showtype === 0){
		mark.setIcon("Pic/s" + data + ".png");
	}else if(showtype === 1){
		if(data === undefined|| data === null){
			mark.setIcon("Pic/s-1.png");
			return;
		}
		var e = Number(data);
		var picstr = "Pic/s1";
		var num =  Math.floor((e+2)/2);
		if(num>=1 &&num<=18){
			picstr += num;
		}else if(num<1){
			picstr += "1";
		}else{
			picstr += "18";
		}
		picstr += ".png";
		mark.setIcon(picstr);	
	}else if(showtype === 2){
		if(data === undefined|| data === null){
			mark.setIcon("Pic/s-1.png");
			return;
		}
		var e = Number(data);
		var picstr = "Pic/s2";
		var num = Math.floor((e+10)/10);
		if(num>=1 &&num<=10){
			picstr += num;
		}else if(num<1){
			picstr += "1";
		}else{
			picstr += "10";
		}
		picstr += ".png";
		mark.setIcon(picstr);
	}else if(showtype === 3){
		if(data === undefined|| data === null){
			mark.setIcon("Pic/s-1.png");
			return;
		}
		var e = Number(data);
		var picstr = "Pic/s34";
		var num = Math.floor((e+15)/15);
		if(num>=1 &&num<=4){
			picstr += num;
		}else if(num<1){
			picstr += "1";
		}else{
			picstr += "4";
		}
		picstr += ".png";
		mark.setIcon(picstr);
	}else if(showtype === 4){
		if(data === undefined || data === null){
			mark.setIcon("Pic/s-1.png");
			return;
		}
		var e = Number(data);
		var picstr = "Pic/s34";
		var num = Math.floor((e+50)/50);
		if(num>=1 &&num<=4){
			picstr += num;
		}else if(num<1){
			picstr += "1";
		}else{
			picstr += "4";
		}
		picstr += ".png";
		mark.setIcon(picstr);
	}
}

function getdata(website){
	var successFunc = null;
	var failureFunc = null;
	var xmlHttp,backdata;
	function createXMLHttpRequest()
	{
		if(window.XMLHttpRequest)
		{
			xmlHttp = new XMLHttpRequest();
		}
	}
	function startRequest()
	{
		createXMLHttpRequest();
		try
		{
			xmlHttp.onreadystatechange = handleStateChange;
			xmlHttp.open("GET", website, true);
			xmlHttp.send(null);
		}
		catch(exception)
		{
			alert("xmlHttp Fail");
		}
	}
	function handleStateChange()
	{   
		if(xmlHttp.readyState == 4)
		{       
			if (xmlHttp.status == 200 || xmlHttp.status == 0)
			{
			    var result = xmlHttp.responseText;
			    var backdata = eval("(" + result + ")");
			    
			    if(successFunc)
			    	successFunc(backdata);
			}else{
				failureFunc(null);
			}
		}
	}
	startRequest();
	return {
		success:function(func){
			successFunc = func;
		},
		failure:function(func){
			failureFunc = func;
		}
	};
}

function getdatafromthingspeak(channel){
	var successFunc = null;
	var failureFunc = null;
	var xmlHttp,backdata;
	function createXMLHttpRequest()
	{
		if(window.XMLHttpRequest)
		{
			xmlHttp = new XMLHttpRequest();
		}
	}
	function startRequest()
	{
		createXMLHttpRequest();
		try
		{
			xmlHttp.onreadystatechange = handleStateChange;
			xmlHttp.open("GET", "https://thingspeak.com/channels/" + channel.chid + "/feeds.json", true);
			xmlHttp.send(null);
		}
		catch(exception)
		{
			alert("xmlHttp Fail");
		}
	}
	function handleStateChange()
	{   
		if(xmlHttp.readyState == 4)
		{       
			if (xmlHttp.status == 200 || xmlHttp.status == 0)
			{
			    var result = xmlHttp.responseText;
			    var json = eval("(" + result + ")");
			    	var l = json.feeds.length-1;
				    backdata =
				    {
				    	id: channel.id,
				    	chid: channel.chid,
				    	chna: json.channel.name,
				    	lat : json.channel.latitude,
				    	lng : json.channel.longitude,
				    	maker: channel.maker,
				    	version: channel.version,
				    	door: channel.door,
				    	temp : (l == -1) ? undefined : json.feeds[l].field1,
				    	humi : (l == -1) ? undefined : json.feeds[l].field2,
				    	ppm : (l == -1) ? undefined : json.feeds[l].field4,
				    	dust : (l == -1) ? undefined : json.feeds[l].field5,
				    	lasten : json.channel.last_entry_id,
				    	intime : json.channel.updated_at
				    };
				    if(successFunc)
				    	successFunc(backdata,xmlHttp);
			}else{
				if(failureFunc)
					failureFunc({chid: channel.chid},xmlHttp);
			}
		}
	}
	startRequest();
	return {
		success:function(func){
			successFunc = func;
		},
		failure:function(func){
			failureFunc = func;
		}
	};
}

function processdata(){
	alldata=[];
	var k={};
	var i;
	for(i=0 ; i<=channeldata.length-1 ; i++){
		var returnobj = getdatafromthingspeak( channeldata[i] );
		returnobj.success( function(data,xhr){
			k = data;
			k.id = data.id;
			k.temps = (typeof k.temp == "string" ? (k.temp>28 ? 1 : k.temp<15 ? 1 : 0) : -1);
			k.humis = (typeof k.humi == "string" ? (k.humi>80 ? 1 : k.humi<40 ? 1 : 0) : -1);
			k.ppms = (typeof k.ppm == "string" ? (k.ppm>20 ? 1 : 0) : -1);
			k.dusts = (typeof k.dust == "string" ? (k.dust>75 ? 1 : 0) : -1);
			k.score = (typeof k.temp == "string" && typeof k.humi == "string" && typeof k.humi == "string" && typeof k.dust == "string") ?
					   (((k.temp>28 ? 1 : k.temp<15 ? 1 : 0) === 0 ? 0 : 1 )+ 
					   ((k.humi>80 ? 1 : k.humi<40 ? 1 : 0) === 0 ? 0 : 1 )+ (k.ppm>20 ? 1 : 0) + (k.dust>75 ? 1 : 0)) : -1;
			k.infowindow = new google.maps.InfoWindow({content: "undefined", disableAutoPan: true});
			alldata.push(k);
			var s = getalldataindex(k.id);
			alldata[s].mark = createMarker(new google.maps.LatLng(alldata[s].lat, alldata[s].lng), alldata[s].id);
		});
	}
}
function getalldata(id){
	for(var i=0;i<=alldata.length-1;i++){
		if(alldata[i].id === id){
			return alldata[i];
		}
	}
	return null;
}
function getalldataindex(id){
	for(var i=0;i<=alldata.length-1;i++){
		if(alldata[i].id === id){
			return i;
		}
	}
	return null;
}
function update(){
	var k={};
	var counter = 0;
	for(var i=0 ;i<=alldata.length-1 ;i++){
		getdatafromthingspeak( alldata[i] ).success( function(data,xhr){
			var s = getalldataindex(data.id);
			counter++;
			if(alldata[s].lasten === undefined){
				if(counter === alldata.length){
					document.getElementById("liveupdate").innerHTML = updatedata.join("");
				}
				return;
			}
			if(Number(data.lasten) > Number(alldata[s].lasten)){
				k = data;
				k.id = data.id;
				k.temps = (typeof k.temp == "string" ? (k.temp>28 ? 1 : k.temp<15 ? 1 : 0) : -1);
				k.humis = (typeof k.humi == "string" ? (k.humi>80 ? 1 : k.humi<40 ? 1 : 0) : -1);
				k.ppms = (typeof k.ppm == "string" ? (k.ppm>20 ? 1 : 0) : -1);
				k.dusts = (typeof k.dust == "string" ? (k.dust>75 ? 1 : 0) : -1);
				k.score = (typeof k.temp == "string" && typeof k.humi == "string" && typeof k.humi == "string" && typeof k.dust == "string") ?
						   (((k.temp>28 ? 1 : k.temp<15 ? 1 : 0) === 0 ? 0 : 1 )+ 
						   ((k.humi>80 ? 1 : k.humi<40 ? 1 : 0) === 0 ? 0 : 1 )+ (k.ppm>20 ? 1 : 0) + (k.dust>75 ? 1 : 0)) : -1;
				k.mark = alldata[s].mark;
				k.infowindow = alldata[s].infowindow;
				alldata[s] = k;
				if(showtype === 0){
					changeicon(alldata[s].score,alldata[s].mark);
				}else if(showtype === 1){
					changeicon(alldata[s].temp,alldata[s].mark);
				}else if(showtype === 2){
					changeicon(alldata[s].humi,alldata[s].mark);
				}else if(showtype === 3){
					changeicon(alldata[s].ppm,alldata[s].mark);
				}else if(showtype === 4){
					changeicon(alldata[s].dust,alldata[s].mark);
				}
				var updatestr = "<font face=\"Microsoft JhengHei\">";
				if(updatedata.length < 8){
					updatestr += "<p class='updateinfo'><font color =\'#ffffff\'><font style=\"background-color: #888888\">" + alldata[s].intime + "</font> <font class=\"colorblock\" style=\"background-color: #8fbc8f\">ID" + alldata[s].chid + "</font> <font class=\"colorblock\" style=\"background-color: #32CD32\">" + alldata[s].chna + "</font></font>  氣溫 " + alldata[s].temp + "°C, 濕度 " + alldata[s].humi + "%, 空氣汙染 " + alldata[s].ppm + "ppm, 懸浮微粒 " + alldata[s].dust + "μg/m<sup>3</sup></p></font>";
					updatedata.push(updatestr);
				}else{
					updatedata.shift();
					updatestr += "<p class='updateinfo'><font color =\'#ffffff\'><font style=\"background-color: #888888\">" + alldata[s].intime + "</font> <font class=\"colorblock\" style=\"background-color: #8fbc8f\">ID" + alldata[s].chid + "</font> <font class=\"colorblock\" style=\"background-color: #32CD32\">" + alldata[s].chna + "</font></font>  氣溫 " + alldata[s].temp + "°C, 濕度 " + alldata[s].humi + "%, 空氣汙染 " + alldata[s].ppm + "ppm, 懸浮微粒 " + alldata[s].dust + "μg/m<sup>3</sup></p></font>";
					updatedata.push(updatestr);
				}
				alldata[s].infowindow.setContent("Update!");
			  	alldata[s].infowindow.open(map,alldata[s].mark);
			  	infowindowque.push(alldata[s].infowindow);
	  			setTimeout("infowindowque.shift().close();",2000);
			}
			if(counter === alldata.length){
				if(updateflag){
					document.getElementById("liveupdate").innerHTML = updatedata.join("");
				}
			}
		});
	}
	if(updateflag === true){
		setTimeout("update();",5000);
	}else{
		updatedata = undefined;
		updatedata = [];
		document.getElementById("liveupdate").innerHTML = "<font face=\"Microsoft JhengHei\"><h2>即時更新已關閉</h2></font>" ;
		document.getElementById("livebutton").innerHTML = "<input type=\"button\" id=\"lbutton\" value=\"開啟即時更新\" onclick = \"restartupdate();\">";
		document.getElementById("live").src = "Pic/icons/OFFLINEcs.png";
		return;
	}
}
function restartupdate(){
	updateflag = true;
	document.getElementById("live").src = "Pic/icons/LIVEcs.png";
	document.getElementById("livebutton").innerHTML = "<input type=\"button\" id=\"lbutton\" value=\"關閉即時更新\" onclick = \"shutlive();\">";
	update();
}
function shutlive(){
	updateflag = false;
	document.getElementById("livebutton").innerHTML = "<input type=\"button\" id=\"lbutton\" value=\"關閉中...\">";
}


