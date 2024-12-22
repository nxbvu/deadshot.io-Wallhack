// Tiefer Grafik-Analyzer
(() => {
    console.log('=== Tiefer Grafik-Scan Start ===');

    // Hilfsfunktion zum sicheren Abrufen von Objekteigenschaften
    function safeGet(obj, path) {
        try {
            return path.split('.').reduce((o, k) => o && o[k], obj);
        } catch (e) {
            return null;
        }
    }

    // Hilfsfunktion zum Scannen von Objekten nach bestimmten Eigenschaften
    function scanForProperties(obj, depth = 0, maxDepth = 3, path = '') {
        if (depth > maxDepth) return;
        
        Object.keys(obj || {}).forEach(key => {
            try {
                const value = obj[key];
                const newPath = path ? `${path}.${key}` : key;
                
                // Suche nach interessanten Eigenschaften
                if (key.toLowerCase().includes('gl') || 
                    key.toLowerCase().includes('canvas') || 
                    key.toLowerCase().includes('render') ||
                    key.toLowerCase().includes('shader') ||
                    key.toLowerCase().includes('material') ||
                    key.toLowerCase().includes('mesh')) {
                    
                    console.log(`Gefunden: ${newPath}`, value);
                }
                
                // Rekursiv weitersuchen
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    scanForProperties(value, depth + 1, maxDepth, newPath);
                }
            } catch (e) {}
        });
    }

    // Canvas Analysis
    const canvases = document.querySelectorAll('canvas');
    console.log(`\nGefundene Canvas-Elemente: ${canvases.length}`);
    
    canvases.forEach((canvas, index) => {
        console.log(`\n=== Canvas ${index + 1} ===`);
        console.log('Size:', canvas.width, 'x', canvas.height);
        console.log('Style:', getComputedStyle(canvas));
        console.log('Attribute:', Array.from(canvas.attributes).map(attr => `${attr.name}="${attr.value}"`));
        
        // WebGL Kontexte analysieren
        ['webgl2', 'webgl', 'experimental-webgl'].forEach(contextType => {
            try {
                const gl = canvas.getContext(contextType);
                if (gl) {
                    console.log(`\n${contextType.toUpperCase()} Kontext gefunden:`);
                    
                    // Basis Info
                    console.log('Renderer:', gl.getParameter(gl.RENDERER));
                    console.log('Vendor:', gl.getParameter(gl.VENDOR));
                    console.log('Version:', gl.getParameter(gl.VERSION));
                    console.log('Shading Language:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
                    
                    // Detaillierte WebGL Capabilities
                    const capabilities = [
                        'MAX_VERTEX_ATTRIBS',
                        'MAX_VARYING_VECTORS',
                        'MAX_VERTEX_UNIFORM_VECTORS',
                        'MAX_FRAGMENT_UNIFORM_VECTORS',
                        'MAX_TEXTURE_SIZE',
                        'MAX_CUBE_MAP_TEXTURE_SIZE',
                        'MAX_VIEWPORT_DIMS',
                        'MAX_TEXTURE_IMAGE_UNITS',
                        'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
                        'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
                        'MAX_RENDERBUFFER_SIZE'
                    ];
                    
                    console.log('\nWebGL Capabilities:');
                    capabilities.forEach(cap => {
                        try {
                            console.log(`${cap}:`, gl.getParameter(gl[cap]));
                        } catch (e) {}
                    });
                    
                    // Extensions
                    const extensions = gl.getSupportedExtensions();
                    console.log('\nVerfügbare Extensions:', extensions.length);
                    extensions.forEach(ext => {
                        const extension = gl.getExtension(ext);
                        if (extension) {
                            console.log(`- ${ext}`);
                            // Analysiere Extension-Eigenschaften
                            Object.keys(extension).forEach(key => {
                                console.log(`  ${key}:`, extension[key]);
                            });
                        }
                    });
                    
                    // Aktive Shader und Programme
                    console.log('\nAktive Shader & Programme:');
                    try {
                        const program = gl.getParameter(gl.CURRENT_PROGRAM);
                        if (program) {
                            console.log('Aktives Programm:', program);
                            // Attribute
                            const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
                            console.log('Active Attributes:', numAttribs);
                            for (let i = 0; i < numAttribs; i++) {
                                const attrib = gl.getActiveAttrib(program, i);
                                console.log(`- ${attrib.name}: ${attrib.type}`);
                            }
                            // Uniforms
                            const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
                            console.log('Active Uniforms:', numUniforms);
                            for (let i = 0; i < numUniforms; i++) {
                                const uniform = gl.getActiveUniform(program, i);
                                console.log(`- ${uniform.name}: ${uniform.type}`);
                            }
                        }
                    } catch (e) {
                        console.log('Fehler beim Shader-Scan:', e);
                    }
                }
            } catch (e) {
                console.log(`Fehler beim ${contextType} Kontext:`, e);
            }
        });
    });

    // 3D Engines Detection
    console.log('\n=== 3D Engine Detection ===');
    const engines = {
        'Three.js': () => {
            const hasThree = typeof THREE !== 'undefined';
            if (hasThree) {
                console.log('Three.js Version:', THREE.REVISION);
                // Scanne Three.js Szene
                Object.keys(window).forEach(key => {
                    const obj = window[key];
                    if (obj && obj.isScene) {
                        console.log('Three.js Szene gefunden:', key);
                        console.log('Objekte in Szene:', obj.children.length);
                        obj.children.forEach(child => {
                            console.log(`- ${child.type}:`, child);
                        });
                    }
                });
            }
            return hasThree;
        },
        'Babylon.js': () => {
            const hasBabylon = typeof BABYLON !== 'undefined';
            if (hasBabylon) {
                console.log('Babylon.js Version:', BABYLON.Engine.Version);
                if (BABYLON.Engine.Scenes) {
                    console.log('Aktive Szenen:', BABYLON.Engine.Scenes.length);
                }
            }
            return hasBabylon;
        },
        'PlayCanvas': () => {
            const hasPlayCanvas = typeof pc !== 'undefined';
            if (hasPlayCanvas && pc.version) {
                console.log('PlayCanvas Version:', pc.version);
            }
            return hasPlayCanvas;
        },
        'Unity': () => {
            const hasUnity = typeof unityInstance !== 'undefined';
            if (hasUnity) {
                console.log('Unity WebGL Instance gefunden');
                scanForProperties(unityInstance);
            }
            return hasUnity;
        },
        'Pixi.js': () => {
            const hasPixi = typeof PIXI !== 'undefined';
            if (hasPixi) {
                console.log('Pixi.js Version:', PIXI.VERSION);
            }
            return hasPixi;
        },
        'Phaser': () => {
            const hasPhaser = typeof Phaser !== 'undefined';
            if (hasPhaser) {
                console.log('Phaser Version:', Phaser.VERSION);
            }
            return hasPhaser;
        }
    };

    console.log('\nEngine Detection Ergebnisse:');
    Object.entries(engines).forEach(([name, detector]) => {
        try {
            if (detector()) {
                console.log(`✓ ${name} gefunden`);
            }
        } catch (e) {}
    });

    // Shader Sammlung
    console.log('\n=== Shader Sammlung ===');
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.type === 'x-shader/x-vertex' || 
            script.type === 'x-shader/x-fragment' ||
            script.type.includes('shader')) {
            console.log('Shader gefunden:', script.type);
            console.log(script.textContent);
        }
    });

    // WebGL Debugging Info
    console.log('\n=== WebGL Debug Info ===');
    const debugInfo = window.WebGLDebugUtils || window.WebGLDebugRenderer;
    if (debugInfo) {
        console.log('WebGL Debug Utils gefunden');
        scanForProperties(debugInfo);
    }

    // Performance Info
    console.log('\n=== Performance Info ===');
    if (window.performance) {
        const perfEntries = performance.getEntriesByType('resource');
        const glResources = perfEntries.filter(entry => 
            entry.name.includes('.glsl') || 
            entry.name.includes('shader') || 
            entry.name.includes('webgl')
        );
        console.log('WebGL-bezogene Performance Einträge:', glResources);
    }

    // GPU Info
    console.log('\n=== GPU Info ===');
    if (navigator.gpu) {
        console.log('WebGPU verfügbar');
        scanForProperties(navigator.gpu);
    }

    // Globale WebGL-bezogene Objekte
    console.log('\n=== Globale WebGL Objekte ===');
    const globalWebGLObjects = Object.keys(window).filter(key => 
        key.toLowerCase().includes('gl') || 
        key.toLowerCase().includes('webgl') ||
        key.toLowerCase().includes('canvas') ||
        key.toLowerCase().includes('render')
    );
    console.log('Gefundene globale WebGL-Objekte:', globalWebGLObjects);

    console.log('\n=== Tiefer Grafik-Scan Ende ===');
})();
