package com.fpoly.dto;

import com.fpoly.entities.Customer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CheckInDTO {
    private Customer customer;
    private BillsDTO bill;
    private List<DetailsInvoiceDTO> detailInvoices;
    private List<ServiceDetailsDTO> serviceDetails;
}
