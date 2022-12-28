package com.fpoly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomPlanDTO {
    private int numberOfFloors;
    private List<RoomDetailDTO> listRoom;
}
