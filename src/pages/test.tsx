import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfToday,
  startOfYear,
} from "date-fns";
import React, { useRef } from "react";
import { useMeasure } from "react-use";
import * as d3 from "d3";

interface Props {}

const SQUARE_SIZE = 20;
const ROUNDING = 4;
const HORIZONTAL_MARGIN = 4;
const VERTICAL_MARGIN = 4;

const Test: React.FC = () => {
  const [ref, { height, width }] = useMeasure<HTMLDivElement>();

  const today = startOfToday();
  const months = eachMonthOfInterval({
    start: startOfYear(today),
    end: endOfYear(today),
  });

  const values = months.map((month) => {
    return eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });
  });

  const xScale = d3.scaleTime().domain(months).range([0, width]);
  const yScale = d3.scaleTime().domain(values[0]).range([0, height]);

  return (
    <div ref={ref} className="h-full w-full">
      <svg className="" viewBox={`0 0 ${width} ${height}`}>
        {/* X Axis */}
        <g transform={`translate(50, 16)`}>
          {xScale.ticks().map((month, idx) => (
            <text
              transform={`translate(${
                (SQUARE_SIZE + HORIZONTAL_MARGIN) * idx + HORIZONTAL_MARGIN
              }, 0)`}
              key={month.toString()}
            >
              {format(month, "LLLLL")}
            </text>
          ))}
        </g>

        {/* Y Axis */}
        <g transform={`translate(26, 32)`}>
          {yScale.ticks(31).map((day, idx) => (
            <text
              transform={`translate(0, ${
                (SQUARE_SIZE + VERTICAL_MARGIN) * idx + VERTICAL_MARGIN
              })`}
              key={day.toString()}
            >
              {format(day, "dd")}
            </text>
          ))}
        </g>

        {months.map((month, monthIdx) => (
          <g transform={`translate(50, 20)`} key={month.toString()}>
            {values[monthIdx].map((day, idx) => (
              <rect
                key={day.toString()}
                x={(SQUARE_SIZE + HORIZONTAL_MARGIN) * monthIdx}
                y={(SQUARE_SIZE + VERTICAL_MARGIN) * idx}
                height={SQUARE_SIZE}
                width={SQUARE_SIZE}
                className="fill-red-400"
                rx={ROUNDING}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Test;
