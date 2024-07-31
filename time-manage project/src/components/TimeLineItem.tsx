import { useEffect } from "react";
import "./timeLineItem.css";
type TimeLineItemProps = {
  time: number;
  latestTime: number;
};

const TimeLineItem: React.FC<TimeLineItemProps> = ({ time, latestTime }) => {
  useEffect(() => {
    console.log(latestTime);
  }, [latestTime]);

  return (
    <div className="time_line_item">
      <div className="time">{`${time}h`}</div>
      <div className="duration">00:00 ~ 00:30</div>
      <div className="todo">
        <div>프로젝트 개발</div>
      </div>
      <div className="progress"></div>
    </div>
  );
};

export default TimeLineItem;
