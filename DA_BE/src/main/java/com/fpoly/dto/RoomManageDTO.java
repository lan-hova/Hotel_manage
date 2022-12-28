package com.fpoly.dto;

import com.fpoly.entities.FacilitiesDetails;
import com.fpoly.entities.Rooms;
import com.fpoly.entities.ServiceAvailable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomManageDTO {
    private Rooms rooms;
    private List<FacilitiesDetails> facilitiesDetailsList;
    private List<ServiceAvailable> serviceAvailableList;
}
