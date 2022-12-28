package com.fpoly.entities;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
public class Personnel implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID", unique = true, nullable = false, precision = 10)
	private int id;

	@Column(name = "FULLNAME", nullable = false, length = 255)
	private String fullname;

	@Column(name = "EMAIL", nullable = false, length = 50)
	private String email;

	@Column(name = "GENDER", nullable = false, length = 5)
	private String gender;

	@Column(name = "CITIZEN_ID_CODE", length = 12)
	private String citizenIdCode;

	@Column(name = "DATE_OF_BIRTH", nullable = false)
	private LocalDate dateOfBirth;

	@Column(name = "PHONE_NUMBER", nullable = false, length = 12)
	private String phoneNumber;

	@Column(name = "ADDRESS")
	private String address;

	@Column(name = "IMG")
	private String img;

	@Column(name = "STATUS", nullable = false, precision = 10)
	private int status;

	@ManyToOne(optional = false)
	@JoinColumn(name = "ID_NATIONALITY", nullable = false)
	private Nationality nationality;

	@OneToMany(mappedBy = "personnel")
	@JsonIgnore
	private Set<Bills> bills;

	@OneToMany(mappedBy = "personnel")
	@JsonIgnore
	private Set<HandOver> handOver;

	@OneToMany(mappedBy = "personnel")
	@JsonIgnore
	private Set<ResetHandOver> resetHandOver;

	@ManyToOne(optional = false, cascade = CascadeType.ALL)
	@JoinColumn(name = "ID_USER", nullable = false)
	private Users users;

}
