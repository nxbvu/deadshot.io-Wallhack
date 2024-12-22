(() => {
    const canvas = document.querySelectorAll('canvas')[6];
    const gl = canvas.getContext('webgl2', {
        preserveDrawingBuffer: true
    });

    const MIN_PLAYER_VERTS = 100;
    const MAX_PLAYER_VERTS = 3000;

    gl.drawArrays = function() {
        const vertCount = arguments[2];
        if (vertCount >= MIN_PLAYER_VERTS && vertCount <= MAX_PLAYER_VERTS) {
            gl.disable(gl.DEPTH_TEST);
            gl.lineWidth(20.0);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE);
            return gl.drawArrays.apply(gl, [gl.LINE_STRIP, ...Array.prototype.slice.call(arguments, 1)]);
        }
        return gl.drawArrays.apply(gl, arguments);
    };

    gl.clear = function() {
        return;
    };

    setInterval(() => {
        gl.disable(gl.DEPTH_TEST);
    }, 1);
})();