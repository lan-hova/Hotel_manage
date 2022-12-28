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

import com.fpoly.entities.PaymentType;
import com.fpoly.repositories.irepo.IPaymentTypeService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/payment-type")
public class PaymentTypeController {

	@Autowired
	IPaymentTypeService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<PaymentType>> getAllPaymentType() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<PaymentType> createNewPaymentType(@RequestBody PaymentType payment) {
		return new ResponseEntity<>(repository.save(payment), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<PaymentType> getPaymentType(@PathVariable Integer id) {
		Optional<PaymentType> paymentOptional = repository.findById(id);
		return paymentOptional.map(payment -> new ResponseEntity<>(payment, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<PaymentType> updatePaymentType(@PathVariable Integer id, @RequestBody PaymentType payment) {
		Optional<PaymentType> paymentOptional = repository.findById(id);
		return paymentOptional.map(p -> {
			payment.setId(p.getId());
			return new ResponseEntity<>(repository.save(payment), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<PaymentType> deletePaymentType(@PathVariable Integer id) {
		Optional<PaymentType> paymentOptional = repository.findById(id);
		return paymentOptional.map(b -> {
			repository.remove(id);
			return new ResponseEntity<>(b, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
