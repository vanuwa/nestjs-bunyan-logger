import { Injectable } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import { BunyanLoggerService } from '../logger/bunyan-logger.service';

const BASE_URL = 'https://api.test.com';
const CLIENT_ID = 'cl';
const CLIENT_SECRET = 'cs';
const USERNAME = 'u';
const PASSWORD = 'p';

@Injectable()
export class MarketplaceService {
  private readonly RETRY_MAX_ATTEMPTS = 100;
  private readonly API_RATE_LIMIT_PAUSE_DURATION_MS = 5000;
  private readonly logger = BunyanLoggerService.createLogger(MarketplaceService.name);
  private readonly httpClient: AxiosInstance;
  private token: string = null;

  constructor() {
    this.httpClient = Axios.create({
      baseURL: BASE_URL,
      responseType: 'json'
    });
  }

  async loginAsUser(username = USERNAME, password = PASSWORD) {
    const requestData = {
      username,
      password,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'password'
    };

    this.logger.debug({ requestData }, 'Logging in as a User...');

    try {
      const { data } = await this.httpClient.postForm('/oauth/token', requestData);

      this.logger.debug({ data }, 'Login as a User RESULT');

      this.token = data?.value;

      return data;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getUserDetails(token = this.token) {
    const config = {
      method: 'get',
      url: '/common/v1/user-details'
    };

    const data = await this.request(config, token);

    this.logger.debug({ data }, 'getUserDetails');

    return data;
  }

  async request(options: any = {}, authToken = this.token): Promise<any> {
    const token = authToken;

    if (!token) {
      throw new Error('Can not proceed without auth token');
    }

    let attempt = 0;
    let shallRetry = false;

    do {
      attempt++;
      shallRetry = false;

      const headers = { ...(options.headers || {}), authorization: `Bearer ${token}` };
      const requestOptions = {
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 401 || status === 429;
        },
        ...options,
        headers
      };

      const response = await this.httpClient.request(requestOptions);

      // if (response?.status === 401) {
      //   this.logger.warn('It seems tha auth token has expired.');
      //
      //   if (initiator === InitiatorEnum.USER) {
      //     throw new Error('Unauthorized user or token expired (HTTP Status Code 401)')
      //   }
      //
      //   shallRetry = true
      //   token = await this.loginAsPlatform()
      //
      //   continue
      // }

      if (response?.status === 429) {
        this.logger.warn(`It seems the API rate limit exceeded. Taking a break... (${this.API_RATE_LIMIT_PAUSE_DURATION_MS} ms.)`);

        shallRetry = true;
        await MarketplaceService.wait(this.API_RATE_LIMIT_PAUSE_DURATION_MS);

        continue;
      }

      return response;
    } while (shallRetry === true && attempt < this.RETRY_MAX_ATTEMPTS);

    throw new Error(`Retry attempts limit exceeded (${this.RETRY_MAX_ATTEMPTS})`);
  }

  static wait(timeoutMs = 1000): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), timeoutMs));
  }
}
