function process(domCanvasOutputID, frameData) {
    let low = new cv.Mat(frameData.src.rows, frameData.src.cols, frameData.src.type(), [0, 0, 0, 0]);
    let high = new cv.Mat(frameData.src.rows, frameData.src.cols, frameData.src.type(), [25, 5.1 * 255, 5.05 * 255, 255]);

    cv.inRange(frameData.src, low, high, frameData.dst);

    // Blit
    cv.imshow(domCanvasOutputID, frameData.dst);
    
    // Tidy up
    low.delete();
    high.delete();
}


exampleList[4] = new function () {
    return {
        begin:   ()=>{},
        release: ()=>{},
        destroy: ()=>{},
        process
    }
}

