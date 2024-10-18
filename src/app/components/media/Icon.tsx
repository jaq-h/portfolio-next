'use client';
import { Icon as SemanticIcon } from 'semantic-ui-react';

type iconProps = {
    icon: string;
}
 function Icon(props: iconProps) {
    return (
        <SemanticIcon className={props.icon}/>
    )
}
export default Icon;