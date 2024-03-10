import { useEffect, useState } from 'react';
import './App.css';
import { useFirebase } from "./Firebase";
import { collection, getDocs } from "firebase/firestore";
import { InfinitySpin } from 'react-loader-spinner'
import CarPage from './CarPage';

function App() {
  const [cars, setCars] = useState(null)
  const [summaryRouteLength, setSummaryRouteLength] = useState(0)
  const [summaryConsumption, setSummaryConsumption] = useState(0)
  const [allDataisShown, setAllDataisShown] = useState(false)

  const [chosedCarDetails, setChosedCarDetails] = useState(null);

  const db = useFirebase()

  async function getAllData() {
    const tempArray = [];
    const querySnapshot = await getDocs(collection(db, "cars"));

    const promises = querySnapshot.docs.map(async (outDoc) => {
      const subCollection = await getDocs(collection(db, "cars", outDoc.id, "routes"));
      const routes = [];
      subCollection.forEach((doc) => {
        routes.push({ id: doc.id, ...doc.data() });
      });
      tempArray.push({ id: outDoc.id, ...outDoc.data(), routes });
    });

    await Promise.all(promises);

   
    setCars(tempArray);
  }

  async function getSummaryRouteLength() {
    let tempSummaryRouteLength = []
    const tempArray = [];
    const querySnapshot = await getDocs(collection(db, "cars"));

    const promises = querySnapshot.docs.map(async (outDoc) => {
      const subCollection = await getDocs(collection(db, "cars", outDoc.id, "routes"));
      let allRoutes = [];
      subCollection.forEach((doc) => {
        allRoutes.push(doc.data());
      });
      tempArray.push(allRoutes)
    });


    await Promise.all(promises);


    tempArray.forEach((item) => {
      item.forEach((route) => {
        if (route.route_length !== undefined)
          tempSummaryRouteLength.push(Number(route.route_length));

      });
    });

    setSummaryRouteLength(tempSummaryRouteLength.reduce((total, current) => total + current, 0))

  }
  async function getSummaryConsumption() {
    const querySnapshot = await getDocs(collection(db, "cars"));

    let totalConsumption = 0;

    const promises = querySnapshot.docs.map(async (outDoc) => {
      const carData = outDoc.data();
      const carConsumption = carData.consumption;

      const subCollection = await getDocs(collection(db, "cars", outDoc.id, "routes"));
      let carRouteLength = 0;

      subCollection.forEach((doc) => {
        const routeLength = doc.data().route_length;
        carRouteLength += routeLength;
      });


      totalConsumption += (carRouteLength / 100) * carConsumption;
    });

    await Promise.all(promises);
    setSummaryConsumption(totalConsumption)

  }






  useEffect(function () {
    getAllData()
    getSummaryRouteLength()
    getSummaryConsumption()
  }, [])

  if(!cars)
  return(
  <div className='w-screen h-screen flex items-center justify-center'>
      <InfinitySpin
    visible={true}
    width="200"
    color="#4fa94d"
    ariaLabel="infinity-spin-loading"
    />
  </div>
  )

  
  return (
    <div className="App">
      <div className='w-screen flex flex-col   h-screen'>
        <div className='w-screen  gap-2 h-1/6 header py-3  xl:px-36 sm:px-2'>
          <div className='flex gap-2'>
            <p>Összes megtett kilóméter:</p>
            <p className='font-semibold'>{summaryRouteLength} km</p>
          </div>

          <div className='flex gap-2'>
            <p>Összes felhasznált üzemanyag:</p>
            <p className='font-semibold'>{summaryConsumption} liter</p>
          </div>

          <div className='flex gap-2'>
            <input onChange={() => setAllDataisShown(!allDataisShown)} type="checkbox"></input>
            <p>Mutass minden adatot</p>
          </div>
          {!allDataisShown &&
            <div className='flex'>
              Járműválasztó:
              <select  onChange={(e) => {
              const selectedCarType = e.target.value;
              const selectedCar = cars.find((car) => car.type === selectedCarType);
              setChosedCarDetails(selectedCar);
            }}>
              <option value="">Válassz autót...</option>
              {cars?.map((car) => (
                <option key={car.type} value={car.type}>
                  {car.type}
                </option>
              ))}
            </select>

            </div>}
        </div>
        <div className='flex   flex-col  h-fit w-screen justify-evenly'>
          {cars && allDataisShown ?
            cars.map((item, index) =>
              <CarPage type={item.type} consumption={item.consumption} plate_number={item.plate_number} ></CarPage>
            )
            : <div className='w-screen h-screen defbg flex items-center justify-center'>
              {chosedCarDetails?
                <CarPage type={chosedCarDetails.type} consumption={chosedCarDetails.consumption} plate_number={chosedCarDetails.plate_number}></CarPage>
                : <p className='text-2xl'>Kérlek válassz járművet</p>}

            </div>
          }
        </div>

      </div>
    </div>
  );
}

export default App;
