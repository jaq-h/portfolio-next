'use client';
export type IframeProps = {
    src: string;
    width: number;
    height: number;
}

export default function Iframe(props: IframeProps) {
    return (
        <iframe src={props.src} width={props.width} height={props.height} allowFullScreen />
    )
}