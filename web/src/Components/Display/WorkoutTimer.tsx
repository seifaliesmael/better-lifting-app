import { useContext, useEffect, useState } from "react";
import { Card } from "../UI/Card";
import { FiClock } from "react-icons/fi";
import { ThemeContext } from "../../contexts/theme/ThemeContext";

interface Props {
  startTime: Date;
}

const calculateDiff = (start: Date): number => {
  const curr = new Date();
  return Math.round((curr.getTime() - start.getTime()) / 60000); 
}

const getElapsedDisplay = (diff: number): string => {
  switch (diff) {
    case 0:
      return "< 1 min";
    case 1:
      return "1 min";
    default:
      return `${diff} mins`
  }
}

const WorkoutTimer = ({ startTime }: Props) => {
    const [elapsed, setElapsed] = useState<number>(calculateDiff(startTime));
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
      const timer = setInterval(() => {
        setElapsed(calculateDiff(startTime));
      }, 60000) 

      return () => clearInterval(timer);
    }, [startTime])
    
    const iconColor = theme === 'light' ? 'black' : 'white';

    return (
     <Card className="rounded-full h-10 m-0 w-fit mx-auto">
      <Card.Body className="flex flex-row items-center justify-center gap-2 m-0 px-4 h-full bg-blue-500">
        <FiClock color={iconColor} size={16}/>
        <p className="text-black dark:text-white font-medium"> 
          {getElapsedDisplay(elapsed)} 
        </p>
        
      </Card.Body>
    </Card>
  );
};

export default WorkoutTimer;