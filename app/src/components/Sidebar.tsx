import { IonIcon } from '@ionic/react';
import { home } from 'ionicons/icons';
import { ReactNode } from 'react';
import { HStack, VStack } from 'reaction';
import './Sidebar.css';

export interface SidebarProps {
    logo: string;
    children?: ReactNode;
}

export interface SidebarNavigationButtonProps {
    ionicon: string;
    label: string;
    active?: boolean;
    onClick: () => void;
}

export default function Sidebar({ logo, children }: SidebarProps) {
    return (
        <VStack justify='start' className='sidebar'>
            <img src={logo} alt='Product Brand' className='sidebar-brand' />
            <SidebarNavigationButton
                ionicon={home}
                label='Home'
                onClick={() => (window.location.href = '/')}
            />
            {children}
        </VStack>
    );
}

export function SidebarNavigationButton({
    ionicon,
    label,
    onClick,
    active,
}: SidebarNavigationButtonProps) {
    function getClassName() {
        return `sidebar-navigation-button ${active ? ' active' : ''}`.trim();
    }

    return (
        <button className={getClassName()} onClick={onClick}>
            <HStack justify='start'>
                <IonIcon className='sidebar-navigation-button-icon' icon={ionicon} />
                {label}
            </HStack>
        </button>
    );
}
