package com.fpoly.dto;

import com.fpoly.entities.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CheckInResponseDTO {
    private List<Rooms> roomsList;
    private Bills bill;
    private Customer customer;
    private List<DetailsInvoice> detailsInvoiceList;
    private List<ServiceDetails> serviceDetailsList;
}
