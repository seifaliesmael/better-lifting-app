import { Card } from "react-bootstrap"
import type { DisplayObject } from "./Interfaces"
import { useContext } from "react";
import { ThemeContext } from "../contexts/theme/ThemeContext";

interface ListRenderProps<T extends DisplayObject> {
    data: T[];
    title:string;
    onClick?: (item:T) => void;
    renderData: (item: T) => React.ReactNode;
}

// Takes in a ListRenderProps object for a generic type T which extends displayobject, returns a JSX element
export const ListRender = <T extends DisplayObject> ({data, title, renderData, onClick}: ListRenderProps<T>) => {
    const {theme} = useContext(ThemeContext);

    return (
        <div>
            <h1 style={{textAlign:"center"}}> {title} </h1>
            <div className="overflow-scroll" style={{maxHeight:"600px", width:"600px"}}>
                {data?.map((obj) => (
                    <Card onClick={() => onClick?.(obj)} key={obj.id} className={`m-4 shadow-sm ${theme === "light" ? "bg-white text-dark" : "bg-body-tertiary text-white" }`} style={{width:"550px", cursor:onClick ? "pointer" : "default"}}>
                        <Card.Body>
                            {renderData(obj)}
                        </Card.Body>
                    </Card>
                ))}

            </div>
        </div>
    )

}
