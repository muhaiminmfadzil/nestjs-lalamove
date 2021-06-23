import { GetQuotationDto } from './get-quotation.dto';

interface QuotedTotalFee {
  amount: string;
  currency: string;
}

export class PlaceOrderDto extends GetQuotationDto {
  // Required
  quotedTotalFee: QuotedTotalFee;
  // Optional
  sms?: boolean;
  pod?: boolean;
  fleetOption?: string;
}
