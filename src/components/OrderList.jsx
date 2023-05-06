import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParcels } from "../slices/parcelsSlice";
import {
  CheckIcon,
  TruckIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import Paginate from './Paginate';

export default function OrderList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { parcels, loading } = useSelector((state) => state.parcels);
  const { user } = useSelector((state) => state.loggedIn);
  const [currentPage, setCurrentPage] = useState(1)

  const token = "sk_live_cswltnqwc2rp7dedhblxpxmuoaz880jgqmi92dz"


  useEffect(() => {
    dispatch(getParcels());
  }, [dispatch,currentPage, setCurrentPage]);

  const filteredParcels = parcels.filter(
    (parcel) => parcel.user_id === user.id
  );
  const parcelPerPage = 5;
	const totalParcels = filteredParcels.length;

	const indexOfLastParcel = currentPage * parcelPerPage;
	const indexOfFirstParcel = indexOfLastParcel - parcelPerPage;
	const filterParcels = filteredParcels.slice(indexOfFirstParcel, indexOfLastParcel);
  

  if (loading) {
    return <div className="h-screen">Loading...</div>;
  }
  if (filteredParcels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center font-bold text-2xl">You have no orders.</div>
        <div className="text-center font-bold text-xl">
          Go to the{" "}
          <Link to="/" className="text-blue-300">
            homepage
          </Link>{" "}
          to read about us and make an order.
        </div>
      </div>
    );
  }

  function singleOrder(e) {
    e.preventDefault();
    navigate(`/orders/${e.target.id}`);
  }

  function handleCheckout(){
    const totalAmount = filteredParcels?.reduce((total, val) => {
      return val.price + total
    }, 0)

    fetch('https://api.budpay.com/api/v2/transaction/initialize', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
        "Accept": 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(
        {
          email: "adewale@budpay.com",
          amount: "10",
          currency: "KES",
          reference: `123456890123mn4mm5ckpskt0dsjlwk${Math.random().toString(36).substring(2,7)}`,
          callback: "www.budpay.com"
        }
      )
    }).then(res => {
      if(res.ok){
        res.json().then(data => {
          const authorization_url = data.data.authorization_url 
          window.location.href = authorization_url       
        })
      }
    })
  }

  return (
    <div className="h-screen">
      <div className="border-b border-gray-200 flex justify-center gap-4 items-center p-4">
        <h1 className="text-3xl font-bold">Your Orders</h1>
        <span>
          <TruckIcon className="h-6 w-7 text-yellow-500" />
        </span>
      </div>

      <div className="container mx-auto mt-4">
        {filterParcels.map((parcel) => (
          <div key={parcel.id} className="border-b border-gray-200 py-4">
            <h1
              onClick={singleOrder}
              id={parcel.id}
              className="text-xl underline font-medium leading-6 text-gray-900 mb-2 cursor-pointer"
            >
              {parcel.parcel_name}
            </h1>
            <h1 className="text-lg font-medium leading-6 text-gray-900 mb-2">
              Pick up location: {parcel.pickup_location}
            </h1>
            <h1 className="text-lg font-medium leading-6 text-gray-900 mb-2">
              Destination: {parcel.destination}
            </h1>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 font-medium">
                Weight: {parcel.weight}
              </p>
              <p className="text-gray-500 font-medium">Price: {parcel.price}</p>
              <div className="text-gray-500 font-medium flex gap-2">
                <span>Status: {parcel.status.status}</span>
                <span className="flex justify-between items-center">
                  {parcel.status.status === "Delivered" && (
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  )}
                  {parcel.status.status === "In-transit" && (
                    <TruckIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  )}
                  {parcel.status.status === "Cancelled" && (
                    <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  {parcel.status.status === "Pending" && (
                    <ArrowPathIcon className="h-5 w-5 text-red-500 mr-2" />
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}     
      </div>
      <div className="container">
          
            
          

       
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalParcels={totalParcels}
            parcelPerPage={parcelPerPage}
          />
        
        
      </div>

      <div>
        <div>
          <p>Total Price</p>
          {
            filteredParcels?.reduce((total, val) => {
              return val.price + total
            }, 0)
          }
        </div>

        <button
          type="submit"
          onClick={handleCheckout}
          className="inline-flex justify-center rounded-md border border-transparent bg-slate-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Checkout
      </button>
      </div>
    </div>
  );
}
