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
public class RoomDetailDTO {
    private RoomByDateDTO rooms;
    private List<DetailsInvoice> detailInvoiceList;
    private List<FacilitiesDetails> facilitiesDetailsList;
    private List<ServiceAvailable> serviceAvailableList;
    private List<ServiceDetails> serviceDetailsList;
}
