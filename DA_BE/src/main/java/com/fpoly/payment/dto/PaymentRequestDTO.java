package com.fpoly.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDTO {
    private int deposits;
    private String bankCode;
    private int idBooking;

    private String billMobile;
    private String billEmail;
    private String billingFullName;
    private String billAddress;
    private String billCity;
    private String billCountry;
    private String billState;

    private String invPhone;
    private String invEmail;
    private String invCustomer;
    private String invAddress;
    private String invCompany;
    private String invTaxcode;
    private String invType;
}
