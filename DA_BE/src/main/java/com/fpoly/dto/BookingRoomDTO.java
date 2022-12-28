package com.fpoly.dto;

import com.fpoly.entities.Bills;
import com.fpoly.entities.Booking;
import com.fpoly.entities.Rooms;
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
public class BookingRoomDTO {
    private Rooms rooms;
    private Bills bills;
    private Booking booking;
    private String hireDate;
    private String checkOutDay;
    private String userNamePersonnel;
}
