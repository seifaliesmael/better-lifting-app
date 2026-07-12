import { Card, Col, Row } from "react-bootstrap";

import {useSortable} from '@dnd-kit/react/sortable';
import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

function Sortable({id, index, text}: {id:number, index:number, text:string}) {
  const {ref} = useSortable({id, index});

  return (
    <Card ref={ref} className="item">
      <Card.Body>
        <Card.Title>Item {id}: {text} </Card.Title>
      </Card.Body>
    </Card>
  );
}

const TestDND = () => {
  const [items, setItems] = useState([
    {id:1, text:"First item"},
    {id:2, text:"Second item"},
    {id:3, text:"Third item"},
  ]);

  return (
    <DragDropProvider
    onDragEnd={(event) => {
      setItems((prev) => move(prev, event));
    }}
    >
      <div>
        <Row>
          <Col>
            <h1> TestDND </h1>
            <ul className="list">
            {items.map((item, index) =>
              <Sortable key={item.id} id={item.id} index={index} text={item.text} />
            )}
            </ul>
          </Col>
          <Col>
            <p> {JSON.stringify(items)}</p>
          </Col>
        </Row>
      </div>
    </DragDropProvider>
    
  )
}

export default TestDND