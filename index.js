window.requestAnimFrame = (function () {
    return window.requestAnimationFrame
    || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();


$(document).ready(function () {
    var checkboxValue = JSON.parse(sessionStorage.getItem("checkboxValue")) || false;
    var checkbox = $("#checkbox");
    if (checkboxValue) {
        checkbox.prop("checked", true);
    }
    else {
        checkbox.prop("checked", false);
    }
    document.getElementById("colorChooser").value = JSON.parse(sessionStorage.getItem("color")) || "#ff0000";
    settings = {
        stepsize: JSON.parse(sessionStorage.getItem("stepsize")) || 0.025,
        maxheight: JSON.parse(sessionStorage.getItem("maxheight")) || 1,
        trailsize: JSON.parse(sessionStorage.getItem("trailsize")) || 10,
        decay: JSON.parse(sessionStorage.getItem("decay")) || 0.1,
        alpha: JSON.parse(sessionStorage.getItem("alpha")) || 0.4,
        freqA: JSON.parse(sessionStorage.getItem("freqA")) || 12,
        freqB: JSON.parse(sessionStorage.getItem("freqB")) || 11,
    };

    var gui = new dat.GUI({ autoPlace: false });
    gui.remember(settings);
    var customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(gui.domElement);
    var folderOne = gui.addFolder('Frequencies')
    folderOne.add(settings, 'freqA', 1, 50);
    folderOne.add(settings, 'freqB', 1, 50);
    var folderTwo = gui.addFolder('Alphas')
    folderTwo.add(settings, 'decay', 0.01, 0.99);
    folderTwo.add(settings, 'alpha', 0.01, 0.99);
    var folderThree = gui.addFolder('Others')
    folderThree.add(settings, 'trailsize', 1, 360);
    folderThree.add(settings, 'stepsize', 0.010, 1);
    folderThree.add(settings, 'maxheight', 0.1, 32);
    gui.open();

    var calculateX = function (calculatedDegree) {
        return 120 * Math.sin(settings.freqA * calculatedDegree) + 200
    }
    var calculateY = function (calculatedDegree) {
        return 120 * Math.cos(settings.freqB * calculatedDegree) + 200
    }
    var drawOnePoint = function (twoDCanvas, x, y, passedOffset) {
        twoDCanvas.save();
        twoDCanvas.fillRect(20 + x, 20 + y, 0.5 + (passedOffset / 32) * settings.maxheight, 0.5 + (passedOffset / 32) * settings.maxheight);
        twoDCanvas.restore();
    }

    var degreeToRadians = function (angle) {
        return angle / 180 * Math.PI;
    }

    $('input[type=checkbox]').change(function () {
        checkboxValue = !checkboxValue;
    });

    var saveStates = function () {
        sessionStorage.setItem("freqA", JSON.stringify(settings.freqA));
        sessionStorage.setItem("freqB", JSON.stringify(settings.freqB));
        sessionStorage.setItem("trailsize", JSON.stringify(settings.trailsize));
        sessionStorage.setItem("decay", JSON.stringify(settings.decay));
        sessionStorage.setItem("alpha", JSON.stringify(settings.alpha));
        sessionStorage.setItem("stepsize", JSON.stringify(settings.stepsize));
        sessionStorage.setItem("maxheight", JSON.stringify(settings.maxheight));
        sessionStorage.setItem("color", JSON.stringify(document.getElementById("colorChooser").value));
        sessionStorage.setItem("checkboxValue", JSON.stringify(checkboxValue));
    }

    var restoreStates = function () {
        sessionStorage.removeItem("freqA");
        sessionStorage.removeItem("freqB");
        sessionStorage.removeItem("trailsize");
        sessionStorage.removeItem("decay");
        sessionStorage.removeItem("alpha");
        sessionStorage.removeItem("stepsize");
        sessionStorage.removeItem("maxheight");
        sessionStorage.removeItem("color");
        sessionStorage.removeItem("checkboxValue");
    }

    var twoDCanvas = document.getElementById("canvas").getContext('2d');
    var offset = 0;
    (function animloop() {
        if (checkboxValue) {
            saveStates();
        }
        else {
            restoreStates();
        }
        offset = (offset + 1) % 360;
        requestAnimFrame(animloop);
        twoDCanvas.fillStyle = "rgba(0,0,0," + settings.decay + ")";
        twoDCanvas.fillRect(0, 0, 500, 500);
        var off = Math.ceil(Math.abs(Math.sin(degreeToRadians(offset)) * 32));
        twoDCanvas.fillStyle = document.getElementById("colorChooser").value;
        for (counter = offset; counter < settings.trailsize + offset; counter += settings.stepsize) {
            drawOnePoint(twoDCanvas, calculateX(degreeToRadians(counter)), calculateY(degreeToRadians(counter)), off);
        }
    })();
});
