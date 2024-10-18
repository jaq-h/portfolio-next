'use client';
export type IframeProps = {
    src: string;
    width?: number;
    height: number;
}

export default function Iframe(props: IframeProps) {
    return (
        <iframe src={props.src} width={props.width ? props.width : "100%"} height={props.height} allowFullScreen />
    )
}