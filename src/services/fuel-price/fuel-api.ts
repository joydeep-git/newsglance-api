import axios from "axios";
import { FuelPriceResponseType } from "../../types";


class FuelPrice {


  private baseUrl = process.env.FUEL_PRICE_URL!;


  private headers = {
    "x-api-key": process.env.FUEL_PRICE_API!,
    "accept": "application/json",
  }


  public async getFuelPrice(fuelType: "petrol" | "diesel" = "petrol"): Promise<FuelPriceResponseType[]> {

    const searchParams = new URLSearchParams({
      "type": fuelType,
      "location_type": "state"
    });

    try {

      const res =  await axios.get<FuelPriceResponseType[]>(this.baseUrl, {
        params: searchParams,
        headers: this.headers
      });

      return res.data;

    } catch (err) {
      throw err;
    }

  }


}


const fuelPrice = new FuelPrice();

export default fuelPrice;