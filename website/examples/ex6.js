// https://docs.opencv.org/4.x/dd/dfc/tutorial_js_grabcut.html

function process(domCanvasOutputID, frameData) {
    cv.cvtColor(frameData.src, frameData.src, cv.COLOR_RGBA2RGB, 0);

    let mask = new cv.Mat();
    let bgdModel = new cv.Mat();
    let fgdModel = new cv.Mat();
    let rect = new cv.Rect(50, 10, 200, 150);

    cv.grabCut(frameData.src, mask, rect, bgdModel, fgdModel, 1, cv.GC_INIT_WITH_RECT);

    // draw foreground
    for (let i = 0; i < frameData.src.rows; i++) {
        for (let j = 0; j < frameData.src.cols; j++) {
            if (mask.ucharPtr(i, j)[0] == 0 || mask.ucharPtr(i, j)[0] == 2) {
                frameData.src.ucharPtr(i, j)[0] = 0;
                frameData.src.ucharPtr(i, j)[1] = 0;
                frameData.src.ucharPtr(i, j)[2] = 0;
            }
        }
    }

    // draw grab rect
    let color = new cv.Scalar(0, 0, 255);
    let point1 = new cv.Point(rect.x, rect.y);
    let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
    cv.rectangle(frameData.src, point1, point2, color);
    

    // Blit
    cv.imshow(domCanvasOutputID, frameData.src);

    // Tidy up
    mask.delete();
    bgdModel.delete();
    fgdModel.delete();
}


exampleList[6] = new function () {
    return {
        begin:   ()=>{},
        release: ()=>{},
        destroy: ()=>{},
        process
    }
}
