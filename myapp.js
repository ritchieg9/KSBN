const manifestUri = 'https://mxlivechannelsvosdash.clarovideo.com/Content/DASH_DASH_FK/Live/Channel(CLARO_SPORTS_MX_HD)/manifest.mpd';
const serverUrl = 'https://widevine-claroglobal-vod.clarovideo.net/licenser/getlicense';
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
                'com.widevine.alpha': serverUrl,
            },
            advanced: {
                'com.widevine.alpha': {
                    serverCertificateUri: certificateUrl,
                    // serverCertificate: "CrYCCAMSEHL+DSD08domI9jFJXcARnk YtpOAqgUijgIwggEKAoIBAQDEG8PxTwiALyDHGvKZjJxo7G6+X KHnjV4p2F+TvUng79fyRvk8rpEjl4k+V4V4YIfEIh2ZirIE3J8 kCsNWvkdX3ZAsUVrEBf2mzpGTfsMGWsLbVPCMutqR/eLGpI2mAwkdyTEhoGsvDXv0ty5Q+z1YccFHyfNPVUfkEsYT8ky R/9f+gNvxWSNQcKfbM3DBhZNkvH3msCZnvGIZl/HvLU8hfe8ycMRExXKwVlpaCbe/0wMEanq38ENMhKJSrtWGQbFFMSMOyEWQwqhP0yY+zl4wQ+AC6V A5rVlegSa2u8+yGKTZwlLScQ/vd/y9p8vQEBDMAC5RP9hH8NfH6RaxovozAgMBAAE6CWRsYXR2Lm5l dBKAA2S7G3l4ei75sFFlhp5nFe8Vj/F8y4/0WNsliYzeEwFkZnrQS2ikJcgV7mPAre3i+TT07opXOJOSjkBk1 8G2/YOwK3DSXK2EpGCBEWOnncpPI2aHoy0zGvH8tdbGaMplYivD3ag R14LVsQUx0YI3hO09OrUMscqgUonjEn3/TTgooLRRGtshRBqIcp0Ob/Cv3Dc6ech61j1/lK+8Lnt7U5Rzy0lCtbEqLXWL2QdoEMoROJ70Vkvv3SshpEtzn6 5yA87o2mkSRK1yZG7xk1IWQ+VOpXIgHrR8icsVaSvlK85L984Z iv8xFsp/cCqTMxBZplFviYv4Tkzv2H09qfg3OmeDfUWxg+u5YKJik9bu2i WFyBju/AQRfkUqvWaknV0sNm6keZmgVUe25k7H22hID4LuLxTTJcGPIJ1 ZJayXYa/YE9ZnryqTgUyjawCIXS0+X4OaLs6FA2x0eXWQL6rjdutfts3m2 vHySEn27730deLw86AxB78jcir7jhXNXvGzCQ=="
                }
            }
        }
    });

    player.getNetworkingEngine().registerRequestFilter(function(type, request) {
        // Alias some utilities provided by the library.
        const StringUtils = shaka.util.StringUtils;
        const Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;
    
        // Only manipulate license requests:
        if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
          // Create the wrapped request structure.
          const wrapped = {};
    
          // Encode the raw license request in base64.
          // The server we are using in this tutorial expects this field and this
          // encoding for the raw request.
          // wrapped.rawLicenseRequestBase64 =Uint8ArrayUtils.toBase64(new Uint8Array(request.body));
    
          // Add whatever else we want to communicate to the server.
          // None of these values are read by the server we are using in this
          // tutorial.
          // In practice, you would send what the server needs and the server would
          // react to it.
          wrapped.token = 'd42ef14fd05d69f14984b441fa3c78e0';
          wrapped.device_id = '693e9af84d3dfcc71e640e005bdc5e2e';
          wrapped.widevineBody = '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';
    
          // Encode the wrapped request as JSON.
          const wrappedJson = JSON.stringify(wrapped);
          // Convert the JSON string back into an ArrayBuffer to replace the request
          // body.
          request.body = StringUtils.toUTF8(wrappedJson);
        }
      });

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