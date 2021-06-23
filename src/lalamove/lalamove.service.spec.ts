require('dotenv').config();
import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LalamoveService } from './lalamove.service';

const { APIKEY, SECRET } = process.env;

xdescribe('Lalamove Wrong API key', () => {
  let service: LalamoveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LalamoveService,
          useValue: new LalamoveService(new HttpService(), {
            apiKey: 'wrong-api-key',
            secret: 'wrong-secret',
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

  // it('should return unauthorized user error', async () => {
  //   const rate = await service.getQuotation({
  //     bulk: [
  //       {
  //         pick_code: '55100',
  //         pick_state: 'kul',
  //         pick_country: 'MY',
  //         send_code: '11900',
  //         send_state: 'png',
  //         send_country: 'MY',
  //         weight: 1,
  //       },
  //     ],
  //   });
  //   // Api call success
  //   expect(rate.api_status).toBe('Error');
  //   // Return result
  //   expect(rate.error_remark).toBe('Unauthorized user');
  // });
});

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

  describe('Get quotation', () => {
    // Single rate checking
    it('should return single rate with success api status', async () => {
      const rate = await service.getQuotation({
        serviceType: 'MOTORCYCLE',
        specialRequests: [],
        stops: [
          {
            // Location information for pick-up point
            location: {
              lat: '3.048593',
              lng: '101.671568',
            },
            addresses: {
              ms_MY: {
                displayString:
                  'Bumi Bukit Jalil, No 2-1, Jalan Jalil 1, Lebuhraya Bukit Jalil, Sungai Besi, 57000 Kuala Lumpur, Malaysia',
                country: 'MY_KUL',
              },
            },
          },
          {
            // Location information for drop-off point (#1)
            location: {
              lat: '2.754873',
              lng: '101.703744',
            },
            addresses: {
              ms_MY: {
                displayString: '64000 Sepang, Selangor, Malaysia',
                country: 'MY_KUL',
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
      });

      // Return result
      expect(rate.totalFeeCurrency).toBe('MYR');
    });
  });
});
