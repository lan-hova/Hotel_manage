package com.fpoly.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fpoly.entities.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class DetailInvoiceAndRoomUtilDTO {
    private int id;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime hireDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime checkOutDay;
    private int numberOfDaysOfRent;
    private int numberOfHoursToRent;
    private int numberOfPeople;
    private double totalCash;
    private int status;
    private Bills bills;
    private Rooms rooms;
    private RentalTypes rentalTypes;
    private List<FacilitiesDetails> facilitiesDetailsList;
    private List<ServiceAvailable> serviceAvailableList;
    private int key;

    public static DetailInvoiceAndRoomUtilDTO toDTO(DetailsInvoice detailsInvoice, List<FacilitiesDetails> facilitiesDetailsList, List<ServiceAvailable> serviceAvailableList, int key) {
        if (detailsInvoice == null) {
            return null;
        }
        return DetailInvoiceAndRoomUtilDTO.builder()
                .id(detailsInvoice.getId())
                .hireDate(detailsInvoice.getHireDate())
                .checkOutDay(detailsInvoice.getCheckOutDay())
                .numberOfHoursToRent(detailsInvoice.getNumberOfHoursToRent())
                .numberOfDaysOfRent(detailsInvoice.getNumberOfDaysOfRent())
                .numberOfPeople(detailsInvoice.getNumberOfPeople())
                .totalCash(detailsInvoice.getTotalCash())
                .status(detailsInvoice.getStatus())
                .bills(detailsInvoice.getBills())
                .rooms(detailsInvoice.getRooms())
                .rentalTypes(detailsInvoice.getRentalTypes())
                .facilitiesDetailsList(facilitiesDetailsList)
                .serviceAvailableList(serviceAvailableList)
                .key(key)
                .build();
    }
}
