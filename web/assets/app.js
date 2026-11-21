/* ============================================================
   Dashboard Mertani Web — logika aplikasi
   File: assets/app.js
   Dataset, navigasi, grafik SVG, halaman parameter, peta,
   unduh, dan pengaturan. Dimuat setelah three-scene.js.
   ============================================================ */
    (function(){
      "use strict";
      /* ---------- Dataset simulasi (tetap, sama seperti dataset DSTX 21 Nov 2026) ---------- */
      var HOURS = ["19:00","20:00","21:00","22:00","23:00","00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
      var ICONS = {
        battery:'<rect x="3" y="8" width="15" height="8" rx="2"/><path d="M21 11v2"/><path d="M6.5 11v2M10 11v2"/>',
        signal:'<path d="M4.5 19.5v-3M9.5 19.5v-6M14.5 19.5v-10M19.5 19.5V5"/>',
        cod:'<path d="M10 3h4M10.5 3v5L5.6 17a2.3 2.3 0 0 0 2 3.4h8.8a2.3 2.3 0 0 0 2-3.4L13.5 8V3"/><path d="M8.2 14.5h7.6"/>',
        ph:'<path d="M12 3.5s6.5 6.6 6.5 11a6.5 6.5 0 0 1-13 0c0-4.4 6.5-11 6.5-11Z"/><path d="M9.5 14.5a2.6 2.6 0 0 0 2 2.7"/>',
        amonia:'<path d="M3 8.5h8.5a2.8 2.8 0 1 0-2.8-2.8M2.5 12.5h13a2.8 2.8 0 1 1-2.8 2.8M3.5 17h5.5"/>',
        tss:'<circle cx="7" cy="7" r="1.3"/><circle cx="12" cy="11" r="1.3"/><circle cx="17" cy="6.5" r="1.3"/><circle cx="6.5" cy="16.5" r="1.3"/><circle cx="12.5" cy="18" r="1.3"/><circle cx="17.5" cy="15" r="1.3"/>',
        level:'<path d="M2 8.5c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2M2 14.5c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>',
        debit:'<path d="M4.6 19a9.2 9.2 0 1 1 14.8 0"/><path d="m12 13.8 3.8-4.6"/><circle cx="12" cy="13.8" r="1.3"/>',
        temp:'<path d="M10 4a2 2 0 0 1 4 0v9.2a4.6 4.6 0 1 1-4 0V4Z"/><circle cx="12" cy="17.6" r="1.5"/>'
      };
      var SENSORS = [
        {key:"battery", name:"Battery", unit:"%", dec:0, limit:"Habis di bawah 20%", status:"Normal", series:[94,94,93,93,92,92,91,91,90,90,90,89,89,88,88,88,87,87,87,86,86,86,86,86]},
        {key:"signal", name:"Signal", unit:"dBm", dec:0, limit:"Baik di atas -80 dBm", status:"Normal", series:[-70,-71,-69,-70,-72,-71,-70,-69,-68,-70,-71,-69,-68,-67,-68,-69,-67,-68,-66,-67,-68,-67,-67,-67]},
        {key:"cod", name:"COD", unit:"mg/L", dec:0, limit:"Ambang maks. 100 mg/L", status:"Normal", series:[38,39,41,40,42,43,41,42,44,45,43,42,44,46,45,44,43,45,46,44,43,44,45,44]},
        {key:"ph", name:"Water pH", unit:"pH", dec:1, limit:"Rentang aman 6,0 - 9,0", status:"Normal", series:[7.1,7.1,7.2,7.2,7.1,7.0,7.1,7.2,7.3,7.2,7.2,7.3,7.4,7.3,7.2,7.2,7.1,7.2,7.3,7.2,7.2,7.1,7.2,7.2]},
        {key:"amonia", name:"Amonia", unit:"mg/L", dec:2, limit:"Ambang maks. 0,5 mg/L", status:"Waspada", limitLine:0.5, limitLabel:"Ambang 0,5", series:[0.31,0.32,0.33,0.32,0.34,0.35,0.36,0.35,0.37,0.38,0.37,0.39,0.40,0.39,0.41,0.42,0.41,0.43,0.44,0.43,0.44,0.45,0.45,0.46]},
        {key:"tss", name:"TSS", unit:"mg/L", dec:0, limit:"Ambang maks. 50 mg/L", status:"Normal", series:[31,33,34,32,35,36,38,37,35,36,39,40,38,37,39,41,40,38,39,40,38,37,39,39]},
        {key:"level", name:"Water Level", unit:"m", dec:2, limit:"Siaga di atas 2,50 m", status:"Normal", series:[1.66,1.64,1.63,1.65,1.68,1.70,1.72,1.71,1.74,1.76,1.75,1.78,1.80,1.79,1.82,1.84,1.83,1.85,1.87,1.86,1.84,1.85,1.84,1.84]},
        {key:"debit", name:"Debit", unit:"L/s", dec:1, limit:"Rentang normal 5 - 20 L/s", status:"Normal", series:[11.2,11.0,10.9,11.1,11.4,11.6,11.9,11.7,12.1,12.3,12.0,12.4,12.8,12.5,12.9,13.2,13.0,13.3,13.1,12.8,12.6,12.7,12.5,12.6]},
        {key:"temp", name:"Water Temperature", unit:"°C", dec:1, limit:"Rentang normal 20 - 32 °C", status:"Normal", series:[27.8,27.7,27.6,27.6,27.7,27.9,28.1,28.3,28.5,28.7,28.9,29.1,29.0,28.9,28.8,28.7,28.6,28.5,28.6,28.5,28.4,28.5,28.4,28.4]}
      ];
      var DEVICES = [
        {id:"kipi", name:"Sparing KIPI", code:"MTI-1OH9R4FCETTL", status:"Online", statusClass:"online", lastSeen:"21/11/2026 18:14", location:"Kalimantan Industrial Park Indonesia"},
        {id:"testing", name:"Mertani Testing Device", code:"MTI-XXXXYYYYZZZZ", status:"Maintenance", statusClass:"maint", lastSeen:"12/06/2026 13:42", location:"—"}
      ];
      function sensor(key){ for(var i=0;i<SENSORS.length;i++) if(SENSORS[i].key===key) return SENSORS[i]; return null; }
      function lastVal(s){ return s.series[s.series.length-1]; }
      function minVal(s){ return Math.min.apply(null,s.series); }
      function maxVal(s){ return Math.max.apply(null,s.series); }
      function avgVal(s){ var t=0; for(var i=0;i<s.series.length;i++) t+=s.series[i]; return t/s.series.length; }
      function fmt(v,dec){ return v.toFixed(dec).replace(".",","); }
      function fmtRaw(v,dec){ return v.toFixed(dec); }
      function esc(t){ return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
      function icon(name,cls){ return '<svg class="ic '+(cls||"")+'" viewBox="0 0 24 24" aria-hidden="true">'+ICONS[name]+"</svg>"; }
      function chipFor(status){
        if(status==="Online"||status==="Normal") return '<span class="chip chip--online"><span class="dot"></span>'+status+"</span>";
        if(status==="Waspada") return '<span class="chip chip--warn"><span class="dot"></span>'+status+"</span>";
        return '<span class="chip chip--maint"><span class="dot"></span>'+status+"</span>";
      }
      var toastTimer=null;
      function toast(msg){
        var t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show");
        clearTimeout(toastTimer); toastTimer=setTimeout(function(){ t.classList.remove("show"); },2600);
      }
      function copyText(text,msg){
        function done(){ toast(msg); }
        if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done,function(){ fallback(); }); } else fallback();
        function fallback(){
          var ta=document.createElement("textarea"); ta.value=text; ta.style.position="fixed"; ta.style.opacity="0";
          document.body.appendChild(ta); ta.select();
          try{ document.execCommand("copy"); done(); }catch(e){ toast(text); }
          document.body.removeChild(ta);
        }
      }
      /* ---------- sparklines & charts (SVG dari data yang sama) ---------- */
      function sparkline(s,w,h){
        var min=minVal(s), max=maxVal(s); if(s.limitLine && s.limitLine>max) max=s.limitLine;
        var range=(max-min)||1, pad=4;
        var pts=s.series.map(function(v,i){
          var x=(i/(s.series.length-1))*w;
          var y=pad+((max-v)/range)*(h-2*pad);
          return x.toFixed(1)+","+y.toFixed(1);
        });
        return '<svg class="spark" viewBox="0 0 '+w+" "+h+'" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,'+h+" "+pts.join(" ")+" "+w+","+h+'" fill="var(--accent)" opacity="0.12" stroke="none"/><polyline points="'+pts.join(" ")+'" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
      }
      function bigChart(s){
        var W=720,H=252,padL=48,padR=16,padT=16,padB=32;
        var min=minVal(s), max=maxVal(s);
        if(s.limitLine){ max=Math.max(max,s.limitLine*1.04); }
        var span=(max-min)||1; min-=span*0.12; max+=span*0.12; span=max-min;
        function X(i){ return padL+(i/(s.series.length-1))*(W-padL-padR); }
        function Y(v){ return padT+((max-v)/span)*(H-padT-padB); }
        var out='<svg class="chart-svg" viewBox="0 0 '+W+" "+H+'" role="img" aria-label="Grafik 24 jam '+esc(s.name)+'">';
        for(var g=0; g<=3; g++){
          var v=min+(span*g/3), y=Y(v);
          out+='<line x1="'+padL+'" y1="'+y.toFixed(1)+'" x2="'+(W-padR)+'" y2="'+y.toFixed(1)+'" stroke="var(--line)" stroke-width="1"/>';
          out+='<text x="'+(padL-8)+'" y="'+(y+4).toFixed(1)+'" font-size="11.5" text-anchor="end">'+fmt(v,s.dec)+"</text>";
        }
        var xIdx=[0,5,11,17,23];
        for(var k=0;k<xIdx.length;k++){
          var i=xIdx[k];
          out+='<text x="'+X(i).toFixed(1)+'" y="'+(H-10)+'" font-size="11.5" text-anchor="middle">'+HOURS[i]+"</text>";
        }
        if(s.limitLine){
          var ly=Y(s.limitLine);
          out+='<line x1="'+padL+'" y1="'+ly.toFixed(1)+'" x2="'+(W-padR)+'" y2="'+ly.toFixed(1)+'" stroke="var(--red)" stroke-width="1.4" stroke-dasharray="6 4"/>';
          out+='<text x="'+(W-padR)+'" y="'+(ly-7).toFixed(1)+'" font-size="11.5" text-anchor="end" fill="var(--red)">'+esc(s.limitLabel)+" "+esc(s.unit)+"</text>";
        }
        var pts=s.series.map(function(v,i){ return X(i).toFixed(1)+","+Y(v).toFixed(1); });
        out+='<polygon points="'+padL+","+(H-padB)+" "+pts.join(" ")+" "+(W-padR)+","+(H-padB)+'" fill="var(--accent)" opacity="0.10" stroke="none"/>';
        out+='<polyline points="'+pts.join(" ")+'" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
        var lx=X(s.series.length-1), lyv=Y(lastVal(s));
        out+='<circle cx="'+lx.toFixed(1)+'" cy="'+lyv.toFixed(1)+'" r="4.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/>';
        out+='<text x="'+(lx-8).toFixed(1)+'" y="'+(lyv-10).toFixed(1)+'" font-size="13" font-weight="700" text-anchor="end" fill="var(--ink)">'+fmt(lastVal(s),s.dec)+" "+esc(s.unit)+"</text>";
        out+="</svg>";
        return out;
      }
      /* ---------- navigasi ---------- */
      var CRUMBS={beranda:"Overview",perangkat:"Perangkat",detail:"Detail Perangkat",param:"Detail Parameter",unduh:"Unduh",pengaturan:"Pengaturan"};
      var currentView="beranda", currentDevice="kipi", focusSensor="ph";
      function go(view,deviceId,sensorKey){
        if(deviceId) currentDevice=deviceId;
        if(sensorKey) focusSensor=sensorKey;
        currentView=view;
        var views=document.querySelectorAll(".view");
        for(var i=0;i<views.length;i++) views[i].classList.toggle("active", views[i].id==="view-"+view);
        var navKey=(view==="detail")?"perangkat":(view==="param")?"beranda":view;
        var links=document.querySelectorAll("[data-nav]");
        for(var j=0;j<links.length;j++){
          if(links[j].classList.contains("navlink")||links[j].closest(".bottomnav")) links[j].classList.toggle("on", links[j].getAttribute("data-nav")===navKey);
        }
        document.getElementById("crumbNow").textContent=CRUMBS[view]||"Overview";
        document.getElementById("bellPanel").classList.remove("open");
        document.getElementById("bellBtn").setAttribute("aria-expanded","false");
        setDrawer(false);
        if(view==="detail") renderDetail(currentDevice, focusSensor);
        if(view==="param"){
          var bb=document.getElementById("paramBackBtn");
          if(bb){
            bb.setAttribute("data-nav",paramBack);
            bb.innerHTML='<svg class="ic sm" viewBox="0 0 24 24"><path d="m14.5 5.5-6.5 6.5 6.5 6.5"/></svg>'+(paramBack==="perangkat"?"Kembali ke Perangkat":"Kembali ke Overview");
          }
          renderParam();
        }
        window.scrollTo({top:0,behavior:"auto"});
      }
      document.addEventListener("click",function(e){
        var t=e.target.closest("[data-nav]");
        if(t){ go(t.getAttribute("data-nav")); }
      });
      /* ---------- drawer menu (tombol hamburger) ---------- */
      var drawer=document.getElementById("drawer"), backdrop=document.getElementById("drawerBackdrop"), menuBtn=document.getElementById("menuBtn");
      function setDrawer(open){
        drawer.classList.toggle("open",open);
        backdrop.classList.toggle("open",open);
        menuBtn.setAttribute("aria-expanded",open?"true":"false");
      }
      menuBtn.addEventListener("click",function(){ setDrawer(!drawer.classList.contains("open")); });
      backdrop.addEventListener("click",function(){ setDrawer(false); });
      /* ---------- kartu perangkat ---------- */
      function deviceCard(d){
        var mini="";
        if(d.id==="kipi"){
          mini='<div class="mini-stats"><div><b>'+fmt(lastVal(sensor("battery")),0)+'%</b><span>Baterai</span></div><div><b>'+fmt(lastVal(sensor("signal")),0)+' dBm</b><span>Sinyal</span></div><div><b>9 aktif</b><span>Sensor</span></div><div><b>'+esc(d.location)+'</b><span>Lokasi</span></div></div>';
        } else {
          mini='<div class="mini-stats"><div><b>—</b><span>Baterai</span></div><div><b>—</b><span>Sinyal</span></div><div><b>Tidak ada data</b><span>Sensor</span></div></div>';
        }
        return '<div class="card device-card" role="button" tabindex="0" data-device="'+d.id+'" aria-label="Buka detail '+esc(d.name)+'">'
          +'<div class="d-top"><h3>'+esc(d.name)+"</h3>"+chipFor(d.status)+"</div>"
          +'<div class="d-meta">'+esc(d.lastSeen)+"</div>"
          +'<div class="d-id"><span class="mono">'+esc(d.code)+'</span><button class="copybtn" data-copy="'+esc(d.code)+'" aria-label="Salin ID perangkat '+esc(d.name)+'"><svg class="ic sm" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>'
          + mini + "</div>";
      }
      function renderDevices(){
        document.getElementById("deviceList").innerHTML=DEVICES.map(deviceCard).join("");
      }
      document.addEventListener("click",function(e){
        var cp=e.target.closest("[data-copy]");
        if(cp){ e.stopPropagation(); copyText(cp.getAttribute("data-copy"),"ID perangkat disalin"); return; }
        var card=e.target.closest("[data-device]");
        if(card){ openParamForDevice(card.getAttribute("data-device")); }
      });
      document.addEventListener("keydown",function(e){
        if(e.key==="Enter" && e.target.matches && e.target.matches("[data-device]")) openParamForDevice(e.target.getAttribute("data-device"));
      });
      /* ---------- stage Live readings (fokus tengah, persis referensi) ---------- */
      var READINGS=[
        {name:"Air Temperature", unit:"°C", code:"RSC-temp", pkey:"temp"},
        {name:"Air Humidity", unit:"%RH", code:"RSC-hum", pkey:"hum"},
        {name:"Air Pressure", unit:"hPa", code:"RSC-pres", pkey:"pres"}
      ];
      var stageCenter=1, suppressStageClick=false;
      function stageCards(){ return document.querySelectorAll("#stage .stage-card"); }
      function markStageCenter(){
        var cards=stageCards();
        for(var i=0;i<cards.length;i++){
          var on=i===stageCenter;
          cards[i].classList.toggle("is-center",on);
          cards[i].setAttribute("aria-hidden",on?"false":"true");
          cards[i].setAttribute("tabindex",on?"0":"-1");
        }
        var dots=document.querySelectorAll("#stageDots button");
        for(var j=0;j<dots.length;j++) dots[j].classList.toggle("on",j===stageCenter);
      }
      function centerStageCard(i,smooth){
        var st=document.getElementById("stage");
        var card=stageCards()[i]; if(!card) return;
        var reduce=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        st.scrollTo({left:card.offsetLeft-(st.clientWidth-card.clientWidth)/2,behavior:(smooth&&!reduce)?"smooth":"auto"});
      }
      function renderStage(){
        var st=document.getElementById("stage");
        st.innerHTML=READINGS.map(function(r,i){
          var value='<div class="st-value"><span class="st-dash" aria-hidden="true"></span><span class="st-unit">'+esc(r.unit)+"</span></div>";
          return '<div class="stage-card" data-stage="'+i+'" role="button" tabindex="-1" aria-label="'+esc(r.name)+', no reading">'
            +'<div class="st-name">'+esc(r.name)+"</div>"
            +'<div class="st-mid solo">'+value+"</div>"
            +'<div class="st-status">No reading</div><div class="st-code">'+esc(r.code)+"</div></div>";
        }).join("");
        document.getElementById("stageDots").innerHTML=READINGS.map(function(r,i){
          return '<button data-dot="'+i+'" aria-label="Ke reading '+esc(r.name)+'"></button>';
        }).join("");
        markStageCenter();
        requestAnimationFrame(function(){ centerStageCard(stageCenter,false); });
      }
      var stageTick=false;
      document.getElementById("stage").addEventListener("scroll",function(){
        if(stageTick) return; stageTick=true;
        var st=this;
        requestAnimationFrame(function(){
          stageTick=false;
          var mid=st.scrollLeft+st.clientWidth/2, best=stageCenter, bestD=Infinity;
          var cards=stageCards();
          for(var i=0;i<cards.length;i++){
            var d=Math.abs(cards[i].offsetLeft+cards[i].clientWidth/2-mid);
            if(d<bestD){ bestD=d; best=i; }
          }
          if(best!==stageCenter){ stageCenter=best; markStageCenter(); }
        });
      },{passive:true});
      document.getElementById("stage").addEventListener("click",function(e){
        if(suppressStageClick){ suppressStageClick=false; return; }
        var card=e.target.closest("[data-stage]");
        if(!card) return;
        var i=parseInt(card.getAttribute("data-stage"),10);
        if(i!==stageCenter){ stageCenter=i; markStageCenter(); centerStageCard(i,true); }
        else openParam(READINGS[i].pkey);
      });
      document.getElementById("stageDots").addEventListener("click",function(e){
        var d=e.target.closest("[data-dot]"); if(!d) return;
        var i=parseInt(d.getAttribute("data-dot"),10);
        stageCenter=i; markStageCenter(); centerStageCard(i,true);
      });
      document.getElementById("stage").addEventListener("keydown",function(e){
        if(e.key==="ArrowRight"||e.key==="ArrowLeft"){
          var n=(stageCenter+(e.key==="ArrowRight"?1:-1)+READINGS.length)%READINGS.length;
          stageCenter=n; markStageCenter(); centerStageCard(n,true);
          var c=stageCards()[n]; if(c) c.focus({preventScroll:true});
          e.preventDefault();
        } else if((e.key==="Enter"||e.key===" ") && e.target.matches && e.target.matches("[data-stage]")){
          e.preventDefault();
          var i=parseInt(e.target.getAttribute("data-stage"),10);
          if(i!==stageCenter){ stageCenter=i; markStageCenter(); centerStageCard(i,true); }
          else openParam(READINGS[i].pkey);
        }
      });
      /* drag dengan mouse: geser kartu tanpa klik panah */
      (function(){
        var st=document.getElementById("stage"), drag=null;
        st.addEventListener("pointerdown",function(e){
          if(e.pointerType!=="mouse") return;
          drag={x:e.clientX,sl:st.scrollLeft,moved:false};
          st.classList.add("dragging");
        });
        st.addEventListener("pointermove",function(e){
          if(!drag) return;
          var dx=e.clientX-drag.x;
          if(Math.abs(dx)>6) drag.moved=true;
          st.scrollLeft=drag.sl-dx;
        });
        function endDrag(){
          if(!drag) return;
          if(drag.moved){ suppressStageClick=true; setTimeout(function(){ suppressStageClick=false; },80); }
          drag=null; st.classList.remove("dragging");
        }
        st.addEventListener("pointerup",endDrag);
        st.addEventListener("pointercancel",endDrag);
        st.addEventListener("pointerleave",endDrag);
      })();
      /* ---------- detail perangkat ---------- */
      function renderDetail(deviceId, sensorKey){
        var d=null; for(var i=0;i<DEVICES.length;i++) if(DEVICES[i].id===deviceId) d=DEVICES[i];
        var root=document.getElementById("detailRoot");
        if(!d) return;
        var head='<div class="card detail-head"><div class="d-top"><div><h2>'+esc(d.name)+'</h2><div class="d-id" style="margin-top:5px"><span class="mono">'+esc(d.code)+'</span><button class="copybtn" data-copy="'+esc(d.code)+'" aria-label="Salin ID perangkat"><svg class="ic sm" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div></div>'+chipFor(d.status)+"</div>";
        if(d.id==="kipi"){
          head+='<div class="fact-grid">'
            +'<div class="fact"><span>Lokasi</span><b>'+esc(d.location)+"</b></div>"
            +'<div class="fact"><span>Terakhir terlihat</span><b>21 Nov 2026, 18:14</b></div>'
            +'<div class="fact"><span>Baterai</span><b>'+fmt(lastVal(sensor("battery")),0)+"%</b></div>"
            +'<div class="fact"><span>Sinyal</span><b>'+fmt(lastVal(sensor("signal")),0)+" dBm</b></div></div></div>";
          var s=sensor(sensorKey)||SENSORS[0];
          var chips=SENSORS.map(function(x){ return '<button class="s-chip'+(x.key===s.key?" on":"")+'" data-chip="'+x.key+'">'+esc(x.name)+"</button>"; }).join("");
          var chart='<div class="card chart-card"><div class="c-top"><div><h3>'+icon(s.key,"sm")+" "+esc(s.name)+'</h3><div class="c-sub">Pembacaan 24 jam terakhir · terakhir '+fmt(lastVal(s),s.dec)+" "+esc(s.unit)+" pukul 18:14 · "+esc(s.limit)+'</div></div><div class="chart-stats"><div><span>Terakhir</span><b>'+fmt(lastVal(s),s.dec)+" "+esc(s.unit)+'</b></div><div><span>Rata-rata</span><b>'+fmt(avgVal(s),s.dec)+" "+esc(s.unit)+'</b></div><div><span>Min</span><b>'+fmt(minVal(s),s.dec)+'</b></div><div><span>Maks</span><b>'+fmt(maxVal(s),s.dec)+"</b></div></div></div>"+bigChart(s)+"</div>";
          var grid='<div class="sensor-grid">'+SENSORS.map(function(x){
            return '<button class="card sensor-card'+(x.key===s.key?" sel":"")+'" data-chip="'+x.key+'"><span class="s-name">'+icon(x.key,"sm")+esc(x.name)+chipFor(x.status)+'</span><span class="s-value">'+fmt(lastVal(x),x.dec)+' <small>'+esc(x.unit)+'</small></span><span class="s-range">'+esc(x.limit)+" · 24 jam: "+fmt(minVal(x),x.dec)+" – "+fmt(maxVal(x),x.dec)+"</span>"+sparkline(x,200,34)+"</button>";
          }).join("")+"</div>";
          root.innerHTML=head+'<div class="sensor-chips" role="group" aria-label="Pilih sensor">'+chips+"</div>"+chart+grid;
        } else {
          head+='<div class="fact-grid">'
            +'<div class="fact"><span>Terakhir terlihat</span><b>12 Jun 2026, 13:42</b></div>'
            +'<div class="fact"><span>Baterai</span><b>—</b></div>'
            +'<div class="fact"><span>Sinyal</span><b>—</b></div>'
            +'<div class="fact"><span>Sensor aktif</span><b>0</b></div></div></div>';
          root.innerHTML=head+'<div class="card empty-note"><b style="color:var(--ink)">Perangkat sedang dalam pemeliharaan</b><br />Tidak ada pembacaan sensor baru sejak 12 Juni 2026, 13:42. Sensor akan tampil lagi begitu perangkat kembali online.</div>';
        }
      }
      document.getElementById("detailRoot").addEventListener("click",function(e){
        var ch=e.target.closest("[data-chip]");
        if(ch){ focusSensor=ch.getAttribute("data-chip"); renderDetail("kipi",focusSensor); }
      });
      /* ---------- halaman parameter: grafik + tabel pemantauan ---------- */
      var PARAM_TIMES=[];
      (function(){ for(var m=0;m<=18*60+30;m+=30){ var hh=Math.floor(m/60), mm=m%60; PARAM_TIMES.push((hh<10?"0":"")+hh+":"+(mm<10?"0":"")+mm); } })();
      var PARAM_SENSORS=[
        {key:"temp", name:"Air Temperature", unit:"°C", code:"RSC-temp", dec:1, series:[26.8,26.6,26.4,26.3,26.2,26.1,26.0,25.9,25.9,26.0,26.1,26.3,26.6,27.0,27.5,28.1,28.7,29.2,29.7,30.1,30.5,30.8,31.1,31.3,31.5,31.6,31.7,31.5,31.3,31.0,30.6,30.2,29.8,29.4,29.0,28.6,28.2,27.9]},
        {key:"hum", name:"Air Humidity", unit:"%RH", code:"RSC-hum", dec:2, series:[93.0,92.8,92.6,92.9,93.4,94.0,94.2,93.8,93.5,94.4,94.1,92.0,89.5,93.0,92.5,88.0,82.0,76.5,73.0,71.5,66.0,58.5,56.2,57.0,72.0,88.0,95.8,94.0,82.0,70.5,67.0,65.2,66.5,67.97,77.2,83.4,86.1,87.1]},
        {key:"pres", name:"Air Pressure", unit:"hPa", code:"RSC-pres", dec:1, series:[1011.4,1011.6,1011.8,1012.0,1012.1,1012.3,1012.2,1012.0,1011.7,1011.4,1011.0,1010.6,1010.2,1009.9,1009.7,1009.6,1009.8,1010.1,1010.5,1010.9,1011.3,1011.6,1011.9,1012.1,1012.0,1011.8,1011.5,1011.2,1010.9,1010.7,1010.8,1011.1,1011.4,1011.7,1012.0,1012.2,1012.4,1012.5]}
      ];
      var currentParam="hum", paramAgg="semua", paramRealtime=false, paramShowLine=true, paramGrid=true;
      var currentParamDevice="kipi", paramBack="beranda";
      var PARAM_AGG_OPTIONS=[["semua","Semua"],["jam","Rata-rata per Jam"],["hari","Rata-rata per Hari"],["minggu","Rata-rata per Minggu"],["bulan","Rata-rata per Bulan"]];
      var PARAM_AGG_LABEL={"semua":"Data mentah per 30 menit — tanpa rata-rata","jam":"Rata-rata per jam","hari":"Rata-rata per hari","minggu":"Rata-rata per minggu","bulan":"Rata-rata per bulan"};
      var MONTHS_ID=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
      var MONTHS_SHORT=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
      function paramSensor(key){ for(var i=0;i<PARAM_SENSORS.length;i++) if(PARAM_SENSORS[i].key===key) return PARAM_SENSORS[i]; return PARAM_SENSORS[1]; }
      function openParam(pkey){ currentParamDevice="kipi"; paramBack="beranda"; currentParam=pkey; paramAgg="semua"; paramRealtime=false; paramShowLine=true; go("param"); }
      function openParamForDevice(deviceId){ currentParamDevice=deviceId||"kipi"; paramBack="perangkat"; currentParam="hum"; paramAgg="semua"; paramRealtime=false; paramShowLine=true; go("param"); }
      function paramFmt(v,dec){ return String(parseFloat(v.toFixed(dec))); }
      function pad2(n){ return (n<10?"0":"")+n; }
      function fmtDateID(d){ return d.getFullYear()+" "+MONTHS_ID[d.getMonth()]+" "+d.getDate(); }
      function fmtDateISO(d){ return d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate()); }
      function addDays(d,n){ var x=new Date(d.getFullYear(),d.getMonth(),d.getDate()); x.setDate(x.getDate()+n); return x; }
      var PARAM_END_DATE=new Date(2026,10,21);
      function paramBaseAvg(s){ var t=0; for(var i=0;i<s.series.length;i++) t+=s.series[i]; return t/s.series.length; }
      function paramDailyAvg(s,d){
        var base=paramBaseAvg(s);
        if(d.getFullYear()===2026&&d.getMonth()===10&&d.getDate()===21) return base;
        var dayNum=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000);
        var hash=0; for(var i=0;i<s.key.length;i++) hash+=s.key.charCodeAt(i)*(i+3);
        var mn=Math.min.apply(null,s.series), mx=Math.max.apply(null,s.series), span=(mx-mn)||1;
        var v=base+Math.sin(dayNum*0.91+hash)*span*0.10+Math.sin(dayNum*0.37+hash*0.7+1.3)*span*0.06;
        var lo=mn-span*0.08, hi=mx+span*0.08;
        return Math.max(lo,Math.min(hi,v));
      }
      function paramPoints(s){
        if(paramRealtime || paramAgg==="semua"){
          return s.series.map(function(v,i){ return {v:v, tableLabel:"2026 November 21 "+PARAM_TIMES[i]+":00", chartLabel:"2026-11-21 "+PARAM_TIMES[i], csvTime:"2026-11-21 "+PARAM_TIMES[i]+":00"}; });
        }
        if(paramAgg==="jam"){
          var byHour={}, order=[], i, h;
          for(i=0;i<s.series.length;i++){ h=PARAM_TIMES[i].slice(0,2); if(!byHour[h]){ byHour[h]=[]; order.push(h); } byHour[h].push(s.series[i]); }
          return order.map(function(hh){
            var arr=byHour[hh], t=0; for(var j=0;j<arr.length;j++) t+=arr[j];
            return {v:t/arr.length, tableLabel:"2026 November 21 "+hh+":00:00", chartLabel:"2026-11-21 "+hh+":00", csvTime:"2026-11-21 "+hh+":00:00"};
          });
        }
        if(paramAgg==="hari"){
          var outH=[];
          for(var off=29;off>=0;off--){ var dH=addDays(PARAM_END_DATE,-off); outH.push({v:paramDailyAvg(s,dH), tableLabel:fmtDateID(dH), chartLabel:fmtDateISO(dH), csvTime:fmtDateISO(dH)}); }
          return outH;
        }
        if(paramAgg==="minggu"){
          var outW=[];
          for(var w=11;w>=0;w--){ var endW=addDays(PARAM_END_DATE,-w*7), startW=addDays(endW,-6), tw=0, k; for(k=0;k<7;k++) tw+=paramDailyAvg(s,addDays(startW,k));
            outW.push({v:tw/7, tableLabel:fmtDateID(startW)+" – "+fmtDateID(endW), chartLabel:startW.getDate()+" "+MONTHS_SHORT[startW.getMonth()]+" – "+endW.getDate()+" "+MONTHS_SHORT[endW.getMonth()], csvTime:fmtDateISO(startW)+" s/d "+fmtDateISO(endW)}); }
          return outW;
        }
        /* bulan: Jun–Nov 2026, November hanya 1–21 Nov */
        var outB=[];
        for(var m=5;m<=10;m++){ var first=new Date(2026,m,1), last=(m===10)?new Date(2026,10,21):new Date(2026,m+1,0), days=last.getDate(), tb=0; for(var dd=1;dd<=days;dd++) tb+=paramDailyAvg(s,new Date(2026,m,dd));
          outB.push({v:tb/days, tableLabel:"2026 "+MONTHS_ID[m], chartLabel:MONTHS_SHORT[m]+" 2026", csvTime:"2026-"+pad2(m+1)}); }
        return outB;
      }
      function paramRangeText(){
        if(paramRealtime) return "Realtime · data terakhir 2026-11-21, 18:30:00";
        if(paramAgg==="hari") return fmtDateISO(addDays(PARAM_END_DATE,-29))+", 00:00:00  →  2026-11-21, 23:59:59";
        if(paramAgg==="minggu") return fmtDateISO(addDays(PARAM_END_DATE,-83))+", 00:00:00  →  2026-11-21, 23:59:59";
        if(paramAgg==="bulan") return "2026-06-01, 00:00:00  →  2026-11-21, 23:59:59";
        return "2026-11-21, 00:00:00  →  2026-11-21, 23:59:59";
      }
      function smoothPath(xy){
        if(xy.length<2) return "";
        if(xy.length===2) return "M"+xy[0].x.toFixed(1)+","+xy[0].y.toFixed(1)+" L"+xy[1].x.toFixed(1)+","+xy[1].y.toFixed(1);
        var d="M"+xy[0].x.toFixed(1)+","+xy[0].y.toFixed(1);
        for(var i=0;i<xy.length-1;i++){
          var p0=xy[Math.max(0,i-1)], p1=xy[i], p2=xy[i+1], p3=xy[Math.min(xy.length-1,i+2)];
          var c1x=p1.x+(p2.x-p0.x)/6, c1y=p1.y+(p2.y-p0.y)/6;
          var c2x=p2.x-(p3.x-p1.x)/6, c2y=p2.y-(p3.y-p1.y)/6;
          d+="C"+c1x.toFixed(1)+","+c1y.toFixed(1)+" "+c2x.toFixed(1)+","+c2y.toFixed(1)+" "+p2.x.toFixed(1)+","+p2.y.toFixed(1);
        }
        return d;
      }
      function paramChart(s, pts){
        var W=720,H=308,padL=54,padR=16,padT=14,padB=72;
        var min=Infinity,max=-Infinity,i,v;
        for(i=0;i<pts.length;i++){ if(pts[i].v<min)min=pts[i].v; if(pts[i].v>max)max=pts[i].v; }
        var span=(max-min)||1, rawLo=min-span*0.3, rawHi=max+span*0.3;
        var step0=(rawHi-rawLo)/5, mag=Math.pow(10,Math.floor(Math.log(step0)/Math.LN10)), norm=step0/mag;
        var step=(norm<1.5?1:norm<3.5?2:norm<7.5?5:10)*mag;
        var lo=Math.floor(rawLo/step)*step, hi=Math.ceil(rawHi/step)*step;
        var tickDec=step>=1?0:(step>=0.1?1:2);
        function X(i){ return padL+(pts.length<2?0:i/(pts.length-1))*(W-padL-padR); }
        function Y(v){ return padT+((hi-v)/(hi-lo))*(H-padT-padB); }
        var out='<svg class="param-chart" viewBox="0 0 '+W+" "+H+'" role="img" aria-label="Grafik data '+esc(s.name)+' 21 November 2026">';
        if(paramGrid){
          for(v=lo; v<=hi+step*0.001; v+=step){
            var gy=Y(v);
            out+='<line x1="'+padL+'" y1="'+gy.toFixed(1)+'" x2="'+(W-padR)+'" y2="'+gy.toFixed(1)+'" stroke="var(--line)" stroke-width="1"/>';
            out+='<text x="'+(padL-9)+'" y="'+(gy+4).toFixed(1)+'" font-size="11.5" text-anchor="end">'+v.toFixed(tickDec)+"</text>";
          }
        }
        out+='<text transform="rotate(-90 15 '+((padT+H-padB)/2)+')" x="15" y="'+((padT+H-padB)/2)+'" font-size="12" text-anchor="middle">'+esc(s.name)+" ("+esc(s.unit)+")</text>";
        var stride=Math.max(1,Math.ceil(pts.length/8));
        for(i=0;i<pts.length;i++){
          if(i%stride!==0 && i!==pts.length-1) continue;
          var lx=X(i), ly=H-padB+12;
          out+='<text transform="rotate(-32 '+lx.toFixed(1)+" "+ly+')" x="'+lx.toFixed(1)+'" y="'+ly+'" font-size="11" text-anchor="end">'+esc(pts[i].chartLabel)+"</text>";
        }
        if(paramShowLine){
          var xy=pts.map(function(p,i){ return {x:X(i), y:Y(p.v)}; });
          out+='<path d="'+smoothPath(xy)+'" fill="none" stroke="#1E8FE8" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>';
        }
        out+="</svg>";
        return out;
      }
      function renderParam(){
        var s=paramSensor(currentParam), d=null;
        for(var di=0;di<DEVICES.length;di++) if(DEVICES[di].id===currentParamDevice) d=DEVICES[di];
        if(!d) d=DEVICES[0];
        if(d.id==="testing"){
          document.getElementById("paramRoot").innerHTML=
            '<div class="card param-card" id="paramCard">'
            +'<div class="param-devrow"><span class="param-namebox">'+esc(d.name)+"</span>"+chipFor(d.status)+"</div>"
            +'<div class="param-id mono">'+esc(d.code)+"</div>"
            +'<div class="card empty-note" style="border:0;box-shadow:none"><b style="color:var(--ink)">Perangkat sedang dalam pemeliharaan</b><br />Tidak ada data pemantauan untuk ditampilkan — tidak ada pembacaan baru sejak 12 Juni 2026, 13:42. Grafik, tabel, dan unduh akan tersedia lagi begitu perangkat kembali online.</div>'
            +"</div>";
          return;
        }
        var pts=paramPoints(s);
        var rangeTxt=paramRangeText();
        var aggLabel=paramRealtime?"Realtime — data mentah per 30 menit":PARAM_AGG_LABEL[paramAgg];
        var sensorOpts=PARAM_SENSORS.map(function(x){ return '<option value="'+x.key+'"'+(x.key===s.key?" selected":"")+">"+esc(x.name)+"</option>"; }).join("");
        var rangeOpts=PARAM_AGG_OPTIONS.map(function(o){ return '<option value="'+o[0]+'"'+(paramAgg===o[0]?" selected":"")+">"+o[1]+"</option>"; }).join("");
        var rows=pts.slice().reverse().map(function(p){
          return "<tr><td>"+esc(p.tableLabel)+'</td><td class="val">'+paramFmt(p.v,s.dec)+"</td></tr>";
        }).join("");
        document.getElementById("paramRoot").innerHTML=
          '<div class="card param-card" id="paramCard">'
          +'<div class="param-devrow"><span class="param-namebox">'+esc(d.name)+"</span>"+chipFor(d.status)
          +'<button class="param-fs" id="paramFs" aria-label="Tampilkan layar penuh"><svg class="ic" viewBox="0 0 24 24"><path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4"/></svg></button></div>'
          +'<div class="param-id mono">'+esc(d.code)+"</div>"
          +'<div class="param-row"><select class="param-select" id="paramSensorSel" aria-label="Pilih sensor">'+sensorOpts+'</select>'
          +'<label class="realtime-box">Realtime<input type="checkbox" id="paramRealtime"'+(paramRealtime?" checked":"")+' /></label></div>'
          +'<div class="param-row"><div class="range-field"><span>'+esc(rangeTxt)+'</span><svg class="ic sm" viewBox="0 0 24 24" style="margin-left:auto"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg></div></div>'
          +'<div class="param-row"><select class="range-select" id="paramRangeSel" aria-label="Agregasi rata-rata data"'+(paramRealtime?" disabled":"")+">"+rangeOpts+'</select>'
          +'<button class="dl-square" id="paramDownload" aria-label="Unduh data '+esc(s.name)+'"><svg class="ic" viewBox="0 0 24 24"><path d="M12 4v10m0 0 4-4m-4 4-4-4"/><path d="M4 17.5V19a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-1.5"/></svg></button></div>'
          +'<div class="param-chart-tools"><button class="param-gear" id="paramGear" aria-label="Tampilkan / sembunyikan garis grid grafik"><svg class="ic sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/></svg></button>'
          +'<span class="param-sensor-tag"><span class="sq"></span>'+esc(s.name)+"</span></div>"
          + paramChart(s, pts)
          +'<div class="param-legend"><label><input type="checkbox" id="paramLegendChk"'+(paramShowLine?" checked":"")+" />"+esc(s.name)+" ("+esc(s.unit)+")</label></div>"
          +'<div class="monitor-card"><h3>Data Pemantauan</h3><div class="monitor-wrap"><table class="monitor-table"><thead><tr><th>Waktu Pemantauan</th><th>'+esc(s.name)+" ("+esc(s.unit)+")</th></tr></thead><tbody>"+rows+"</tbody></table></div></div>"
          +'<p class="updated" style="margin:12px 2px 0">Data simulasi · '+esc(aggLabel)+" · "+pts.length+" titik data · "+esc(s.code)+"</p>"
          +"</div>";
      }
      document.getElementById("paramRoot").addEventListener("change",function(e){
        if(e.target.id==="paramSensorSel"){ currentParam=e.target.value; paramShowLine=true; renderParam(); }
        else if(e.target.id==="paramRangeSel"){ paramAgg=e.target.value; renderParam(); }
        else if(e.target.id==="paramRealtime"){ paramRealtime=e.target.checked; renderParam(); }
        else if(e.target.id==="paramLegendChk"){ paramShowLine=e.target.checked; renderParam(); }
      });
      document.getElementById("paramRoot").addEventListener("click",function(e){
        if(e.target.closest("#paramGear")){ paramGrid=!paramGrid; renderParam(); return; }
        if(e.target.closest("#paramFs")){
          var card=document.getElementById("paramCard");
          if(card && card.requestFullscreen){ var p=card.requestFullscreen(); if(p && p.catch) p.catch(function(){ toast("Mode layar penuh tidak tersedia"); }); }
          else toast("Mode layar penuh tidak tersedia");
          return;
        }
        if(e.target.closest("#paramDownload")){
          var s=paramSensor(currentParam), pts=paramPoints(s);
          var aggName=paramRealtime?"realtime":paramAgg;
          var csv="waktu,sensor,nilai,satuan,agregasi\n"+pts.map(function(p){ return p.csvTime+","+s.name+","+paramFmt(p.v,s.dec)+","+s.unit+","+(paramRealtime?"Realtime":PARAM_AGG_LABEL[paramAgg]); }).join("\n");
          var fname="sparing-kipi_"+s.name.toLowerCase().replace(/\s+/g,"-")+"_"+aggName+"_2026-11-21.csv";
          downloadFile(fname,csv,"text/csv");
          toast("File diunduh: "+fname);
        }
      });
      /* ---------- perangkat: cari & bandingkan ---------- */
      document.getElementById("deviceSearch").addEventListener("input",function(e){
        var q=e.target.value.trim().toLowerCase(), shown=0;
        var cards=document.querySelectorAll("#deviceList [data-device]");
        for(var i=0;i<cards.length;i++){
          var d=DEVICES[i];
          var hit=!q || d.name.toLowerCase().indexOf(q)>-1 || d.code.toLowerCase().indexOf(q)>-1;
          cards[i].style.display=hit?"":"none"; if(hit) shown++;
        }
        document.getElementById("deviceEmpty").style.display=shown?"none":"";
      });
      document.getElementById("compareBtn").addEventListener("click",function(){
        var p=document.getElementById("comparePanel");
        var open=p.classList.toggle("open");
        this.setAttribute("aria-expanded",open?"true":"false");
        if(open && !p.innerHTML){
          var a=DEVICES[0], b=DEVICES[1];
          function row(label,va,vb){ return "<tr><th>"+label+"</th><td>"+va+"</td><td>"+vb+"</td></tr>"; }
          p.innerHTML="<b>Perbandingan perangkat</b><table><tr><th></th><td><b>"+esc(a.name)+"</b></td><td><b>"+esc(b.name)+"</b></td></tr>"
            + row("Status", chipFor(a.status), chipFor(b.status))
            + row("ID perangkat", '<span class="mono">'+a.code+"</span>", '<span class="mono">'+b.code+"</span>")
            + row("Terakhir terlihat", a.lastSeen, b.lastSeen)
            + row("Lokasi", esc(a.location), esc(b.location))
            + row("Baterai", fmt(lastVal(sensor("battery")),0)+"%", "—")
            + row("Sinyal", fmt(lastVal(sensor("signal")),0)+" dBm", "—")
            + row("Sensor aktif", "9", "0") + "</table>";
        }
      });
      /* ---------- refresh & notifikasi ---------- */
      document.getElementById("refreshBtn").addEventListener("click",function(){
        var b=this; b.classList.add("spinning");
        setTimeout(function(){ b.classList.remove("spinning"); toast("Menampilkan dataset simulasi terakhir — 21 Nov 2026, 18:16"); },900);
      });
      var bellBtn=document.getElementById("bellBtn"), bellPanel=document.getElementById("bellPanel");
      bellBtn.addEventListener("click",function(e){
        e.stopPropagation();
        var open=bellPanel.classList.toggle("open");
        bellBtn.setAttribute("aria-expanded",open?"true":"false");
      });
      document.addEventListener("click",function(e){ if(!e.target.closest(".top-actions")){ bellPanel.classList.remove("open"); bellBtn.setAttribute("aria-expanded","false"); } });
      document.getElementById("alertAmonia").addEventListener("click",function(){ go("detail","kipi","amonia"); });
      document.getElementById("alertMaint").addEventListener("click",function(){ go("detail","testing","ph"); });
      function updateAlerts(){
        var aOn=document.getElementById("swAmbang").getAttribute("aria-checked")==="true";
        var mOn=document.getElementById("swMaint").getAttribute("aria-checked")==="true";
        document.getElementById("alertAmonia").style.display=aOn?"":"none";
        document.getElementById("alertMaint").style.display=mOn?"":"none";
        var n=(aOn?1:0)+(mOn?1:0), badge=document.getElementById("bellBadge");
        badge.textContent=n; badge.style.display=n?"grid":"none";
      }
      function bindSwitch(id){
        var el=document.getElementById(id);
        el.addEventListener("click",function(){
          var now=el.getAttribute("aria-checked")==="true";
          el.setAttribute("aria-checked",now?"false":"true");
          updateAlerts();
          toast("Pengaturan notifikasi diperbarui");
        });
      }
      bindSwitch("swAmbang"); bindSwitch("swMaint");
      /* ---------- tema ---------- */
      function setTheme(mode){
        document.documentElement.setAttribute("data-theme",mode);
        document.getElementById("themeLight").classList.toggle("on",mode==="light");
        document.getElementById("themeDark").classList.toggle("on",mode==="dark");
      }
      var initialTheme=(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light";
      setTheme(initialTheme);
      document.getElementById("themeLight").addEventListener("click",function(){ setTheme("light"); });
      document.getElementById("themeDark").addEventListener("click",function(){ setTheme("dark"); });
      document.getElementById("themeBtn").addEventListener("click",function(){
        setTheme(document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark");
      });
      /* ---------- unduh ---------- */
      var dlSensorSel=document.getElementById("dlSensor");
      dlSensorSel.innerHTML='<option value="semua">Semua sensor (9)</option>'+SENSORS.map(function(s){ return '<option value="'+s.key+'">'+esc(s.name)+"</option>"; }).join("");
      var dlFormat="csv";
      document.getElementById("fmtCsv").addEventListener("click",function(){ dlFormat="csv"; this.classList.add("on"); document.getElementById("fmtJson").classList.remove("on"); });
      document.getElementById("fmtJson").addEventListener("click",function(){ dlFormat="json"; this.classList.add("on"); document.getElementById("fmtCsv").classList.remove("on"); });
      document.getElementById("dlDevice").addEventListener("change",function(){
        var note=document.getElementById("dlNote");
        note.textContent = this.value==="testing"
          ? "Mertani Testing Device sedang pemeliharaan — tidak ada pembacaan untuk diunduh."
          : "Kolom: waktu, sensor, nilai, satuan, status. Nilai mengikuti pembacaan terakhir pukul 18:14.";
      });
      function downloadFile(name, content, type){
        var blob=new Blob([content],{type:type});
        var url=URL.createObjectURL(blob);
        var a=document.createElement("a"); a.href=url; a.download=name; document.body.appendChild(a); a.click();
        document.body.removeChild(a); setTimeout(function(){ URL.revokeObjectURL(url); },800);
      }
      document.getElementById("dlBtn").addEventListener("click",function(){
        var dev=document.getElementById("dlDevice").value;
        if(dev==="testing"){ toast("Tidak ada data — perangkat sedang pemeliharaan"); return; }
        var sel=dlSensorSel.value;
        var list=(sel==="semua")?SENSORS:[sensor(sel)];
        var rows=[];
        list.forEach(function(s){
          s.series.forEach(function(v,i){ rows.push({waktu:"2026-11-21 "+HOURS[i], sensor:s.name, nilai:v, satuan:s.unit, status:s.status}); });
        });
        var base="sparing-kipi_"+(sel==="semua"?"semua-sensor":sel)+"_24jam_2026-11-21";
        var label;
        if(dlFormat==="csv"){
          var csv="waktu,sensor,nilai,satuan,status\n"+rows.map(function(r){ return r.waktu+","+r.sensor+","+fmtRaw(r.nilai,2)+","+r.satuan+","+r.status; }).join("\n");
          downloadFile(base+".csv",csv,"text/csv"); label=base+".csv";
        } else {
          downloadFile(base+".json",JSON.stringify({perangkat:"Sparing KIPI",id:"MTI-1OH9R4FCETTL",dataset:"2026-11-21 18:16",pembacaan:rows},null,2),"application/json"); label=base+".json";
        }
        var wrap=document.getElementById("dlHistoryWrap"); wrap.style.display="";
        var li=document.createElement("li"); li.textContent=label+" · "+rows.length+" baris data";
        document.getElementById("dlHistory").appendChild(li);
        toast("File diunduh: "+label);
      });
      /* ---------- tabel ambang ---------- */
      document.querySelector("#limitTable tbody").innerHTML=SENSORS.map(function(s){
        return "<tr><td><b>"+esc(s.name)+"</b></td><td>"+esc(s.unit)+"</td><td>"+esc(s.limit)+"</td><td>"+fmt(lastVal(s),s.dec)+" "+esc(s.unit)+"</td><td>"+chipFor(s.status)+"</td></tr>";
      }).join("");
      /* ---------- peta Device Distribution (Sukolilo, Surabaya) ---------- */
      (function(){
        var places=[{label:"Sukolilo point", venue:"Sukolilo", locality:"Surabaya", region:"Jawa Timur", country:"Indonesia", lat:-7.29665, lng:112.80123, source:"geocoder"}];
        var mapHandle=null, fbScale=1, fbX=0, fbY=0;
        function fbLimits(){
          var f=document.getElementById("mapFallback");
          var w=f?f.clientWidth:0, h=f?f.clientHeight:0;
          return {x:Math.max(0,w*0.25+(fbScale-1)*w*0.75), y:Math.max(0,h*0.25+(fbScale-1)*h*0.75)};
        }
        function clampFb(){ var L=fbLimits(); fbX=Math.max(-L.x,Math.min(L.x,fbX)); fbY=Math.max(-L.y,Math.min(L.y,fbY)); }
        function applyFb(){ var el=document.getElementById("fbViewport"); if(el) el.style.transform="translate("+fbX+"px,"+fbY+"px) scale("+fbScale+")"; }
        function hideMapHint(){ var hint=document.getElementById("mapHint"); if(hint) hint.classList.add("gone"); }
        document.getElementById("mapEl").addEventListener("pointerdown",hideMapHint);
        function showFallback(){
          var el=document.getElementById("mapEl"); if(el) el.style.display="none";
          document.getElementById("mapFallback").classList.add("show");
        }
        try{
          var link=document.getElementById("mapsLink");
          if(window.MapHelpers && MapHelpers.mapsSearchUrl){
            var u=MapHelpers.mapsSearchUrl(places[0]);
            if(u) link.href=u; else link.style.display="none";
          } else link.style.display="none";
        }catch(e){ document.getElementById("mapsLink").style.display="none"; }
        try{
          if(window.MapHelpers && MapHelpers.mountPlaceListMap){
            mapHandle=MapHelpers.mountPlaceListMap(document.getElementById("mapEl"), {places:places, rows:[document.getElementById("placeRow0")], baseStyle:"grayscale"}, showFallback);
            if(!mapHandle) showFallback();
          } else showFallback();
        }catch(e){ showFallback(); }
        /* Paksa tile peta interaktif tampil abu-abu: canvas MapLibre & tile <img> Leaflet/OSM
           dibuat asinkron setelah mount, jadi terapkan filter inline + awasi node baru.
           Marker/popup tidak disentuh agar tetap berwarna. */
        (function enforceGrayTiles(){
          var root=document.getElementById("mapEl");
          if(!root) return;
          var TILE_SEL="canvas, .maplibregl-canvas, .leaflet-tile-pane, .leaflet-tile, .leaflet-tile-container img, img.leaflet-tile";
          function paint(scope){
            var nodes=scope.querySelectorAll ? scope.querySelectorAll(TILE_SEL) : [];
            for(var i=0;i<nodes.length;i++) nodes[i].style.setProperty("filter","grayscale(1)","important");
          }
          paint(root);
          if(window.MutationObserver){
            var pending=false;
            var mo=new MutationObserver(function(){
              if(pending) return; pending=true;
              requestAnimationFrame(function(){ pending=false; paint(root); });
            });
            mo.observe(root,{childList:true,subtree:true});
            setTimeout(function(){ mo.disconnect(); },30000);
          }
        })();
        /* ---------- popup detail device saat marker diklik ---------- */
        var mapPop=document.getElementById("mapPop");
        function openMapPop(){
          try{
            var bEl=document.getElementById("popBattery");
            if(bEl) bEl.textContent=fmt(lastVal(sensor("battery")),0)+"%";
            var dir=document.getElementById("popDirections");
            if(dir && window.MapHelpers && MapHelpers.mapsDirectionsUrl){
              var du=MapHelpers.mapsDirectionsUrl(places[0]);
              if(du) dir.href=du;
            }
          }catch(e){}
          if(mapPop) mapPop.classList.add("open");
          hideMapHint();
        }
        function closeMapPop(){ if(mapPop) mapPop.classList.remove("open"); }
        window.__openMapPop=openMapPop;
        document.getElementById("mapPopClose").addEventListener("click",closeMapPop);
        document.getElementById("popViewDetails").addEventListener("click",function(){ closeMapPop(); openParam("hum"); });
        /* Popup HARUS tertutup saat peta ditekan atau digeser (peta interaktif).
           Dengarkan pointerdown/mousedown/touchstart di fase capture pada #mapEl
           supaya popup langsung tertutup di awal tekanan/geseran, sebelum handler
           drag bawaan peta berjalan. Menekan marker tidak dicegah: event click
           sesudahnya tetap membuka popup lagi, dan View details tetap ke Detail Parameter. */
        var mapElEl=document.getElementById("mapEl");
        function closePopOnMapPress(e){
          if(e && e.target && e.target.closest && e.target.closest(".map-pop")) return;
          closeMapPop();
        }
        mapElEl.addEventListener("pointerdown",closePopOnMapPress,true);
        mapElEl.addEventListener("mousedown",closePopOnMapPress,true);
        mapElEl.addEventListener("touchstart",closePopOnMapPress,{capture:true,passive:true});
        mapElEl.addEventListener("pointermove",function(e){ if(e.buttons) closeMapPop(); },true);
        mapElEl.addEventListener("wheel",closePopOnMapPress,{capture:true,passive:true});
        mapElEl.addEventListener("click",function(e){
          if(e.target.closest && e.target.closest(".pin")) openMapPop();
        });
        /* Jika peta interaktif mengekspos event drag/move, tutup juga dari sana. */
        (function hookMapDragClose(attempt){
          try{
            var m=mapHandle && (mapHandle.getMap ? mapHandle.getMap() : mapHandle.map);
            if(m && m.on){
              m.on("dragstart",closeMapPop); m.on("movestart",closeMapPop);
              m.on("mousedown",closeMapPop); m.on("touchstart",closeMapPop);
            } else if(attempt<10){ setTimeout(function(){ hookMapDragClose(attempt+1); },600); }
          }catch(err){ if(attempt<10) setTimeout(function(){ hookMapDragClose(attempt+1); },600); }
        })(0);
        var legendPanel=document.getElementById("legendPanel"), dataPanel=document.getElementById("dataPanel");
        var legendBtn=document.getElementById("legendBtn"), dataBtn=document.getElementById("dataBtn");
        function togglePanel(which){
          var openL=which==="legend" ? !legendPanel.classList.contains("open") : false;
          var openD=which==="data" ? !dataPanel.classList.contains("open") : false;
          legendPanel.classList.toggle("open",openL); dataPanel.classList.toggle("open",openD);
          legendBtn.setAttribute("aria-expanded",openL?"true":"false"); dataBtn.setAttribute("aria-expanded",openD?"true":"false");
        }
        legendBtn.addEventListener("click",function(){ togglePanel("legend"); });
        dataBtn.addEventListener("click",function(){ togglePanel("data"); });
        document.getElementById("mapSearchBtn").addEventListener("click",function(){ togglePanel("data"); });
        document.getElementById("mapLayersBtn").addEventListener("click",function(){ togglePanel("legend"); });
        function applyZoom(dir){
          fbScale=Math.min(2.6,Math.max(0.7,fbScale+dir*0.45));
          clampFb(); applyFb();
          try{
            var m=mapHandle && (mapHandle.getMap ? mapHandle.getMap() : mapHandle.map);
            if(m){ if(dir>0 && m.zoomIn) m.zoomIn(); else if(dir<0 && m.zoomOut) m.zoomOut(); }
          }catch(e){}
        }
        document.getElementById("zoomIn").addEventListener("click",function(){ applyZoom(1); });
        document.getElementById("zoomOut").addEventListener("click",function(){ applyZoom(-1); });
        document.getElementById("zoomTarget").addEventListener("click",function(){
          fbScale=1; fbX=0; fbY=0; applyFb();
          var row=document.getElementById("placeRow0"); if(row) row.click();
        });
        /* seret peta cadangan: geser gambar + penanda dengan mouse / sentuh */
        (function(){
          var vp=document.getElementById("fbViewport");
          if(!vp) return;
          var drag=null;
          vp.addEventListener("pointerdown",function(e){
            if(e.button!==undefined && e.button!==0) return;
            /* Popup perangkat tertutup begitu peta ditekan / digeser. Jika yang
               ditekan tepat marker-nya, tap bersih (tanpa geser) di pointerup
               tetap membukanya lagi lewat logika wasTap di endDrag. */
            closeMapPop();
            drag={id:e.pointerId,x:e.clientX,y:e.clientY,sx:fbX,sy:fbY};
            vp.classList.add("dragging");
            try{ vp.setPointerCapture(e.pointerId); }catch(err){}
            hideMapHint();
          });
          vp.addEventListener("pointermove",function(e){
            if(!drag || e.pointerId!==drag.id) return;
            if(Math.abs(e.clientX-drag.x)>7 || Math.abs(e.clientY-drag.y)>7) closeMapPop();
            fbX=drag.sx+(e.clientX-drag.x); fbY=drag.sy+(e.clientY-drag.y);
            clampFb(); applyFb();
          });
          function endDrag(e){
            if(drag && (!e || e.pointerId===drag.id)){
              var wasTap=false;
              if(e && Math.abs(e.clientX-drag.x)<7 && Math.abs(e.clientY-drag.y)<7){
                var mk=vp.querySelector(".dev-marker");
                if(mk){ var r=mk.getBoundingClientRect(); wasTap=e.clientX>=r.left-8 && e.clientX<=r.right+8 && e.clientY>=r.top-8 && e.clientY<=r.bottom+8; }
              }
              drag=null; vp.classList.remove("dragging");
              if(wasTap && window.__openMapPop) window.__openMapPop();
            }
          }
          vp.addEventListener("pointerup",endDrag);
          vp.addEventListener("pointercancel",endDrag);
          vp.addEventListener("dragstart",function(e){ e.preventDefault(); });
        })();
      })();
      /* ---------- hubungkan data terakhir ke visualisasi 3D ---------- */
      if(window.MertaniThree && MertaniThree.setLevels){
        MertaniThree.setLevels({
          waterLevel: lastVal(sensor("level")),
          battery: lastVal(sensor("battery")),
          signal: lastVal(sensor("signal"))
        });
      }
      /* ---------- login / signup ---------- */
      var authScreen=document.getElementById("authScreen");
      var loginForm=document.getElementById("loginForm"), signupForm=document.getElementById("signupForm");
      function showAuthForm(which){
        loginForm.hidden=which!=="login";
        signupForm.hidden=which!=="signup";
      }
      document.getElementById("toSignup").addEventListener("click",function(){ showAuthForm("signup"); });
      document.getElementById("toLogin").addEventListener("click",function(){ showAuthForm("login"); });
      var showBtns=document.querySelectorAll("[data-show]");
      for(var si=0;si<showBtns.length;si++){
        showBtns[si].addEventListener("click",function(){
          var inp=document.getElementById(this.getAttribute("data-show"));
          if(!inp) return;
          var show=inp.type==="password";
          inp.type=show?"text":"password";
          this.textContent=show?"Hide":"Show";
        });
      }
      function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
      function setUserName(name){
        if(!name) return;
        var names=document.querySelectorAll(".js-user-name");
        for(var i=0;i<names.length;i++) names[i].textContent=name;
        var parts=name.trim().split(/\s+/);
        var ini=((parts[0]||"").charAt(0)+(parts[1]||"").charAt(0)).toUpperCase();
        var avs=document.querySelectorAll(".js-user-avatar");
        for(var j=0;j<avs.length;j++) avs[j].textContent=ini;
      }
      function enterApp(name,msg){
        if(name) setUserName(name);
        document.body.classList.remove("auth-lock");
        authScreen.classList.add("hide");
        setTimeout(function(){ authScreen.style.display="none"; },380);
        try{ window.dispatchEvent(new Event("resize")); }catch(e){}
        if(msg) setTimeout(function(){ toast(msg); },430);
      }
      loginForm.addEventListener("submit",function(e){
        e.preventDefault();
        var em=document.getElementById("loginEmail").value.trim();
        var pw=document.getElementById("loginPass").value;
        var err=document.getElementById("loginError");
        if(!validEmail(em)){ err.textContent="Enter a valid work email address."; return; }
        if(!pw){ err.textContent="Enter your password."; return; }
        err.textContent="";
        enterApp(null,"Selamat datang kembali di workspace Mertani");
      });
      signupForm.addEventListener("submit",function(e){
        e.preventDefault();
        var nm=document.getElementById("suName").value.trim();
        var em=document.getElementById("suEmail").value.trim();
        var p1=document.getElementById("suPass").value, p2=document.getElementById("suPass2").value;
        var err=document.getElementById("signupError");
        if(nm.length<2){ err.textContent="Enter your full name."; return; }
        if(!validEmail(em)){ err.textContent="Enter a valid work email address."; return; }
        if(p1.length<8){ err.textContent="Password must be at least 8 characters."; return; }
        if(p1!==p2){ err.textContent="Passwords do not match."; return; }
        err.textContent="";
        enterApp(nm,"Akun dibuat — selamat datang, "+nm);
      });
      document.getElementById("demoBtn").addEventListener("click",function(){
        enterApp(null,"Masuk sebagai demo — Admin Mertani");
      });
      document.getElementById("forgotBtn").addEventListener("click",function(){
        toast("Reset kata sandi tidak tersedia di demo ini — gunakan Enter demo workspace");
      });
      var logoutBtns=document.querySelectorAll(".logout-btn");
      for(var li=0;li<logoutBtns.length;li++){
        logoutBtns[li].addEventListener("click",function(){
          authScreen.style.display="";
          authScreen.classList.remove("hide");
          document.body.classList.add("auth-lock");
          showAuthForm("login");
          setDrawer(false);
          window.scrollTo({top:0});
          try{ window.dispatchEvent(new Event("resize")); }catch(e){}
        });
      }
      /* ---------- render awal ---------- */
      renderDevices();
      renderStage();
      updateAlerts();
    })();
    
