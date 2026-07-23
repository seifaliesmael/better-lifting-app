import { useEffect, useState, useContext } from "react";
import { Card } from "@/components/ui/Card";
import { FontAwesome } from "@expo/vector-icons";
import { Text } from "react-native";
import {ThemeContext} from "@/contexts/theme/ThemeContext";

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

const WorkoutTimer = ({startTime} : Props) => {
    const [elapsed, setElapsed] = useState<number>(0);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
      const timer = setInterval(() => {
        setElapsed(calculateDiff(startTime));
      }, 60000) // Update every minute

      return () => {clearInterval(timer)}
    }, [])

    const isLight = theme === 'light';
    const textColor = isLight ? 'text-black' : 'text-white';
    const iconColor = isLight ? 'black' : 'white';
    
    return (
    <Card className="rounded-[30px] h-[40px] m-0 w-[120px] self-center overflow-hidden">
      <Card.Body className="flex-1 flex-row items-center justify-center gap-2 m-0 p-0 bg-blue-500">
        <FontAwesome name="clock-o" size={16} color={iconColor} />
        <Text className={`text-[16px] ${textColor}`}>
          {getElapsedDisplay(elapsed)}
        </Text>
      </Card.Body>
    </Card>
  );
};

export default WorkoutTimer;
