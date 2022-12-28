/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.NumberOfFloors;
import com.fpoly.repositories.irepo.INumberOfFloorService;
import com.fpoly.repositories.repo.NumberOfFloorRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class INumberOfFloorServiceImp implements INumberOfFloorService {

	@Autowired
	private NumberOfFloorRepository nofloorRepo;

	@Override
	public Iterable<NumberOfFloors> findAll() {
		return nofloorRepo.findAll();
	}

	@Override
	public Optional<NumberOfFloors> findById(Integer id) {
		return nofloorRepo.findById(id);
	}

	@Override
	public NumberOfFloors save(NumberOfFloors t) {
		return nofloorRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		nofloorRepo.deleteById(id);
	}

}
