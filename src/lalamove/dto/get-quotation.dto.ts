interface Waypoint {
  location: Location;
  addresses: Addresses;
}

interface Location {
  lat: string;
  lng: string;
}

interface Addresses {
  [key: string]: {
    displayString: string;
    country: string;
  };
}

interface DeliveryInfo {
  toStop: number;
  toContact: Contact;
  remarks?: string;
}

interface Contact {
  name: string;
  phone: string;
}

export class GetQuotationDto {
  // Required
  serviceType: string;
  stops: Waypoint[];
  deliveries: DeliveryInfo[];
  requesterContact: Contact;
  // Optional
  specialRequests?: string[];
  scheduleAt?: string;
}
