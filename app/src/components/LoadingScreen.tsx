import { HStack, VStack } from 'reaction';
import defaultIcon from '../resources/images/icons/logo-alt.png';
import { useState } from 'react';

interface LoadingScreenProps {
    title: string;
    message?: string;
    icon?: string;
}

function LoadingScreen(props: LoadingScreenProps) {
    return (
        <VStack>
            <img src={props.icon ?? defaultIcon} alt={props.title} />
            <LoadingBar progress={0} />
        </VStack>
    );
}

function LoadingBar(props: { progress: number }) {
    return (
        <HStack>
            <div style={{ width: `${props.progress}%` }}></div>
        </HStack>
    );
}

function useLoadingScreen(props: LoadingScreenProps): [JSX.Element | undefined, () => void] {
    const [showing, setShowing] = useState(true);
    const screen = showing ? <LoadingScreen {...props} /> : undefined;
    const close = () => setShowing(false);
    return [screen, close];
}

function useWaitForImagesToLoad(callback: () => void) {
    // Images loaded is zero because we're going to process a new set of images.
    var imagesLoaded = 0;
    // Total images is still the total number of <img> elements on the page.
    var totalImages = document.querySelectorAll('img').length;

    // Step through each image in the DOM, clone it, attach an onload event
    // listener, then set its source to the source of the original image. When
    // that new image has loaded, fire the imageLoaded() callback.
    document.querySelectorAll('img').forEach(img => {
        const mock = document.createElement('img');
        mock.onload = imageLoaded;
        mock.src = img.src;
    });

    // Do exactly as we had before -- increment the loaded count and if all are
    // loaded, call the allImagesLoaded() function.
    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) callback();
    }
}

export { useLoadingScreen, useWaitForImagesToLoad };
