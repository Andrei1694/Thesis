import { useState } from "react";

function SensorsPage() {
  const [sensors, setSensors] = useState([
    {
      id: 1,
      pin: 14,
    },
  ]);
  const renderSensors = () => {
    return sensors.map((sensor) => <div>sda</div>);
  };
  return (
    <div>
      SensorsPage
      {renderSensors()}
    </div>
  );
}
export default SensorsPage;
