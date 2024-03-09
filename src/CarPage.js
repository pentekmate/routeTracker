import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import { GiSteeringWheel } from "react-icons/gi";
import { FaCarSide } from "react-icons/fa6";
import a3 from './imgs/a3.png'
import volvo from './imgs/volvo.png'
import bmw from './imgs/bmw.png'
import toyota from './imgs/toyota.png'
function CarPage({ plate_number, id, consumption, type  }) {

    function imageCheck(type) {
        if (type === "Audi") {
            return <img src={a3}></img>
        }
        else if (type === "Volvo") {
            return <img className="xl:h-[500px] sm:h-[202px]" src={volvo}></img>
        }
        else if (type === "bmw") {
            return <img src={bmw}></img>
        }
        else if (type === "Toyota") {
            return <img src={toyota}></img>
        }
    }
    return (
        <div className="h-[500px] xl:flex xl:flex-row sm:flex-col items-center carpage w-screen">
            <div className="xl:w-3/4 sm:w-screen xm:h-[400px] flex justify-center">
                {imageCheck(type)}
            </div>
            <div className="xl:w-1/3 px-2 sm:w-screen h-[400px] gap-10 flex flex-col pt-24">
                <div className="flex gap-2">
                    <BsFillFuelPumpDieselFill className="mt-1" />
                    <p>Fogyasztás:</p>
                    <p>{consumption}liter/100km</p>
                </div>
                <div className="flex gap-2">
                    <GiSteeringWheel className="mt-1" />
                    <p>Tipus:</p>
                    <p>{type}</p>
                </div>
                <div className="flex gap-2">
                    <FaCarSide className="mt-1" />
                    <p>Rendszám:</p>
                    <p>{plate_number}</p>
                </div>
            </div>
        </div>
    )
}

export default CarPage