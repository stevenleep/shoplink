import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';

@Interceptor()
export class GlobalResponseInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    console.log('GlobalResponseInterceptor: ', content);
    return content;
  }
}
