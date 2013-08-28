$(document).ready(function() {
    
    // Selecciona tot el contingut dels inputs
    $("input[type='number']").click(function () {
        this.select()
    });
	
    var nen = false;
    var jove = false;
    
	$("input, select").change(function () {
	    nen = $("#menor14anys").is(':checked');
	    if (nen) $("#menor25anys").attr('checked', true).attr("readonly",true).checkboxradio("refresh");
		else $("#menor25anys").attr("readonly",false).checkboxradio("refresh");
	    jove = $("#menor25anys").is(':checked');
	});
    
    // Animacions bitllets
    $(".bitllet").bind('expand', function () {
        $(this).find(".imatge-bitllet").clearQueue().delay(0).queue(function() {
            $(this).addClass("visible")
        });
    }).bind('collapse', function() {
        $(this).find(".imatge-bitllet").removeClass("visible");
    });
    
    // Dates
    setDates();
    var diesACalcular;
    $("#dies-a-calcular").change(function() {
        setDates();
    });

	var indexPrimerDiaSetmana = 0;
	
    function setDates() {
        
        diesACalcular = parseInt($("#dies-a-calcular").val());
        
        var today = new Date();
        var d = today.getDay();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        indexPrimerDiaSetmana = today.getDay();
        var diesDeLaSetmana = ["dg.", "dl.", "dt.", "dc.", "dj.", "dv.", "ds."];
        $("#start-date").html(diesDeLaSetmana[d] + " " + dd+'/'+mm+'/'+yyyy);
        
        var lastDay = new Date(today);
        lastDay.setDate(lastDay.getDate() + diesACalcular);
        var d = lastDay.getDay();
        var dd = lastDay.getDate();
        var mm = lastDay.getMonth()+1; //January is 0!
        var yyyy = lastDay.getFullYear();
        $("#end-date").html(diesDeLaSetmana[d] + " " + dd+'/'+mm+'/'+yyyy);
    }
        
    // Flag on guardarem la targeta més econòmica i el preu
    var minTargeta = "bitllet-senzill";
    
    $("#results").on("pageshow",function() {
        recalculateEverything();
        
        // Expandeix la targeta més barata
		$("#"+minTargeta).trigger('expand');
        
        // Actualitza el collapsible perquè els borders quedin bé
        $("#resultats-collapsible").collapsibleset('refresh');
        
        function recalculateEverything() {
            var viatgesSetmana = 0;
            var viatgesTotals = 0;
            
            var diesDeLaSetmana = ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"];
            
            var diesEnQueAgafemElTransport = 0;
            var mesosEnQueAgafemElTransport = 0;
            var ultimDiaAmbMesSumat = 0;
            var trimestresEnQueAgafemElTransport = 0;
            var ultimDiaAmbTrimestreSumat = 0;
            var diaT5030 = 0;
            var T5030necessaries = 0;
            var viatgesEnComprarLUltimaT5030 = 0;
            var T7030necessaries = 0;
            var viatgesEnComprarLUltimaT7030 = 0;
            for (var i = 0; i < diesACalcular; i++) {
                var viatgesAquellDia = parseInt($("#viatges-" + diesDeLaSetmana[(i + indexPrimerDiaSetmana) % 7]).val());
                viatgesTotals += viatgesAquellDia;
                if (viatgesAquellDia !== 0) {
                    diesEnQueAgafemElTransport++;
                    
                    if (mesosEnQueAgafemElTransport === 0) {
                        mesosEnQueAgafemElTransport++;
                        ultimDiaAmbMesSumat = i;
                    }
                    else if (ultimDiaAmbMesSumat + 30 <= i) {
                        ultimDiaAmbMesSumat = i;
                        mesosEnQueAgafemElTransport++;
                    }
                    
                    if (trimestresEnQueAgafemElTransport === 0) {
                        trimestresEnQueAgafemElTransport++;
                        ultimDiaAmbTrimestreSumat = i;
                    }
                    else if (ultimDiaAmbTrimestreSumat + 90 <= i) {
                        ultimDiaAmbTrimestreSumat = i;
                        trimestresEnQueAgafemElTransport++;
                    }
                    
                    if (T5030necessaries === 0) {
                        diaT5030 = i;
                        viatgesEnComprarLUltimaT5030 = viatgesTotals - viatgesAquellDia;
                        T5030necessaries++;
                    }
                    else if (diaT5030 + 30 <= i || viatgesEnComprarLUltimaT5030 + 50 < viatgesTotals) {
                        diaT5030 = i;
                        viatgesEnComprarLUltimaT5030 = viatgesTotals - viatgesAquellDia;
                        T5030necessaries++;
                    }
                    
                    if (T7030necessaries === 0) {
                        diaT7030 = i;
                        viatgesEnComprarLUltimaT7030 = viatgesTotals - viatgesAquellDia;
                        T7030necessaries++;
                    }
                    else if (diaT7030 + 30 <= i || viatgesEnComprarLUltimaT7030 + 70 < viatgesTotals) {
                        diaT7030 = i;
                        viatgesEnComprarLUltimaT7030 = viatgesTotals - viatgesAquellDia;
                        T7030necessaries++;
                    }
                }
                
            }
            var viatgesTotalsSetmana = 0;
            for (var i = 0; i < 7; i++) {
                viatgesTotalsSetmana += parseInt($("#viatges-" + diesDeLaSetmana[i]).val());
            }
            $("#viatges-totals-setmana").html(viatgesTotalsSetmana);
            $("#viatges-totals").html(viatgesTotals);
            
            
            // Preus
            var preus = new Array();
            
            var zones = parseInt($("#zones").val());
                
            var familiaNombrosa = $("#familianombrosa").is(':checked');
            
            switch (zones) {
                case 1:
                    preus["bitllet-senzill"] = 2.00;
                    preus["t10"] = 9.80;
                    preus["tdia"] = 7.25;
                    preus["t5030"] = 39.20;
                    preus["t7030"] = 54.90;
                    preus["tmes"] = 52.75;
                    preus["ttrimestre"] = 142.00;
                    if (jove || nen) preus["tjove"] = 105.00;
                    if (nen) preus["t12"] = 35.00;
                    
                    if (familiaNombrosa) {
                        preus["tmes"] = 42.20;
                        preus["ttrimestre"] = 113.60;
                        if (jove || nen) preus["tjove"] = 84.00;
                    }
                    
                    var aturat = $("#aturat").is(':checked');
                    
                    if (aturat && zones === 1) {
                        preus["ttrimestre"] = 29.40;
                        $("#explicacioaturat").show();
                    }
                    else {
                        $("#explicacioaturat").hide();
                    }
                    break;
                case 2:
                    preus["bitllet-senzill"] = 2.80;
                    preus["t10"] = 19.40;
                    preus["tdia"] = 11.50;
                    preus["t5030"] = 65.50;
                    preus["t7030"] = 79.40;
                    preus["tmes"] = 77.45;
                    preus["ttrimestre"] = 211.00;
                    if (jove || nen) preus["tjove"] = 155.00;
                    
                    if (familiaNombrosa) {
                        preus["tmes"] = 61.95;
                        preus["ttrimestre"] = 168.80;
                        if (jove || nen) preus["tjove"] = 124.00;
                    }
                    
                    break;
                case 3:
                    preus["bitllet-senzill"] = 3.75;
                    preus["t10"] = 26.40;
                    preus["tdia"] = 14.50;
                    preus["t5030"] = 91.90;
                    preus["t7030"] = 109.00;
                    preus["tmes"] = 105.00;
                    preus["ttrimestre"] = 290.00;
                    if (jove || nen) preus["tjove"] = 210.00;
                    
                    if (familiaNombrosa) {
                        preus["tmes"] = 84.00;
                        preus["ttrimestre"] = 232.00;
                        if (jove || nen) preus["tjove"] = 168.00;
                    }
                    
                    break;
                case 4:
                    preus["bitllet-senzill"] = 4.75;
                    preus["t10"] = 33.95;
                    preus["tdia"] = 13.35;
                    preus["t5030"] = 114.50;
                    preus["t7030"] = 133.50;
                    preus["tmes"] = 124.50;
                    preus["ttrimestre"] = 342.50;
                    if (jove || nen) preus["tjove"] = 249.00;
                    
                    if (familiaNombrosa) {
                        preus["tmes"] = 99.60;
                        preus["ttrimestre"] = 274.00;
                        if (jove || nen) preus["tjove"] = 199.20;
                    }
                    
                    break;
                case 5:
                    preus["bitllet-senzill"] = 6.05;
                    preus["t10"] = 39.00;
                    preus["tdia"] = 18.40;
                    preus["t5030"] = 135.00;
                    preus["t7030"] = 153.00;
                    preus["tmes"] = 143.00;
                    preus["ttrimestre"] = 390.00;
                    if (jove || nen) preus["tjove"] = 285.50;
                    
                    if (familiaNombrosa) {
                        preus["tmes"] = 114.40;
                        preus["ttrimestre"] = 312.00;
                        if (jove || nen) preus["tjove"] = 228.40;
                    }
                    
                    break;
                case 6:
                    preus["bitllet-senzill"] = 7.10;
                    preus["t10"] = 41.50;
                    preus["tdia"] = 20.65;
                    preus["t5030"] = 150.00;
                    preus["t7030"] = 165.50;
                    preus["tmes"] = 153.00;
                    preus["ttrimestre"] = 406.00;
                    if (jove || nen) preus["tjove"] = 305.50;
                    
                    if (familiaNombrosa) {
                        preus["tmes"] = 122.40;
                        preus["ttrimestre"] = 324.80;
                        if (jove || nen) preus["tjove"] = 244.40;
                    }
                    
                    break;
            }
            
            var bitlletsAComprar = new Array();
            bitlletsAComprar["bitllet-senzill"] = viatgesTotals;
            bitlletsAComprar["t10"] = Math.ceil(viatgesTotals/10);
            bitlletsAComprar["tdia"] = diesEnQueAgafemElTransport;
            bitlletsAComprar["t5030"] = T5030necessaries;
            bitlletsAComprar["t7030"] = T7030necessaries;
            bitlletsAComprar["tmes"] = mesosEnQueAgafemElTransport;
            bitlletsAComprar["ttrimestre"] = trimestresEnQueAgafemElTransport;
            if (jove || nen) bitlletsAComprar["tjove"] = trimestresEnQueAgafemElTransport;
            if (nen) bitlletsAComprar["t12"] = Math.min(1,viatgesTotals);
            
            // Flag on guardarem el preu de la targeta més econòmica
            var minPreuTotal = Number.MAX_VALUE;
            
            for (var targeta in preus) {
                var preuTotal = bitlletsAComprar[targeta] * preus[targeta];
                var preuViatge = preuTotal / viatgesTotals;
                writePrice(".preu-" + targeta + "-bitllet", preus[targeta]);
                writePrice(".preu-" + targeta + "-total", preuTotal);
                writePrice(".preu-" + targeta + "-viatge", preuViatge);
                writePrice("." + targeta + "-comprar", bitlletsAComprar[targeta]);
                
                if (preuTotal < minPreuTotal) {
                    minPreuTotal = preuTotal;
                    minTargeta = targeta;
                }
            }
            if (jove || nen) {
                $("#tjove").show();
            }
            else {
                $("#tjove").hide();
            }
            // T-12
            if (nen && zones === 1) {
                $("#t12").show();
            }
            else {
                $("#t12").hide();
            }
            
            function writePrice (id, price) {
                if (isNaN(price)) price = 0;
                $(id).html(Math.ceil(price * 100) / 100);
            }
        }
    });
});
