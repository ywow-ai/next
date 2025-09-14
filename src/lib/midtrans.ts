import midtransClient from "midtrans-client";

const isProduction = Boolean(process.env.MIDTRANS_IS_PRODUCTION),
  clientKey = String(process.env.MIDTRANS_CLIENT_KEY),
  serverKey = String(process.env.MIDTRANS_SERVER_KEY);

export const coreApi = new midtransClient.CoreApi({
  isProduction,
  clientKey,
  serverKey,
});

export const snap = new midtransClient.Snap({
  isProduction,
  clientKey,
  serverKey,
});
