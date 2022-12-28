package com.fpoly.dto;

import com.fpoly.entities.ImageKindOfRoom;
import com.fpoly.entities.KindOfRoom;
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
public class DetailKindOfRoomResponseDTO {
    KindOfRoom kindOfRoom;
    List<ImageKindOfRoom> imageKindOfRoomList;
}
