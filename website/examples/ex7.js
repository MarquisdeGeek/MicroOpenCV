let faceCascade = null;
let eyeCascade = null;
let isLoadingUnderway = false;

function begin(moc) {
    // A quick check to eliminate extraneous requests for the button bashes who keep
    // recalling begin()
    if (isLoadingUnderway) {
        return;
    }

    isLoadingUnderway = true;

    let urlFace = 'https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml';
    let xmlFace = 'haarcascade_frontalface_default.xml';

    moc.loadCascadeClassifier(xmlFace, urlFace)
    .then((cascade) => {
        faceCascade = cascade;
    })
    .then(() => {
        let urlEyes = 'https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_eye.xml';
        let xmlEyes = 'haarcascade_eye.xml';

        return moc.loadCascadeClassifier(xmlEyes, urlEyes)
    })
    .then((cascade) => {
        eyeCascade = cascade;
    })
}


function process(domCanvasOutputID, frameData) {
    if (!faceCascade || !eyeCascade) {
        return;
    } else if (faceCascade.empty() || eyeCascade.empty()) {
        return;
    }


    let gray = new cv.Mat();
    let faces = new cv.RectVector();
    let eyes = new cv.RectVector();

    frameData.src.copyTo(frameData.dst);

    cv.cvtColor(frameData.dst, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.imshow(frameData.canvasID, gray);

    // detect faces.
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0);

    let matMarkers = frameData.src;
    for (let i = 0; i < faces.size(); ++i) {
        let roiGray = gray.roi(faces.get(i));
        let roiSrc = matMarkers.roi(faces.get(i));
        let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
        let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
                                  faces.get(i).y + faces.get(i).height);
        cv.rectangle(matMarkers, point1, point2, [255, 0, 0, 255]);
        
        // detect eyes in face ROI
        eyeCascade.detectMultiScale(roiGray, eyes);
        for (let j = 0; j < eyes.size(); ++j) {
            let point1 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
            let point2 = new cv.Point(eyes.get(j).x + eyes.get(j).width,
                                      eyes.get(j).y + eyes.get(j).height);
            cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255]);
        }

        roiGray.delete();
        roiSrc.delete();
    }

    
    // Blit
    cv.imshow(domCanvasOutputID, matMarkers);

    // Tidy up
    gray.delete();
    faces.delete();   
}


function release() {
    // Don't delete the cascades here, as avoiding the time to re-load is of greater benefit than the
    // memory saved by releasing them.
}


function destroy() {
    delete faceCascade;
    delete eyeCascade;

    isLoadingUnderway = false;
}


exampleList[7] = new function() {
    return {
        begin,
        release:
        destroy,
        process
    }
}
