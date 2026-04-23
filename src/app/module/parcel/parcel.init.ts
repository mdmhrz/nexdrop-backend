import paymentService from '../payment/services/payment.service';
import parcelPaymentService from './services/parcelPayment.service';

// Register parcel payment webhook callback
paymentService.registerWebhookCallback('parcel', parcelPaymentService.handleParcelPaymentWebhook);
