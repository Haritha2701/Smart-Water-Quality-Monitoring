let fullData = [];
let chartInstance = null;

// 🎤 Voice Function
function speakMessage(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

async function loadData() {
    const res = await fetch("/data");
    const result = await res.json();

    fullData = result.data;

    displaySummary(result.summary);
    populateFilter(fullData);
    displayData(fullData);
    drawChart(fullData[0]);
}

function displaySummary(summary) {
    document.getElementById("summary").innerHTML = `
        <h3>Total: ${summary.total}</h3>
        <p>Safe: ${summary.safe}</p>
        <p>Moderate: ${summary.moderate}</p>
        <p>Danger: ${summary.danger}</p>
    `;
}

function populateFilter(data) {
    const filter = document.getElementById("villageFilter");

    filter.innerHTML = `<option value="all">All Villages</option>`;

    data.forEach(item => {
        filter.innerHTML += `<option value="${item.village}">${item.village}</option>`;
    });

    filter.onchange = () => {
        let value = filter.value;

        if (value === "all") {
            displayData(fullData);
            drawChart(fullData[0]);
        } else {
            const filtered = fullData.filter(d => d.village === value);
            displayData(filtered);
            drawChart(filtered[0]);

            // 🎤 Voice Output
            let item = filtered[0];
            let message = "";

            if (item.prediction < 60) {
                message = `Water quality in ${item.village} is safe`;
            } 
            else if (item.prediction < 80) {
                message = `Water quality in ${item.village} is moderate`;
            } 
            else {
                message = `Warning! Water is highly polluted in ${item.village}`;
            }

            speakMessage(message);
        }
    };
}

function displayData(data) {
    let output = "";

    data.forEach(item => {

        let className = "safe";
        if (item.prediction > 80) className = "danger";
        else if (item.prediction > 60) className = "moderate";

        let futureHTML = "";
        item.future.forEach(day => {
            futureHTML += `<li><b>${day.day}:</b> ${day.value}</li>`;
        });

        output += `
        <div class="card ${className}">
            <h3>${item.village}</h3>
            <p>${item.alert}</p>
            <p><b>Prediction:</b> ${item.prediction}</p>
            <ul>${futureHTML}</ul>
        </div>`;
    });

    document.getElementById("output").innerHTML = output;
}

function drawChart(item) {

    const ctx = document.getElementById('chart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    const labels = item.future.map(d => d.day);
    const values = item.future.map(d => d.value);

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '7-Day Prediction',
                data: values,
                borderColor: "black",
                backgroundColor: "rgba(0,0,0,0.1)",
                borderWidth: 3,
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: "black"
            }]
        }
    });
}