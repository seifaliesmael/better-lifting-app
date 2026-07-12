import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Clock } from "react-bootstrap-icons";

interface Props {
  startTime: Date;
  theme: string;
}

const calculateDiff = (start:Date):number => {
  const curr = new Date();
  return Math.round((curr.getTime() - start.getTime()) / 60000); // difference in minutes
}

const getElapsedDisplay = (diff:number):string => {
  switch (diff) {
    case 0:
      return "< 1 min";
    case 1:
      return "1 min";
    default:
      return `${diff} mins`
  }
}


const WorkoutTimer = ({startTime, theme} : Props) => {
    const [elapsed, setElapsed] = useState<number>(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setElapsed(calculateDiff(startTime));
      }, 60000) // Update every minute

      return () => {clearInterval(timer)}
    }, [])
    
    const cardClass = (theme === "light") ? "bg-white text-dark" : "bg-primary text-white border-secondary";

    return (
    <Card className={cardClass} style={{
      borderRadius:25,
    }}>
      <Card.Body className="d-flex align-items-center gap-2 m-0 p-2">
        <Clock style={{ fontSize: 18 }} />
        <Card.Text style={{ fontSize: 18 }}> {getElapsedDisplay(elapsed)} </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default WorkoutTimer;
