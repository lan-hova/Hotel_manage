/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.PaymentType;
import com.fpoly.repositories.irepo.IPaymentTypeService;
import com.fpoly.repositories.repo.PaymentTypeRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IPaymentTypeServiceImp implements IPaymentTypeService {

	@Autowired
	private PaymentTypeRepository payRepo;

	@Override
	public Iterable<PaymentType> findAll() {
		return payRepo.findAll();
	}

	@Override
	public Optional<PaymentType> findById(Integer id) {
		return payRepo.findById(id);
	}

	@Override
	public PaymentType save(PaymentType t) {
		return payRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		payRepo.deleteById(id);
	}

}
