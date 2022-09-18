const manifestUri = 'https://mxlivechannelsvosdash.clarovideo.com/Content/DASH_DASH_FK/Live/Channel(CLARO_SPORTS_MX_HD)/manifest.mpd';
const serverUrl = 'https://widevine-claroglobal-vod.clarovideo.net/licenser/getlicense?user_id=';
const certificateUrl = "https://widevine-claroglobal-vod.clarovideo.net/licenser/getcertificate";

let serverCertificate = null;

function initApp() {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        initPlayer();
    } else {
        // This browser does not have the minimum set of APIs we need.
        console.error('Browser not supported!');
    }
}
async function initPlayer() {
    // Create a Player instance.
    const video = document.getElementById('video');
    const player = new shaka.Player(video);

    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    // Listen for error events.
    player.addEventListener('error', onErrorEvent);

    player.configure({
        drm: {
            servers: {
                'com.widevine.alpha': 'http://127.0.0.1/cocoa/KSBN/dashwv.php',
            },
            // advanced: {
            //     'com.widevine.alpha': {
            //         serverCertificateUri: certificateUrl,
            //         audioRobustness: "SW_SECURE_CRYPTO",
            //         distinctiveIdentifierRequired: false,
            //         persistentStateRequired: false,
            //         videoRobustness: "SW_SECURE_CRYPTO"
            //     }
            // }
        }
    });

    // player.getNetworkingEngine().registerRequestFilter(function (type, request) {
    //     // Alias some utilities provided by the library.
    //     const StringUtils = shaka.util.StringUtils;
    //     const Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;

    //     // Only manipulate license requests:
    //     if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
    //         // Create the wrapped request structure.
    //         const wrapped = {};

    //         // Encode the raw license request in base64.
    //         // The server we are using in this tutorial expects this field and this
    //         // encoding for the raw request.
    //         // wrapped.rawLicenseRequestBase64 =Uint8ArrayUtils.toBase64(new Uint8Array(request.body));

    //         // Add whatever else we want to communicate to the server.
    //         // None of these values are read by the server we are using in this
    //         // tutorial.
    //         // In practice, you would send what the server needs and the server would
    //         // react to it.
    //         wrapped.token = '2554f40b35e41519929a90bd68aba7e7';
    //         wrapped.device_id = '693e9af84d3dfcc71e640e005bdc5e2e';
    //         wrapped.widevineBody = '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';

    //         // Encode the wrapped request as JSON.
    //         const wrappedJson = JSON.stringify(wrapped);
    //         // Convert the JSON string back into an ArrayBuffer to replace the request
    //         request.body = StringUtils.toUTF8(wrappedJson);
    //     }
    // });

    // player.getNetworkingEngine().registerResponseFilter(function(type, response) {
    //     // Alias some utilities provided by the library.
    //     const StringUtils = shaka.util.StringUtils;
    //     const Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;
  
    //     // Only manipulate license responses:
    //     if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
    //       const wrappedString = Uint8ArrayUtils.toBase64(new Uint8Array(response.data));
    //       response.data = new ArrayBuffer(response.data);
    //     }
    //   });

    // Try to load a manifest.
    // This is an asynchronous process.
    try {
        await player.load(manifestUri);
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');
    } catch (e) {
        // onError is executed if the asynchronous load fails.
        onError(e);
    }
}

function onErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    onError(event.detail);
}

function onError(error) {
    // Log the error.
    console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);