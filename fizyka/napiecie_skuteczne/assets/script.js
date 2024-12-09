let chart = null;

function syncSliders() {
    const numTurns = parseInt(document.getElementById('numTurnsInput').value);
    const area = parseFloat(document.getElementById('areaInput').value);
    const frequency = parseFloat(document.getElementById('frequencyInput').value);
    const magneticField = parseFloat(document.getElementById('magneticFieldInput').value);

    document.getElementById('numTurnsSlider').max = numTurns;
    document.getElementById('numTurnsSlider').value = numTurns;

    document.getElementById('areaSlider').max = area;
    document.getElementById('areaSlider').value = area;

    document.getElementById('frequencySlider').max = frequency;
    document.getElementById('frequencySlider').value = frequency;

    document.getElementById('magneticFieldSlider').max = magneticField;
    document.getElementById('magneticFieldSlider').value = magneticField;

    updateGraph();
}

function syncInputs() {
    const numTurnsSlider = parseInt(document.getElementById('numTurnsSlider').value);
    const areaSlider = parseFloat(document.getElementById('areaSlider').value);
    const frequencySlider = parseFloat(document.getElementById('frequencySlider').value);
    const magneticFieldSlider = parseFloat(document.getElementById('magneticFieldSlider').value);

    document.getElementById('numTurnsInput').value = numTurnsSlider;
    document.getElementById('areaInput').value = areaSlider;
    document.getElementById('frequencyInput').value = frequencySlider;
    document.getElementById('magneticFieldInput').value = magneticFieldSlider;

    updateGraph();
}

function updateGraph() {
    const numTurns = parseInt(document.getElementById('numTurnsInput').value);
    const area = parseFloat(document.getElementById('areaInput').value);
    const frequency = parseFloat(document.getElementById('frequencyInput').value);
    const magneticField = parseFloat(document.getElementById('magneticFieldInput').value);
    const resultDiv = document.getElementById('result');
    const canvas = document.getElementById('voltageChart');
    const ctx = canvas.getContext('2d');

    if (
        isNaN(numTurns) || isNaN(area) || isNaN(frequency) || isNaN(magneticField) ||
        numTurns <= 0 || area <= 0 || frequency <= 0 || magneticField <= 0
    ) {
        resultDiv.innerHTML = `<h3 class="error">Wszystkie dane wejściowe muszą być dodatnie.</h3>`;
        canvas.style.display = 'none';
        if (chart) {
            chart.destroy();
            chart = null;
        }
        return;
    }

    canvas.style.display = 'block';

    const omega = 2 * Math.PI * frequency;
    const maxVoltage = numTurns * area * magneticField * omega;
    const rmsVoltage = maxVoltage / Math.sqrt(2);

    resultDiv.innerHTML = `<span>U<sub>max</sub> = ${maxVoltage.toFixed(2)} V</span><br><span>U<sub>rms</sub> = ${rmsVoltage.toFixed(2)} V</span>`;

    const tau = 1 / frequency;
    const time = [];
    const voltage = [];
    const numPoints = 1000;

    for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * 2 * tau;
        time.push(t.toFixed(4));
        voltage.push(maxVoltage * Math.sin(omega * t));
    }

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                label: 'Napięcie (V)',
                data: voltage,
                borderColor: 'blue',
                borderWidth: 2,
                fill: false
            }]
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
}

document.getElementById('numTurnsInput').addEventListener('input', syncSliders);
document.getElementById('areaInput').addEventListener('input', syncSliders);
document.getElementById('frequencyInput').addEventListener('input', syncSliders);
document.getElementById('magneticFieldInput').addEventListener('input', syncSliders);

document.getElementById('numTurnsSlider').addEventListener('input', syncInputs);
document.getElementById('areaSlider').addEventListener('input', syncInputs);
document.getElementById('frequencySlider').addEventListener('input', syncInputs);
document.getElementById('magneticFieldSlider').addEventListener('input', syncInputs);

syncSliders();
updateGraph();