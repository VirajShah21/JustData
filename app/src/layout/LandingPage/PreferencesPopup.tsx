import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { HStack, VStack } from 'reaction';
import Button from 'src/components/ui/Button';
import DropdownMenu from 'src/components/ui/DropdownMenu';
import AppPreferences, { AppTheme } from 'src/utils/AppPreferences';
import './PreferencesPopup.css';

interface PreferencesPopupProps {
    onClose: () => void;
    open: boolean;
}

/**
 * @param onClose - A function to call when the preferences popup is closed.
 * @param open - Whether the preferences popup is open or not. If true, the popup
 * will be displayed; if false, the popup will be hidden.
 * @returns The preferences popup window.
 */
export default function PreferencesPopup({ onClose, open }: PreferencesPopupProps) {
    return (
        <VStack
            className='preferences-popup-overlay'
            style={{ display: open ? undefined : 'none' }}>
            <VStack className='preferences-popup' align='start'>
                <HStack className='titlebar' justify='start'>
                    <Button className='close-button' onClick={() => onClose()}>
                        <IonIcon icon={closeOutline} />
                    </Button>
                    <h2 className='title'>Preferences</h2>
                </HStack>
                <VStack className='inner' justify='start'>
                    <LightDarkModePreferences />
                </VStack>
            </VStack>
        </VStack>
    );
}

/**
 * A component which allows the user to toggle between light and dark mode.
 *
 * @returns A fragment of the preferences popup.
 */
function LightDarkModePreferences() {
    const [selected, setSelected] = useState<AppTheme>(AppPreferences.theme);
    const options = [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
    ];

    useEffect(() => {
        AppPreferences.theme = selected;
    }, [selected]);

    return (
        <HStack justify='start'>
            <span>Light/Dark Mode</span>
            &nbsp;
            <DropdownMenu
                options={options}
                placeholder={options.find(o => o.value === selected)?.label}
                onChange={opt => setSelected(opt.value as AppTheme)}
            />
        </HStack>
    );
}
