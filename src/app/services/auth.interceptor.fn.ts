import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor'; // Adjust the path as necessary

export const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authInterceptor = new AuthInterceptor();
  return authInterceptor.intercept(req, { handle: next });
};