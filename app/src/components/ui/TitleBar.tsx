import { HStack } from 'reaction';
import BrandButton from '../BrandButton';

/**
 * This is the react component for the titlebar. Regardless of the assigned
 * children, it will always render the `<BrandButton />` to the left of all
 * children.
 *
 * @param props - The children to appear in the titlebar
 * @returns The titlebar component
 */
function TitleBar(props: { children: React.ReactNode }) {
    return (
        <HStack>
            <BrandButton />
            {props.children}
        </HStack>
    );
}

export default TitleBar;
