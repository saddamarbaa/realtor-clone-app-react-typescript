export interface ListingT {
  id: string;
  userRef: string;
  name: string;
  bedRoom: number;
  parking: boolean;
  longitude: number;
  geolocation: {
    lng: number;
    lat: number;
  };
  address: string;
  latitude: number;
  bathRoom: number;
  regularPrice: number;
  description: string;
  furnished: boolean;
  imgUrls: string[];
  offer: boolean;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  type: 'rent' | 'sale'; // assuming that 'type' can only be one of these two strings
  discountedPrice: number;
}
