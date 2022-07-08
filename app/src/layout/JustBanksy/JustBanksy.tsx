import { albums, albumsOutline, images, imagesOutline } from 'ionicons/icons';
import { useState } from 'react';
import { HStack } from 'reaction';
import logo from 'src/assets/images/icons/Just Banksy.png';
import Sidebar, { SidebarNavigationButton } from 'src/components/ui/Sidebar';
import ImageGenerator from './ImageGenerator';
import './JustBanksy.css';
import PreparedStatements from './PreparedStatements';

export enum JustBanksyFeature {
    IMAGE_GENERATOR,
    PREPARED_STATEMENTS,
}

/**
 * @returns A page that displays the JustBanksy app.
 */
export default function JustBanksy() {
    const [feature, setFeature] = useState<JustBanksyFeature>(JustBanksyFeature.IMAGE_GENERATOR);

    function ActiveFeature() {
        if (feature === JustBanksyFeature.IMAGE_GENERATOR) {
            return <ImageGenerator />;
        }

        if (feature === JustBanksyFeature.PREPARED_STATEMENTS) {
            return <PreparedStatements />;
        }

        setFeature(JustBanksyFeature.IMAGE_GENERATOR);
        return <ImageGenerator />;
    }

    return (
        <HStack height='100%'>
            <Sidebar logo={logo}>
                <SidebarNavigationButton
                    ionicon={{ default: imagesOutline, active: images }}
                    label='Image Generator'
                    onClick={() => setFeature(JustBanksyFeature.IMAGE_GENERATOR)}
                    active={feature === JustBanksyFeature.IMAGE_GENERATOR}
                />
                <SidebarNavigationButton
                    ionicon={{ default: albumsOutline, active: albums }}
                    label='Prepared Statements'
                    onClick={() => setFeature(JustBanksyFeature.PREPARED_STATEMENTS)}
                    active={feature === JustBanksyFeature.PREPARED_STATEMENTS}
                />
            </Sidebar>

            <ActiveFeature />
        </HStack>
    );
}
