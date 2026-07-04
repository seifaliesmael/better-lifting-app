import { closestCorners, DndContext, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent, type UniqueIdentifier } from "@dnd-kit/core"
import { useState } from "react";
import DraggableList from "../Components/Draggable/DraggableList";
import { arrayMove } from "@dnd-kit/sortable";
import { Col, Row } from "react-bootstrap";

const TestDND = () => {
  const [items, setItems] = useState([
    {id:1, text:"First item"},
    {id:2, text:"Second item"},
    {id:3, text:"Third item"},

  ]);

  const getItemPosition = (id:UniqueIdentifier) => items.findIndex(x => x.id == id);
  
  const handleDragEnd = (event:DragEndEvent) => {
    const {active, over} = event

    if (active.id === over?.id) return;
    if (!over) return;

    setItems(items => {
      const originalPos = getItemPosition(active.id);
      const newPos = getItemPosition(over.id);

      return arrayMove(items, originalPos, newPos);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  ) // allow for mobile


  return (
    <div>
      <Row>
        <Col>
          <h1> TestDND </h1>
          {/* collision detection is algorithm for determining which object we landed on */}
          <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}> 
              <DraggableList items={items}/>
          </DndContext>
        </Col>
        <Col>
          <p> {JSON.stringify(items)}</p>
        </Col>
      </Row>
    </div>
  )
}

export default TestDND