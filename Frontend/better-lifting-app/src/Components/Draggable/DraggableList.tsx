import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import DraggableItem from "./DraggableItem"

interface listItem {
    id:number,
    text:string
}

const DraggableList = ({items}:{items:listItem[]}) => {
  return (
    <div>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
                <DraggableItem key={item.id} id={item.id} text={item.text}/> 
            ))}
        </SortableContext>
    </div>
  )
}

export default DraggableList