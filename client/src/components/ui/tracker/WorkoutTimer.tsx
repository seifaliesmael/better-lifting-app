import { Card } from "@/components/ui/Card";
import { ThemeContext } from "@/contexts/theme/ThemeContext";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { Text } from "react-native";

interface Props {
  startTime: Date;
}

const calculateDiff = (start: Date): number => {
  const curr = new Date();
  return Math.round((curr.getTime() - start.getTime()) / 60000); // difference in minutes
};

const getElapsedDisplay = (diff: number): string => {
  switch (diff) {
    case 0:
      return "< 1 min";
    case 1:
      return "1 min";
    default:
      return `${diff} mins`;
  }
};

const WorkoutTimer = ({ startTime }: Props) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(calculateDiff(startTime));
    }, 60000); // Update every minute

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Card className="rounded-full m-0 self-center overflow-hidden border-0">
      <Card.Body className="flex-row items-center justify-center gap-2 m-0 px-6 py-3 bg-blue-500">
        <Feather name="clock" size={20} color="white" />
        <Text className="text-lg font-semibold text-white">
          {getElapsedDisplay(elapsed)}
        </Text>
      </Card.Body>
    </Card>
  );
};

export default WorkoutTimer;
