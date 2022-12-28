/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Customer;
import com.fpoly.repositories.irepo.ICustomerService;
import com.fpoly.repositories.repo.CustomerRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class ICustomerServiceImp implements ICustomerService {

	@Autowired
	private CustomerRepository customerRepo;

	@Override
	public Iterable<Customer> findAll() {
		return customerRepo.findAll();
	}

	@Override
	public Optional<Customer> findById(Integer id) {
		return customerRepo.findById(id);
	}

	@Override
	public Customer save(Customer t) {
		return customerRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		customerRepo.deleteById(id);
	}

}
