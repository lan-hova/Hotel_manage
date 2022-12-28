package com.fpoly.dto;

import com.fpoly.entities.Servicess;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ServiceByTypeDTO {
    private String serviceType;
    private List<Servicess> listService;
}
