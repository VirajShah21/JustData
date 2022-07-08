import { IonIcon } from '@ionic/react';
import { homeOutline } from 'ionicons/icons';
import { ReactNode } from 'react';
import { HStack, VStack } from 'reaction';
import './Sidebar.css';

export interface SidebarProps {
    logo: string;
    children?: ReactNode;
}

export interface SidebarNavigationButtonProps {
    ionicon: string | { default: string; active: string };
    label: string;
    active?: boolean;
    onClick: () => void;
}

/**
 * A sidebar component that displays the application logo and a list of navigation buttons.
 *
 * @param props.logo - The logo to appear in the sidebar.
 * @param props.children - The navigation buttons to appear in the sidebar. Other components
 * can also be added to the sidebar (which is contained within a `VStack`).
 * @returns A sidebar component.
 */
export default function Sidebar({ logo, children }: SidebarProps) {
    return (
        <VStack justify='start' className='sidebar'>
            <img src={logo} alt='Product Brand' className='sidebar-brand' />
            <SidebarNavigationButton
                ionicon={homeOutline}
                label='Home'
                onClick={() => (window.location.href = '/')}
            />
            {children}
        </VStack>
    );
}

/**
 * A button that appears in the sidebar. It includes an icon and a label. When the button is
 * active, the text will be bold.
 *
 * @param props.ionicon - The icon to appear on the left of the button.
 * @param props.label - The label to appear to the right of the icon.
 * @param props.onClick - The function to invoke when the button is clicked.
 * @param props.active - Whether or not the button is active.
 * @returns The sidebar navigation button.
 */
export function SidebarNavigationButton({
    ionicon,
    label,
    onClick,
    active,
}: SidebarNavigationButtonProps) {
    function getClassName() {
        return `sidebar-navigation-button ${active ? ' active' : ''}`.trim();
    }

    function GetIcon() {
        if (typeof ionicon === 'string') {
            return <IonIcon className='sidebar-navigation-button-icon' icon={ionicon} />;
        }

        if (active) {
            return <IonIcon className='sidebar-navigation-button-icon' icon={ionicon.active} />;
        }

        return <IonIcon className='sidebar-navigation-button-icon' icon={ionicon.default} />;
    }

    return (
        <button className={getClassName()} onClick={onClick}>
            <HStack justify='start'>
                <GetIcon />
                {label}
            </HStack>
        </button>
    );
}
