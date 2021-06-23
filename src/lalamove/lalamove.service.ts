import { HttpService, Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  CONFIG_OPTIONS,
  LalamoveOptions,
  HttpMethod,
} from './lalamove.definition';
const CryptoJS = require('crypto-js');

import { GetQuotationDto } from './dto/get-quotation.dto';
import { RegionDto } from './dto/region.dto';
import { PlaceOrderDto } from './dto/place-order.dto';

@Injectable()
export class LalamoveService {
  // Api endpoint
  private readonly demoUrl = 'https://sandbox-rest.lalamove.com';
  private readonly liveUrl = 'https://rest.lalamove.com';

  private sandbox: boolean;
  private apiKey: string;
  private secret: string;
  private logService?: LoggerService;
  private baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(CONFIG_OPTIONS) options: LalamoveOptions,
  ) {
    this.apiKey = options.apiKey;
    this.secret = options.secret;
    this.sandbox = options.sandbox || false;
    this.apiKey = options.apiKey;
    this.logService = options.logger;
    this.setBaseUrl();
  }

  private setBaseUrl() {
    if (this.sandbox === false) {
      this.baseUrl = this.liveUrl;
    } else {
      this.baseUrl = this.demoUrl;
    }
  }

  private getUrl(path: string) {
    return `${this.baseUrl}${path}`;
  }

  private getMethod(httpMethod: HttpMethod) {
    switch (httpMethod) {
      case HttpMethod.GET:
        return 'GET';
      case HttpMethod.POST:
        return 'POST';
      case HttpMethod.PUT:
        return 'PUT';
      case HttpMethod.PATCH:
        return 'PATCH';
      case HttpMethod.DELETE:
        return 'DELETE';
      default:
        break;
    }
  }

  private getRegion(body: GetQuotationDto): string {
    const senderAddress = body.stops[0].addresses;
    let country: string;
    for (const key in senderAddress) {
      country = senderAddress[key].country;
    }
    return country;
  }

  private getApiCaller(
    httpMethod: HttpMethod,
    path: string,
    body?: GetQuotationDto | PlaceOrderDto,
  ) {
    const time = new Date().getTime().toString();
    const method = this.getMethod(httpMethod);
    const jsonBody = JSON.stringify(body);
    const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n${jsonBody}`;
    const SIGNATURE = CryptoJS.HmacSHA256(rawSignature, this.secret).toString();
    const region = this.getRegion(body);

    const headers = {
      'Content-type': 'application/json; charset=utf-8',
      Authorization: `hmac ${this.apiKey}:${time}:${SIGNATURE}`,
      Accept: 'application/json',
      'X-LLM-Country': region,
    };
    const url = this.getUrl(path);
    const handleResponse = response => {
      return response.data;
    };

    const handlerError = error => {
      throw error;
    };

    if (httpMethod === HttpMethod.GET) {
      return this.httpService
        .get(url, {
          headers,
        })
        .toPromise()
        .then(handleResponse)
        .catch(handlerError);
    }

    if (httpMethod === HttpMethod.DELETE) {
      return this.httpService
        .delete(url, { headers })
        .toPromise()
        .then(handleResponse)
        .catch(handlerError);
    }

    if (httpMethod === HttpMethod.POST) {
      return this.httpService
        .post(url, { ...body }, { headers })
        .toPromise()
        .then(handleResponse)
        .catch(handlerError);
    }

    if (httpMethod === HttpMethod.PUT) {
      return this.httpService
        .put(url, { ...body }, { headers })
        .toPromise()
        .then(handleResponse)
        .catch(handlerError);
    }

    if (httpMethod === HttpMethod.PATCH) {
      return this.httpService
        .patch(url, { ...body }, { headers })
        .toPromise()
        .then(handleResponse)
        .catch(handlerError);
    }
  }

  async getQuotation(data: GetQuotationDto) {
    return await this.getApiCaller(HttpMethod.POST, '/v2/quotations', data);
  }

  async placeOrder(data: PlaceOrderDto) {
    return await this.getApiCaller(HttpMethod.POST, '/v2/orders', data);
  }
}
