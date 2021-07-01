require('dotenv').config();
import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LalamoveService } from './lalamove.service';

const { APIKEY, SECRET } = process.env;

describe('Lalamove Service', () => {
  let service: LalamoveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LalamoveService,
          useValue: new LalamoveService(new HttpService(), {
            apiKey: APIKEY,
            secret: SECRET,
            partnerPortal: true,
            sandbox: true,
          }),
        },
      ],
    }).compile();

    service = module.get<LalamoveService>(LalamoveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 3.2611977841933264, 101.66906835308804 north
  // 2.881286865907826, 101.78435653959467 south
  // 2.971381883241138, 101.82963580944276 east
  // 3.0396200092379595, 101.44151855415718 west

  function randomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
  function randomLocation(): { lat: string; lng: string } {
    const lat = randomNumber(2.881286865907826, 3.2611977841933264).toString();
    const lng = randomNumber(101.44151855415718, 101.82963580944276).toString();
    return { lat, lng };
  }
  const senderLocation = randomLocation();
  const receiverLocation = randomLocation();

  const region = 'MY_KUL';
  const quotationData = {
    serviceType: 'MOTORCYCLE',
    specialRequests: [],
    stops: [
      {
        // Location information for pick-up point
        location: senderLocation,
        addresses: {
          ms_MY: {
            displayString: 'Malaysia',
            country: region,
          },
        },
      },
      {
        // Location information for drop-off point (#1)
        location: receiverLocation,
        addresses: {
          ms_MY: {
            displayString: 'Malaysia',
            country: region,
          },
        },
      },
    ],
    // Pick-up point copntact details
    requesterContact: {
      name: 'Chris Wong',
      phone: '0376886555',
    },
    deliveries: [
      {
        toStop: 1,
        toContact: {
          name: 'Shen Ong',
          phone: '0376886555',
        },
        remarks: 'Do not take this order - SANDBOX CLIENT TEST',
      },
    ],
  };

  describe('Get quotation, place order, get order details and cancel order', () => {
    let totalRate: { totalFee: string; totalFeeCurrency: string };
    let orderId: string;

    // Get quotation
    it('should return successful price', async () => {
      const rate = await service.getQuotation(quotationData);

      // Return result
      expect(rate.totalFeeCurrency).toBe('MYR');

      // Save price
      totalRate = rate;
    });

    // Place order
    it('should return successful order ref', async () => {
      const orderData = {
        ...quotationData,
        quotedTotalFee: {
          amount: totalRate.totalFee,
          currency: 'MYR',
        },
      };

      const order = await service.placeOrder(orderData);

      // Return result
      expect(order).toHaveProperty('orderRef');

      // Save order ref
      orderId = order.orderRef;
    });

    // Check order details
    it('should return order details', async () => {
      const orderDetails = await service.orderDetails(orderId, region);

      // Return result
      expect(orderDetails).toHaveProperty('price');
      expect(orderDetails).toHaveProperty('status');
      expect(orderDetails).toHaveProperty('shareLink');
      expect(orderDetails.price.amount).toBe(totalRate.totalFee);
      expect(orderDetails.price.currency).toBe(totalRate.totalFeeCurrency);
    });

    // Cancel order
    it('should return successful cancel order', async () => {
      const cancelOrder = await service.cancelOrder(orderId, region);
      // Result of empty object
      expect(cancelOrder).toMatchObject({});
    });
  });

  describe('Get driver details', () => {
    const randomOrderId = '11234';
    const randomDriverId = '123';

    // Get driver details with error 404
    it('should return unsuccessful driver details', async () => {
      try {
        await service.driverDetails(randomOrderId, randomDriverId, region);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 404');
      }
    });
  });

  describe('Get driver location', () => {
    const randomOrderId = '34567';
    const randomDriverId = '34896';

    // Get driver location with error 404
    it('should return unsuccessful driver location', async () => {
      try {
        await service.driverLocation(randomOrderId, randomDriverId, region);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 404');
      }
    });
  });
});
