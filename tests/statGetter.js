"use strict";
init().then(function () {

    //Подписка на шоты
    var labels = [0, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            chart, dps = [], data = [{type: "line", dataPoints: dps}], dataLength = 500,
            xVal = 0;

    chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: false,
        title: {
            text: "Metrika shots graph"
        },
        legend: {
            horizontalAlign: "right",
            verticalAlign: "center"
        },
        axisY: {
            includeZero: false
        },
        data: data
    });
    var shots = 0, sps = 0, scls = 0, seconds = 0, loadMax = 0, sclsMax = 0, load = 0;
    var shotsLabel = document.getElementById("shotsCount");
    var shotsPerSecondLabel = document.getElementById("shotsPerSecond");
    var shotsPerSecondMaxLabel = document.getElementById("shotsPerSecondMax");
    var loadLabel = document.getElementById("loadStat");
    var loadMaxLabel = document.getElementById("loadStatMax");

    var lastRequest;
    function getStatByLastTime(callback) {
        var curTime = new Date();
        if (lastRequest) {
            fetchData('qShotsInPeriod'
                    , {
                        period_start: '"' + lastRequest.toJSON() + '"',
                        period_end: '"' + curTime.toJSON() + '"'
                    }
            , function (res) {
                shots += res.length;
                scls += res.length;
                shotsLabel.innerHTML = shots;
                callback();
            });
        }
        lastRequest = curTime;
    }

    setInterval(function () {
        seconds++;
        getStatByLastTime(function() {
            shotsPerSecondLabel.innerHTML = scls;
            if (scls > sclsMax) {
                sclsMax = scls;
                shotsPerSecondMaxLabel.innerHTML = scls;
            }
            dps.push({
                x: xVal,
                y: scls
            });
            xVal++;
            if (dps.length > dataLength) {
                dps.shift();
            }
            chart.render();

            scls = 0;
            load = (shots / seconds).toFixed(2);
            if (load > loadMax) {
                loadMax = load;
                loadMaxLabel.innerHTML = loadMax;
            }
            loadLabel.innerHTML = load;
        });
    }, 1000);
});
