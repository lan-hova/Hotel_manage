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
public class Customer implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID", unique = true, nullable = false, precision = 10)
	private int id;

	@Column(name = "FULLNAME", nullable = false, length = 255)
	private String fullname;

	@Column(name = "EMAIL", length = 255)
	private String email;

	@Column(name = "CITIZEN_ID_CODE", length = 12)
	private String citizenIdCode;

	@Column(name = "GENDER", length = 5)
	private String gender;

	@Column(name = "DATE_OF_BIRTH")
	private LocalDate dateOfBirth;

	@Column(name = "PHONE_NUMBER", length = 12)
	private String phoneNumber;

	@Column(name = "ADDRESS", length = 255)
	private String address;

	@Column(name = "IMG", length = 255)
	private String img;

	@Column(name = "STATUS", nullable = false, precision = 10)
	private int status;

	@OneToMany(mappedBy = "customer")
	@JsonIgnore
	private Set<Bills> bills;

	@ManyToOne
	@JoinColumn(name = "ID_NATIONALITY")
	private Nationality nationality;

	@ManyToOne
	@JoinColumn(name = "ID_USER")
	private Users users;

}
