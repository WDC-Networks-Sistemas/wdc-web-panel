import React, { ReactNode } from "react";
import {useDraggable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

interface DraggableProps {
    id: string;
    children: ReactNode;
}

export const Draggable = (props: DraggableProps) => {
    const {listeners, setNodeRef, attributes, transform} = useDraggable({
        id: props.id,
    });
    const style = {
        transform: CSS.Transform.toString(transform),
    }

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
            {props.children}
        </div>
    )
}