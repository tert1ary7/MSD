// --- System Configuration ---
const ORGS = [
    { name: "AEROSPACE", color: "#00e5ff" },
    { name: "AUTOMOTIVE", color: "#ffea00" },
    { name: "COMPUTING", color: "#b000ff" },
    { name: "R&D", color: "#00ff2a" },
    { name: "FINANCE", color: "#ff8800" }
];

const PRODUCTS = ["MATLAB", "AUTOCAD", "MAYA", "SOLIDWORKS", "ANSYS", "CATIA", "FLEXLM_CORE", "RLM_BASE"];
const TOTAL_TRIADS = 120; // 120 Triads = 360 individual hexes (120 per Data Center)

let systemTriads = [];
let denialCount = 0;

// --- 1. Data Generation ---
function generateTopology() {
    for (let i = 0; i < TOTAL_TRIADS; i++) {
        const org = ORGS[Math.floor(Math.random() * ORGS.length)];
        const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        
        systemTriads.push({
            id: `triad-${i}`,
            product: product,
            org: org.name,
            color: org.color,
            searchTag: `${product} ${org.name}`.toLowerCase()
        });
    }
}

// --- 2. DOM Rendering ---
function renderInfrastructure() {
    const stack = document.getElementById('server-stack');
    for (let i = 0; i < 60; i++) {
        const server = document.createElement('div');
        server.className = 'server-node';
        server.id = `host-${i}`;
        stack.appendChild(server);
    }
}

function renderMatrix() {
    const lanes = [
        document.getElementById('lane-grid-1'),
        document.getElementById('lane-grid-2'),
        document.getElementById('lane-grid-3')
    ];

    systemTriads.forEach(triad => {
        // Drop one leg of the triad into each Data Center
        lanes.forEach((lane, dcIndex) => {
            const hexContainer = document.createElement('div');
            hexContainer.className = 'hex-container';
            hexContainer.dataset.triadId = triad.id;
            hexContainer.dataset.search = triad.searchTag;
            // Apply Ownership Halo
            hexContainer.style.filter = `drop-shadow(0 0 3px ${triad.color})`;

            const hex = document.createElement('div');
            hex.className = 'hex';
            hex.id = `${triad.id}-leg-${dcIndex}`;

            // Interaction: Hovering over one leg highlights the entire triad
            hexContainer.addEventListener('mouseenter', () => highlightTriad(triad.id, true));
            hexContainer.addEventListener('mouseleave', () => highlightTriad(triad.id, false));

            hexContainer.appendChild(hex);
            lane.appendChild(hexContainer);
        });
    });
}

function renderLegend() {
    const flowBars = document.getElementById('org-flows');
    ORGS.forEach(org => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `<div class="legend-color" style="box-shadow: 0 0 10px ${org.color}; background-color: ${org.color}"></div> ${org.name}`;
        flowBars.appendChild(item);
    });
}

// --- 3. Interactions & Telemetry ---
function highlightTriad(triadId, active) {
    const nodes = document.querySelectorAll(`[data-triad-id="${triadId}"]`);
    nodes.forEach(node => {
        if (active) node.classList.add('highlight-triad');
        else node.classList.remove('highlight-triad');
    });
}

function setupSearchFilter() {
    const filterInput = document.getElementById('asset-filter');
    filterInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const allNodes = document.querySelectorAll('.hex-container');
        
        allNodes.forEach(node => {
            if (term === '') {
                node.classList.remove('dimmed');
            } else if (!node.dataset.search.includes(term)) {
                node.classList.add('dimmed');
            } else {
                node.classList.remove('dimmed');
            }
        });
    });
}

function simulateTelemetry() {
    // 1. Simulate Asset Saturation/Failures
    for(let i=0; i < 6; i++) {
        const randomTriad = systemTriads[Math.floor(Math.random() * systemTriads.length)];
        const randomLeg = Math.floor(Math.random() * 3);
        const hex = document.getElementById(`${randomTriad.id}-leg-${randomLeg}`);
        
        const stateRoll = Math.random();
        hex.className = 'hex'; // Reset
        
        if (stateRoll > 0.98) {
            hex.classList.add('state-critical');
            denialCount++;
            document.getElementById('denial-counter').innerText = denialCount;
        } else if (stateRoll > 0.90) {
            hex.classList.add('state-amber');
        } else if (stateRoll > 0.30) {
            hex.classList.add('state-nominal'); // Active processing
        }
    }

    // 2. Simulate Host Infrastructure Spikes
    const randomHostId = Math.floor(Math.random() * 60);
    const server = document.getElementById(`host-${randomHostId}`);
    if (Math.random() > 0.9) {
        server.style.backgroundColor = 'var(--state-amber)';
        setTimeout(() => server.style.backgroundColor = 'var(--state-nominal-dim)', 1500);
    }
}

// --- Boot Sequence ---
window.onload = () => {
    generateTopology();
    renderInfrastructure();
    renderMatrix();
    renderLegend();
    setupSearchFilter();
    
    // Pulse the system
    setInterval(simulateTelemetry, 800);
};
