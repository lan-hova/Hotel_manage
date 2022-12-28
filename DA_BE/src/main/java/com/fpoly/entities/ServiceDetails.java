package com.fpoly.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fpoly.dto.ServiceDetailsDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@SuperBuilder
public class ServiceDetails implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID", unique = true, nullable = false, precision = 10)
	private int id;

	@Column(name = "QUANTITY", nullable = false, precision = 10)
	private int quantity;

	@Column(name = "TOTAL_CASH", precision = 53)
	private double totalCash;

	@Column(name = "STATUS", nullable = false, precision = 10)
	private int status;

	@ManyToOne(optional = false)
	@JoinColumn(name = "ID_DETAILS_INVOICE", nullable = false)
	private DetailsInvoice detailsInvoice;

	@ManyToOne(optional = false)
	@JoinColumn(name = "ID_SERVICE", nullable = false)
	private Servicess servicess;

	public static ServiceDetails toEntity(ServiceDetailsDTO serviceDetailsDTO){
		return ServiceDetails.builder()
				.id(serviceDetailsDTO.getId())
				.quantity(serviceDetailsDTO.getQuantity())
				.totalCash(serviceDetailsDTO.getTotalCash())
				.status(serviceDetailsDTO.getStatus())
				.detailsInvoice(DetailsInvoice.toEntity(serviceDetailsDTO.getDetailsInvoice()))
				.servicess(serviceDetailsDTO.getServicess()).build();
	}

}
