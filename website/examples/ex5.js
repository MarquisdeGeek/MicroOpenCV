// contours
// https://docs.opencv.org/4.x/d5/daa/tutorial_js_contours_begin.html

function process(domCanvasOutputID, frameData) {
    // Reduce the colour space
    let src = cv.imread(frameData.canvasID);
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);

    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 90, 250, cv.THRESH_BINARY);
    cv.imshow(frameData.canvasID, src);

    // Then search for contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    // And draw them
    let rectangleColor = new cv.Scalar(255, 0, 0);
    let contoursColor = new cv.Scalar(255, 255, 255);

    let count = contours.size();
    for(let i=0;i<count;++i) {
      let cnt = contours.get(i);

      // You can try more different parameters
      let rect = cv.boundingRect(cnt);
      cv.drawContours(dst, contours, 0, contoursColor, 1, 8, hierarchy, 100);

      let point1 = new cv.Point(rect.x, rect.y);
      let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
      cv.rectangle(dst, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);

      // Free this resource
      cnt.delete();
    }

    // Blit
    cv.imshow(domCanvasOutputID, dst);

    // We used our own src/dst, so remember to free them
    src.delete();
    dst.delete(); 

    // Standard tidy up
    contours.delete();
    hierarchy.delete(); 
}


exampleList[5] = new function () {
    return {
        begin:   ()=>{},
        release: ()=>{},
        destroy: ()=>{},
        process
    }
}
