import { MercadoPagoConfig, Payment } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.MERCADO_PAGO_ACCESS_TOKEN)


const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
  options: { timeout: 5000 },
});

const payment = new Payment(mercadoPagoClient);

export { payment };
