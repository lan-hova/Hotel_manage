package com.fpoly.dto;

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
public class KindOfRoomAndImageRequestDTO {
    private KindOfRoom kindOfRoom;
    private List<ImageDTO> imageList;
    private List<ImageDTO> imageListDelete;
}
