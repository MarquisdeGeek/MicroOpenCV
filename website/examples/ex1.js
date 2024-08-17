// https://docs.opencv.org/4.x/dd/d52/tutorial_js_geometric_transformations.html

function process(domCanvasOutputID, frameData) {
    let dsize = new cv.Size(300, 300);

    let srcTri = cv.matFromArray(3, 1, cv.CV_32FC2, [0, 0, 0, 1, 1, 0]);
    let dstTri = cv.matFromArray(3, 1, cv.CV_32FC2, [0.6, 0.2, 0.1, 1.3, 1.5, 0.3]);

    let M = cv.getAffineTransform(srcTri, dstTri);

    cv.warpAffine(frameData.src, frameData.dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    // Blit
    cv.imshow(domCanvasOutputID, frameData.dst);

    // Tidy up
    delete dsize;
}


exampleList[1] = new function () {
    return {
        begin:   ()=>{},
        release: ()=>{},
        destroy: ()=>{},
        process
    }
}
