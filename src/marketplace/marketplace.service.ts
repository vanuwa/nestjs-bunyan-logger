import { Injectable } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import { BunyanLoggerService } from '../logger/bunyan-logger.service';

const BASE_URL = 'https://api.test.com';
const CLIENT_ID = 'cl';
const CLIENT_SECRET = 'cs';

@Injectable()
export class MarketplaceService {
  private readonly logger = BunyanLoggerService.createLogger(MarketplaceService.name);
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = Axios.create({
      baseURL: BASE_URL,
      responseType: 'json'
    });
  }

  async loginAsUser(username, password) {
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

      return data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
