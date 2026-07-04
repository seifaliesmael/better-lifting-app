import { Card } from 'react-bootstrap'
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities";

interface Props {
    id: number,
    text:string
}
const DraggableItem = ({id, text}:Props) => {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  return (
    <Card ref={setNodeRef} {...attributes } {...listeners} style={style}>
        <Card.Body>
            <Card.Title> Item {id} </Card.Title>
            <Card.Text> {text} </Card.Text>

        </Card.Body>
    </Card>
  )
}

export default DraggableItem