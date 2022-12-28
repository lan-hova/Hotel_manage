/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.RentalTypes;
import com.fpoly.repositories.irepo.IRentalTypeService;
import com.fpoly.repositories.repo.RentalTypeRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IRentalTypeServiceImp implements IRentalTypeService {

	@Autowired
	private RentalTypeRepository typeRepo;

	@Override
	public Iterable<RentalTypes> findAll() {
		return typeRepo.findAll();
	}

	@Override
	public Optional<RentalTypes> findById(Integer id) {
		return typeRepo.findById(id);
	}

	@Override
	public RentalTypes save(RentalTypes t) {
		return typeRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		typeRepo.deleteById(id);
	}

}
