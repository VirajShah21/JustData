import { HStack } from 'reaction';
import './RatingComponent.css';

const DEFAULT_RATING_DENOMINATOR = 5;
const DEC_TO_PERCENT = 100;

/**
 * A rating component which displays the rating of anything. It uses circles (instead of start).
 *
 * @param props - Properties to define the appearance of the rating component.
 * - `rating` - The rating to display.
 * - `color` - The color of the rating circles.
 * - `outOf` - The denominator of the rating (max rating). (Default is 5)
 * @returns The rating component.
 */
function RatingComponent(props: { rating: number; color?: string; outOf?: number }) {
    const fills = [];

    for (let i = 1; i <= props.rating; i++) {
        fills.push(1);
    }

    if (props.rating % 1 !== 0) {
        fills.push(props.rating % 1);
    }

    if (Math.ceil(props.rating) < (props.outOf ?? DEFAULT_RATING_DENOMINATOR)) {
        for (
            let i = Math.ceil(props.rating);
            i < (props.outOf ?? DEFAULT_RATING_DENOMINATOR);
            i++
        ) {
            fills.push(0);
        }
    }

    return (
        <HStack width='auto' className='rating'>
            {fills.map(fill => (
                <RatingCircle fill={fill} color={props.color} />
            ))}
        </HStack>
    );
}

/**
 * A cricle which gets filled in appropriately. This is to be used with a rating
 * component.
 *
 * @param props - Properties to define the appearance of the rating circle.
 * - `fill` - How much of the circle should be filled with its color.
 * - `color` - The color of the circle.
 * @returns A circle filled with the specified color and percentage.
 */
function RatingCircle(props: { fill: number; color?: string }) {
    const color = props.color ?? 'yellow';

    return (
        <div className='rating-circle' style={{ borderColor: color }}>
            <div
                className='rating-circle-fill'
                style={{ backgroundColor: color, width: `${props.fill * DEC_TO_PERCENT}%` }}></div>
        </div>
    );
}

export default RatingComponent;
