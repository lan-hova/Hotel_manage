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

import com.fpoly.entities.DetailsInvoice;
import com.fpoly.repositories.irepo.IDetailInvoiceService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/detail-invoice")
public class DetailInvoiceController {

	@Autowired
	IDetailInvoiceService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<DetailsInvoice>> getAllDetailsInvoic() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<DetailsInvoice> createNewDetailsInvoice(@RequestBody DetailsInvoice voice) {
		return new ResponseEntity<>(repository.save(voice), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<DetailsInvoice> getDetailsInvoice(@PathVariable Integer id) {
		Optional<DetailsInvoice> voiceOptional = repository.findById(id);
		return voiceOptional.map(voice -> new ResponseEntity<>(voice, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<DetailsInvoice> updateDetailsInvoice(@PathVariable Integer id, @RequestBody DetailsInvoice voice) {
		Optional<DetailsInvoice> voiceOptional = repository.findById(id);
		return voiceOptional.map(v -> {
			voice.setId(v.getId());
			return new ResponseEntity<>(repository.save(voice), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<DetailsInvoice> deleteDetailsInvoice(@PathVariable Integer id) {
		Optional<DetailsInvoice> voiceOptional = repository.findById(id);
		return voiceOptional.map(v -> {
			repository.remove(id);
			return new ResponseEntity<>(v, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
