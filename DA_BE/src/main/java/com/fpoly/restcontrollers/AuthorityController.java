/**
 * 
 */
package com.fpoly.restcontrollers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.entities.Authority;
import com.fpoly.repositories.irepo.IAuthorityService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/authority")
public class AuthorityController {

	@Autowired
	IAuthorityService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<Authority>> getAllAuthority() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<Authority> createNewAuthority(@RequestBody Authority authority) {
		return new ResponseEntity<>(repository.save(authority), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<Authority> getAuthority(@PathVariable Integer id) {
		Optional<Authority> authorityOptional = repository.findById(id);
		return authorityOptional.map(authority -> new ResponseEntity<>(authority, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<Authority> updateAuthority(@PathVariable Integer id, @RequestBody Authority authority) {
		Optional<Authority> authorityOptional = repository.findById(id);
		return authorityOptional.map(a -> {
			authority.setId(a.getId());
			return new ResponseEntity<>(repository.save(authority), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<Authority> deleteAuthority(@PathVariable Integer id) {
		Optional<Authority> authorityOptional = repository.findById(id);
		return authorityOptional.map(a -> {
			repository.remove(id);
			return new ResponseEntity<>(a, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
