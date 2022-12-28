package com.fpoly.dto;

import com.fpoly.entities.RentalTypes;
import com.fpoly.entities.Rooms;
import com.fpoly.entities.Servicess;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class DetailsInvoiceDTO {
    private int id;
    private String hireDate;
    private String checkOutDay;
    private int numberOfDaysOfRent;
    private int numberOfHoursToRent;
    private int numberOfPeople;
    private double totalCash;
    private int status;
    private BillsDTO bills;
    private Rooms rooms;
    private RentalTypes rentalTypes;
}
