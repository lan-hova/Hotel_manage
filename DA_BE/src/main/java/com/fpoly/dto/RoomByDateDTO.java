package com.fpoly.dto;

import com.fpoly.entities.KindOfRoom;
import com.fpoly.entities.NumberOfFloors;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class RoomByDateDTO {
    private int id;
    private String name;
    private String note;
    private String img;
    private String img1;
    private String img2;
    private String img3;
    private int status;
    private int statusByDate;
    private KindOfRoom kindOfRoom;
    private NumberOfFloors numberOfFloors;
}
