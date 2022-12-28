package com.fpoly.entities;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Booking implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID", unique = true, nullable = false, precision = 10)
	private int id;

	@Column(name = "CUSTOMER_NAME", nullable = false, length = 255)
	private String customerName;

	@Column(name = "CUSTOMER_PHONE_NUMBER", nullable = false, length = 255)
	private String customerPhoneNumber;

	@Column(name = "CUSTOMER_EMAIL", nullable = false, length = 255)
	private String customerEmail;

	@ManyToOne(optional = false)
	@JoinColumn(name = "ID_KIND_OF_ROOM", nullable = false)
	private KindOfRoom kindOfRoom;

	@Column(name = "HIRE_DATE", nullable = false)
	private LocalDate hireDate;

	@Column(name = "CHECK_OUT_DAY", nullable = false)
	private LocalDate checkOutDay;

	@Column(name = "NUMBER_OF_ADULTS", nullable = false, precision = 10)
	private int numberOfAdults;

	@Column(name = "NUMBER_OF_KIDS", nullable = false, precision = 10)
	private int numberOfKids;

	@Column(name = "DEPOSITS", precision = 53)
	private double deposits;

	@Column(name = "MONEY_TO_PAY", precision = 10)
	private Integer moneyToPay;

	@Column(name = "NOTE", length = 255)
	private String note;

	@Column(name = "PAYMENT_STATUS", nullable = false, precision = 10)
	private int paymentStatus;

	@Column(name = "STATUS", nullable = false, precision = 10)
	private int status;

	@Column(name = "BOOKING_STATUS", nullable = false, precision = 10)
	private int bookingStatus;

	@Column(name = "QUANTITY_ROOM")
	private Integer quantityRoom;

	@OneToMany(mappedBy = "booking")
	@JsonIgnore
	private Set<Bills> bills;
}
