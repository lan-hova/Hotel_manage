package com.fpoly.dto;

import com.fpoly.entities.RentalTypes;
import com.fpoly.entities.Rooms;
import com.fpoly.entities.Servicess;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ServiceDetailsDTO {
    private int id;
    private int quantity;
    private double totalCash;
    private int status;
    private DetailsInvoiceDTO detailsInvoice;
    private Servicess servicess;
}
