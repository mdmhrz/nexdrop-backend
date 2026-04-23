import crypto from 'crypto';
import { envVars } from '../../../config/env';

const SSLCOMMERZ_SANDBOX_URL = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
const SSLCOMMERZ_LIVE_URL = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

export const sslcommerzService = {
    /**
     * Get SSL Commerz API URL based on sandbox mode
     */
    getApiUrl(): string {
        return envVars.SSLCOMMERZ.IS_SANDBOX ? SSLCOMMERZ_SANDBOX_URL : SSLCOMMERZ_LIVE_URL;
    },

    /**
     * Create SSL Commerz payment session
     */
    async createSession(params: {
        amount: number;
        customerEmail: string;
        customerName: string;
        successUrl: string;
        cancelUrl: string;
        metadata: Record<string, string>;
    }): Promise<{ url: string; sessionId: string }> {
        const { amount, customerEmail, customerName, cancelUrl, metadata } = params;

        const tranId = `TRANSACTION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const payload = {
            store_id: envVars.SSLCOMMERZ.STORE_ID,
            store_passwd: envVars.SSLCOMMERZ.STORE_PASSWORD,
            total_amount: amount.toString(),
            currency: 'BDT',
            tran_id: tranId,
            success_url: `${envVars.BACKEND_URL}/api/v1/payments/sslcommerz/success`,
            fail_url: cancelUrl,
            cancel_url: cancelUrl,
            ipn_url: `${envVars.BACKEND_URL}/api/v1/payments/sslcommerz/ipn`,
            shipping_method: 'NO',
            product_name: metadata.description || 'Parcel Delivery',
            product_category: 'Service',
            product_profile: 'non-physical-goods',
            cus_name: customerName,
            cus_email: customerEmail,
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01700000000',
            ship_name: customerName,
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: '1000',
            ship_country: 'Bangladesh',
            multi_card_name: 'visa,mastercard,amex',
            value_a: metadata.type || 'parcel',
            value_b: metadata.parcelId || '',
            value_c: metadata.description || '',
        };

        try {
            const response = await fetch(this.getApiUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(payload as Record<string, string>).toString(),
            });

            const data = await response.json();

            if (data.status === 'FAILED') {
                throw new Error(`SSL Commerz session creation failed: ${data.failedreason}`);
            }

            return {
                url: data.GatewayPageURL,
                sessionId: tranId,
            };
        } catch (error) {
            throw new Error(`SSL Commerz session creation error: ${error instanceof Error ? error.message : 'Unknown error'}`, { cause: error });
        }
    },

    /**
     * Verify SSL Commerz IPN signature
     */
    verifyIPN(ipnData: Record<string, unknown>): boolean {
        const storeId = envVars.SSLCOMMERZ.STORE_ID;
        const storePassword = envVars.SSLCOMMERZ.STORE_PASSWORD;
        const status = ipnData.status;
        const tranId = ipnData.tran_id;
        const amount = ipnData.amount;
        const currency = ipnData.currency;

        // Create validation string
        const validationString = `${storeId},${amount},${currency},${tranId},${status},${storePassword}`;
        const calculatedHash = crypto.createHash('md5').update(validationString).digest('hex');

        // Compare with provided hash
        return calculatedHash === ipnData.val_id;
    },

    /**
     * Extract transaction ID from IPN data
     */
    extractTransactionId(ipnData: Record<string, unknown>): string {
        return (ipnData.tran_id as string) || '';
    },

    /**
     * Extract amount from IPN data
     */
    extractAmount(ipnData: Record<string, unknown>): number {
        return parseFloat(ipnData.amount as string) || 0;
    },

    /**
     * Extract metadata from IPN data
     */
    extractMetadata(ipnData: Record<string, unknown>): Record<string, string> {
        return {
            type: (ipnData.value_a as string) || '',
            parcelId: (ipnData.value_b as string) || '',
            description: (ipnData.value_c as string) || '',
        };
    },

    /**
     * Check if payment was successful
     */
    isPaymentSuccessful(ipnData: Record<string, unknown>): boolean {
        return ipnData.status === 'VALID' || ipnData.status === 'VALIDATED';
    },

    /**
     * Validate payment using SSL Commerz validation API
     */
    async validatePayment(valId: string): Promise<{ isValid: boolean; tranId: string; amount: number; cardType: string; tranDate: string }> {
        const validationUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${envVars.SSLCOMMERZ.STORE_ID}&store_passwd=${envVars.SSLCOMMERZ.STORE_PASSWORD}&v=1&format=json`;

        try {
            const response = await fetch(validationUrl);
            const data = await response.json();

            if (data.status !== 'VALID') {
                return {
                    isValid: false,
                    tranId: '',
                    amount: 0,
                    cardType: '',
                    tranDate: '',
                };
            }

            return {
                isValid: true,
                tranId: data.tran_id || '',
                amount: parseFloat(data.amount) || 0,
                cardType: data.card_type || '',
                tranDate: data.tran_date || '',
            };
        } catch (error) {
            throw new Error(`SSL Commerz validation error: ${error instanceof Error ? error.message : 'Unknown error'}`, { cause: error });
        }
    },
};

export default sslcommerzService;
