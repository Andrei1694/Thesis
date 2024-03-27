import rasp from "../assets/raspberry.png";

function DeviceCard({ deviceName, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-[113px] h-[108px] shadow-sm rounded-[10px] cursor-pointer hover:bg-customSecondary text-customDark hover:text-white"
    >
      <div className="h-[108px] px-2 py-6 rounded-[10px] shadow flex-col justify-start items-center gap-4 inline-flex">
        <div className="flex flex-col justify-center ">
          <img src={rasp} alt="Raspberry" width={"32px"} height={"32px"} />
        </div>
        <div>
          <h5 className="w-[99px] text-center text-xs font-extrabold font-['Lato'] leading-3">
            {deviceName}
          </h5>
        </div>
      </div>
    </div>
  );
}

export default DeviceCard;
