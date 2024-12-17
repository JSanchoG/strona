let chart = null;
let show2 = false;
let balls = true;
tempRes2 = ""

function syncSliders() {
    for (let i = 1; i <= 2; i++) {
      const numTurns = parseInt(document.getElementById(`numTurnsInput${i}`).value);
      const area = parseFloat(document.getElementById(`areaInput${i}`).value);
      const frequency = parseFloat(document.getElementById(`frequencyInput${i}`).value);
      const magneticField = parseFloat(document.getElementById(`magneticFieldInput${i}`).value);
      document.getElementById(`numTurnsSlider${i}`).max = numTurns;
      document.getElementById(`numTurnsSlider${i}`).value = numTurns;

      document.getElementById(`areaSlider${i}`).max = area;
      document.getElementById(`areaSlider${i}`).value = area;

      document.getElementById(`frequencySlider${i}`).max = frequency;
      document.getElementById(`frequencySlider${i}`).value = frequency;

      document.getElementById(`magneticFieldSlider${i}`).max = magneticField;
      document.getElementById(`magneticFieldSlider${i}`).value = magneticField;
    }
    if (!balls) updateGraph();
}

function syncInputs() {
    for (let i = 1; i <= 2; i++) {
        const numTurnsSlider = parseInt(document.getElementById(`numTurnsSlider${i}`).value);
        const areaSlider = parseFloat(document.getElementById(`areaSlider${i}`).value);
        const frequencySlider = parseFloat(document.getElementById(`frequencySlider${i}`).value);
        const magneticFieldSlider = parseFloat(document.getElementById(`magneticFieldSlider${i}`).value);

        document.getElementById(`numTurnsInput${i}`).value = numTurnsSlider;
        document.getElementById(`areaInput${i}`).value = areaSlider;
        document.getElementById(`frequencyInput${i}`).value = frequencySlider;
        document.getElementById(`magneticFieldInput${i}`).value = magneticFieldSlider;
    }
    updateGraph();
}
const i1 = document.querySelector("#i-1");
const i2 = document.querySelector("#i-2");
function updateGraph() {
    const voltage = [];
    const voltage2 = [];

    let g1 = {
      label: "Napięcie (V)",
      data: voltage,
      borderColor: "blue",
      borderWidth: 2,
      fill: false,
    };
    let g2 = {
      label: "Wykres 2",
      data: voltage2,
      borderColor: "red",
      borderWidth: 2,
      fill: false,
      hidden: false,
    };

    if (balls) {
      g2.hidden = "true";
      balls = false;
    }

    const numTurns = parseInt(document.getElementById('numTurnsInput1').value);
    const area = parseFloat(document.getElementById('areaInput1').value);
    const frequency = parseFloat(document.getElementById('frequencyInput1').value);
    const magneticField = parseFloat(document.getElementById('magneticFieldInput1').value);
    const numTurns2 = parseInt(document.getElementById('numTurnsInput2').value);
    const area2 = parseFloat(document.getElementById('areaInput2').value);
    const frequency2 = parseFloat(document.getElementById('frequencyInput2').value);
    const magneticField2 = parseFloat(document.getElementById('magneticFieldInput2').value);
    const resultDivL = document.getElementById('resultL');
    const resultDivR = document.getElementById('resultR');
    const canvas = document.getElementById('voltageChart');
    const ctx = canvas.getContext('2d');

    if (isNaN(numTurns) || isNaN(area) || isNaN(frequency) || isNaN(magneticField) || numTurns <= 0 || area <= 0 || frequency <= 0 || magneticField <= 0) {
        resultDivL.innerHTML = `<h3 class="errorL">Wszystkie dane wejściowe muszą być dodatnie.</h3>`;
        canvas.style.display = 'none';
        if (chart) {
            chart.destroy();
            chart = null;
        }
        resultDivR.innerHTML = ``;
        return;
    }
    if (isNaN(numTurns2) || isNaN(area2) || isNaN(frequency2) || isNaN(magneticField2) || numTurns2 <= 0 || area2 <= 0 || frequency2 <= 0 || magneticField2 <= 0) {
        resultDivR.innerHTML = `<h3 class="errorR">Wszystkie dane wejściowe muszą być dodatnie.</h3>`;
        canvas.style.display = 'none';
        if (chart) {
            chart.destroy();
            chart = null;
        }
        resultDivL.innerHTML = ``;
        return;
    }

    canvas.style.display = 'block';

    const omega = 2 * Math.PI * frequency;
    const maxVoltage = numTurns * area * magneticField * omega;
    const rmsVoltage = maxVoltage / Math.sqrt(2);
    const omega2 = 2 * Math.PI * frequency2;
    const maxVoltage2 = numTurns2 * area * magneticField2 * omega2;
    const rmsVoltage2 = maxVoltage2 / Math.sqrt(2);

    resultDivL.innerHTML = `<span>U<sub>max</sub> = ${maxVoltage.toFixed(2)} V</span><br><span>U<sub>rms</sub> = ${rmsVoltage.toFixed(2)} V</span>`;
    if (show2) resultDivR.innerHTML = `<span>U<sub>max</sub> = ${maxVoltage2.toFixed(2)} V</span><br><span>U<sub>rms</sub> = ${rmsVoltage2.toFixed(2)} V</span>`;
    else tempRes2 = `<span>U<sub>max</sub> = ${maxVoltage2.toFixed(2)} V</span><br><span>U<sub>rms</sub> = ${rmsVoltage2.toFixed(2)} V</span>`;

    const tau = 1 / frequency;
    const tau2 = 1 / frequency2;
    const time = [];
    const numPoints = 500;

    for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * 2 * tau;
        const t2 = (i / numPoints) * 2 * tau2;
        time.push(Math.max(t,t2).toFixed(4));
        voltage.push(maxVoltage * Math.sin(omega * Math.max(t,t2)));
        voltage2.push(maxVoltage2 * Math.sin(omega2 * Math.max(t,t2)));
    }    

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: time,
            datasets: [g1,g2]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Czas (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amplituda (V)'
                    }
                }
            }
        }
    });

    document.addEventListener("keydown", function (event) {
        if (document.activeElement.tagName.toLowerCase() !== 'input' || document.activeElement.type !== 'number') {
            if (event.key == "1") {
                i1.style.display = "block";
                i2.style.display = "none";
            } else if (event.key == "2") {
                if (!show2) {
                    resultDivR.innerHTML = tempRes2;
                    show2 = true;
                    g2.hidden = false;
                    chart.update();
                }
                i1.style.display = "none";
                i2.style.display = "block";
            }
        }
    });

}

const inputs = ['numTurnsInput1', 'numTurnsInput2', 'areaInput1', 'areaInput2', 'frequencyInput1', 'frequencyInput2', 'magneticFieldInput1', 'magneticFieldInput2'];
inputs.forEach(inputId => {
    document.getElementById(inputId).addEventListener('input', syncSliders);
});

const sliders = ['numTurnsSlider1', 'numTurnsSlider2', 'areaSlider1', 'areaSlider2', 'frequencySlider1', 'frequencySlider2', 'magneticFieldSlider1', 'magneticFieldSlider2'];
sliders.forEach(sliderId => {
    document.getElementById(sliderId).addEventListener('input', syncInputs);
});

syncSliders();
updateGraph();