// Configuration
const CONFIG = {
    totalPools: 150, // Reduced from 400 for a cleaner visual on standard monitors
    hexPerRow: 15,
    servers: 40,
    organizations: ["AEROSPACE", "COMPUTING", "AUTOMOTIVE", "R&D", "FINANCE"]
};

let denialCount = 0;

// 1. Initialize Infrastructure Sidebar
function initInfrastructure() {
    const stack = document.getElementById('server-stack');
    for (let i = 0; i < CONFIG.servers; i++) {
        const server = document.createElement('div');
        server.className = 'server-node';
        server.id = `server-${i}`;
        stack.appendChild(server);
    }
}

// 2. Initialize Core Matrix (Hex Grid)
function initHexGrid() {
    const grid = document.getElementById('hex-grid');
    let poolsCreated = 0;
    
    while (poolsCreated < CONFIG.totalPools) {
        const row = document.createElement('div');
        row.className = 'hex-row';
        
        for (let i = 0; i < CONFIG.hexPerRow && poolsCreated < CONFIG.totalPools; i++) {
            const hex = document.createElement('div');
            hex.className = 'hex';
            hex.id = `pool-${poolsCreated}`;
            row.appendChild(hex);
            poolsCreated++;
        }
        grid.appendChild(row);
    }
}

// 3. Initialize Organizational Flow
function initFlows() {
    const flowContainer = document.getElementById('org-flows');
    CONFIG.organizations.forEach(org => {
        const track = document.createElement('div');
        track.className = 'flow-track';
        track.innerHTML = `
            <div class="flow-fill" id="flow-${org}" style="width: 10%;"></div>
            <div class="flow-label">${org}</div>
        `;
        flowContainer.appendChild(track);
    });
}

// 4. The Telemetry Simulation Loop
function simulateTelemetry() {
    // Randomly update a few Hex nodes
    for(let i=0; i < 5; i++) {
        const randomPoolId = Math.floor(Math.random() * CONFIG.totalPools);
        const hex = document.getElementById(`pool-${randomPoolId}`);
        const stateRoll = Math.random();

        // Reset class
        hex.className = 'hex'; 
        
        if (stateRoll > 0.98) {
            hex.classList.add('state-critical');
            denialCount += Math.floor(Math.random() * 3);
            document.getElementById('denial-counter').innerText = denialCount;
        } else if (stateRoll > 0.90) {
            hex.classList.add('state-amber');
        } else if (stateRoll > 0.40) {
            hex.classList.add('state-nominal'); // Active load
        } 
        // Below 0.4 stays dim (idle)
    }

    // Randomly flash a server infrastructure node
    const randomServerId = Math.floor(Math.random() * CONFIG.servers);
    const server = document.getElementById(`server-${randomServerId}`);
    const serverRoll = Math.random();
    
    if (serverRoll > 0.95) {
        server.style.backgroundColor = 'var(--state-critical)';
        setTimeout(() => server.style.backgroundColor = 'var(--state-nominal-dim)', 2000);
    } else if (serverRoll > 0.8) {
         server.style.backgroundColor = 'var(--state-amber)';
         setTimeout(() => server.style.backgroundColor = 'var(--state-nominal-dim)', 1000);
    }

    // Fluctuate Budgetary Flows
    CONFIG.organizations.forEach(org => {
        const currentWidth = parseFloat(document.getElementById(`flow-${org}`).style.width);
        const fluctuation = (Math.random() * 10) - 5; // -5% to +5%
        let newWidth = currentWidth + fluctuation;
        if (newWidth < 5) newWidth = 5;
        if (newWidth > 95) newWidth = 95;
        document.getElementById(`flow-${org}`).style.width = `${newWidth}%`;
    });
}

// Boot Sequence
window.onload = () => {
    initInfrastructure();
    initHexGrid();
    initFlows();
    
    // Pulse the system every 800ms
    setInterval(simulateTelemetry, 800);
};
