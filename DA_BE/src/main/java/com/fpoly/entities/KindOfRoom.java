package com.fpoly.entities;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

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
public class KindOfRoom implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID", unique = true, nullable = false, precision = 10)
	private int id;

	@Column(name = "ROOM_TYPE_NAME", nullable = false, length = 50)
	private String name;

	@Column(name = "NOTE", length = 255)
	private String note;

	@Column(name = "PRICE_BY_DAY", nullable = false, precision = 53)
	private double priceByDay;

	@Column(name = "HOURLY_PRICE", nullable = false, precision = 53)
	private double hourlyPrice;

	@Column(name = "STATUS", nullable = false, precision = 10)
	private int status;

	@OneToMany(mappedBy = "kindOfRoom")
	@JsonIgnore
	private Set<Rooms> rooms;

	@OneToMany(mappedBy = "kindOfRoom")
	@JsonIgnore
	private Set<Booking> booking;

	@OneToMany(mappedBy = "kindOfRoom")
	@JsonIgnore
	private Set<ImageKindOfRoom> imageKindOfRooms;
}
