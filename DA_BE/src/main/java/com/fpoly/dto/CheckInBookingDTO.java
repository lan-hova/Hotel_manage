package com.fpoly.dto;

import com.fpoly.entities.Bills;
import com.fpoly.entities.Booking;
import com.fpoly.entities.DetailsInvoice;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class CheckInBookingDTO {
    private Bills dataBill;
    private List<DetailsInvoice> roomBookingList;
}
