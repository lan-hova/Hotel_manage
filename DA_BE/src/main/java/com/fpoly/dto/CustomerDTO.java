package com.fpoly.dto;

import com.fpoly.entities.Customer;
import com.fpoly.entities.Users;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDTO {
	private Customer customer;
	private Users user;
}
