import HmacSHA256 from 'crypto-js/hmac-sha256';

export function validateSign(sign: string, params: Record<string, any> = {}) {
  const source: string = Object.keys(params)
    .sort()
    .reduce((acc, key, index) => {
      acc[index] = `${key}=${params[key]}`;
      return acc;
    }, [] as string[])
    .join('&');
  const hash = HmacSHA256(source, process.env.SHOPLINE_PLOATFORM_APP_SECRET).toString();
  return hash === sign;
}
