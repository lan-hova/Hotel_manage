package com.fpoly.dto;

import com.fpoly.entities.Bills;
import com.fpoly.entities.DetailsInvoice;
import com.fpoly.entities.Rooms;
import com.fpoly.entities.ServiceDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DetailsByTheRoomIsInUseDTO {
    private Rooms rooms;
    private Bills bills;
    private List<DetailInvoiceAndRoomUtilDTO> detailsInvoiceList;
    private List<ServiceDetails> serviceDetailsList;
}
