class PaymentVNPAYModel {
  userId: number;
  cartItemId: number;
  vnpAmount: number;
  vnpBankCode: string;
  vnpBankTranNo: string;
  vnpCardType: string;
  vnpPayDate: string;
  vnpResponseCode: string;
  vnpTmnCode: string;
  vnpTransactionNo: string;
  vnpTransactionStatus: string;
  vnpTxnRef: string;

  constructor(
    userId: number,
    cartItemId: number,
    vnpAmount: number,
    vnpBankCode: string,
    vnpBankTranNo: string,
    vnpCardType: string,
    vnpPayDate: string,
    vnpResponseCode: string,
    vnpTmnCode: string,
    vnpTransactionNo: string,
    vnpTransactionStatus: string,
    vnpTxnRef: string
  ) {
    this.userId = userId;
    this.cartItemId = cartItemId;
    this.vnpAmount = vnpAmount;
    this.vnpBankCode = vnpBankCode;
    this.vnpBankTranNo = vnpBankTranNo;
    this.vnpCardType = vnpCardType;
    this.vnpPayDate = vnpPayDate;
    this.vnpResponseCode = vnpResponseCode;
    this.vnpTmnCode = vnpTmnCode;
    this.vnpTransactionNo = vnpTransactionNo;
    this.vnpTransactionStatus = vnpTransactionStatus;
    this.vnpTxnRef = vnpTxnRef;
  }
}

export default PaymentVNPAYModel;
