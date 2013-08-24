/*
    TODO separar calulate.js i layout.js
    TODO separar css
    TODO targeta rosa
    TODO a vegades els bitllets no mostren l'animació
    TODO bitllets Hola BCN
    TODO els resultats haurien d'estar ordenats per preu
    TODO T-12 no s'amaga si se seleccionen diverses zones o es deselecciona "menor de 14 anys"
    DONE zones
*/
$(document).ready(function() {
    
    $("input[type='number']").click(function () {
        this.select()
    });

	var d = new Date();
	var indexPrimerDiaSetmana = d.getDay();
	
	$("#setmana-comenca").val(indexPrimerDiaSetmana).selectmenu('refresh');;
	
	$("#setmana-comenca").change(function () {
		indexPrimerDiaSetmana = parseInt($(this).val());
	});
	
	$("input, select").change(function () {
	    recalculateEverything();
	});
    
    $(".bitllet").bind('expand', function () {
        $(this).find(".imatge-bitllet").delay(0).queue(function() {
            $(this).addClass("visible")
        });
    });
    
	function recalculateEverything() {
	    var nen = $("#menor14anys").is(':checked');
	    if (nen) $("#menor25anys").attr('checked', true).attr("readonly",true).checkboxradio("refresh");
		else $("#menor25anys").attr("readonly",false).checkboxradio("refresh");
	    var jove = $("#menor25anys").is(':checked');
	    
		var viatgesSetmana = 0;
		var viatgesTotals = 0;
		var diesACalcular = parseInt($("#dies-a-calcular").val());
		
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
        
		var minPreuTotal = Number.MAX_VALUE;
		var minTargeta = "bitllet-senzill";
		
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
		    $("#12").hide();
	    }
	    
		$("#"+minTargeta).trigger('expand');
		
		// Calculate prices
		// bitllet senzill
		/*var preuTotal = viatgesTotals * preuBitlletSenzill;
		writePrice(".preu-bitllet-senzill-bitllet",preuBitlletSenzill);
		writePrice(".preu-bitllet-senzill-total",preuTotal);
		writePrice(".preu-bitllet-senzill-viatge",preuBitlletSenzill);
		writePrice(".bitllet-senzill-comprar",viatgesTotals);
		
		// T-10
		var bitlletsAComprar = Math.ceil(viatgesTotals/10);
		var preuTotal = bitlletsAComprar * preuT10;
		var preuViatge = preuTotal / viatgesTotals;
		writePrice(".preu-t10-bitllet",preuT10);
		writePrice(".preu-t10-total",preuTotal);
		writePrice(".preu-t10-viatge",preuViatge);
		writePrice(".t10-comprar",bitlletsAComprar);
		// T-Dia
		var bitlletsAComprar = diesEnQueAgafemElTransport;
		var preuTotal = bitlletsAComprar * preuTDia;
		var preuViatge = preuTotal / viatgesTotals;
		writePrice(".preu-tdia-bitllet",preuTDia);
		writePrice(".preu-tdia-total",preuTotal);
		writePrice(".preu-tdia-viatge",preuViatge);
		writePrice(".tdia-comprar",bitlletsAComprar);
		// T-50/30
		var bitlletsAComprar = T5030necessaries;
		var preuTotal = bitlletsAComprar * preuT5030;
		var preuViatge = preuTotal / viatgesTotals;
		writePrice(".preu-t5030-bitllet",preuT5030);
		writePrice(".preu-t5030-total",preuTotal);
		writePrice(".preu-t5030-viatge",preuViatge);
		writePrice(".t5030-comprar",bitlletsAComprar);
		// T-70/30
		var bitlletsAComprar = T7030necessaries;
		var preuTotal = bitlletsAComprar * preuT7030;
		var preuViatge = preuTotal / viatgesTotals;
		writePrice(".preu-t7030-bitllet",preuT7030);
		writePrice(".preu-t7030-total",preuTotal);
		writePrice(".preu-t7030-viatge",preuViatge);
		writePrice(".t7030-comprar",bitlletsAComprar);
		// T-Mes
		var bitlletsAComprar = mesosEnQueAgafemElTransport;
		var preuTotal = bitlletsAComprar * preuTMes;
		var preuViatge = preuTotal / viatgesTotals;
		writePrice(".preu-tmes-bitllet",preuTMes);
		writePrice(".preu-tmes-total",preuTotal);
		writePrice(".preu-tmes-viatge",preuViatge);
		writePrice(".tmes-comprar",bitlletsAComprar);
		// T-Trimestre
		var bitlletsAComprar = trimestresEnQueAgafemElTransport;
		var preuTotal = bitlletsAComprar * preuTTrimestre;
		var preuViatge = preuTotal / viatgesTotals;
		writePrice(".preu-ttrimestre-bitllet",preuTTrimestre);
		writePrice(".preu-ttrimestre-total",preuTotal);
		writePrice(".preu-ttrimestre-viatge",preuViatge);
		writePrice(".ttrimestre-comprar",bitlletsAComprar);
		// T-Jove
		if (jove || nen) {
		    $("#tjove").show();
		    var bitlletsAComprar = trimestresEnQueAgafemElTransport;
		    var preuTotal = bitlletsAComprar * preuTJove;
		    var preuViatge = preuTotal / viatgesTotals;
		    writePrice(".preu-tjove-bitllet",preuTJove);
		    writePrice(".preu-tjove-total",preuTotal);
		    writePrice(".preu-tjove-viatge",preuViatge);
		    writePrice(".tjove-comprar",bitlletsAComprar);
	    }
	    else {
		    $("#tjove").hide();
	    }
		// T-12
		if (nen) {
		    $("#t12").show();
		    var bitlletsAComprar = Math.min(1,viatgesTotals);
		    var preuTotal = bitlletsAComprar * preuT12;
		    var preuViatge = preuTotal / viatgesTotals;
		    writePrice(".preu-t12-bitllet",preuT);
		    writePrice(".preu-t12-total",preuTotal);
		    writePrice(".preu-t12-viatge",preuViatge);
		    writePrice(".t12-comprar",bitlletsAComprar);
	    }
	    else {
		    $("#12").hide();
	    }*/
		
		function writePrice (id, price) {
			if (isNaN(price)) price = 0;
			$(id).html(Math.ceil(price * 100) / 100);
		}
	}
});
