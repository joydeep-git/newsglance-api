import axios from "axios";
import { GeolocationData } from "../../types";

class IpInfo {


  public async getLocation(ip: string): Promise<string | null > {

    const url = `https://ipinfo.io/${ip}?token=${process.env.IP_INFO_TOKEN}`;

    const data: GeolocationData = await axios.get(url) ?? null;

    return data.country ? data.country : null;

  }

}


const ipInfo = new IpInfo();

export default ipInfo;