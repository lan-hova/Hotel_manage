package com.fpoly.payment;

import com.fpoly.payment.config.ConfigPayment;
import com.fpoly.payment.dto.PaymentRequestDTO;
import com.fpoly.payment.dto.PaymentResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.transaction.Transactional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/payment")
public class PaymentAPI {

    @Transactional
    @PostMapping()
    public ResponseEntity<?> Payment (@RequestBody PaymentRequestDTO paymentRequestDTO) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderInfo = "Thanh toan hoa don";
        String orderType = "170000";
        String vnp_TxnRef = ConfigPayment.getRandomNumber(8);
        String vnp_IpAddr = "0:0:0:0:0:0:0:1";
        String vnp_TmnCode = ConfigPayment.vnp_TmnCode;

        int amount = paymentRequestDTO.getDeposits() * 100;

        Map vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        String bank_code = paymentRequestDTO.getBankCode();
        if (bank_code != null && !bank_code.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bank_code);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", orderType);

        String locate = "vn";
        if (locate != null && !locate.isEmpty()) {
            vnp_Params.put("vnp_Locale", locate);
        } else {
            vnp_Params.put("vnp_Locale", "vn");
        }
        vnp_Params.put("vnp_ReturnUrl", ConfigPayment.vnp_Returnurl + paymentRequestDTO.getIdBooking());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());

        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        //Add Params of 2.1.0 Version
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
        //Billing
        vnp_Params.put("vnp_Bill_Mobile", paymentRequestDTO.getBillMobile());
        vnp_Params.put("vnp_Bill_Email", paymentRequestDTO.getBillEmail());
        String fullName = (paymentRequestDTO.getBillingFullName()).trim();
        if (fullName != null && !fullName.isEmpty()) {
            int idx = fullName.indexOf(' ');
            String firstName = fullName.substring(0, idx);
            String lastName = fullName.substring(fullName.lastIndexOf(' ') + 1);
            vnp_Params.put("vnp_Bill_FirstName", firstName);
            vnp_Params.put("vnp_Bill_LastName", lastName);

        }
        vnp_Params.put("vnp_Bill_Address", paymentRequestDTO.getBillAddress());
        vnp_Params.put("vnp_Bill_City", paymentRequestDTO.getBillCity());
        vnp_Params.put("vnp_Bill_Country", paymentRequestDTO.getBillCountry());
        if (paymentRequestDTO.getBillState() != null && !paymentRequestDTO.getBillState().isEmpty()) {
            vnp_Params.put("vnp_Bill_State", paymentRequestDTO.getBillState());
        }
        // Invoice
        vnp_Params.put("vnp_Inv_Phone", "0987654321");
        vnp_Params.put("vnp_Inv_Email", "polytel@gmail.com");
        vnp_Params.put("vnp_Inv_Customer", "POLYTEL");
        vnp_Params.put("vnp_Inv_Address", "Trịnh Văn Bô - Nam Từ Liêm - Hà Nội");
        vnp_Params.put("vnp_Inv_Company", "POLYTEL");
        vnp_Params.put("vnp_Inv_Taxcode", "00000000");
        vnp_Params.put("vnp_Inv_Type", "KS");
        //Build data to hash and querystring
        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try {
                    //Build hash data
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                } catch (UnsupportedEncodingException e) {

                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = ConfigPayment.hmacSHA512(ConfigPayment.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = ConfigPayment.vnp_PayUrl + "?" + queryUrl;
        PaymentResponseDTO paymentResponseDTO = new PaymentResponseDTO("00", "success", paymentUrl);

        return new ResponseEntity<>(paymentResponseDTO, HttpStatus.OK);
    }
}
