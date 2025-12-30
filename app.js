// stations
const stations = ["Sled", "SkiErg", "Row", "Burpee", "WallBall"];

// combo data
const combos = [];

// generate all unique 2-station combos
for (let i = 0; i < stations.length; i++) {
    for (let j = 0; j < stations.length; j++) {
        if (i !== j) {
            combos.push({
                station1: stations[i],
                station2: stations[j],
                done: false,
                times: []
            });
        }
    }
}

const comboListDiv = document.getElementById("combo-list");
const totalCombosSpan = document.getElementById("total-combos");
const remainingCombosSpan = document.getElementById("remaining-combos");
const totalTimeSpan = document.getElementById("total-time");

function renderCombos() {
    comboListDiv.innerHTML = "";
    let totalTime = 0;
    let remainingCount = 0;

    combos.forEach((combo, index) => {
        const div = document.createElement("div");
        div.className = "combo-item";
        if (combo.done) div.classList.add("done");

        // left: checkbox + label
        const left = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = combo.done;
        checkbox.addEventListener("change", () => {
            combo.done = checkbox.checked;
            renderCombos();
        });

        const label = document.createElement("span");
        label.textContent = `${combo.station1} + ${combo.station2}`;
        left.appendChild(checkbox);
        left.appendChild(label);

        // right: times input + stats
        const right = document.createElement("div");
        right.className = "times";

        const timeInput = document.createElement("input");
        timeInput.type = "number";
        timeInput.placeholder = "time (min)";
        timeInput.addEventListener("change", () => {
            const val = parseFloat(timeInput.value);
            if (!isNaN(val)) {
                combo.times.push(val);
                timeInput.value = "";
                renderCombos();
            }
        });

        const stats = document.createElement("span");
        stats.className = "stats-mini";

        if (combo.times.length > 0) {
            const fastest = Math.min(...combo.times);
            const slowest = Math.max(...combo.times);
            const avg = (combo.times.reduce((a,b)=>a+b,0)/combo.times.length).toFixed(1);
            stats.textContent = `Fastest: ${fastest} | Slowest: ${slowest} | Avg: ${avg}`;
            totalTime += avg*1; // sum averages for total estimated training time
        }

        if (!combo.done) remainingCount++;

        right.appendChild(timeInput);
        right.appendChild(stats);

        div.appendChild(left);
        div.appendChild(right);

        comboListDiv.appendChild(div);
    });

    // update overall stats
    totalCombosSpan.textContent = combos.length;
    remainingCombosSpan.textContent = remainingCount;
    totalTimeSpan.textContent = totalTime.toFixed(1);
}

// initial render
renderCombos();
