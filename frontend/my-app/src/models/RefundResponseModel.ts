class RefundResponseModel {
  vnp_RequestId: string;
  vnp_Version: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_TransactionType: string;
  vnp_TxnRef: string;
  vnp_Amount: string;
  vnp_TransactionNo: string;
  vnp_TransactionDate: string;
  vnp_CreateBy: string;
  vnp_CreateDate: string;
  vnp_IpAddr: string;
  vnp_OrderInfo: string;
  vnp_SecureHash: string;

  constructor(
    vnp_RequestId: string,
    vnp_Version: string,
    vnp_Command: string,
    vnp_TmnCode: string,
    vnp_TransactionType: string,
    vnp_TxnRef: string,
    vnp_Amount: string,
    vnp_TransactionNo: string,
    vnp_TransactionDate: string,
    vnp_CreateBy: string,
    vnp_CreateDate: string,
    vnp_IpAddr: string,
    vnp_OrderInfo: string,
    vnp_SecureHash: string
  ) {
    this.vnp_RequestId = vnp_RequestId;
    this.vnp_Version = vnp_Version;
    this.vnp_Command = vnp_Command;
    this.vnp_TmnCode = vnp_TmnCode;
    this.vnp_TransactionType = vnp_TransactionType;
    this.vnp_TxnRef = vnp_TxnRef;
    this.vnp_Amount = vnp_Amount;
    this.vnp_TransactionNo = vnp_TransactionNo;
    this.vnp_TransactionDate = vnp_TransactionDate;
    this.vnp_CreateBy = vnp_CreateBy;
    this.vnp_CreateDate = vnp_CreateDate;
    this.vnp_IpAddr = vnp_IpAddr;
    this.vnp_OrderInfo = vnp_OrderInfo;
    this.vnp_SecureHash = vnp_SecureHash;
  }
}

export default RefundResponseModel;
