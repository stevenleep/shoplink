import { Service } from 'typedi';
import { Body, Controller, Post } from 'routing-controllers';
import { generateToken } from '@/middleware/JWTTokenMiddleware';

interface IAccountPayload {
  email: string;
  password: string;
}

interface IAccountRegisterPayload extends IAccountPayload {
  name: string;
  code: string;
}

@Service()
@Controller('/account')
export class AccountController {
  public async getAccount() {
    return {
      id: 1,
      name: 'John Doe',
      email: '',
    };
  }

  @Post('/login')
  public async login(@Body() payload: IAccountPayload) {
    // const { email, password } = payload;
    console.log('payload', payload);

    // Check email and password
    // const user = await accountService.findByEmail(email);
    // if (!user) {
    //   throw new Error('Invalid email or password');
    // }

    // const isValidPassword = await accountService.comparePassword(password, user.password);
    // if (!isValidPassword) {
    //   throw new Error('Invalid email or password');
    // }

    const account = { id: 1, name: 'John Doe' };

    // Generate token
    const tokenPayload = {
      id: account.id,
      name: account.name,
      machine: 'web',
    };

    const token = generateToken(tokenPayload);

    return {
      user: tokenPayload,
      access_token: token,
    };
  }

  @Post('/register')
  public async register(@Body() payload: IAccountRegisterPayload) {
    console.log('payload', payload);
  }
}
