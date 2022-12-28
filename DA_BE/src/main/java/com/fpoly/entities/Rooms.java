package com.fpoly.entities;

import java.io.Serializable;
import java.time.format.DateTimeFormatter;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fpoly.dto.BillsDTO;
import com.fpoly.dto.RoomByDateDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Rooms implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID", unique = true, nullable = false, precision = 10)
	private int id;

	@Column(name = "NAME", length = 255)
	private String name;

	@Column(name = "NOTE", length = 255)
	private String note;

	@Column(name = "IMG", length = 255)
	private String img;

	@Column(name = "IMG1", length = 255)
	private String img1;

	@Column(name = "IMG2", length = 255)
	private String img2;

	@Column(name = "IMG3", length = 255)
	private String img3;

	@Column(name = "STATUS", nullable = false, precision = 10)
	private int status;

	@ManyToOne(optional = false)
	@JoinColumn(name = "ID_KIND_OF_ROOM", nullable = false)
	private KindOfRoom kindOfRoom;

	@ManyToOne(optional = false)
	@JoinColumn(name = "ID_NUMBER_OF_FLOORS", nullable = false)
	private NumberOfFloors numberOfFloors;

	@OneToMany(mappedBy = "rooms")
	@JsonIgnore
	private Set<FacilitiesDetails> facilitiesDetails;

	@OneToMany(mappedBy = "rooms")
	@JsonIgnore
	private Set<DetailsInvoice> detailsInvoice;

	@OneToMany(mappedBy = "rooms")
	@JsonIgnore
	private Set<ServiceAvailable> serviceAvailable;

	public RoomByDateDTO toRoomByDate(Integer statusByDate) {
		RoomByDateDTO roomByDateDTO = RoomByDateDTO.builder()
				.id(this.id)
				.name(this.name)
				.note(this.note)
				.img(this.img)
				.img1(this.img1)
				.img2(this.img2)
				.img3(this.img3)
				.status(this.status)
				.kindOfRoom(this.kindOfRoom)
				.numberOfFloors(this.numberOfFloors)
				.statusByDate(statusByDate)
				.build();
		return roomByDateDTO;
	}
}
