
(function detectTechnologies() {
    const technologies = {
        frameworks: [],
        graphics: [],
        other: []
    };

    // Three.js Erkennung
    if (window.THREE || document.querySelector('script[src*="three.js"]')) {
        technologies.graphics.push('Three.js');
    }

    // WebGL Erkennung
    try {
        const canvas = document.createElement('canvas');
        if (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) {
            technologies.graphics.push('WebGL');
        }
    } catch (e) {}

    // WebAssembly Erkennung
    if (typeof WebAssembly === 'object') {
        technologies.other.push('WebAssembly Support verfügbar');
    }

    // Unity Erkennung
    if (window.unityInstance || document.querySelector('canvas[id*="unity"]')) {
        technologies.frameworks.push('Unity');
    }

    // Babylon.js Erkennung
    if (window.BABYLON) {
        technologies.graphics.push('Babylon.js');
    }

    // Phaser Erkennung
    if (window.Phaser) {
        technologies.frameworks.push('Phaser');
    }

    // Canvas Erkennung
    if (document.querySelector('canvas')) {
        technologies.graphics.push('Canvas');
    }

    // Scripts analysieren
    const scripts = Array.from(document.getElementsByTagName('script'));
    const scriptSources = scripts.map(script => script.src).join(' ');
    
    if (scriptSources.includes('pixi.js')) technologies.graphics.push('Pixi.js');
    if (scriptSources.includes('matter.js')) technologies.other.push('Matter.js (Physics)');
    if (scriptSources.includes('socket.io')) technologies.other.push('Socket.IO');

    // Ausgabe der Ergebnisse
    console.log('%cGefundene Technologien:', 'font-weight: bold; font-size: 14px; color: #4CAF50;');
    for (let category in technologies) {
        if (technologies[category].length > 0) {
            console.log(`\n${category}:`);
            technologies[category].forEach(tech => console.log(`- ${tech}`));
        }
    }

    // Zusätzliche WebGL Info
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
        console.log('\nWebGL Details:');
        console.log('Renderer:', gl.getParameter(gl.RENDERER));
        console.log('Vendor:', gl.getParameter(gl.VENDOR));
        console.log('Version:', gl.getParameter(gl.VERSION));
    }

    return technologies;
})();
