let field = document.getElementById("field");
let potentials;

window.onload = function () {
    createSurfacePlot();
};

function clearField() {
    field.innerHTML = "";
}

function createSurfacePlot() {
    const step = 3;
    const k = 8987551792;
    const e = -0.000000000000000000160217646;
    const p = 0.000000000000000000160217733;
    const scale = 1000000000000;

    potentials = [];

    let charges = Array.from(document.getElementsByClassName("charge-wrapper"));

    for (let i = field.offsetLeft; i < field.offsetLeft + field.offsetWidth; i+=step) {
        potentials.push([]);

        for (let j = field.offsetTop; j < field.offsetTop + field.offsetHeight; j+=step) {
            let potential = 0;
            charges.forEach(
                function(item, index, array) {
                    let q = item.getElementsByTagName("span")[0].className === "proton" ? p : e;

                    let x = item.offsetLeft;
                    let y = item.offsetTop;
                    let r = Math.sqrt(Math.pow(x-i, 2) + Math.pow(y-j, 2));

                    let v = ( r !== 0 ) ? ( k*q/r * scale ) : ( "infty" );
                    potential += v;
                }
            );
            potentials[potentials.length-1].push(potential);
        }
    }

    let data = {
        z: potentials,
        type: 'surface',
        contours: {
            z: {
                show: true,
                usecolormap: true,
                project: {z:true}
            }
        }
    };
    Plotly.newPlot('graph', [data]);
}

function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,"
        + potentials.map(e => e.join(",")).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "equipotentials.csv");
    document.body.appendChild(link);

    link.click();
}

$( function() {
    $('.charges').droppable({
        accept: ".charge-wrapper",
        drop: function(event, ui) {
            ui.draggable.remove();
        }
    });

    let field = $("#field");

    $(".generator").draggable({
        helper: "clone",
        cancel: false,
        containment: ".interactive"
    });

    field.droppable({
        drop: function(event, ui) {
            if (ui.helper.hasClass("generator")) {
                let wrapper = $("<div>", {
                    class: "charge-wrapper",
                    style: ui.helper.attr("style")
                });

                $("<div>", {
                    class: "charge"
                })
                    .html(ui.helper.html())
                    .appendTo(wrapper);

                wrapper.appendTo($(this));
                wrapper.draggable({
                    helper: false,
                    containment: ".interactive"
                });
            }
        }
    });
} );
