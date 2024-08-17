// Blur
// https://docs.opencv.org/4.x/d7/dd0/tutorial_js_thresholding.html
// https://docs.opencv.org/4.x/dd/d6a/tutorial_js_filtering.html

function process(domCanvasOutputID, frameData) {
    let dsize = new cv.Size(300, 300);
    let blurType = 0;

    // You can try more different parameters
    // cv.threshold(src, dst, 77, 200, cv.THRESH_BINARY);
    // NOT SUPPORTED!?!?!
    // cv.adaptiveThreshold(src, dst, 200, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 3, 2);


    // Matrix filtering:

    // https://docs.opencv.org/4.x/d3/d63/classcv_1_1Mat.html
    // Not all given CV_ matrices are available
    let anchor = new cv.Point(-1, -1);
    let M = cv.Mat.eye(3, 3, cv.CV_32FC1);

    let ksize = new cv.Size(3, 3); // larger matrix sizes increase pixels to be averaged

    switch(blurType) {
        case 0:
            // Blur, with builtin
            // You can try more different parameters
            cv.blur(frameData.src, frameData.dst, ksize, anchor, cv.BORDER_DEFAULT);
            break;

        case 1:
            cv.GaussianBlur(frameData.src, frameData.dst, ksize, 0, 0, cv.BORDER_DEFAULT);
            break;
    
        case 2:
            // Replaced colour is always one of those in the area
            cv.medianBlur(frameData.src, frameData.dst, 15);
            break;
    
    
    }

    /*
    WIP: Experiments
    cv.bilateralFilter (frameData.src, frameData.dst, d, sigmaColor, sigmaSpace, borderType = cv.BORDER_DEFAULT)

    For simplicity, you can set the 2 sigma values to be the same. If they are small (< 10), the filter 
    will not have much effect, whereas if they are large (> 150), they will have a very strong effect, 
    making the image look "cartoonish". Large filters (d > 5) are very slow, so it is recommended 
    to use d=5 for real-time applications, and perhaps d=9 for offline applications that need heavy 
    noise filtering.
    */
    // FAILS:
    // cv.bilateralFilter(frameData.src, frameData.dst, 5, 25, 25, cv.BORDER_DEFAULT);


    // Blit
    cv.imshow(domCanvasOutputID, frameData.dst);

    // Tidy up
    delete dsize;
    delete anchor;
}


exampleList[3] = new function () {
    return {
        begin:   ()=>{},
        release: ()=>{},
        destroy: ()=>{},
        process
    }
}
