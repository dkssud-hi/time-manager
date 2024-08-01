import { useEffect, useState } from "react";
import "./timeLineItem.css";

type TimeLineItemProps = {
  time: number;
  Todo?: string;
  latestTime: null | Date;
};

const TimeLineItem: React.FC<TimeLineItemProps> = ({
  time,
  Todo,
  latestTime,
}) => {
  const [duration, setDuration] = useState<Date>();

  useEffect(() => {
    if (latestTime) {
      setDuration(latestTime);
    }
    //집중시간 변동에따라 backgroud-color 영역 변경하는 코드 작성
  }, [latestTime]);

  return (
    <div className="time_line_item">
      <div className="time">{`${time}h`}</div>
      <div className="duration">00:00 ~ 00:30</div>
      <div className="todo">
        <div>{Todo ? Todo : ""}</div>
      </div>
      <div className="progress"></div>
    </div>
  );
};

export default TimeLineItem;
