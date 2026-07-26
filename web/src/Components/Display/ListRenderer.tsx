import { type RowComponentProps } from "react-window";
import { List } from "react-window"; 
import { Card } from "../UI/Card"; 

interface DisplayObject {
  id: number;
}

interface Props<T extends DisplayObject> {
  data: T[];
  title: string;
  onClick?: (item: T) => void;
  rowHeight?: number;
  renderData: (item: T) => React.ReactNode;
}

interface ListRowData<T extends DisplayObject> {
  data: T[];
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
  
  const obj = data[index];
  if (!obj) return null;

  return (
    <div style={style}>
      <Card
        onClick={() => onClick?.(obj)}
        key={obj.id}
        className={`m-4 shadow-sm ${
          onClick ? "hover:bg-gray-50 dark:hover:bg-slate-700 active:opacity-70 transition-colors" : ""
        }`}
        style={{ width: "550px", cursor: onClick ? "pointer" : "default" }}
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
      <h1 className="text-2xl font-bold text-center my-4 text-black dark:text-white"> 
        {title} 
      </h1>
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