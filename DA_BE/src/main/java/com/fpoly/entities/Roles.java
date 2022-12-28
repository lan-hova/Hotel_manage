// Generated with g9.

package com.fpoly.entities;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true) // important
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Roles implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include // important, only on the PK
	@Column(name = "ID", unique = true, nullable = false, precision = 10)
	private int id;
	
	@Column(name = "NAME", nullable = false, length = 255)
	private String name;
	
	@Column(name = "STATUS", nullable = false, precision = 10)
	private int status;
	
	@OneToMany(mappedBy = "roles", cascade = CascadeType.ALL)
	@JsonIgnore
	private Set<Authority> authority;

}
