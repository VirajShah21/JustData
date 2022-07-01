import { IonIcon } from '@ionic/react';
import { bugOutline, cogOutline, helpOutline, logoGithub } from 'ionicons/icons';
import { useState } from 'react';
import { HStack } from 'reaction';
import Button from 'src/components/ui/Button';
import './OptionsBar.css';
import PreferencesPopup from './PreferencesPopup';

/**
 * A simple transparent bar that is displayed at the bottom of the landing page.
 * It includes a button for: preferences, help, issue reporting, and view on
 * GitHub.
 *
 * @returns The options bar at the bottom of the landing page.
 */
export function OptionsBar() {
    const [prefsOpen, setPrefsOpen] = useState(false);

    return (
        <HStack justify='start' className='options-bar'>
            <PreferencesPopup open={prefsOpen} onClose={() => setPrefsOpen(false)} />

            <Button onClick={() => setPrefsOpen(true)}>
                <IonIcon icon={cogOutline} />
                &nbsp; Preferences
            </Button>

            <Button>
                <IonIcon icon={helpOutline} />
                &nbsp; Help
            </Button>

            <Button onClick={openGitHubRepo}>
                <IonIcon icon={bugOutline} />
                &nbsp; Report an Issue
            </Button>

            <Button onClick={openGitHubIssues}>
                <IonIcon icon={logoGithub} />
                &nbsp; View on GitHub
            </Button>
        </HStack>
    );
}

/**
 * Opens the JustData Github page.
 */
function openGitHubRepo() {
    window.open('https://github.com/VirajShah21/JustData', '_blank');
}

/**
 * Opens the JustData issues tab on Github.
 */
function openGitHubIssues() {
    window.open('https://github.com/VirajShah21/JustData/issues/new', '_blank');
}
