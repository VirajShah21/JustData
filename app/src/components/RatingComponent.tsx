import { HStack } from 'reaction';
import './RatingComponent.css';

function Rating(props: { rating: number; color?: string; outOf?: number }) {
    const fills = [];

    for (let i = 1; i <= props.rating; i++) fills.push(1);
    if (props.rating % 1 !== 0) fills.push(props.rating % 1);
    if (Math.ceil(props.rating) < (props.outOf ?? 5)) {
        for (let i = Math.ceil(props.rating); i < (props.outOf ?? 5); i++) fills.push(0);
    }

    return (
        <HStack width='auto' className='rating'>
            {fills.map(fill => (
                <RatingCircle fill={fill} color={props.color} />
            ))}
        </HStack>
    );
}

function RatingCircle(props: { fill: number; color?: string }) {
    const color = props.color ?? 'yellow';

    return (
        <div className='rating-circle' style={{ borderColor: color }}>
            <div
                className='rating-circle-fill'
                style={{ backgroundColor: color, width: `${props.fill * 100}%` }}></div>
        </div>
    );
}

export default Rating;
