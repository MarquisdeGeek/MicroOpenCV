
function process(domCanvasOutputID, frameData) {
    cv.cvtColor(frameData.src, frameData.src, cv.COLOR_RGB2GRAY, 0);
    cv.Canny(frameData.src, frameData.dst, 50, 100, 3, false);

    // Blit
    cv.imshow(domCanvasOutputID, frameData.dst);
}


exampleList[2] = new function () {
    return {
        begin:   ()=>{},
        release: ()=>{},
        destroy: ()=>{},
        process
    }
}
