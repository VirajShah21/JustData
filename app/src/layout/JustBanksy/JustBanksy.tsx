import { albumsOutline, imagesOutline } from 'ionicons/icons';
import { useState } from 'react';
import { HStack } from 'reaction';
import logo from 'src/assets/images/icons/Just Banksy.png';
import Sidebar, { SidebarNavigationButton } from 'src/components/ui/Sidebar';
import ImageGenerator from './ImageGenerator';
import './JustBanksy.css';
import PreparedStatements from './PreparedStatements';

type JustBanksyFeatures = 'image-generator' | 'prepared-statements';

/**
 * @returns A page that displays the JustBanksy app.
 */
export default function JustBanksy() {
    const [feature, setFeature] = useState<JustBanksyFeatures>('image-generator');

    function ActiveFeature() {
        if (feature === 'image-generator') {
            return <ImageGenerator />;
        }

        if (feature === 'prepared-statements') {
            return <PreparedStatements />;
        }

        setFeature('image-generator');
        return <ImageGenerator />;
    }

    return (
        <HStack height='100%'>
            <Sidebar logo={logo}>
                <SidebarNavigationButton
                    ionicon={imagesOutline}
                    label='Image Generator'
                    onClick={() => setFeature('image-generator')}
                    active={feature === 'image-generator'}
                />
                <SidebarNavigationButton
                    ionicon={albumsOutline}
                    label='Prepared Statements'
                    onClick={() => setFeature('prepared-statements')}
                    active={feature === 'prepared-statements'}
                />
            </Sidebar>

            <ActiveFeature />
        </HStack>
    );
}
