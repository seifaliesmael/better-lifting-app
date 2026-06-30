import { Card } from "react-bootstrap"
import type { DisplayObject } from "./Interfaces"

interface ListRenderProps<T extends DisplayObject> {
    data: T[];
    title:string;
    renderData: (item: T) => React.ReactNode;
}

// Takes in a ListRenderProps object for a generic type T which extends displayobject, returns a JSX element
export const ListRender = <T extends DisplayObject> ({data, title, renderData}: ListRenderProps<T>) => {
    return (
        <div>
            <h1 style={{textAlign:"center"}}> {title} </h1>
            <div className="overflow-scroll" style={{maxHeight:"600px", width:"600px"}}>
                {data?.map((obj) => (
                    <Card key={obj.id} className="m-4" style={{width:"450px"}}>
                        <Card.Body>
                            {renderData(obj)}
                        </Card.Body>
                    </Card>
                ))}

            </div>
        </div>
    )

}
