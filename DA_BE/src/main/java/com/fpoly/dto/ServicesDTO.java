package com.fpoly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ServicesDTO {

	private String name;

	private double prices;

	private String note;

	private int status;

	private int serviceType;
}
