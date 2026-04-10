import axios from "axios";
import { FuelPriceResponseType } from "../../types/index.js";


class FuelPrice {

  private options = {
    method: 'GET',
    url: process.env.FUEL_PRICE_URL,
    headers: { 'X-Api-Key': process.env.FUEL_PRICE_API }
  };


  public async getFuelPrice(fuel: "petrol" | "diesel" = "petrol"): Promise<FuelPriceResponseType[]> {

    try {

      const { data } = await axios.request({
        ...this.options,
        params: { fuel_type: fuel, location_type: 'state' },
      });

      return data;

    } catch (error) {
      throw error;
    }

  }


}


const fuelPrice = new FuelPrice();

export default fuelPrice;