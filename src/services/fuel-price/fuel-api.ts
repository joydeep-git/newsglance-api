import axios from "axios";
import { FuelCustomResponseType, FuelPriceResponseType } from "../../types/index.js";


class FuelPrice {

  private options = {
    method: 'GET',
    url: process.env.FUEL_PRICE_URL,
    headers: { 'X-Api-Key': process.env.FUEL_PRICE_API }
  };


  public async getFuelPrice(): Promise<FuelCustomResponseType[]> {

    try {

      const [petrol, diesel] = await Promise.all([

        axios.request<FuelPriceResponseType[]>({
          ...this.options,
          params: { fuel_type: "petrol", location_type: 'state' },
        }),

        axios.request<FuelPriceResponseType[]>({
          ...this.options,
          params: { fuel_type: "diesel", location_type: 'state' },
        }),

      ]);


      // store petrol in map
      const data: Map<string, FuelCustomResponseType> = new Map(
        petrol.data.map(item => [item.city, {
          petrol: item.price,
          state: item.city,
          diesel: "N/A"
        }]));


      // add diesel
      diesel.data.forEach(item => {

        const stateData = data.get(item.city);

        if (stateData) {
          data.set(stateData.state, {
            ...stateData,
            diesel: item.price,
          })
        }

      })


      return Array.from(data.values());

    } catch (error) {
      throw error;
    }

  }


}


const fuelPrice = new FuelPrice();

export default fuelPrice;