export default function Sensor({ name }) {
    return (
        <div className="bg-white rounded-[10px] shadow p-6 w-80">
            <h1>{name}</h1>
            <p>Temperature: 25°C</p>

        </div>
    );
}