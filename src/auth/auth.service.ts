import { Injectable } from '@nestjs/common';
import { BunyanLoggerService } from '../logger/bunyan-logger.service';
import Axios, { AxiosInstance } from 'axios';
import { UsersService } from '../users/users.service';

const BASE_URL = 'https://api.test.com';

@Injectable()
export class AuthService {
  private readonly logger = BunyanLoggerService.createLogger(AuthService.name);
  private readonly httpClient: AxiosInstance;

  constructor(private usersService: UsersService) {
    this.httpClient = Axios.create({
      baseURL: BASE_URL,
      responseType: 'json'
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: secret, ...result } = user;

      return result;
    }

    return null;
  }

  async validateMarketplaceUser(username: string, password: string): Promise<any> {
    try {
      const { data } = await this.httpClient.postForm('https://api.test.com/oauth/token', new URLSearchParams({ grant_type: 'password' }), {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        auth: { username, password }
      });

      this.logger.debug({ data }, 'Auth with marketplace');

      // const token = response?.data?.value;

      return { username, ...data };
    } catch (err) {
      this.logger.error(err);

      return null;
    }
  }
}
