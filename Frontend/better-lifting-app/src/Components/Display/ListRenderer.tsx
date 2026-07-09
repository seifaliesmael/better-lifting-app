import { Card } from "react-bootstrap";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/theme/ThemeContext";
import { List, type RowComponentProps } from "react-window";

interface DisplayObject {
  id: number
}

interface Props<T extends DisplayObject> {
  data: T[];
  title: string;
  onClick?: (item: T) => void;
  rowHeight?:number;
  renderData: (item: T) => React.ReactNode;
}

interface ListRowData<T extends DisplayObject> {
    data:T[];
  renderData: (item: T) => React.ReactNode;
  onClick?: (item: T) => void;
}


const ListRow = <T extends DisplayObject>({
  index,
  data,
  onClick,
  renderData,
  style,
}: RowComponentProps<ListRowData<T>>) => {
    const {theme} = useContext(ThemeContext);

    const obj = data[index];
    if (!obj) return null;

  return (
    <div style={style}>
    <Card
        onClick={() => onClick?.(obj)}
        key={obj.id}
        className={`m-4 shadow-sm ${theme === "light" ? "bg-white text-dark" : "bg-body-tertiary text-white"}`}
        style={{width: "550px", cursor: onClick ? "pointer" : "default" }}
        >
        <Card.Body>{renderData(obj)}</Card.Body>
        </Card>
    </div>
  );
};

export const ListRender = <T extends DisplayObject>({
  data,
  title,
  rowHeight,
  renderData,
  onClick,
}: Props<T>) => {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}> {title} </h1>
      <List
        style={{ maxHeight: 600, width: 600 }}
        rowComponent={ListRow}
        rowCount={data?.length || 0}
        rowHeight={rowHeight ? rowHeight : 150}
        rowProps={{ data, renderData, onClick }}
      />
    </div>
  );
};
