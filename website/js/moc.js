function MicroOpenCV(cv, domVideoInputID, domCanvasProcessingID) {
let elementVideo; // TODO: was video
let video_mat_src;
let video_mat_dst;
let video_cap;
let domCanvasWorkingID;

    (function ctor() {
        elementVideo = document.getElementById(domVideoInputID);
        video_mat_src = new cv.Mat(elementVideo.height, elementVideo.width, cv.CV_8UC4);
        video_mat_dst = new cv.Mat(elementVideo.height, elementVideo.width, cv.CV_8UC1);
        video_cap = new cv.VideoCapture(elementVideo);

        // Did the user supply their own canvas element?
        if (domCanvasProcessingID) {
            // If so, use it.
            domCanvasWorkingID = domCanvasProcessingID;
        } else {
            // Otherwise, create our own, and add to body invisibly

            const canvas = document.createElement('canvas');

            canvas.id = domCanvasWorkingID = "domMicroOpenCVCanvas";
            canvas.width = 600;
            canvas.height = 600;
            canvas.style.visibility= 'hidden';
            
            const body = document.getElementsByTagName("body")[0];
            body.appendChild(canvas);
        }

    })();


    async function streamVideoStart() {
        try {
            const constraints = {'video': true, 'audio': false};
            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            elementVideo.srcObject = stream;
            elementVideo.play();
        } catch(error) {
            console.error('Error opening video camera.', error);
        }
    }


    async function streamVideoStop() {
        elementVideo.stop();
    }


    function processingFrameStart() {
        // Bring in a new video image, that we can later manipulate/change
        video_cap.read(video_mat_src)

        // Fix the colour type to RGBA
        cv.cvtColor(video_mat_src, video_mat_dst, cv.COLOR_RGBA2RGB);

        // Render video stream image to a canvas, as all manipulations take place from a canvas
        cv.imshow(domCanvasWorkingID, video_mat_dst);

        // Set up some standard objects
        return {
            src:      cv.imread(domCanvasWorkingID),
            dst:      new cv.Mat(),
            canvasID: domCanvasWorkingID,
            begin:    Date.now()
        }
    }


    function processingFrameEnd(frameData) {
        frameData.src && frameData.src.delete();
        frameData.dst && frameData.dst.delete();
    }


    function getTimeoutDelay(frameData, fps) {
        let delay = 1000/fps - (Date.now() - frameData.begin);
    }


    function loadCascadeClassifier(path, url) {
        // path: string to access loaded file trough cv
        // url: path of the actual file on your FS
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = function(ev) {
                request = this;
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        let data = new Uint8Array(request.response);
                        cv.FS_createDataFile('/', path, data, true, false, false);

                        const cascade = new cv.CascadeClassifier();
                        cascade.load(path);

                        resolve(cascade, path, url);
                    } else {
                        console.error('Failed to load ' + url + ' status: ' + request.status);
                        reject(path, url);
                    }
                }
            };
            //
            request.send();
        });
    }

    return {
        streamVideoStart,
        streamVideoStop,

        processingFrameStart,
        processingFrameEnd,

        getTimeoutDelay,

        loadCascadeClassifier,
    }
}
