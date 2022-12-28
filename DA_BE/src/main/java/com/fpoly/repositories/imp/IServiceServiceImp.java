/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Servicess;
import com.fpoly.repositories.irepo.IServiceService;
import com.fpoly.repositories.repo.ServiceRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IServiceServiceImp implements IServiceService {

	@Autowired
	private ServiceRepository serviceRepo;

	@Override
	public Iterable<Servicess> findAll() {
		return serviceRepo.findAll();
	}

	@Override
	public Optional<Servicess> findById(Integer id) {
		return serviceRepo.findById(id);
	}

	@Override
	public Servicess save(Servicess t) {
		return serviceRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		serviceRepo.deleteById(id);
	}

}
